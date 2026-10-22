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

// Configuração da Conexão com o Supabase
const SUPABASE_URL = 'https://awllwrltulzmjdcchlxs.supabase.co';
const SUPABASE_KEY = 'sb_publishable__Cj-tdVffbiigN0-YczRkw_eVLEUIMZ';
let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let produtos = [];
let imagemBase64Temp = '';

document.addEventListener("DOMContentLoaded", async () => {
    if (await protegerPagina()) {
        await carregarProdutosNuvem();
    }
});

/* CARREGAR PRODUTOS DA NUVEM */
async function carregarProdutosNuvem() {
    const tbody = document.getElementById('produtosGrid');
    tbody.innerHTML = `<p class="pro-status">Carregando catálogo profissional...</p>`;

    try {
        const { data, error } = await supabaseClient
            .from('produtos_b2b')
            .select('id, sku, nome, intensidade, capsulas_caixa, preco, foto, observacoes')
            .order('nome', { ascending: true });

        if (error) {
            console.error('Erro detalhado do Supabase:', error);
            tbody.innerHTML = `<p class="pro-status">Não foi possível carregar o catálogo. Atualize a página para tentar novamente.</p>`;
            return;
        }

        produtos = data || [];
        renderizarTabela(produtos);
    } catch (err) {
        console.error('Erro de conexão:', err);
        tbody.innerHTML = `<p class="pro-status">Não foi possível conectar ao catálogo. Verifique a conexão e atualize a página.</p>`;
    }
}

function criarElementoPro(tag, classe, texto) {
    const el=document.createElement(tag);if(classe) el.className=classe;if(texto!=null) el.textContent=texto;return el;
}
function criarFotoPro(produto) {
    const area=criarElementoPro('div','pro-photo');
    const fallback=criarElementoPro('span','pro-photo-fallback','N');fallback.setAttribute('aria-label','Foto indisponível');area.append(fallback);
    if(produto.foto) {
        const img=document.createElement('img');img.alt=produto.nome || 'Cápsula profissional';img.loading='lazy';img.decoding='async';
        img.addEventListener('error',()=>{img.remove();fallback.hidden=false;});
        img.addEventListener('load',()=>fallback.hidden=true);
        img.src=produto.foto;area.append(img);
    }
    return area;
}
function precoPro(valor) {return Number(valor || 0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function renderizarTabela(dados = produtos) {
    const grid=document.getElementById('produtosGrid');grid.replaceChildren();
    document.getElementById('produtosContagem').textContent=`${dados.length} ${dados.length===1?'café':'cafés'}`;
    if(!dados.length) {grid.append(criarElementoPro('p','pro-status',produtos.length?'Nenhum café encontrado. Tente outro nome ou SKU.':'Nenhuma cápsula cadastrada. Use “Nova cápsula” para começar.'));return;}
    for(const p of dados) {
        const card=criarElementoPro('article','pro-card');
        card.append(criarFotoPro(p));
        const corpo=criarElementoPro('div','pro-card-body');
        corpo.append(criarElementoPro('span','pro-sku',`SKU ${p.sku || '—'}`),criarElementoPro('h3','pro-name',p.nome || 'Cápsula profissional'),criarElementoPro('p','pro-pack',`Caixa com ${p.capsulas_caixa || 50} cápsulas`));
        if(p.observacoes) corpo.append(criarElementoPro('p','pro-description',p.observacoes));
        if(p.intensidade) corpo.append(criarElementoPro('span','pro-intensity',`Intensidade ${p.intensidade}`));
        const rodape=criarElementoPro('div','pro-card-footer');
        const valor=criarElementoPro('div','pro-price');valor.append(criarElementoPro('strong','',precoPro(p.preco)),criarElementoPro('span','','por cápsula'));rodape.append(valor);
        const detalhes=criarElementoPro('button','btn pro-details','Ver detalhes');detalhes.type='button';detalhes.setAttribute('aria-label',`Ver detalhes de ${p.nome || p.sku}`);detalhes.addEventListener('click',()=>visualizarProduto(p.id));rodape.append(detalhes);
        const gestao=criarElementoPro('div','pro-manage');
        for(const [texto,acao,classe] of [['Editar',()=>editarProduto(p.id),''],['Excluir',()=>excluirProduto(p.id),'pro-delete']]) {
            const botao=criarElementoPro('button',classe,texto);botao.type='button';botao.setAttribute('aria-label',`${texto} ${p.nome || p.sku}`);botao.addEventListener('click',acao);gestao.append(botao);
        }
        rodape.append(gestao);corpo.append(rodape);card.append(corpo);grid.append(card);
    }
}
function filtrarProdutos() {
    const normalizar=v=>String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const termo=normalizar(document.getElementById('searchInput').value.trim());
    renderizarTabela(produtos.filter(p=>[p.nome,p.sku,p.observacoes].some(v=>normalizar(v).includes(termo))));
}
function visualizarProduto(id) {
    const p=produtos.find(item=>item.id===id);if(!p)return;
    const container=document.getElementById('detalhesConteudo');container.replaceChildren();
    const destaque=criarElementoPro('div','pro-detail-hero');destaque.append(criarFotoPro(p),criarElementoPro('h3','',p.nome));container.append(destaque);
    for(const [label,valor] of [['SKU',p.sku],['Preço por cápsula',precoPro(p.preco)],['Intensidade',p.intensidade || 'Não informada'],['Cápsulas por caixa',p.capsulas_caixa || 50],['Valor da caixa',precoPro(Number(p.preco || 0)*(p.capsulas_caixa || 50))],['Observações',p.observacoes || 'Nenhuma observação cadastrada para este café.']]) {
        const bloco=criarElementoPro('div','detail-item');bloco.append(criarElementoPro('div','detail-label',label),criarElementoPro('div','detail-value',valor));container.append(bloco);
    }
    document.getElementById('detalhesModal').style.display='flex';
}
function calcularPrecoCaixa() {
    const texto=document.getElementById('precoInput').value.trim();
    const preco=Number(texto.replace(',','.')),qtd=Number(document.getElementById('caixaQtdInput').value);
    document.getElementById('precoCaixaCalculado').value=texto && Number.isFinite(preco) && preco>=0 && Number.isInteger(qtd) && qtd>0 ? precoPro(preco*qtd) : '';
}

function fecharModalDetalhes() {
    document.getElementById('detalhesModal').style.display = 'none';
}

/* CONVERTER IMAGEM DO COMPUTADOR (COM COMPRESSÃO/REDIMENSIONAMENTO) */
function converterImagem(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            // Redimensiona para no máximo 200px para não pesar no banco
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 200;
            const MAX_HEIGHT = 200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            imagemBase64Temp = canvas.toDataURL('image/png', 0.8);
            document.getElementById('fotoInput').value = "[Imagem otimizada carregada]";
        };
    };
    reader.readAsDataURL(file);
}

