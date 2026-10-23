// Verifica a sessão depois de inicializar o cliente Supabase.
async function protegerPagina() {
    try {
        if (!supabaseClient) throw new Error('Supabase indisponível');
        const { data, error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        if (!data.session) {
            window.location.replace('login.html');
            return false;
        }
        return true;
    } catch (error) {
        alert('Não foi possível verificar seu acesso. Verifique a conexão e tente novamente.');
        window.location.replace('login.html');
        return false;
    }
}

// Conexão com o Supabase
const SUPABASE_URL = 'https://awllwrltulzmjdcchlxs.supabase.co';
const SUPABASE_KEY = 'sb_publishable__Cj-tdVffbiigN0-YczRkw_eVLEUIMZ';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let produtos = [];
let filtroSistemaAtual = 'Todos';

document.addEventListener("DOMContentLoaded", async () => {
    if (await protegerPagina()) {
        await carregarProdutosNuvem();
    }
});

/* CARREGAR PRODUTOS DA NUVEM */
async function carregarProdutosNuvem() {
    const tbody = document.getElementById('produtosTableBody');
    tbody.innerHTML = `<p class="pro-status">Carregando catálogo B2C...</p>`;

    if (!supabaseClient) {
        tbody.innerHTML = `<p class="pro-status">Não foi possível carregar os cafés. Verifique a conexão e atualize a página.</p>`;
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('produtos_b2c')
            .select('*')
            .order('nome', { ascending: true });

        if (error) {
            console.error('Erro ao buscar produtos B2C:', error);
            tbody.innerHTML = `<p class="pro-status">Não foi possível carregar os cafés. Verifique a conexão e atualize a página.</p>`;
            return;
        }

        produtos = data || [];
        renderizarTabela();
    } catch (err) {
        console.error('Erro de conexão:', err);
        tbody.innerHTML = `<p class="pro-status">Não foi possível carregar os cafés. Verifique a conexão e atualize a página.</p>`;
    }
}


function elementoB2C(tag, classe, texto) {
 const el=document.createElement(tag);if(classe)el.className=classe;if(texto!=null)el.textContent=texto;return el;
}
function moedaB2C(v) {return Number(v || 0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function criarFotoB2C(p) {
 const area=elementoB2C('div','pro-photo');
 const fallback=elementoB2C('span','pro-photo-fallback','N');fallback.setAttribute('aria-label','Foto indisponível');area.append(fallback);
 const fontes=fontesFotoB2C(p);
 if(fontes.length){
  const img=document.createElement('img');img.alt=p.nome || 'Cápsula de café';img.loading='lazy';img.decoding='async';
  img.addEventListener('load',()=>fallback.hidden=true);
  img.addEventListener('error',()=>{if(fontes.length)img.src=fontes.shift();else{img.remove();fallback.hidden=false;}});
  img.src=fontes.shift();area.append(img);
 }
 return area;
}
function descricaoB2C(p) {return infoOficialB2C(p)?.notes || p.observacoes || '';}
function renderizarTabela() {
 const grid=document.getElementById('produtosTableBody'),nav=document.getElementById('categoriasNav');
 grid.replaceChildren();nav.replaceChildren();
 const termo=normalizarTextoB2C(document.getElementById('searchInput').value);
 const filtrados=produtos.filter(p=>{
  const sistema=sistemaB2C(p),info=infoOficialB2C(p),categoria=(COLECOES_B2C[sistema]||[]).find(c=>c[0]===categoriaB2C(p));
  return (filtroSistemaAtual==='Todos'||sistema===filtroSistemaAtual)&&[p.nome,p.sku,sistema,p.observacoes,info?.notes,categoria?.[1],info?.size].some(v=>normalizarTextoB2C(v).includes(termo));
 });
 document.getElementById('produtosContagem').textContent=filtrados.length+' '+(filtrados.length===1?'café':'cafés');
 if(!filtrados.length){grid.append(elementoB2C('p','pro-status',produtos.length?'Nenhum café encontrado. Tente outro nome, SKU ou coleção.':'Nenhuma cápsula cadastrada. Use “Nova Cápsula B2C” para começar.'));return;}
 for(const sistema of ['Original','Vertuo','Outros']){
  const itens=filtrados.filter(p=>sistemaB2C(p)===sistema);if(!itens.length)continue;
  const navLinha=elementoB2C('div','b2c-nav-line');navLinha.append(elementoB2C('span','b2c-nav-label',sistema));
  const links=elementoB2C('div','pro-category-nav');
  const bloco=elementoB2C('section','b2c-system');bloco.setAttribute('aria-label','Cafés '+sistema);
  const heading=elementoB2C('div','b2c-system-heading');heading.append(elementoB2C('h2','',sistema),elementoB2C('p','',sistema==='Original'?'Espressos clássicos e receitas com leite.':sistema==='Vertuo'?'Diferentes tamanhos, uma crema generosa.':'Mais cápsulas do seu catálogo.'));bloco.append(heading);
  const categorias=COLECOES_B2C[sistema]||[['outros','Outros','Mais cafés do seu catálogo.','']];
  for(const [slug,titulo,descricao] of categorias){
   const grupo=itens.filter(p=>categoriaB2C(p)===slug);if(!grupo.length)continue;
   const id='b2c-'+sistema.toLowerCase()+'-'+slug;
   const link=elementoB2C('a','pro-category-link',titulo);link.href='#'+id;links.append(link);
   const secao=elementoB2C('section','pro-category');secao.id=id;secao.setAttribute('aria-labelledby','titulo-'+id);
   const banner=elementoB2C('header','pro-category-banner'),copy=elementoB2C('div','pro-category-copy');
   const title=elementoB2C('h3','pro-category-title',titulo);title.id='titulo-'+id;
   copy.append(elementoB2C('span','pro-category-eyebrow','Nespresso '+sistema),title,elementoB2C('p','pro-category-description',descricao),elementoB2C('span','pro-category-count',grupo.length+' '+(grupo.length===1?'café':'cafés')));
   banner.append(copy);const lista=elementoB2C('div','pro-grid');secao.append(banner,lista);bloco.append(secao);
   for(const p of grupo){
    const info=infoOficialB2C(p),card=elementoB2C('article','pro-card'),body=elementoB2C('div','pro-card-body');
    card.append(criarFotoB2C(p));body.append(elementoB2C('span','b2c-system-badge',sistema),elementoB2C('span','pro-sku','SKU '+(p.sku||'—')),elementoB2C('h4','pro-name',p.nome||'Cápsula de café'));
    body.append(elementoB2C('p','pro-pack','Caixa com '+(p.capsulas_caixa||10)+' cápsulas'+(info?.size?' · '+info.size:'')));
    if(descricaoB2C(p))body.append(elementoB2C('p','pro-description',descricaoB2C(p)));
    const atributos=elementoB2C('div','b2c-attributes'),intensidade=intensidadeB2C(p);
    if(intensidade)atributos.append(elementoB2C('span','pro-intensity','Intensidade '+intensidade));
    if(/decaff|descaf/.test(normalizarTextoB2C(p.nome)))atributos.append(elementoB2C('span','b2c-decaf','Descafeinado'));
    body.append(atributos);
    const footer=elementoB2C('div','pro-card-footer'),price=elementoB2C('div','pro-price');
    price.append(elementoB2C('strong','',moedaB2C(p.preco)),elementoB2C('span','','por cápsula'));
    footer.append(price,elementoB2C('p','pro-pack',moedaB2C(Number(p.preco||0)*(p.capsulas_caixa||10))+' por caixa'));
    const details=elementoB2C('button','btn pro-details','Ver detalhes');details.type='button';details.setAttribute('aria-label','Ver detalhes de '+p.nome);details.addEventListener('click',()=>visualizarProduto(p.id));footer.append(details);
    const manage=elementoB2C('div','pro-manage');
    for(const [label,acao,classe]of [['Editar',editarProduto,''],['Excluir',excluirProduto,'pro-delete']]){
     const btn=elementoB2C('button',classe,label);btn.type='button';btn.setAttribute('aria-label',label+' '+p.nome);btn.addEventListener('click',()=>acao(p.id));manage.append(btn);
    }
    footer.append(manage);body.append(footer);card.append(body);lista.append(card);
   }
  }
  navLinha.append(links);nav.append(navLinha);grid.append(bloco);
 }
}
function filtrarSistema(sistema) {
 if(!['Todos','Original','Vertuo'].includes(sistema))return;
 filtroSistemaAtual=sistema;document.body.dataset.system=sistema;
 for(const linha of ['Todos','Original','Vertuo']){
  const btn=document.getElementById('btnFiltro'+linha);
  btn.classList.toggle('active',linha===sistema);btn.setAttribute('aria-pressed',String(linha===sistema));
 }
 renderizarTabela();
}
function filtrarProdutos() {renderizarTabela();}
function visualizarProduto(id) {
 const p=produtos.find(item=>item.id===id);if(!p)return;
 const info=infoOficialB2C(p),container=document.getElementById('detalhesConteudo');container.replaceChildren();
 const hero=elementoB2C('div','pro-detail-hero');hero.append(criarFotoB2C(p),elementoB2C('h3','',p.nome));container.append(hero);
 const campos=[['Sistema',sistemaB2C(p)],['Coleção',(COLECOES_B2C[sistemaB2C(p)]||[]).find(c=>c[0]===categoriaB2C(p))?.[1]||'Outros'],['SKU',p.sku],['Preço por cápsula',moedaB2C(p.preco)],['Cápsulas por caixa',p.capsulas_caixa||10],['Valor da caixa',moedaB2C(Number(p.preco||0)*(p.capsulas_caixa||10))]];
 if(info?.size)campos.push(['Preparo',info.size]);
 if(intensidadeB2C(p))campos.push(['Intensidade',intensidadeB2C(p)]);
 if(info?.notes)campos.push(['Perfil aromático',info.notes]);
 if(p.observacoes)campos.push(['Observações cadastradas',p.observacoes]);
 for(const [label,valor]of campos){const bloco=elementoB2C('div','detail-item');bloco.append(elementoB2C('div','detail-label',label),elementoB2C('div','detail-value',valor));container.append(bloco);}
 if(info?.source){const source=elementoB2C('a','b2c-source','Consultar referência na Nespresso');source.href=info.source;source.target='_blank';source.rel='noopener noreferrer';container.append(source);}
 document.getElementById('detalhesModal').style.display='flex';
}

function fecharModalDetalhes() {
    document.getElementById('detalhesModal').style.display = 'none';
}

/* CADASTRAR / EDITAR PRODUTO B2C */
function abrirModal(produto = null) {
    document.getElementById('produtoForm').reset();
    document.getElementById('produtoId').value = '';
    document.getElementById('produtoModal').style.display = 'flex';

    if (produto) {
        document.getElementById('modalTitle').innerText = 'Editar Cápsula B2C';
        document.getElementById('produtoId').value = produto.id;
        document.getElementById('sistemaInput').value = produto.sistema || 'Vertuo';
        document.getElementById('skuInput').value = produto.sku || '';
        document.getElementById('nomeInput').value = produto.nome || '';
        document.getElementById('intensidadeInput').value = produto.intensidade || '';
        document.getElementById('caixaQtdInput').value = produto.capsulas_caixa || 10;
        document.getElementById('precoInput').value = produto.preco ? produto.preco.toString().replace('.', ',') : '';
        document.getElementById('fotoInput').value = produto.foto || '';
        document.getElementById('observacoesInput').value = produto.observacoes || '';
    } else {
        document.getElementById('modalTitle').innerText = 'Cadastrar Nova Cápsula B2C';
    }
}

function fecharModal() {
    document.getElementById('produtoModal').style.display = 'none';
    document.getElementById('produtoForm').reset();
}

async function salvarProduto(e) {
    e.preventDefault();
    const id = document.getElementById('produtoId').value;
    const precoStr = document.getElementById('precoInput').value.trim().replace(',', '.');
    const fotoUrlInput = document.getElementById('fotoInput').value.trim();
    const intVal = document.getElementById('intensidadeInput').value;

    const dadosProduto = {
        id: id ? parseInt(id) : Date.now(),
        sistema: document.getElementById('sistemaInput').value,
        sku: document.getElementById('skuInput').value.trim(),
        nome: document.getElementById('nomeInput').value.trim(),
        intensidade: intVal ? parseInt(intVal) : null,
        capsulas_caixa: parseInt(document.getElementById('caixaQtdInput').value) || 10,
        preco: parseFloat(precoStr) || 0,
        foto: fotoUrlInput,
        observacoes: document.getElementById('observacoesInput').value.trim()
    };

    const { error } = await supabaseClient
        .from('produtos_b2c')
        .upsert([dadosProduto]);

    if (error) {
        alert('Erro ao salvar no banco de dados B2C: ' + error.message);
    } else {
        fecharModal();
        carregarProdutosNuvem();
    }
}

function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (produto) abrirModal(produto);
}

async function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir esta cápsula do catálogo B2C?")) {
        const { error } = await supabaseClient
            .from('produtos_b2c')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Erro ao excluir do banco de dados: ' + error.message);
        } else {
            carregarProdutosNuvem();
        }
    }
}
