(() => {
'use strict';
const S=CentralSales,W=SalesWidgets,$=id=>document.getElementById(id);
let state={data:null,orders:[],returns:[],month:S.today().slice(0,7)},serial=0,dialogState=null,busy=false,dirty=false;
const pages={clients:1,orders:1,returns:1};
function pagination(items,key){const total=Math.max(1,Math.ceil(items.length/20));pages[key]=Math.min(pages[key],total);const start=(pages[key]-1)*20;const target=document.querySelector('[data-pagination="'+key+'"]');if(target)target.innerHTML='<span>'+items.length+' registro(s) · Página '+pages[key]+' de '+total+'</span><div><button type="button" class="btn btn-secondary" data-page="'+key+'" data-step="-1" '+(pages[key]===1?'disabled':'')+'>Anterior</button> <button type="button" class="btn btn-secondary" data-page="'+key+'" data-step="1" '+(pages[key]===total?'disabled':'')+'>Próxima</button></div>';return items.slice(start,start+20);}
function message(text,error=false){$('historyStatus').textContent=text;$('historyStatus').hidden=!text;$('historyStatus').classList.toggle('error',error);}
function clientName(id){return S.name(state.data?.clients.find(c=>String(c.id)===String(id)));}
function selectedClient(){return $('historyClient').value;}
function limits(month){const [y,m]=month.split('-').map(Number);return {start:month+'-01',end:new Date(Date.UTC(y,m,1)).toISOString().slice(0,10)};}
async function reload(){
 const request=++serial;const month=$('historyMonth').value;if(!/^\d{4}-\d{2}$/.test(month))return;
 $('historyReload').disabled=true;message('Atualizando histórico…');
 const client=selectedClient(),pending=$('pendingOnly').checked,range=limits(month);
 try{
  const [data,orders,returns]=await Promise.all([
   S.loadYear(month.slice(0,4)),
   S.all('vendas_pedidos','*',q=>{if(client)q=q.eq('cliente_id',client);if(pending)q=q.eq('cancelado',false).is('numero_externo',null);else q=q.gte('data_venda',range.start).lt('data_venda',range.end);return q.order('codigo',{ascending:false});}),
   S.all('vendas_devolucoes','*',q=>{if(client)q=q.eq('cliente_id',client);return q.gte('data_devolucao',range.start).lt('data_devolucao',range.end).order('criado_em',{ascending:false}).order('id');})
  ]);
  if(request!==serial)return;
  state={data,orders,returns,month};pages.clients=pages.orders=pages.returns=1;
  const chosen=client;
  $('historyClient').innerHTML='<option value="">Todos os clientes</option>'+data.clients.slice().sort((a,b)=>S.name(a).localeCompare(S.name(b),'pt-BR')).map(c=>'<option value="'+S.esc(c.id)+'">'+S.esc(S.name(c))+' · NN '+S.esc(c.nn)+'</option>').join('');
  if(data.clients.some(c=>String(c.id)===String(chosen)))$('historyClient').value=chosen;
  render();message('');
 }catch(e){if(request!==serial)return;message(S.error(e)+' Os dados anteriores podem estar desatualizados.',true);}
 finally{if(request===serial)$('historyReload').disabled=false;}
}
function render(){
 if(!state.data)return;const cid=selectedClient(),s=S.stats(state.data,state.month,cid),global=S.stats(state.data,state.month);
 W.summary($('historyKpis'),s,global);
 $('historyCoverage').textContent=W.coverage(state.data);
 $('historyScope').textContent=cid?'Volumes filtrados por cliente. A meta de positivação continua mostrando a carteira inteira.':'Positivado: cliente com saldo de cápsulas maior que zero no mês. Cada cliente conta uma vez.';
 $('historyBreakdown').innerHTML='<span>Saldo importado: <b>'+S.num(s.imported)+'</b></span><span>Novas vendas: <b>'+S.num(s.sales)+'</b></span><span>Novas devoluções: <b>'+S.num(s.returns)+'</b></span>';
 W.list($('historyRanking'),s.ranked.filter(c=>c.balance>0),'Nenhum cliente com saldo positivo neste mês.','ranking',state.month);
 W.list($('historyTargets'),s.targets,'Todos os clientes do filtro estão positivados.','targets',state.month);
 const trend=S.trend(state.data,state.month.slice(0,4),cid);$('historyChart').innerHTML=S.chart(trend);
 $('annualRows').innerHTML=trend.map(t=>{const rows=state.data.balances.filter(r=>r.mes===t.month+'-01'&&(!cid||String(r.cliente_id)===String(cid)));const sum=k=>rows.reduce((n,r)=>n+S.n(r[k]),0);const show=v=>rows.length?S.num(v):'—';return '<tr><td>'+S.esc(S.monthTitle(t.month))+'</td><td>'+show(sum('importado'))+'</td><td>'+show(sum('vendas'))+'</td><td>'+show(sum('devolucoes'))+'</td><td>'+show(t.net)+'</td><td>'+show(t.positive)+'</td></tr>';}).join('');
 const clients=pagination($('onlyTargets').checked?s.targets:s.ranked,'clients');
 const visibleOrders=pagination(state.orders,'orders'),visibleReturns=pagination(state.returns,'returns');
 $('historyClientRows').innerHTML=clients.length?clients.map(c=>'<tr><td>'+S.esc(S.name(c))+'</td><td>'+S.esc(c.nn)+'</td><td>'+S.num(c.balance)+'</td><td>'+S.num(c.annual)+'</td><td><span class="sales-badge">'+(c.balance>0?'Positivado':'A positivar')+'</span></td></tr>').join(''):'<tr><td colspan="5">Nenhum cliente neste filtro.</td></tr>';
 $('orderRows').innerHTML=state.orders.length?visibleOrders.map(p=>{
 const pending=!p.numero_externo;const days=Math.max(0,Math.floor((Date.parse(S.today()+'T12:00Z')-Date.parse(p.data_venda+'T12:00Z'))/86400000));
 return '<tr><td>'+S.code(p)+'<small>'+S.date(p.data_venda)+(p.cancelado?' · Cancelado':'')+'</small></td><td>'+S.esc(clientName(p.cliente_id))+'</td><td>'+S.esc(p.canal==='email'?'E-mail':p.canal==='whatsapp'?'WhatsApp':'Manual')+'</td><td>'+S.num(p.capsulas)+'</td><td>'+(p.numero_externo?S.esc(p.numero_externo):'<span class="sales-badge">Número pendente</span><small>Há '+days+' dia(s)</small>')+'</td><td><button class="btn btn-secondary" data-action="detail" data-id="'+p.id+'">Detalhes</button>'+(!p.cancelado?'<button class="btn btn-edit" data-action="number" data-id="'+p.id+'">'+(pending?'Informar número':'Editar número')+'</button><button class="btn btn-danger" data-action="cancelOrder" data-id="'+p.id+'">Cancelar</button>':'')+'</td></tr>';
 }).join(''):'<tr><td colspan="6">Nenhum pedido neste filtro. Os saldos importados não são pedidos individuais.</td></tr>';
 $('returnRows').innerHTML=state.returns.length?visibleReturns.map(r=>'<tr><td>'+S.date(r.data_devolucao)+(r.cancelado?'<small>Cancelada</small>':'')+'</td><td>'+S.esc(clientName(r.cliente_id))+'</td><td class="sales-negative">−'+S.num(r.capsulas)+'</td><td>'+S.esc(r.referencia||'Sem referência externa')+'<small>'+S.esc(r.observacao)+'</small></td><td>'+(!r.cancelado?'<button class="btn btn-danger" data-action="cancelReturn" data-id="'+r.id+'">Cancelar lançamento</button>':'—')+'</td></tr>').join(''):'<tr><td colspan="5">Nenhuma nova devolução registrada neste mês. Devoluções antigas já estão no saldo importado.</td></tr>';
}
function clientOptions(){return state.data.clients.slice().sort((a,b)=>S.name(a).localeCompare(S.name(b),'pt-BR')).map(c=>'<option value="'+S.esc(c.id)+'">'+S.esc(S.name(c))+' · NN '+S.esc(c.nn)+'</option>').join('');}
function formBase(mode){
 const ret=mode==='return';
 return '<form id="operationForm" class="sales-form"><label>Cliente<select id="opClient" required><option value="">Selecione o cliente</option>'+clientOptions()+'</select></label>'+
 '<div class="sales-form-row"><label>Data '+(ret?'da devolução':'da venda')+'<input id="opDate" type="date" min="2000-01-01" max="'+S.today()+'" value="'+S.today()+'" required></label><label>Quantidade de cápsulas<input id="opCaps" type="number" min="1" max="2147483647" step="1" required></label></div>'+
 (ret?'<label>Pedido vinculado (opcional)<select id="opOrder"><option value="">Histórico importado / pedido não cadastrado</option></select></label><label>Referência externa (opcional)<input id="opNumber" type="text" maxlength="120" placeholder="Número do pedido original, se disponível"></label>':'<div class="sales-form-row"><label>Canal<select id="opChannel"><option value="whatsapp">WhatsApp</option><option value="email">E-mail</option><option value="manual">Manual</option></select></label><label>Número externo (opcional)<input id="opNumber" type="text" maxlength="80" placeholder="Pode informar depois"></label></div>')+
 '<label>'+(ret?'Motivo da devolução':'Observação / referência')+'<textarea id="opNote" maxlength="2000" '+(ret?'required minlength="3"':'')+' placeholder="'+(ret?'Descreva a devolução':'Ex.: complemento não incluído no fechamento da planilha')+'"></textarea></label>'+
 '<div id="opOverlap" class="sales-overlap" hidden><label class="check-label"><input id="opCheck" type="checkbox"><span>Conferi que este lançamento não está incluído na planilha importada. É um complemento pendente.</span></label></div>'+
 '<p class="sales-note">'+(ret?'Digite a quantidade positiva. O sistema fará o desconto no mês da devolução.':'Esta confirmação soma a venda ao histórico. Se já estiver na planilha, não lance novamente.')+'</p><button class="btn btn-primary" type="submit">'+(ret?'Registrar devolução':'Confirmar venda')+'</button></form>';
}
function openDialog(mode,id){
 if(!state.data){message('Aguarde o carregamento do histórico.',true);return;}
 dialogState={mode,id:id||S.uuid()};dirty=false;$('dialogMessage').hidden=true;
 let title,body;
 const p=state.orders.find(p=>p.id===id),r=state.returns.find(r=>r.id===id);
 if(mode==='sale'||mode==='return'){title=mode==='sale'?'Registrar venda manual':'Registrar devolução';body=formBase(mode);}
 else if(mode==='number'){title='Número externo do pedido';body='<p class="sales-note">'+S.code(p)+' · '+S.esc(clientName(p.cliente_id))+'</p><form class="sales-form" id="operationForm"><label>Número recebido<input id="opNumber" type="text" required maxlength="80" value="'+S.esc(p.numero_externo||'')+'"></label><p class="sales-note">O número apenas completa este pedido. O volume não será somado novamente.</p><button class="btn btn-primary" type="submit">Salvar número</button></form>';}
 else if(mode==='goal'){title='Meta de positivação · '+S.monthTitle(state.month);body='<form class="sales-form" id="operationForm"><label>Quantidade de clientes<input id="opGoal" type="number" required min="0" max="100000" step="1" value="'+(S.stats(state.data,state.month).goal??'')+'"></label><p class="sales-note">A meta é mensal e vale para a carteira inteira.</p><button class="btn btn-primary" type="submit">Salvar meta</button></form>';}
 else if(mode==='cancelOrder'||mode==='cancelReturn'){title='Cancelar lançamento';body='<p class="sales-note">'+S.esc(mode==='cancelOrder'?S.code(p)+' · '+clientName(p.cliente_id):'Devolução · '+clientName(r.cliente_id))+'</p><form class="sales-form" id="operationForm"><label>Motivo<input id="opNote" type="text" required minlength="3" maxlength="2000"></label><p class="sales-note">O registro será preservado como cancelado e sairá dos cálculos. Para corrigir uma venda, cancele o lançamento e registre a versão correta. Devoluções vinculadas precisam ser canceladas primeiro.</p><button class="btn btn-danger" type="submit">Confirmar cancelamento</button></form>';}
 else if(mode==='detail'){
 title=S.code(p);body='<dl class="sales-detail"><dt>Cliente</dt><dd>'+S.esc(clientName(p.cliente_id))+'</dd><dt>Data / Canal</dt><dd>'+S.date(p.data_venda)+' · '+S.esc(p.canal)+'</dd><dt>Número externo</dt><dd>'+S.esc(p.numero_externo||'Pendente')+'</dd><dt>Cápsulas</dt><dd>'+S.num(p.capsulas)+'</dd><dt>Valor do pedido</dt><dd>'+(p.total_centavos==null?'Não informado':(S.n(p.total_centavos)/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}))+'</dd><dt>Observação</dt><dd>'+S.esc(p.observacao||'—')+'</dd><dt>Status</dt><dd>'+S.esc(p.cancelado?'Cancelado: '+p.motivo_cancelamento:'Registrado')+'</dd></dl>';
 if(p.itens?.length)body+='<ul class="sales-list">'+p.itens.map(i=>'<li><div>'+S.esc(i.nome)+'<small>SKU '+S.esc(i.sku)+' · '+S.num(i.quantidade)+' '+(i.tipo==='acessorios'?'embalagem(ns)':'caixa(s) de '+i.unidades_por_embalagem+' cápsulas')+'</small></div></li>').join('')+'</ul>';
 if(p.numeros_historico?.length)body+='<p class="sales-note">Alterações do número externo: '+p.numeros_historico.map(h=>S.esc(h.anterior||'Pendente')+' → '+S.esc(h.novo||'Pendente')).join('; ')+'</p>';
 }
 $('historyDialogTitle').textContent=title;$('historyDialogBody').innerHTML=body;$('historyDialog').showModal();
 const form=$('operationForm');
 if(form){form.addEventListener('submit',submit);form.addEventListener('input',()=>dirty=true);}
 if(mode==='sale'||mode==='return'){
  if(selectedClient())$('opClient').value=selectedClient();
  $('opDate').addEventListener('change',overlap);overlap();
  if(mode==='return'){$('opClient').addEventListener('change',loadReturnOrders);loadReturnOrders();}
 }
 $('historyDialog').querySelector('input,select,textarea')?.focus();
}
function overlap(){const cutoff=state.data.imports[0]?.data_corte;const needs=!!cutoff&&$('opDate').value<=cutoff;$('opOverlap').hidden=!needs;$('opCheck').required=needs;if(!needs)$('opCheck').checked=false;}
let orderRequest=0;
async function loadReturnOrders(){
 const req=++orderRequest,id=$('opClient').value;$('opOrder').innerHTML='<option value="">Histórico importado / pedido não cadastrado</option>';
 if(!id)return;
 try{const orders=await S.all('vendas_pedidos','id,codigo,numero_externo,data_venda,capsulas',q=>q.eq('cliente_id',id).eq('cancelado',false).gt('capsulas',0).order('codigo',{ascending:false}));if(req!==orderRequest||!$('opOrder'))return;
 $('opOrder').innerHTML+=orders.map(p=>'<option value="'+p.id+'">'+S.esc(S.code(p)+(p.numero_externo?' · '+p.numero_externo:' · Número pendente')+' · '+S.date(p.data_venda)+' · '+S.num(p.capsulas)+' cápsulas')+'</option>').join('');
 }catch(e){dialogMessage(S.error(e));}
}
function dialogMessage(text){$('dialogMessage').textContent=text;$('dialogMessage').hidden=!text;$('dialogMessage').classList.add('error');}
async function submit(event){
 event.preventDefault();if(busy)return;const form=event.currentTarget,mode=dialogState.mode,id=dialogState.id;busy=true;
 const button=form.querySelector('[type=submit]');button.disabled=true;const label=button.textContent;button.textContent='Salvando…';dialogMessage('');
 try{
  if(mode==='sale'||mode==='return'){
   const cid=$('opClient').value,caps=Number($('opCaps').value),when=$('opDate').value,note=$('opNote').value.trim();
   if(!cid||!Number.isSafeInteger(caps)||caps<1)throw Error('Informe cliente e quantidade válida.');
   if(!$('opOverlap').hidden&&(!$('opCheck').checked||note.length<5))throw Error('Confirme a conferência com a planilha e descreva o complemento com pelo menos 5 caracteres.');
   if(mode==='sale')await S.insertOnce('vendas_pedidos',{id,cliente_id:cid,data_venda:when,canal:$('opChannel').value,origem:'manual',capsulas_informadas:caps,numero_externo:$('opNumber').value.trim()||null,observacao:note,conferencia_importacao:$('opCheck').checked});
   else await S.insertOnce('vendas_devolucoes',{id,cliente_id:cid,data_devolucao:when,capsulas:caps,pedido_id:$('opOrder').value||null,referencia:$('opNumber').value.trim(),observacao:note,conferencia_importacao:$('opCheck').checked});
  }else if(mode==='number'){const external=$('opNumber').value.trim();if(!external)throw Error('Informe um número de pedido válido.');await S.patch('vendas_pedidos',id,{numero_externo:external});}
  else if(mode==='goal'){await S.saveGoal(state.month,Number($('opGoal').value));}
  else if(mode==='cancelOrder'||mode==='cancelReturn'){await S.patch(mode==='cancelOrder'?'vendas_pedidos':'vendas_devolucoes',id,{cancelado:true,motivo_cancelamento:$('opNote').value.trim()});}
  dirty=false;$('historyDialog').close();S.notify();await reload();message('Lançamento salvo e totais atualizados.');
 }catch(e){dialogMessage(e.code?S.error(e):e.message||S.error(e));}
 finally{busy=false;button.disabled=false;button.textContent=label;}
}
function closeDialog(){if(busy)return;if(dirty&&!confirm('Descartar os dados não salvos?'))return;dirty=false;$('historyDialog').close();}
document.addEventListener('DOMContentLoaded',async()=>{
 const params=new URLSearchParams(location.search);const requested=params.get('mes');
 $('historyMonth').value=/^\d{4}-(0[1-9]|1[0-2])$/.test(requested||'')?requested:S.today().slice(0,7);
 if(params.get('cliente'))$('historyClient').innerHTML+='<option value="'+S.esc(params.get('cliente'))+'" selected>Cliente selecionado</option>';
 $('pendingOnly').checked=params.get('pendentes')==='1';
 try{const {data,error}=await S.api().auth.getSession();if(error)throw error;if(!data.session){location.replace('login.html');return;}}catch{message('Não foi possível verificar seu acesso. Recarregue a página.',true);return;}
 ['historyMonth','historyClient','pendingOnly'].forEach(id=>$(id).addEventListener('change',reload));
 $('onlyTargets').addEventListener('change',render);$('historyReload').addEventListener('click',reload);
 $('manualSale').addEventListener('click',()=>openDialog('sale'));$('manualReturn').addEventListener('click',()=>openDialog('return'));$('editGoal').addEventListener('click',()=>openDialog('goal'));
 $('dialogClose').addEventListener('click',closeDialog);$('historyDialog').addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
 document.querySelector('main').addEventListener('click',event=>{const pager=event.target.closest('[data-page]');if(pager){pages[pager.dataset.page]+=Number(pager.dataset.step);render();return;}const b=event.target.closest('[data-action]');if(b)openDialog(b.dataset.action,b.dataset.id);});
 window.addEventListener('storage',event=>{if(event.key==='central-sales-updated'&&!busy)reload();});
 window.addEventListener('focus',()=>{if(!$('historyDialog').open)reload();});
 await reload();
});
})();

