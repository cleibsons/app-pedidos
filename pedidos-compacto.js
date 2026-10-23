(() => {
'use strict';
const $=id=>document.getElementById(id);
let locked=true,category='b2b',replacement=null;
const selected=new Map();
function syncLock(){document.querySelectorAll('[data-category],#addSelected,.product-name').forEach(el=>el.disabled=locked);if(locked&&$('productPicker').open)$('productPicker').close();}
window.addEventListener('pedido-lock-change',e=>{locked=e.detail.locked;syncLock();});
window.addEventListener('pedido-items-rendered',syncLock);
function summary(){
 let capsules=0,boxes=0;
 for(const i of itensPedido){const r=resumoItem(i);if(r){boxes+=r.qtd;if(i.tipo!=='acessorios')capsules+=r.qtd*r.unidades;}}
 $('compactCount').textContent=itensPedido.length+' itens · '+capsules.toLocaleString('pt-BR')+' cápsulas · '+boxes+' embalagens';
 $('seeCart').textContent='Ver pedido · '+itensPedido.length;
}
const originalPreview=atualizarPreview;
atualizarPreview=function(){originalPreview();summary();};
function renderPicker(){
 const results=$('pickerResults');results.replaceChildren();
 const query=normalizarBusca($('pickerSearch').value);
 const products=listaPorTipo(category).filter(p=>normalizarBusca([p.nome,p.descricao,p.sku].join(' ')).includes(query));
 document.querySelectorAll('[data-picker-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pickerCategory===category)));
 if(!products.length){const p=document.createElement('p');p.textContent='Nenhum produto encontrado nesta categoria.';results.append(p);}
 for(const p of products){
  const key=category+':'+p.id,type=category,row=document.createElement('div');row.className='picker-row';
  const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=selected.has(key);
  const text=document.createElement('span'),title=document.createElement('strong'),meta=document.createElement('small');
  title.textContent=p.nome||p.descricao||'Produto';const price=lerCentavos(type==='acessorios'?p.preco_embalagem:p.preco);
  meta.textContent='SKU '+(p.sku||'—')+' · '+(price===null?'Preço a informar':moeda(price))+' / '+(type==='acessorios'?'embalagem':'cápsula');
  text.append(title,meta);label.append(check,text);
  const qty=document.createElement('input');qty.type='number';qty.min='1';qty.step='1';qty.value=selected.get(key)?.quantity||1;qty.setAttribute('aria-label','Quantidade de '+title.textContent);qty.className='picker-qty';qty.disabled=!check.checked;
  check.addEventListener('change',()=>{if(check.checked)selected.set(key,{type,product:p,quantity:qty.value});else selected.delete(key);qty.disabled=!check.checked;selectionCount();});
  qty.addEventListener('input',()=>{if(selected.has(key))selected.get(key).quantity=qty.value;selectionCount();});
  row.append(label,qty);results.append(row);
 }
 selectionCount();
}
function selectionCount(){$('pickerCount').textContent=selected.size+' produto(s) selecionado(s)';$('addSelected').disabled=locked||!selected.size;}
window.abrirSeletorProdutos=function(type='b2b',id=null){
 if(locked)return;category=type;replacement=id;selected.clear();$('tipoItemAdd').value=type;$('pickerSearch').value='';$('pickerError').textContent='';renderPicker();$('productPicker').showModal();$('pickerSearch').focus();
};
function add(){
 if(locked||!selected.size)return;
 const entries=[...selected.values()];
 if(entries.some(e=>!Number.isSafeInteger(Number(e.quantity))||Number(e.quantity)<1)){$('pickerError').textContent='Informe quantidades inteiras maiores que zero.';return;}
 const next=itensPedido.map(i=>({...i}));let target=replacement===null?null:next.find(i=>i.idUnico===replacement);
 for(const e of entries){
  const existing=target||next.find(i=>i.tipo===e.type&&String(i.produtoId)===String(e.product.id));
  if(existing){if(target){existing.tipo=e.type;existing.produtoId=e.product.id;existing.quantidade=Number(e.quantity);if(!existing.precoManual)existing.preco=textoPreco(lerCentavos(e.type==='acessorios'?e.product.preco_embalagem:e.product.preco));target=null;}else existing.quantidade=Number(existing.quantidade)+Number(e.quantity);}
  else next.push({idUnico:++proximoItemId,tipo:e.type,produtoId:e.product.id,quantidade:Number(e.quantity),preco:textoPreco(lerCentavos(e.type==='acessorios'?e.product.preco_embalagem:e.product.preco)),precoManual:false});
 }
 if(next.length>100){$('pickerError').textContent='O limite é de 100 itens por pedido.';return;}
 itensPedido=next;renderizarItensPedido();atualizarPreview();$('productPicker').close();
}
function message(){if($('cartDrawer').open)$('cartDrawer').close();$('pedidoPreview').open=true;$('pedidoPreview').scrollIntoView({behavior:'smooth',block:'start'});}
function review(){if($('cartDrawer').open)$('cartDrawer').close();document.querySelector('.sales-save').scrollIntoView({behavior:'smooth',block:'start'});}
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>abrirSeletorProdutos(b.dataset.category)));
 document.querySelectorAll('[data-picker-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.pickerCategory;$('pickerSearch').value='';renderPicker();}));
 $('pickerSearch').addEventListener('input',renderPicker);$('addSelected').addEventListener('click',add);
 document.querySelector('[data-close-picker]').addEventListener('click',()=>$('productPicker').close());
 $('seeMessage').addEventListener('click',message);$('drawerMessage').addEventListener('click',message);$('reviewSale').addEventListener('click',review);$('drawerReview').addEventListener('click',review);
 $('seeCart').addEventListener('click',()=>{$('drawerBody').append($('cartPanel'));$('cartDrawer').showModal();});
 $('closeCart').addEventListener('click',()=>$('cartDrawer').close());
 $('cartDrawer').addEventListener('close',()=>{$('cartHome').append($('cartPanel'));});
 matchMedia('(min-width: 761px)').addEventListener('change',e=>{if(e.matches&&$('cartDrawer').open)$('cartDrawer').close();});
 syncLock();summary();
});
})();
