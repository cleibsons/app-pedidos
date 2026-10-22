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
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--muted); padding: 24px;">🔄 Carregando catálogo B2C da nuvem...</td></tr>`;

    if (!supabaseClient) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--danger); padding: 24px;">❌ Erro ao conectar com o Supabase. Verifique a chave de API.</td></tr>`;
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('produtos_b2c')
            .select('*')
            .order('nome', { ascending: true });

        if (error) {
            console.error('Erro ao buscar produtos B2C:', error);
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--danger); padding: 24px;">❌ Erro ao carregar dados: ${error.message}</td></tr>`;
            return;
        }

        produtos = data || [];
        renderizarTabela();
    } catch (err) {
        console.error('Erro de conexão:', err);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--danger); padding: 24px;">❌ Falha na conexão com a nuvem.</td></tr>`;
    }
}

function renderizarTabela() {
    const tbody = document.getElementById('produtosTableBody');
    tbody.innerHTML = '';

    const termo = document.getElementById('searchInput').value.toLowerCase();

    const filtrados = produtos.filter(p => {
        const bateSistema = (filtroSistemaAtual === 'Todos') || (p.sistema === filtroSistemaAtual);
        const bateTexto = (p.nome && p.nome.toLowerCase().includes(termo)) || (p.sku && p.sku.toLowerCase().includes(termo));
        return bateSistema && bateTexto;
    });

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--muted); padding: 24px;">Nenhuma cápsula B2C encontrada.</td></tr>`;
        return;
    }

    filtrados.forEach(p => {
        const tr = document.createElement('tr');
        const imgTag = criarImagemProdutoB2C(p);
        const precoFormatado = Number(p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const badgeSistema = p.sistema === 'Vertuo' ? `<span class="badge-vertuo">Vertuo</span>` : `<span class="badge-original">Original</span>`;

        tr.innerHTML = `
            <td style="text-align: center;">${imgTag}</td>
            <td>${badgeSistema}</td>
            <td><strong style="color: var(--brand);">${p.sku || ''}</strong></td>
            <td style="font-weight: 500;">${p.nome || ''}</td>
            <td>${p.capsulas_caixa || 10} cápsulas</td>
            <td style="color: var(--success); font-weight: 600;">${precoFormatado}</td>
            <td style="text-align: center; white-space: nowrap;">
                <button class="btn btn-view" style="padding: 4px 8px; font-size: 12px;" title="Ver Detalhes" onclick="visualizarProduto(${p.id})">👁️</button>
                <button class="btn btn-edit" style="padding: 4px 8px; font-size: 12px;" title="Editar" onclick="editarProduto(${p.id})">✏️</button>
                <button class="btn btn-danger" style="padding: 4px 8px; font-size: 12px;" title="Excluir" onclick="excluirProduto(${p.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filtrarSistema(sistema) {
    filtroSistemaAtual = sistema;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    
    if (sistema === 'Todos') document.getElementById('btnFiltroTodos').classList.add('active');
    if (sistema === 'Vertuo') document.getElementById('btnFiltroVertuo').classList.add('active');
    if (sistema === 'Original') document.getElementById('btnFiltroOriginal').classList.add('active');

    renderizarTabela();
}

function filtrarProdutos() {
    renderizarTabela();
}

/* VISUALIZAR DETALHES */
function visualizarProduto(id) {
    const p = produtos.find(item => item.id === id);
    if (!p) return;

    const precoFormatado = Number(p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const imgHtml = criarImagemProdutoB2C(p, true);
    const badgeSistema = p.sistema === 'Vertuo' ? `<span class="badge-vertuo">Vertuo</span>` : `<span class="badge-original">Original</span>`;

    const detalhesHTML = `
        <div class="detail-item" style="text-align: center; grid-column: span 2; background: var(--field); padding: 16px;">
            ${imgHtml}
            <div style="margin-bottom: 6px;">${badgeSistema}</div>
            <div class="detail-value highlight" style="font-size: 18px;">${p.nome || '-'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">SKU</div>
            <div class="detail-value highlight">${p.sku || '-'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">PREÇO (UNIDADE / CAIXA)</div>
            <div class="detail-value" style="color: var(--success); font-weight: bold;">${precoFormatado}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">INTENSIDADE</div>
            <div class="detail-value">${p.intensidade ? p.intensidade : '-'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Cápsulas por caixa</div>
            <div class="detail-value">${p.capsulas_caixa || 10} unidades</div>
        </div>
        <div class="detail-item full-width" style="grid-column: span 2; background: var(--field); border-color: var(--brand);">
            <div class="detail-label" style="color: var(--brand); font-weight: bold;">Observação</div>
            <div class="detail-value" style="white-space: pre-wrap; margin-top: 8px; font-size: 14px; line-height: 1.5; color: var(--ink);">${p.observacoes || 'Nenhuma observação cadastrada para este blend.'}</div>
        </div>
    `;

    document.getElementById('detalhesConteudo').innerHTML = detalhesHTML;
    document.getElementById('detalhesModal').style.display = 'flex';
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
