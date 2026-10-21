// Conexão com o Supabase
const SUPABASE_URL = 'https://awllwrltulzmjdcchlxs.supabase.co';
const SUPABASE_KEY = 'sb_publishable__Cj-tdVffbiigN0-YczRkw_eVLEUIMZ';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let canalAtual = 'whatsapp'; // 'whatsapp' ou 'email'
let clientesLista = [];
let clienteSelecionado = null;

document.addEventListener("DOMContentLoaded", () => {
    carregarClientesNuvem();
});

function selecionarCanal(canal) {
    canalAtual = canal;
    document.getElementById('cardWhats').classList.remove('active');
    document.getElementById('cardEmail').classList.remove('active');

    if (canal === 'whatsapp') {
        document.getElementById('cardWhats').classList.add('active');
        document.getElementById('secaoEmailOpcoes').style.display = 'none';
    } else {
        document.getElementById('cardEmail').classList.add('active');
        document.getElementById('secaoEmailOpcoes').style.display = 'block';
    }
    atualizarPreview();
}

async function carregarClientesNuvem() {
    const select = document.getElementById('clienteSelect');
    if (!supabaseClient) {
        select.innerHTML = `<option value="">Erro ao conectar com Supabase</option>`;
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('clientes')
            .select('*')
            .order('nome_fantasia', { ascending: true });

        if (error) throw error;

        clientesLista = data || [];
        select.innerHTML = `<option value="">-- Selecione um cliente cadastrado --</option>`;
        
        clientesLista.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.text = `${c.nome_fantasia || c.razao_social} (NN: ${c.nn})`;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error('Erro ao carregar clientes:', err);
        select.innerHTML = `<option value="">Erro ao carregar clientes da nuvem</option>`;
    }
}

function carregarDadosCliente() {
    const id = document.getElementById('clienteSelect').value;
    clienteSelecionado = clientesLista.find(c => c.id == id);
    
    const infoCard = document.getElementById('clienteInfoCard');
    if (clienteSelecionado) {
        infoCard.style.display = 'block';
        infoCard.innerHTML = `
            <strong>Razão Social:</strong> ${clienteSelecionado.razao_social}<br>
            <strong>CNPJ:</strong> ${clienteSelecionado.cnpj} | <strong>NN:</strong> ${clienteSelecionado.nn}<br>
            <strong>Endereço:</strong> ${clienteSelecionado.endereco}, ${clienteSelecionado.bairro} - ${clienteSelecionado.cidade} - CEP ${clienteSelecionado.cep}
        `;
    } else {
        infoCard.style.display = 'none';
    }
    atualizarPreview();
}

function atualizarPreview() {
    const preview = document.getElementById('previewMensagem');
    
    if (!clienteSelecionado) {
        preview.innerText = "Por favor, selecione um cliente para visualizar o pedido gerado.";
        return;
    }

    if (canalAtual === 'whatsapp') {
        let texto = `Gostaria de solicitar a inserção do pedido abaixo, por favor:\n\n`;
        texto += `📌 Cliente: ${clienteSelecionado.razao_social}\n`;
        texto += `📌 NN: ${clienteSelecionado.nn}\n`;
        texto += `📌 CNPJ: ${clienteSelecionado.cnpj}\n`;
        texto += `📍 Endereço de entrega: ${clienteSelecionado.endereco}, ${clienteSelecionado.bairro} - ${clienteSelecionado.cidade} - CEP ${clienteSelecionado.cep}.\n\n`;
        texto += `[Aqui entrarão os itens divididos por categorias B2B, Vertuo, Original e Acessórios]\n\n`;
        texto += `Fico no aguardo da confirmação. Obrigado!`;
        preview.innerText = texto;
    } else {
        const tipoLogistica = document.getElementById('tipoLogisticaInput').value;
        const oc = document.getElementById('ordemCompraInput').value.trim() || '[Número da OC ou Autorização]';

        let texto = `Prezado time de Compras,\n\n`;
        texto += `Por gentileza, poderiam inserir o pedido para o cliente abaixo?\n\n`;
        
        if (tipoLogistica === 'broker') {
            texto += `Observação importante: A entrega e o faturamento devem ser realizados VIA BROKER. Favor anexar na Nota Fiscal a observação: "Ordem de Compra: ${oc}".\n\n`;
        } else {
            texto += `Observação importante: Identificamos que o item solicitado não possui estoque no Broker. Portanto, peço que sigam com o faturamento VIA ESTOQUE 3A e entrega VIA TRANSPORTADORA (Total Express) — NÃO enviar via Correios, pois o cliente não recebe mercadorias por esta modalidade.\n\n`;
            texto += `Observação de Faturamento: Pedido faturado sem Ordem de Compra, autorizado por ${oc}.\n\n`;
        }

        texto += `Dados do Cliente:\n`;
        texto += `- Razão Social: ${clienteSelecionado.razao_social}\n`;
        texto += `- CNPJ: ${clienteSelecionado.cnpj}\n`;
        texto += `- NN: ${clienteSelecionado.nn}\n`;
        texto += `- Endereço: ${clienteSelecionado.endereco}, ${clienteSelecionado.bairro} - ${clienteSelecionado.cidade} - CEP ${clienteSelecionado.cep}\n\n`;

        texto += `Detalhes do Pedido:\n`;
        texto += `- Condição de Pagamento: Boleto faturado para 30 dias.\n\n`;
        texto += `Itens do Pedido:\n\n`;
        texto += `[Itens do pedido separados por categorias]\n\n`;
        texto += `Desde já, agradeço pela atenção e colaboração.\n\nAtenciosamente,`;
        
        preview.innerText = texto;
    }
}

function copiarMensagem() {
    const texto = document.getElementById('previewMensagem').innerText;
    navigator.clipboard.writeText(texto).then(() => {
        alert('Texto copiado para a área de transferência!');
    });
}
