// Verificar se o usuário está logado ao abrir a página
async function protegerPagina() {
    if (!supabaseClient) return;
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        // Se não estiver logado, expulsa para a tela de login
        window.location.href = 'login.html';
    }
}

// Chame essa função logo no carregamento
protegerPagina();
// Conexão com o Supabase
const SUPABASE_URL = 'https://awllwrltulzmjdcchlxs.supabase.co';
const SUPABASE_KEY = 'sb_publishable__Cj-tdVffbiigN0-YczRkw_eVLEUIMZ';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let clientes = [];

document.addEventListener("DOMContentLoaded", () => {
    carregarClientesNuvem();
});

/* CARREGAR CLIENTES DA NUVEM */
async function carregarClientesNuvem() {
    const tbody = document.getElementById('clientesTableBody');
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #64748b; padding: 24px;">🔄 Carregando clientes da nuvem...</td></tr>`;

    if (!supabaseClient) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444; padding: 24px;">❌ Erro ao conectar com o Supabase.</td></tr>`;
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('clientes')
            .select('*');

        if (error) {
            console.error('Erro ao buscar clientes:', error);
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444; padding: 24px;">❌ Erro ao carregar dados: ${error.message}</td></tr>`;
            return;
        }

        clientes = data || [];
        renderizarTabela();
    } catch (err) {
        console.error('Erro de conexão:', err);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444; padding: 24px;">❌ Falha na conexão com a nuvem.</td></tr>`;
    }
}

