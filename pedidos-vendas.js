(() => {
'use strict';
const S=CentralSales,$=id=>document.getElementById(id);
let draft=null,key='',restoring=false,ready=false,busy=false,cutoff='';
const originalLoad=carregarDadosNuvem,originalPreview=atualizarPreview,originalClear=limparPedido;
function blank(){return {id:S.uuid(),saved:null};}
function notice(text,error=false){$('salesSaveStatus').textContent=text;$('salesSaveStatus').classList.toggle('error',error);$('salesSaveStatus').hidden=!text;}
function persist(){
 if(!ready||restoring||!draft||!key)return;
 const fields={client:clienteSelecionado?.id||null,search:$('buscaClienteInput').value,items:itensPedido,channel:canalAtual,logistics:$('tipoLogisticaInput').value,oc:$('ordemCompraInput').value,date:$('saleDate').value,number:$('saleNumber').value,note:$('saleNote').value,checked:$('saleCheck').checked};
 try{sessionStorage.setItem(key,JSON.stringify({...draft,fields}));}catch{notice('Seu navegador não conseguiu guardar o rascunho. Mantenha esta aba aberta até concluir.',true);}
}
function lock(locked){
 ['buscaClienteInput','tipoItemAdd','cardWhats','cardEmail','opcaoBroker','opcao3a','ordemCompraInput','saleDate','saleNumber','saleNote','saleCheck'].forEach(id=>{const el=$(id);if(el)el.disabled=locked;});
 document.querySelectorAll('.item-linha input,.item-linha button,[onclick*="adicionarLinhaItem"]').forEach(el=>el.disabled=locked);
 $('saveSale').disabled=locked||busy;
}
function overlap(){const needs=!!cutoff&&$('saleDate').value<=cutoff;$('saleOverlap').hidden=!needs;$('saleCheck').required=needs;if(!needs)$('saleCheck').checked=false;}
function receipt(order){
 $('saleSavedLink').href='historico.html?mes='+order.data_venda.slice(0,7);$('saleSavedLink').hidden=false;
 notice(S.code(order)+' registrado: '+S.num(order.capsulas)+' cápsulas. '+(order.numero_externo?'Número externo: '+order.numero_externo+'.':'Número externo pendente. Informe depois no histórico.')+' Para outra venda, use Limpar / Novo pedido.');
 lock(true);$('saveSale').textContent='Venda registrada';
}
async function init(){
 if(ready)return;
 const {data,error}=await S.api().auth.getSession();if(error||!data.session)return;
 key='central-sale-draft:'+data.session.user.id;draft=blank();
 try{const raw=sessionStorage.getItem(key);if(raw){const saved=JSON.parse(raw);if(saved.id&&/^[0-9a-f-]{36}$/i.test(saved.id))draft=saved;}}catch{draft=blank();}
 try{const imports=await S.all('historico_importacoes','data_corte',q=>q.order('data_corte',{ascending:false}));cutoff=imports[0]?.data_corte||'';}catch{notice('Não foi possível conferir a data de corte da importação. O servidor validará o lançamento.',true);}
 $('saleDate').value=S.today();$('saleDate').max=S.today();restoring=true;
 if(draft.fields){
  const f=draft.fields;itensPedido=Array.isArray(f.items)?f.items:[];proximoItemId=itensPedido.reduce((max,i)=>Math.max(max,Number(i.idUnico)||0),0);
  renderizarItensPedido();$('buscaClienteInput').value=f.search||'';
  mostrarClienteSelecionado(clientesLista.find(c=>String(c.id)===String(f.client))||null);
  $('ordemCompraInput').value=f.oc||'';selecionarCanal(['email','whatsapp'].includes(f.channel)?f.channel:'whatsapp',f.logistics||'broker');
  $('saleDate').value=f.date||S.today();$('saleNumber').value=f.number||'';$('saleNote').value=f.note||'';$('saleCheck').checked=!!f.checked;
 }
 restoring=false;ready=true;overlap();persist();
 if(draft.saved){
  lock(true);
  try{const {data:order,error}=await S.api().from('vendas_pedidos').select('*').eq('id',draft.id).maybeSingle();if(error)throw error;if(order){receipt(order);return;}}
  catch{notice('Este rascunho já foi salvo. Consulte o histórico para confirmar o pedido antes de iniciar outro.',true);return;}
  notice('O rascunho indica uma venda já registrada. Confira o histórico antes de começar outra.',true);
 }else lock(false);
}
carregarDadosNuvem=async function(){await originalLoad();try{await init();}catch{notice('Não foi possível preparar o registro da venda. Recarregue a página.',true);}};
atualizarPreview=function(){originalPreview();persist();};
limparPedido=function(){
 if(busy)return;originalClear();
 if(!clienteSelecionado&&!itensPedido.length){
  draft=blank();$('saleDate').value=S.today();$('saleNumber').value='';$('saleNote').value='';$('saleCheck').checked=false;$('saleSavedLink').hidden=true;$('saveSale').textContent='Confirmar venda e salvar';lock(false);overlap();notice('');persist();
 }
};
async function save(){
 if(!ready||busy||draft?.saved)return;
 if(!clienteSelecionado||!itensPedido.length||atualizarTotais().pendentes){notice('Selecione o cliente e complete todos os itens antes de confirmar a venda.',true);return;}
 const date=$('saleDate').value;if(!date||date>S.today()){notice('Informe a data correta da venda, sem data futura.',true);return;}
 const note=$('saleNote').value.trim();overlap();
 if(!$('saleOverlap').hidden&&(!$('saleCheck').checked||note.length<5)){notice('Para datas incluídas no fechamento, confirme que a venda não está na planilha e descreva o complemento.',true);return;}
 const items=itensPedido.map(item=>{const r=resumoItem(item);return {tipo:item.tipo,produto_id:String(item.produtoId),quantidade:r.qtd,preco_centavos:r.preco};});
 const payload={id:draft.id,cliente_id:clienteSelecionado.id,data_venda:date,canal:canalAtual,origem:'compositor',itens:items,numero_externo:$('saleNumber').value.trim()||null,observacao:note,conferencia_importacao:$('saleCheck').checked};
 busy=true;persist();lock(true);$('saveSale').textContent='Salvando…';notice('Registrando a venda…');
 try{
  const order=await S.insertOnce('vendas_pedidos',payload);
  draft.saved={id:order.id,codigo:order.codigo};persist();receipt(order);S.notify();
 }catch(error){notice(error.code?S.error(error):error.message||S.error(error),true);lock(false);$('saveSale').textContent='Confirmar venda e salvar';}
 finally{busy=false;if(!draft.saved)$('saveSale').disabled=false;}
}
document.addEventListener('DOMContentLoaded',()=>{
 $('saveSale').addEventListener('click',save);
 ['saleDate','saleNumber','saleNote','saleCheck','ordemCompraInput'].forEach(id=>$(id).addEventListener('input',()=>{overlap();persist();}));
 window.addEventListener('beforeunload',event=>{if(busy){event.preventDefault();event.returnValue='';}});
});
})();

