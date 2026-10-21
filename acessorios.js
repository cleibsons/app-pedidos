// Conexão com o Supabase
const SUPABASE_URL = 'https://awllwrltulzmjdcchlxs.supabase.co';
const SUPABASE_KEY = 'sb_publishable__Cj-tdVffbiigN0-YczRkw_eVLEUIMZ';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let acessorios = [];
let itemSimulacaoAtual = null;

document.addEventListener("DOMContentLoaded", () => {
    carregarAcessoriosNuvem();
});

/* CARREGAR ACESSÓRIOS DA NUVEM */
async function carregarAcessoriosNuvem() {
    const tbody = document.getElementById('acessoriosTableBody');
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #64748b; padding: 24px;">🔄 Carregando acessórios da nuvem...</td></tr>`;

    if (!supabaseClient) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #ef4444; padding: 24px;">❌ Erro ao conectar com o Supabase.</td></tr>`;
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('acessorios')
            .select('*')
            .order('nome', { ascending: true });

        if (error) {
            console.error('Erro ao buscar acessórios:', error);
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #ef4444; padding: 24px;">❌ Erro ao carregar dados: ${error.message}</td></tr>`;
            return;
        }

        acessorios = data || [];
        renderizarTabela();
    } catch (err) {
        console.error('Erro de conexão:', err);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #ef4444; padding: 24px;">❌ Falha na conexão com a nuvem.</td></tr>`;
    }
}

function converterParaNumero(valorStr) {
    if (!valorStr) return 0;
    const limpo = valorStr.toString().replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    return parseFloat(limpo) || 0;
}

