(() => {
'use strict';
const n=v=>Number(v||0),num=v=>n(v).toLocaleString('pt-BR');
const text=v=>v==null||v==='EMPTY'?'':String(v);
const esc=v=>text(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const name=c=>text(c?.fantasia)||text(c?.razao)||'Cliente sem nome';
const api=()=>{if(typeof supabaseClient==='undefined'||!supabaseClient)throw Error('Conexão indisponível. Recarregue a página.');return supabaseClient;};
function uuid(){if(crypto.randomUUID)return crypto.randomUUID();const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;const h=[...b].map(v=>v.toString(16).padStart(2,'0')).join('');return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);}
function today(){const p=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());return ['year','month','day'].map(t=>p.find(x=>x.type===t).value).join('-');}
function date(v){return v?new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC'}).format(new Date(v+'T12:00:00Z')):'—';}
function monthTitle(m){return new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(m+'-01T12:00:00Z'));}
function error(e){if(e?.code==='23505')return 'Esse número de pedido ou lançamento já foi registrado. Confira o histórico.';if(e?.code==='23503')return 'Este registro tem histórico vinculado e não pode ser excluído.';if(e?.code==='42501')return 'Sua conta não tem permissão para esta operação.';return e?.code==='P0001'?e.message:'Não foi possível concluir. Verifique sua conexão e tente novamente.';}
async function all(table,columns='*',filter=q=>q){
 const rows=[];for(let start=0;;start+=1000){const {data,error:e}=await filter(api().from(table).select(columns)).range(start,start+999);if(e)throw e;rows.push(...(data||[]));if(!data||data.length<1000)break;}return rows;
}
async function loadYear(year){
 const start=year+'-01-01',end=(Number(year)+1)+'-01-01';
 const [clients,balances,goals,imports,pending]=await Promise.all([
 all('clientes','id,nn,cnpj,fantasia,razao,cidade,ativo',q=>q.order('id')),
 all('vendas_saldos_mensais','*',q=>q.gte('mes',start).lt('mes',end).order('mes').order('cliente_id')),
 all('vendas_metas','*',q=>q.gte('mes',start).lt('mes',end).order('mes')),
 all('historico_importacoes','arquivo,ano,data_corte,total_capsulas',q=>q.order('data_corte',{ascending:false})),
 all('vendas_pedidos','id,codigo,cliente_id,data_venda,canal',q=>q.eq('cancelado',false).is('numero_externo',null).order('codigo',{ascending:false}))
 ]);
 return {clients,balances,goals,imports,pending};
}
function stats(data,month,client=''){
 const selected=data.balances.filter(r=>r.mes===month+'-01'&&(!client||String(r.cliente_id)===String(client)));
 const yearRows=data.balances.filter(r=>r.mes<=month+'-01'&&(!client||String(r.cliente_id)===String(client)));
 const byClient=new Map(selected.map(r=>[String(r.cliente_id),r]));
 const historical=new Map();yearRows.forEach(r=>historical.set(String(r.cliente_id),(historical.get(String(r.cliente_id))||0)+n(r.saldo)));
 const ranked=data.clients.filter(c=>c.ativo!==false&&(!client||String(c.id)===String(client))).map(c=>({...c,...byClient.get(String(c.id)),id:c.id,balance:n(byClient.get(String(c.id))?.saldo),annual:historical.get(String(c.id))||0}));
 const activeIds=new Set(data.clients.filter(c=>c.ativo!==false).map(c=>String(c.id)));
 const pending=data.pending.filter(p=>activeIds.has(String(p.cliente_id))&&(!client||String(p.cliente_id)===String(client)));
 const goal=data.goals.find(g=>g.mes===month+'-01')?.meta_positivacao;
 return {imported:selected.reduce((s,r)=>s+n(r.importado),0),sales:selected.reduce((s,r)=>s+n(r.vendas),0),returns:selected.reduce((s,r)=>s+n(r.devolucoes),0),net:selected.reduce((s,r)=>s+n(r.saldo),0),annual:yearRows.reduce((s,r)=>s+n(r.saldo),0),positive:selected.filter(r=>n(r.saldo)>0).length,goal:goal==null?null:n(goal),ranked:ranked.sort((a,b)=>b.balance-a.balance||name(a).localeCompare(name(b),'pt-BR')),targets:ranked.filter(c=>c.balance<=0).sort((a,b)=>b.annual-a.annual||name(a).localeCompare(name(b),'pt-BR')),pending};
}
function trend(data,year,client=''){
 return Array.from({length:12},(_,i)=>{const m=year+'-'+String(i+1).padStart(2,'0');const rows=data.balances.filter(r=>r.mes===m+'-01'&&(!client||String(r.cliente_id)===String(client)));return {month:m,net:rows.reduce((s,r)=>s+n(r.saldo),0),positive:rows.filter(r=>n(r.saldo)>0).length,hasData:rows.length>0};});
}
function chart(rows){
 const values=rows.map(r=>r.net),low=Math.min(0,...values),high=Math.max(1,...values),y=v=>150-(v-low)/(high-low)*125,zero=y(0);
 const bars=rows.map((r,i)=>{const x=42+i*55,v=y(r.net),h=Math.max(r.net?2:0,Math.abs(zero-v));const label=new Intl.DateTimeFormat('pt-BR',{month:'short',timeZone:'UTC'}).format(new Date(r.month+'-01T12:00Z')).replace('.','');return '<g><rect x="'+x+'" y="'+Math.min(zero,v)+'" width="30" height="'+h+'" rx="3" fill="'+(r.net<0?'#e49b94':'#d7b66d')+'"><title>'+esc(monthTitle(r.month))+': '+num(r.net)+' cápsulas líquidas; '+r.positive+' clientes positivados</title></rect><text x="'+(x+15)+'" y="178" text-anchor="middle" fill="#bdb6a7" font-size="11">'+esc(label)+'</text></g>';}).join('');
 return '<svg viewBox="0 0 720 195" role="img" aria-label="Evolução mensal de cápsulas líquidas. Os valores detalhados estão na tabela anual do histórico."><line x1="30" x2="708" y1="'+zero+'" y2="'+zero+'" stroke="#68645b"/><text x="31" y="16" fill="#bdb6a7" font-size="10">Máximo: '+num(high)+'</text>'+bars+'</svg>';
}
async function insertOnce(table,payload){
 const {data,error:e}=await api().from(table).insert(payload).select('*').single();
 if(!e){if(!data?.id)throw Error('Gravação não confirmada. Tente novamente sem iniciar outro lançamento.');return data;}
 if(e.code==='23505'){
  const found=await api().from(table).select('*').eq('id',payload.id).maybeSingle();
  if(!found.error&&found.data){
   const row=found.data;
   const fields=table==='vendas_pedidos'?['cliente_id','data_venda','canal','origem','observacao']:['cliente_id','data_devolucao','capsulas','pedido_id','observacao'];
   const same=fields.every(k=>String(row[k]??'')===String(payload[k]??''));
   const sameCaps=payload.origem!=='manual'||n(row.capsulas)===n(payload.capsulas_informadas);
   const sameItems=payload.origem!=='compositor'||JSON.stringify(row.itens.map(i=>[i.tipo,String(i.produto_id),i.quantidade,i.preco_centavos]))===JSON.stringify(payload.itens.map(i=>[i.tipo,String(i.produto_id),i.quantidade,i.preco_centavos]));
   if(!same||!sameCaps||!sameItems)throw Error('Este lançamento já foi salvo com outros dados. Consulte o histórico antes de iniciar outro.');
   return row;
  }
 }
 throw e;
}
async function patch(table,id,values){const {data,error:e}=await api().from(table).update(values).eq('id',id).select('*').single();if(e)throw e;if(!data)throw Error('Atualização não confirmada.');return data;}
function notify(){window.dispatchEvent(new Event('sales-updated'));try{localStorage.setItem('central-sales-updated',String(Date.now()));}catch{}}
async function saveGoal(month,goal){
 const table=api().from('vendas_metas');const found=await table.select('mes').eq('mes',month+'-01').maybeSingle();if(found.error)throw found.error;
 let result=found.data?await api().from('vendas_metas').update({meta_positivacao:goal}).eq('mes',month+'-01').select().single():await api().from('vendas_metas').insert({mes:month+'-01',meta_positivacao:goal}).select().single();
 if(result.error?.code==='23505')result=await api().from('vendas_metas').update({meta_positivacao:goal}).eq('mes',month+'-01').select().single();
 if(result.error)throw result.error;notify();
}
function code(order){return 'PED-'+String(order.codigo).padStart(6,'0');}
window.CentralSales={n,num,text,esc,name,api,uuid,today,date,monthTitle,error,all,loadYear,stats,trend,chart,insertOnce,patch,notify,saveGoal,code};
})();

