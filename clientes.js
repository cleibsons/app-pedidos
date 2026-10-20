// Configuração da Conexão com o Supabase na Nuvem
const SUPABASE_URL = 'https://awllwrltulzmjdcchlxs.supabase.co';
const SUPABASE_KEY = 'sb_publishable__Cj-tdVffbiigN0-YczRkw_eVLEUIMZ';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let clientes = [];

document.addEventListener("DOMContentLoaded", () => {
    carregarClientesNuvem();
});

/* CARREGAR CLIENTES DA NUVEM */
async function carregarClientesNuvem() {
    const tbody = document.getElementById('clientesTableBody');
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #64748b; padding: 24px;">🔄 Carregando dados da nuvem...</td></tr>`;

    const { data, error } = await supabaseClient
        .from('clientes')
        .select('*')
        .order('razao', { ascending: true });

    if (error) {
        console.error('Erro ao buscar clientes:', error);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444; padding: 24px;">❌ Erro ao carregar dados da nuvem. Verifique a tabela no Supabase.</td></tr>`;
        return;
    }

    clientes = data || [];
    renderizarTabela(clientes);

    // Auto-migração inteligente: Se a nuvem estiver vazia e houver dados antigos no navegador, migra automaticamente
    if (clientes.length === 0) {
        const antigos = JSON.parse(localStorage.getItem('clientes_db')) || [];
        if (antigos.length > 0) {
            migrarLocalStorageParaNuvem();
        }
    }
}