function formatarMoeda(valorNum) {
    return valorNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderizarTabela() {
    const tbody = document.getElementById('acessoriosTableBody');
    tbody.innerHTML = '';

    const termo = document.getElementById('searchInput').value.toLowerCase();

    const filtrados = acessorios.filter(a => {
        const sku = (a.sku || '').toLowerCase();
        const nome = (a.nome || '').toLowerCase();
        const tipo = (a.tipo_embalagem || '').toLowerCase();
        return sku.includes(termo) || nome.includes(termo) || tipo.includes(termo);
    });

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #64748b; padding: 24px;">Nenhum acessório encontrado.</td></tr>`;
        return;
    }

    filtrados.forEach(a => {
        const tr = document.createElement('tr');

        const fotoHTML = a.foto 
            ? `<img src="${a.foto}" alt="${a.nome}" style="width: 42px; height: 42px; object-fit: contain; border-radius: 6px; background: #1e293b; padding: 2px;">`
            : `<div style="width: 42px; height: 42px; border-radius: 6px; background: #1e293b; display: flex; align-items: center; justify-content: center; font-size: 18px; margin: 0 auto;">🥄</div>`;

        const qtd = parseInt(a.qtd_embalagem) || 1;
        const tipo = a.tipo_embalagem || 'Unidade';
        
        const badgeApresentacao = qtd > 1
            ? `<span style="background: #1e3a8a; color: #93c5fd; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; border: 1px solid #3b82f6;">${tipo} c/ ${qtd} unid.</span>`
            : `<span style="background: #0f172a; color: #94a3b8; padding: 3px 10px; border-radius: 6px; font-size: 12px; border: 1px solid #334155;">1 Unidade Avulsa</span>`;

        const precoEmbNum = converterParaNumero(a.preco_embalagem);
        const precoUnidNum = qtd > 0 ? (precoEmbNum / qtd) : precoEmbNum;

        const precoEmbTexto = precoEmbNum > 0 ? `R$ ${formatarMoeda(precoEmbNum)}` : `<span style="color:#f59e0b; font-size:12px;">Bonificação / S/V</span>`;
        const precoUnidTexto = precoEmbNum > 0 ? `R$ ${formatarMoeda(precoUnidNum)}` : `-`;

        tr.innerHTML = `
            <td style="text-align: center;">${fotoHTML}</td>
            <td><strong style="color: #60a5fa;">${a.sku || ''}</strong></td>
            <td style="font-weight: 600; color: #f8fafc;">${a.nome || ''}</td>
            <td>${badgeApresentacao}</td>
            <td style="color: #34d399; font-weight: bold;">${precoEmbTexto}</td>
            <td style="color: #cbd5e1; font-size: 13px;">${precoUnidTexto} <span style="font-size:11px; color:#64748b;">/ unid</span></td>
            <td style="text-align: center; white-space: nowrap;">
                <button class="btn btn-view" style="padding: 4px 8px; font-size: 12px;" title="Ver Detalhes e Simular Pedido" onclick="visualizarAcessorio(${a.id})">👁️</button>
                <button class="btn btn-edit" style="padding: 4px 8px; font-size: 12px;" title="Editar" onclick="editarAcessorio(${a.id})">✏️</button>
                <button class="btn btn-danger" style="padding: 4px 8px; font-size: 12px;" title="Excluir" onclick="excluirAcessorio(${a.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filtrarAcessorios() {
    renderizarTabela();
}

/* CALCULAR PREÇO UNITÁRIO NO MODAL DE EDIÇÃO */
function calcularPrecoUnid() {
    const qtd = parseInt(document.getElementById('qtdEmbalagemInput').value) || 1;
    const precoEmb = converterParaNumero(document.getElementById('precoEmbalagemInput').value);

    if (precoEmb > 0 && qtd > 0) {
        const unitario = precoEmb / qtd;
        document.getElementById('precoUnidInput').value = formatarMoeda(unitario);
    } else {
        document.getElementById('precoUnidInput').value = '0,00';
    }
}

/* VISUALIZAR DETALHES + CALCULADORA DE PEDIDO SEM ERRO */
function visualizarAcessorio(id) {
    const a = acessorios.find(item => item.id === id);
    if (!a) return;

    itemSimulacaoAtual = a;
    const qtd = parseInt(a.qtd_embalagem) || 1;
    const precoEmbNum = converterParaNumero(a.preco_embalagem);
    const precoUnidNum = qtd > 0 ? (precoEmbNum / qtd) : precoEmbNum;

    const detalhesHTML = `
        <div class="detail-item">
            <div class="detail-label">SKU</div>
            <div class="detail-value highlight">${a.sku || '-'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">APRESENTAÇÃO DE VENDA</div>
            <div class="detail-value">${a.tipo_embalagem || 'Unidade'} (${qtd} unid. por embalagem)</div>
        </div>
        <div class="detail-item full-width" style="grid-column: span 2;">
            <div class="detail-label">DESCRIÇÃO DO ACESSÓRIO</div>
            <div class="detail-value highlight">${a.nome || '-'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">PREÇO FUL (EMBALAGEM FECHADA)</div>
            <div class="detail-value" style="color: #34d399; font-weight: bold;">R$ ${formatarMoeda(precoEmbNum)}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">CUSTO UNITÁRIO (POR PEÇA)</div>
            <div class="detail-value">R$ ${formatarMoeda(precoUnidNum)}</div>
        </div>
        
        <!-- SIMULADOR DE CONVERSÃO DE PEDIDO -->
        <div class="detail-item full-width" style="grid-column: span 2; background: #0f172a; border: 1px solid #3b82f6; border-radius: 8px; padding: 14px; margin-top: 6px;">
            <div class="detail-label" style="color: #60a5fa; font-weight: bold; margin-bottom: 10px;">🧮 SIMULADOR RÁPIDO PARA PEDIDO (EVITA ERRO DE CONTAGEM)</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: center;">
                <div>
                    <label style="font-size: 12px; color: #94a3b8; display: block; margin-bottom: 4px;">Qtd de Embalagens/Caixas a pedir:</label>
                    <input type="number" id="simCaixasInput" value="1" min="1" oninput="simularPorCaixas()" style="width: 100%; padding: 8px; background: #1e293b; border: 1px solid #334155; color: #fff; border-radius: 6px;">
                </div>
                <div>
                    <label style="font-size: 12px; color: #94a3b8; display: block; margin-bottom: 4px;">Total de Peças/Unidades soltas:</label>
                    <input type="number" id="simUnidadesInput" value="${qtd}" min="1" step="${qtd}" oninput="simularPorUnidades()" style="width: 100%; padding: 8px; background: #1e293b; border: 1px solid #334155; color: #fff; border-radius: 6px;">
                </div>
            </div>
            <div id="resultadoSimulacao" style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px; color: #cbd5e1;">Lançar no pedido: <strong style="color: #60a5fa;">1 ${a.tipo_embalagem || 'Embalagem'}</strong> (${qtd} peças no total)</span>
                <span style="font-size: 16px; font-weight: bold; color: #34d399;">Total: R$ ${formatarMoeda(precoEmbNum)}</span>
            </div>
        </div>

        <div class="detail-item full-width" style="grid-column: span 2;">
            <div class="detail-label">OBSERVAÇÕES</div>
            <div class="detail-value" style="font-size: 13px; color: #94a3b8;">${a.observacoes || 'Nenhuma observação cadastrada.'}</div>
        </div>
    `;

    document.getElementById('detalhesConteudo').innerHTML = detalhesHTML;
    document.getElementById('detalhesModal').style.display = 'flex';
}

function simularPorCaixas() {
    if (!itemSimulacaoAtual) return;
    const qtdPorEmb = parseInt(itemSimulacaoAtual.qtd_embalagem) || 1;
    const precoEmb = converterParaNumero(itemSimulacaoAtual.preco_embalagem);
    
    const caixas = parseInt(document.getElementById('simCaixasInput').value) || 0;
    const totalUnidades = caixas * qtdPorEmb;
    const valorTotal = caixas * precoEmb;

    document.getElementById('simUnidadesInput').value = totalUnidades;
    document.getElementById('resultadoSimulacao').innerHTML = `
        <span style="font-size: 13px; color: #cbd5e1;">Lançar no pedido: <strong style="color: #60a5fa;">${caixas} ${itemSimulacaoAtual.tipo_embalagem || 'Embalagem(ns)'}</strong> (${totalUnidades} peças no total)</span>
        <span style="font-size: 16px; font-weight: bold; color: #34d399;">Total: R$ ${formatarMoeda(valorTotal)}</span>
    `;
}

function simularPorUnidades() {
    if (!itemSimulacaoAtual) return;
    const qtdPorEmb = parseInt(itemSimulacaoAtual.qtd_embalagem) || 1;
    const precoEmb = converterParaNumero(itemSimulacaoAtual.preco_embalagem);

    const unidadesDesejadas = parseInt(document.getElementById('simUnidadesInput').value) || 0;
    const caixasNecessarias = Math.ceil(unidadesDesejadas / qtdPorEmb);
    const unidadesReais = caixasNecessarias * qtdPorEmb;
    const valorTotal = caixasNecessarias * precoEmb;

    document.getElementById('simCaixasInput').value = caixasNecessarias;
    document.getElementById('resultadoSimulacao').innerHTML = `
        <span style="font-size: 13px; color: #cbd5e1;">Para atender ${unidadesDesejadas} unid., lance: <strong style="color: #60a5fa;">${caixasNecessarias} ${itemSimulacaoAtual.tipo_embalagem || 'Embalagem(ns)'}</strong> (Total real: ${unidadesReais} peças)</span>
        <span style="font-size: 16px; font-weight: bold; color: #34d399;">Total: R$ ${formatarMoeda(valorTotal)}</span>
    `;
}

function fecharModalDetalhes() {
    document.getElementById('detalhesModal').style.display = 'none';
}

/* CADASTRAR / EDITAR ACESSÓRIO */
function abrirModal(acessorio = null) {
    document.getElementById('acessorioForm').reset();
    document.getElementById('acessorioId').value = '';
    document.getElementById('acessorioModal').style.display = 'flex';

    if (acessorio) {
        document.getElementById('modalTitle').innerText = 'Editar Acessório';
        document.getElementById('acessorioId').value = acessorio.id;
        document.getElementById('skuInput').value = acessorio.sku || '';
        document.getElementById('nomeInput').value = acessorio.nome || '';
        document.getElementById('tipoEmbalagemInput').value = acessorio.tipo_embalagem || 'Unidade';
        document.getElementById('qtdEmbalagemInput').value = acessorio.qtd_embalagem || 1;
        document.getElementById('precoEmbalagemInput').value = acessorio.preco_embalagem || '';
        document.getElementById('precoUnidInput').value = acessorio.preco_unid || '';
        document.getElementById('fotoInput').value = acessorio.foto || '';
        document.getElementById('observacoesInput').value = acessorio.observacoes || '';
        calcularPrecoUnid();
    } else {
        document.getElementById('modalTitle').innerText = 'Cadastrar Novo Acessório';
        document.getElementById('qtdEmbalagemInput').value = 1;
    }
}

function fecharModal() {
    document.getElementById('acessorioModal').style.display = 'none';
    document.getElementById('acessorioForm').reset();
}

async function salvarAcessorio(e) {
    e.preventDefault();
    const id = document.getElementById('acessorioId').value;

    calcularPrecoUnid();

    const dadosAcessorio = {
        id: id ? parseInt(id) : Date.now(),
        sku: document.getElementById('skuInput').value.trim(),
        nome: document.getElementById('nomeInput').value.trim(),
        tipo_embalagem: document.getElementById('tipoEmbalagemInput').value,
        qtd_embalagem: parseInt(document.getElementById('qtdEmbalagemInput').value) || 1,
        preco_embalagem: document.getElementById('precoEmbalagemInput').value.trim(),
        preco_unid: document.getElementById('precoUnidInput').value.trim(),
        foto: document.getElementById('fotoInput').value.trim(),
        observacoes: document.getElementById('observacoesInput').value.trim()
    };

    const { error } = await supabaseClient
        .from('acessorios')
        .upsert([dadosAcessorio]);

    if (error) {
        alert('Erro ao salvar no banco de dados: ' + error.message);
    } else {
        fecharModal();
        carregarAcessoriosNuvem();
    }
}

function editarAcessorio(id) {
    const item = acessorios.find(a => a.id === id);
    if (item) abrirModal(item);
}

async function excluirAcessorio(id) {
    if (confirm("Tem certeza que deseja excluir este acessório?")) {
        const { error } = await supabaseClient
            .from('acessorios')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Erro ao excluir do banco de dados: ' + error.message);
        } else {
            carregarAcessoriosNuvem();
        }
    }
}
