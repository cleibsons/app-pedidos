(() => {
'use strict';const S=CentralSales,W=SalesWidgets,$=id=>document.getElementById(id);let serial=0,ready=false;
async function load(){
 if(!ready)return;const month=$('dashboardSalesMonth').value;if(!/^\d{4}-\d{2}$/.test(month))return;
 const req=++serial;$('dashboardSalesRefresh').disabled=true;$('dashboardSalesStatus').hidden=false;$('dashboardSalesStatus').textContent='Atualizando resultados…';$('dashboardSalesStatus').classList.remove('error');
 try{
  const data=await S.loadYear(month.slice(0,4));if(req!==serial)return;const stats=S.stats(data,month);
  W.summary($('dashboardSalesKpis'),stats);W.list($('dashboardSalesRanking'),stats.ranked.filter(c=>c.balance>0),'Nenhum cliente com saldo positivo neste mês.','ranking',month);
  W.list($('dashboardSalesTargets'),stats.targets,'Todos os clientes estão positivados.','targets',month);
  $('dashboardSalesChart').innerHTML=S.chart(S.trend(data,month.slice(0,4)));
  $('dashboardSalesCoverage').textContent=W.coverage(data)+' Positivação: saldo de cápsulas maior que zero no mês.';
  $('dashboardGoalLink').href='historico.html?mes='+month;$('dashboardTrendLink').href='historico.html?mes='+month;
  $('dashboardSalesStatus').hidden=true;
 }catch(e){if(req!==serial)return;$('dashboardSalesStatus').textContent=S.error(e)+' Os dados anteriores podem estar desatualizados.';$('dashboardSalesStatus').classList.add('error');}
 finally{if(req===serial)$('dashboardSalesRefresh').disabled=false;}
}
document.addEventListener('DOMContentLoaded',async()=>{
 $('dashboardSalesMonth').value=S.today().slice(0,7);
 $('dashboardSalesMonth').addEventListener('change',load);$('dashboardSalesRefresh').addEventListener('click',load);
 $('refreshDashboard').addEventListener('click',load);
 window.addEventListener('sales-updated',load);window.addEventListener('focus',load);window.addEventListener('storage',e=>{if(e.key==='central-sales-updated')load();});
 try{const {data,error}=await S.api().auth.getSession();if(error)throw error;if(!data.session)return;ready=true;await load();}catch{$('dashboardSalesStatus').textContent='Não foi possível carregar os resultados. Recarregue a página.';}
});
})();

