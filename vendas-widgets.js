(() => {
'use strict';
const S=window.CentralSales;
function summary(node,s,global=s){
 const pct=global.goal>0?Math.min(100,global.positive/global.goal*100):0;
 const goal=global.goal==null?'Meta não definida':global.goal===0?'Sem meta':global.positive>=global.goal?'Meta atingida':'Faltam '+S.num(global.goal-global.positive)+' clientes para a meta';
 node.innerHTML='<article class="sales-kpi sales-goal"><h3>Clientes positivados · carteira inteira</h3><strong>'+S.num(global.positive)+(global.goal>0?' <span style="font-size:16px">de '+S.num(global.goal)+'</span>':'')+'</strong><div class="sales-progress" role="progressbar" aria-label="Meta de positivação" aria-valuemin="0" aria-valuemax="'+(global.goal||100)+'" aria-valuenow="'+Math.min(global.positive,global.goal||100)+'"><span style="width:'+pct+'%"></span></div><small>'+S.esc(goal)+' · Inclui inativos'+(global.goal>0?' · '+(global.positive/global.goal*100).toFixed(1).replace('.',',')+'%':'')+'</small></article>'+
 '<article class="sales-kpi"><h3>Cápsulas líquidas no mês</h3><strong>'+S.num(s.net)+'</strong><small>Saldo importado + vendas − devoluções · Inclui inativos</small></article>'+
 '<article class="sales-kpi"><h3>Acumulado do ano</h3><strong>'+S.num(s.annual)+'</strong><small>Até o mês selecionado · Inclui inativos</small></article>'+
 '<article class="sales-kpi"><h3>Pedidos aguardando número</h3><strong>'+S.num(s.pending.length)+'</strong><small>Todos os meses · <a class="text-link" href="historico-pendencias.html">Conferir pendências</a></small></article>';
}
function list(node,clients,empty,mode='ranking',month=''){
 node.innerHTML=clients.length?'<ol class="sales-list">'+clients.slice(0,5).map(c=>'<li><div><a href="historico-clientes.html?cliente='+encodeURIComponent(c.id)+(month?'&mes='+encodeURIComponent(month):'')+'">'+S.esc(S.name(c))+'</a><small>NN '+S.esc(c.nn)+' · '+(mode==='targets'?'Acumulado: '+S.num(c.annual)+' cápsulas':S.esc(c.cidade))+'</small></div><strong>'+S.num(c.balance)+'<small>cápsulas no mês</small></strong></li>').join('')+'</ol>':'<p class="sales-empty">'+S.esc(empty)+'</p>';
}
function coverage(data){const imported=data.imports[0];return imported?'Histórico importado até '+S.date(imported.data_corte)+'. Novas vendas e devoluções são somadas por sua data. Os valores importados são saldos mensais líquidos.':'Sem histórico importado.';}
window.SalesWidgets={summary,list,coverage};
})();

