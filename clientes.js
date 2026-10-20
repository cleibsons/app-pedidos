let clientes = JSON.parse(localStorage.getItem('clientes_db')) || [
    {
        id: 1,
        nn: "410191",
        razao: "Belmond Brasil Hotéis S.A",
        fantasia: "Hotel das Cataratas",
        cnpj: "32.579.013/0002-34",
        endereco: "Rodovia BR-469, S/N, Km 32",
        bairro: "Parque Nacional Do Iguaçu",
        cidade: "Foz do Iguaçu - PR",
        cep: "85859-750"
    }
];

// Inicializar tabela
document.addEventListener("DOMContentLoaded", renderizarTabela);

function renderizarTabela(dados = clientes) {
    const tbody = document.getElementById('clientesTableBody');
    tbody.innerHTML = '';

    if (dados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #94a3b8;">Nenhum cliente encontrado.</td></tr>`;
        return;
    }

    dados.forEach(c => {
        const tr = document.createElement('tr');
        const fantasiaTag = c.fantasia ? `<span class="tag-fantasia">${c.fantasia}</span>` : '<span style="color:#cbd5e1;">-</span>';
        const enderecoCompleto = `${c.endereco}${c.bairro ? ' - ' + c.bairro : ''}, ${c.cidade} - CEP ${c.cep}`;

        tr.innerHTML = `
            <td><strong>${c.nn}</strong></td>
            <td>${fantasiaTag}</td>
            <td>${c.razao}</td>
            <td>${c.cnpj}</td>
            <td style="max-width: 280px; font-size: 12px; color: #64748b;">${enderecoCompleto}</td>
            <td style="text-align: center; white-space: nowrap;">
                <button class="btn btn-edit" onclick="editarCliente(${c.id})">✏️</button>
                <button class="btn btn-danger" onclick="excluirCliente(${c.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filtrarClientes() {
    const termo = document.getElementById('searchInput').value.toLowerCase();
    const filtrados = clientes.filter(c => 
        (c.fantasia && c.fantasia.toLowerCase().includes(termo)) ||
        c.razao.toLowerCase().includes(termo) ||
        c.nn.toLowerCase().includes(termo) ||
        c.cnpj.toLowerCase().includes(termo)
    );
    renderizarTabela(filtrados);
}

function abrirModal(cliente = null) {
    document.getElementById('clienteModal').style.display = 'flex';
    if (cliente) {
        document.getElementById('modalTitle').innerText = 'Editar Cliente';
        document.getElementById('clienteId').value = cliente.id;
        document.getElementById('nnInput').value = cliente.nn;
        document.getElementById('cnpjInput').value = cliente.cnpj;
        document.getElementById('fantasiaInput').value = cliente.fantasia || '';
        document.getElementById('razaoInput').value = cliente.razao;
        document.getElementById('enderecoInput').value = cliente.endereco;
        document.getElementById('bairroInput').value = cliente.bairro || '';
        document.getElementById('cidadeInput').value = cliente.cidade;
        document.getElementById('cepInput').value = cliente.cep;
    } else {
        document.getElementById('modalTitle').innerText = 'Cadastrar Cliente';
        document.getElementById('clienteForm').reset();
        document.getElementById('clienteId').value = '';
    }
}

function fecharModal() {
    document.getElementById('clienteModal').style.display = 'none';
}

function salvarCliente(e) {
    e.preventDefault();
    const id = document.getElementById('clienteId').value;
    
    const novoCliente = {
        id: id ? parseInt(id) : Date.now(),
        nn: document.getElementById('nnInput').value,
        cnpj: document.getElementById('cnpjInput').value,
        fantasia: document.getElementById('fantasiaInput').value,
        razao: document.getElementById('razaoInput').value,
        endereco: document.getElementById('enderecoInput').value,
        bairro: document.getElementById('bairroInput').value,
        cidade: document.getElementById('cidadeInput').value,
        cep: document.getElementById('cepInput').value
    };

    if (id) {
        const index = clientes.findIndex(c => c.id === parseInt(id));
        clientes[index] = novoCliente;
    } else {
        clientes.push(novoCliente);
    }

    localStorage.setItem('clientes_db', JSON.stringify(clientes));
    renderizarTabela();
    fecharModal();
}

function editarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (cliente) abrirModal(cliente);
}

function excluirCliente(id) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
        clientes = clientes.filter(c => c.id !== id);
        localStorage.setItem('clientes_db', JSON.stringify(clientes));
        renderizarTabela();
    }
}

// IMPORTAR EXCEL SALVO EM CSV
function importarCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const linhas = text.split('\n');
        
        // Pula o cabeçalho e lê as linhas
        for (let i = 1; i < linhas.length; i++) {
            const cols = linhas[i].split(';'); // Ou vírgula
            if (cols.length >= 7) {
                clientes.push({
                    id: Date.now() + i,
                    nn: cols[0].trim(),
                    razao: cols[1].trim(),
                    fantasia: cols[2] ? cols[2].trim() : '',
                    cnpj: cols[3].trim(),
                    endereco: cols[4].trim(),
                    bairro: cols[5] ? cols[5].trim() : '',
                    cidade: cols[6].trim(),
                    cep: cols[7] ? cols[7].trim() : ''
                });
            }
        }
        localStorage.setItem('clientes_db', JSON.stringify(clientes));
        renderizarTabela();
        alert('Clientes importados com sucesso!');
    };
    reader.readAsText(file);
}