function renderizarTabela() {
    const tbody = document.getElementById('clientesTableBody');
    tbody.innerHTML = '';

    const termo = document.getElementById('searchInput').value.toLowerCase();

    const filtrados = clientes.filter(c => {
        const nn = c.nn ? c.nn.toString().toLowerCase() : '';
        const fantasia = (c.fantasia && c.fantasia !== 'EMPTY') ? c.fantasia.toLowerCase() : '';
        const razao = (c.razao || '').toLowerCase();
        const cnpj = c.cnpj ? c.cnpj.toLowerCase() : '';

        return nn.includes(termo) || 
               fantasia.includes(termo) || 
               razao.includes(termo) || 
               cnpj.includes(termo);
    });

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #64748b; padding: 24px;">Nenhum cliente encontrado.</td></tr>`;
        return;
    }

    filtrados.forEach(c => {
        const tr = document.createElement('tr');
        
        const razaoExibir = c.razao || '-';
        const fantasiaExibir = (c.fantasia && c.fantasia !== 'EMPTY') ? c.fantasia : '';
        
        const badgeNome = fantasiaExibir 
            ? `<span style="background: #1e3a8a; color: #93c5fd; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; border: 1px solid #3b82f6;">${fantasiaExibir}</span>` 
            : '-';

        // Monta o endereço completo unindo rua, bairro, cidade e cep
        let enderecoCompleto = c.endereco || '';
        if (c.bairro && c.bairro !== 'EMPTY') enderecoCompleto += `, ${c.bairro}`;
        if (c.cidade) enderecoCompleto += `, ${c.cidade}`;
        if (c.cep) enderecoCompleto += ` - CEP ${c.cep}`;
        if (!enderecoCompleto) enderecoCompleto = '-';

        tr.innerHTML = `
            <td><strong style="color: #60a5fa;">${c.nn || ''}</strong></td>
            <td>${badgeNome}</td>
            <td style="font-weight: 600; color: #f8fafc;">${razaoExibir}</td>
            <td style="color: #94a3b8;">${c.cnpj || ''}</td>
            <td style="font-size: 13px; color: #cbd5e1;">${enderecoCompleto}</td>
            <td style="text-align: center; white-space: nowrap;">
                <button class="btn btn-view" style="padding: 4px 8px; font-size: 12px;" title="Ver Detalhes" onclick="visualizarCliente(${c.id})">👁️</button>
                <button class="btn btn-edit" style="padding: 4px 8px; font-size: 12px;" title="Editar" onclick="editarCliente(${c.id})">✏️</button>
                <button class="btn btn-danger" style="padding: 4px 8px; font-size: 12px;" title="Excluir" onclick="excluirCliente(${c.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filtrarClientes() {
    renderizarTabela();
}

/* VISUALIZAR DETALHES */
function visualizarCliente(id) {
    const c = clientes.find(item => item.id === id);
    if (!c) return;

    const razaoExibir = c.razao || '-';
    const fantasiaExibir = (c.fantasia && c.fantasia !== 'EMPTY') ? c.fantasia : '-';
    
    let enderecoExibir = c.endereco || '';
    if (c.bairro && c.bairro !== 'EMPTY') enderecoExibir += `, ${c.bairro}`;
    if (c.cidade) enderecoExibir += `, ${c.cidade}`;
    if (c.cep) enderecoExibir += ` - CEP ${c.cep}`;
    if (!enderecoExibir) enderecoExibir = '-';

    const detalhesHTML = `
        <div class="detail-item">
            <div class="detail-label">NN (Número de Negócio)</div>
            <div class="detail-value highlight">${c.nn || '-'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">CNPJ</div>
            <div class="detail-value">${c.cnpj || '-'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">NOME FANTASIA</div>
            <div class="detail-value">${fantasiaExibir}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">RAZÃO SOCIAL</div>
            <div class="detail-value highlight">${razaoExibir}</div>
        </div>
        <div class="detail-item full-width" style="grid-column: span 2; background: #111827; border-color: #3b82f6;">
            <div class="detail-label" style="color: #60a5fa; font-weight: bold;">ENDEREÇO COMPLETO</div>
            <div class="detail-value" style="margin-top: 6px; font-size: 14px; color: #e2e8f0;">${enderecoExibir}</div>
        </div>
    `;

    document.getElementById('detalhesConteudo').innerHTML = detalhesHTML;
    document.getElementById('detalhesModal').style.display = 'flex';
}

function fecharModalDetalhes() {
    document.getElementById('detalhesModal').style.display = 'none';
}

/* CADASTRAR / EDITAR CLIENTE */
function abrirModal(cliente = null) {
    document.getElementById('clienteForm').reset();
    document.getElementById('clienteId').value = '';
    document.getElementById('clienteModal').style.display = 'flex';

    if (cliente) {
        document.getElementById('modalTitle').innerText = 'Editar Cliente';
        document.getElementById('clienteId').value = cliente.id;
        document.getElementById('nnInput').value = cliente.nn || '';
        document.getElementById('cnpjInput').value = cliente.cnpj || '';
        document.getElementById('nomeFantasiaInput').value = (cliente.fantasia && cliente.fantasia !== 'EMPTY') ? cliente.fantasia : '';
        document.getElementById('razaoSocialInput').value = cliente.razao || '';
        document.getElementById('contatoInput').value = cliente.contato || '';
        document.getElementById('telefoneInput').value = cliente.telefone || '';
        document.getElementById('enderecoInput').value = cliente.endereco || '';
        document.getElementById('bairroInput').value = cliente.bairro || '';
        document.getElementById('cidadeInput').value = cliente.cidade || '';
        document.getElementById('cepInput').value = cliente.cep || '';
    } else {
        document.getElementById('modalTitle').innerText = 'Cadastrar Novo Cliente';
    }
}

function fecharModal() {
    document.getElementById('clienteModal').style.display = 'none';
    document.getElementById('clienteForm').reset();
}

async function salvarCliente(e) {
    e.preventDefault();
    const id = document.getElementById('clienteId').value;

    const dadosCliente = {
        id: id ? parseInt(id) : Date.now(),
        nn: document.getElementById('nnInput').value.trim(),
        cnpj: document.getElementById('cnpjInput').value.trim(),
        fantasia: document.getElementById('nomeFantasiaInput').value.trim() || 'EMPTY',
        razao: document.getElementById('razaoSocialInput').value.trim(),
        contato: document.getElementById('contatoInput').value.trim(),
        telefone: document.getElementById('telefoneInput').value.trim(),
        endereco: document.getElementById('enderecoInput').value.trim(),
        bairro: document.getElementById('bairroInput').value.trim(),
        cidade: document.getElementById('cidadeInput').value.trim(),
        cep: document.getElementById('cepInput').value.trim()
    };

    const { error } = await supabaseClient
        .from('clientes')
        .upsert([dadosCliente]);

    if (error) {
        alert('Erro ao salvar no banco de dados de clientes: ' + error.message);
    } else {
        fecharModal();
        carregarClientesNuvem();
    }
}

function editarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (cliente) abrirModal(cliente);
}

async function excluirCliente(id) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
        const { error } = await supabaseClient
            .from('clientes')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Erro ao excluir do banco de dados: ' + error.message);
        } else {
            carregarClientesNuvem();
        }
    }
}