function renderizarTabela(dados = clientes) {
    const tbody = document.getElementById('clientesTableBody');
    tbody.innerHTML = '';

    if (dados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #64748b; padding: 24px;">Nenhum cliente cadastrado na nuvem. Clique em <strong>+ Novo Cliente</strong> ou importe seu CSV.</td></tr>`;
        return;
    }

    dados.forEach(c => {
        const tr = document.createElement('tr');
        const fantasiaTag = c.fantasia ? `<span class="tag-fantasia">${c.fantasia}</span>` : '<span style="color:#64748b;">-</span>';
        const enderecoCompleto = `${c.endereco || ''}${c.bairro ? ' - ' + c.bairro : ''}, ${c.cidade || ''} - CEP ${c.cep || ''}`;

        tr.innerHTML = `
            <td><strong style="color: #60a5fa;">${c.nn || ''}</strong></td>
            <td>${fantasiaTag}</td>
            <td style="font-weight: 500;">${c.razao || ''}</td>
            <td style="color: #94a3b8;">${c.cnpj || ''}</td>
            <td style="max-width: 280px; font-size: 13px; color: #94a3b8;">${enderecoCompleto}</td>
            <td style="text-align: center; white-space: nowrap;">
                <button class="btn btn-view" title="Ver Detalhes" onclick="visualizarCliente(${c.id})">👁️</button>
                <button class="btn btn-edit" title="Editar" onclick="editarCliente(${c.id})">✏️</button>
                <button class="btn btn-danger" title="Excluir" onclick="excluirCliente(${c.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filtrarClientes() {
    const termo = document.getElementById('searchInput').value.toLowerCase();
    const filtrados = clientes.filter(c => 
        (c.fantasia && c.fantasia.toLowerCase().includes(termo)) ||
        (c.razao && c.razao.toLowerCase().includes(termo)) ||
        (c.nn && c.nn.toLowerCase().includes(termo)) ||
        (c.cnpj && c.cnpj.toLowerCase().includes(termo)) ||
        (c.contato && c.contato.toLowerCase().includes(termo)) ||
        (c.telefone && c.telefone.toLowerCase().includes(termo))
    );
    renderizarTabela(filtrados);
}

/* VER DETALHES */
function visualizarCliente(id) {
    const c = clientes.find(item => item.id === id);
    if (!c) return;

    const detalhesHTML = `
        <div class="detail-item">
            <div class="detail-label">NN (Número do Cliente)</div>
            <div class="detail-value highlight">${c.nn || '-'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">CNPJ</div>
            <div class="detail-value">${c.cnpj || '-'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Nome Fantasia</div>
            <div class="detail-value highlight">${c.fantasia || '-'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Razão Social</div>
            <div class="detail-value">${c.razao || '-'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Pessoa de Contato</div>
            <div class="detail-value">${c.contato || '-'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Telefone / WhatsApp</div>
            <div class="detail-value">${c.telefone || '-'}</div>
        </div>
        <div class="detail-item full-width">
            <div class="detail-label">Endereço</div>
            <div class="detail-value">${c.endereco || '-'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Bairro</div>
            <div class="detail-value">${c.bairro || '-'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Cidade / UF / CEP</div>
            <div class="detail-value">${c.cidade || '-'} - CEP: ${c.cep || '-'}</div>
        </div>
    `;

    document.getElementById('detalhesConteudo').innerHTML = detalhesHTML;
    document.getElementById('detalhesModal').style.display = 'flex';
}

function fecharModalDetalhes() {
    document.getElementById('detalhesModal').style.display = 'none';
}

/* CADASTRAR / EDITAR CLIENTE NA NUVEM */
function abrirModal(cliente = null) {
    document.getElementById('clienteForm').reset();
    document.getElementById('clienteId').value = '';
    document.getElementById('clienteModal').style.display = 'flex';

    if (cliente) {
        document.getElementById('modalTitle').innerText = 'Editar Cliente (Nuvem)';
        document.getElementById('clienteId').value = cliente.id;
        document.getElementById('nnInput').value = cliente.nn || '';
        document.getElementById('cnpjInput').value = cliente.cnpj || '';
        document.getElementById('fantasiaInput').value = cliente.fantasia || '';
        document.getElementById('razaoInput').value = cliente.razao || '';
        document.getElementById('contatoInput').value = cliente.contato || '';
        document.getElementById('telefoneInput').value = cliente.telefone || '';
        document.getElementById('enderecoInput').value = cliente.endereco || '';
        document.getElementById('bairroInput').value = cliente.bairro || '';
        document.getElementById('cidadeInput').value = cliente.cidade || 'Foz do Iguaçu - PR';
        document.getElementById('cepInput').value = cliente.cep || '';
    } else {
        document.getElementById('modalTitle').innerText = 'Cadastrar Cliente na Nuvem';
        document.getElementById('cidadeInput').value = 'Foz do Iguaçu - PR';
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
        fantasia: document.getElementById('fantasiaInput').value.trim(),
        razao: document.getElementById('razaoInput').value.trim(),
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
        alert('Erro ao salvar no banco de dados da nuvem: ' + error.message);
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
    if (confirm("Tem certeza que deseja excluir este cliente da nuvem?")) {
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

/* IMPORTAR CSV DIRETO PARA A NUVEM */
function importarCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const text = e.target.result;
        const linhas = text.split('\n');
        const novosClientes = [];
        
        for (let i = 1; i < linhas.length; i++) {
            if (!linhas[i].trim()) continue;
            const cols = linhas[i].split(';');
            if (cols.length >= 5) {
                novosClientes.push({
                    id: Date.now() + i,
                    nn: cols[0] ? cols[0].trim() : '',
                    razao: cols[1] ? cols[1].trim() : '',
                    fantasia: cols[2] ? cols[2].trim() : '',
                    cnpj: cols[3] ? cols[3].trim() : '',
                    endereco: cols[4] ? cols[4].trim() : '',
                    bairro: cols[5] ? cols[5].trim() : '',
                    cidade: cols[6] ? cols[6].trim() : 'Foz do Iguaçu - PR',
                    cep: cols[7] ? cols[7].trim() : '',
                    contato: cols[8] ? cols[8].trim() : '',
                    telefone: cols[9] ? cols[9].trim() : ''
                });
            }
        }

        if (novosClientes.length > 0) {
            const { error } = await supabaseClient
                .from('clientes')
                .upsert(novosClientes);

            if (error) {
                alert('Erro ao enviar CSV para a nuvem: ' + error.message);
            } else {
                alert('✅ Clientes importados com sucesso para a nuvem!');
                carregarClientesNuvem();
            }
        }
    };
    reader.readAsText(file, 'iso-8859-1');
}

/* MIGRAÇÃO AUTOMÁTICA DO LOCALSTORAGE PARA O SUPABASE */
async function migrarLocalStorageParaNuvem() {
    const salvosLocais = JSON.parse(localStorage.getItem('clientes_db')) || [];
    if (salvosLocais.length === 0) {
        alert("Nenhum dado antigo encontrado no seu computador para migrar.");
        return;
    }

    if (confirm(`Encontrados ${salvosLocais.length} clientes salvos localmente neste computador. Deseja enviá-los para a nuvem agora?`)) {
        const { error } = await supabaseClient
            .from('clientes')
            .upsert(salvosLocais);

        if (error) {
            alert("Erro ao migrar dados: " + error.message);
        } else {
            alert("🎉 Sucesso! Todos os seus clientes antigos foram salvos na nuvem!");
            localStorage.removeItem('clientes_db'); // Limpa a memória local após migrar com sucesso
            carregarClientesNuvem();
        }
    }
}