/* CADASTRAR / EDITAR PRODUTO */
function abrirModal(produto = null) {
    document.getElementById('produtoForm').reset();
    document.getElementById('produtoId').value = '';
    imagemBase64Temp = '';
    document.getElementById('produtoModal').style.display = 'flex';

    if (produto) {
        document.getElementById('modalTitle').innerText = 'Editar Cápsula B2B';
        document.getElementById('produtoId').value = produto.id;
        document.getElementById('skuInput').value = produto.sku || '';
        document.getElementById('nomeInput').value = produto.nome || '';
        document.getElementById('intensidadeInput').value = produto.intensidade || '';
        document.getElementById('caixaQtdInput').value = produto.capsulas_caixa || 50;
        document.getElementById('precoInput').value = produto.preco ? produto.preco.toString().replace('.', ',') : '';
        document.getElementById('fotoInput').value = produto.foto || '';
        document.getElementById('observacoesInput').value = produto.observacoes || '';
        imagemBase64Temp = produto.foto || '';
        calcularPrecoCaixa();
    } else {
        document.getElementById('modalTitle').innerText = 'Cadastrar Nova Cápsula B2B';
    }
}

function fecharModal() {
    document.getElementById('produtoModal').style.display = 'none';
    document.getElementById('produtoForm').reset();
    imagemBase64Temp = '';
}

async function salvarProduto(e) {
    e.preventDefault();
    const id = document.getElementById('produtoId').value;
    const precoStr = document.getElementById('precoInput').value.trim().replace(',', '.');
    const fotoUrlInput = document.getElementById('fotoInput').value.trim();
    const intVal = document.getElementById('intensidadeInput').value;

    const dadosProduto = {
        id: id ? parseInt(id) : Date.now(),
        sku: document.getElementById('skuInput').value.trim(),
        nome: document.getElementById('nomeInput').value.trim(),
        intensidade: intVal ? parseInt(intVal) : null,
        capsulas_caixa: parseInt(document.getElementById('caixaQtdInput').value) || 50,
        preco: parseFloat(precoStr) || 0,
        foto: fotoUrlInput.startsWith('[Imagem') ? imagemBase64Temp : fotoUrlInput,
        observacoes: document.getElementById('observacoesInput').value.trim()
    };

    const { error } = await supabaseClient
        .from('produtos_b2b')
        .upsert([dadosProduto]);

    if (error) {
        alert('Erro ao salvar no banco de dados da nuvem: ' + error.message);
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
    if (confirm("Tem certeza que deseja excluir esta cápsula do catálogo?")) {
        const { error } = await supabaseClient
            .from('produtos_b2b')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Erro ao excluir do banco de dados: ' + error.message);
        } else {
            carregarProdutosNuvem();
        }
    }
}

/* IMPORTAR CSV DE PRODUTOS B2B */
function importarCSVCapsulas(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const text = e.target.result;
        const linhas = text.split('\n');
        const novosProdutos = [];
        
        for (let i = 1; i < linhas.length; i++) {
            if (!linhas[i].trim()) continue;
            const cols = linhas[i].includes(';') ? linhas[i].split(';') : linhas[i].split(',');
            if (cols.length >= 4) {
                const precoLimpo = cols[3] ? cols[3].replace('R$', '').trim().replace('.', '').replace(',', '.') : '0';
                novosProdutos.push({
                    id: Date.now() + i,
                    sku: cols[0] ? cols[0].trim() : '',
                    nome: cols[1] ? cols[1].trim() : '',
                    capsulas_caixa: cols[2] ? parseInt(cols[2].trim()) || 50 : 50,
                    preco: parseFloat(precoLimpo) || 0
                });
            }
        }

        if (novosProdutos.length > 0) {
            const { error } = await supabaseClient
                .from('produtos_b2b')
                .upsert(novosProdutos);

            if (error) {
                alert('Erro ao enviar CSV para a nuvem: ' + error.message);
            } else {
                alert('✅ Produtos importados com sucesso para a nuvem!');
                carregarProdutosNuvem();
            }
        }
    };
    reader.readAsText(file, 'iso-8859-1');
}
