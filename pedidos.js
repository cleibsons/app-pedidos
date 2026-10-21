// Conexão com o Supabase
const SUPABASE_URL = 'https://awllwrltulzmjdcchlxs.supabase.co';
const SUPABASE_KEY = 'sb_publishable__Cj-tdVffbiigN0-YczRkw_eVLEUIMZ';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let canalAtual = 'whatsapp';
let clientesLista = [];
let clienteSelecionado = null;

let produtosB2B = [];
let produtosVertuo = [];
let produtosOriginal = [];
let acessoriosLista = [];

let itensPedido = [];

document.addEventListener("DOMContentLoaded", () => {
    carregarDadosNuvem();
});

async function carregarDadosNuvem() {
    if (!supabaseClient) {
        console.error('Supabase não conectado.');
        return;
    }

    try {
        // 1. Carrega Clientes
        let resClientes = await supabaseClient.from('clientes').select('*').order('razao', { ascending: true });
        if (resClientes.error) {
            resClientes = await supabaseClient.from('cliente').select('*');
        }
        clientesLista = resClientes.data || [];
        
        const datalistCliente = document.getElementById('listaClientesOpts');
        datalistCliente.innerHTML = '';
        clientesLista.forEach(c => {
            const opt = document.createElement('option');
            opt.value = `${c.razao || ''} - NN: ${c.nn || ''} (CNPJ: ${c.cnpj || ''})`;
            datalistCliente.appendChild(opt);
        });

        // 2. Carrega Produtos B2B
        const resB2B = await supabaseClient.from('produtos_b2b').select('*');
        produtosB2B = resB2B.data || [];

        // 3. Carrega Produtos B2C (Vertuo e Original)
        const resB2C = await supabaseClient.from('produtos_b2c').select('*');
        const todosB2C = resB2C.data || [];
        
        produtosVertuo = todosB2C.filter(p => p.sistema && p.sistema.toLowerCase() === 'vertuo');
        produtosOriginal = todosB2C.filter(p => p.sistema && p.sistema.toLowerCase() === 'original');

        // 4. Carrega Acessórios
        const resAcessorios = await supabaseClient.from('acessorios').select('*');
        acessoriosLista = resAcessorios.data || [];

    } catch (err) {
        console.error('Erro ao carregar dados do Supabase:', err);
    }
}

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

function selecionarClientePorBusca() {
    const valorDigitado = document.getElementById('buscaClienteInput').value;
    clienteSelecionado = clientesLista.find(c => {
        const textoCompleto = `${c.razao || ''} - NN: ${c.nn || ''} (CNPJ: ${c.cnpj || ''})`;
        return textoCompleto === valorDigitado || (c.razao && valorDigitado.includes(c.razao)) || (c.nn && valorDigitado.includes(c.nn));
    });

    const infoCard = document.getElementById('clienteInfoCard');
    if (clienteSelecionado) {
        infoCard.style.display = 'block';
        infoCard.innerHTML = `
            <strong>Razão Social:</strong> ${clienteSelecionado.razao || 'N/A'}<br>
            <strong>Nome Fantasia:</strong> ${clienteSelecionado.fantasia || 'N/A'}<br>
            <strong>CNPJ:</strong> ${clienteSelecionado.cnpj || 'N/A'} | <strong>NN:</strong> ${clienteSelecionado.nn || 'N/A'}<br>
            <strong>Endereço:</strong> ${clienteSelecionado.endereco || 'N/A'}, ${clienteSelecionado.bairro || ''} - ${clienteSelecionado.cidade || ''} - CEP ${clienteSelecionado.cep || ''}
        `;
    } else {
        infoCard.style.display = 'none';
    }
    atualizarPreview();
}

function adicionarLinhaItem() {
    const tipo = document.getElementById('tipoItemAdd').value;
    itensPedido.push({ idUnico: Date.now(), tipo, produtoId: '', quantidade: 1 });
    renderizarItensPedido();
}

function removerLinhaItem(idUnico) {
    itensPedido = itensPedido.filter(i => i.idUnico !== idUnico);
    renderizarItensPedido();
    atualizarPreview();
}

function atualizarProdutoItem(idUnico, produtoId) {
    const item = itensPedido.find(i => i.idUnico === idUnico);
    if (item) {
        item.produtoId = produtoId;
        atualizarPreview();
    }
}

function atualizarQuantidadeItem(idUnico, qtd) {
    const item = itensPedido.find(i => i.idUnico === idUnico);
    if (item) {
        item.quantidade = qtd;
        atualizarPreview();
    }
}

function renderizarItensPedido() {
    const container = document.getElementById('listaItensContainer');
    if (itensPedido.length === 0) {
        container.innerHTML = `<p style="color: #64748b; font-size: 13px; text-align: center; padding: 16px;">Nenhum item adicionado ainda. Clique em "+ Adicionar Item" acima.</p>`;
        return;
    }

    container.innerHTML = '';
    itensPedido.forEach(item => {
        let listaProdutos = [];
        let labelTipo = '';

        if (item.tipo === 'b2b') { listaProdutos = produtosB2B; labelTipo = 'B2B'; }
        else if (item.tipo === 'vertuo') { listaProdutos = produtosVertuo; labelTipo = 'Vertuo'; }
        else if (item.tipo === 'original') { listaProdutos = produtosOriginal; labelTipo = 'Original'; }
        else if (item.tipo === 'acessorios') { listaProdutos = acessoriosLista; labelTipo = 'Acessório'; }

        const datalistId = `produtos_dl_${item.idUnico}`;
        let optionsHTML = '';
        listaProdutos.forEach(p => {
            const nomeProd = p.nome || p.descricao || '';
            optionsHTML += `<option value="${p.sku} - ${nomeProd}" data-id="${p.id}"></option>`;
        });

        let valorInputProd = '';
        if (item.produtoId) {
            let prodObj = listaProdutos.find(p => p.id == item.produtoId);
            if (prodObj) {
                valorInputProd = `${prodObj.sku} - ${prodObj.nome || prodObj.descricao || ''}`;
            }
        }

        const div = document.createElement('div');
        div.className = 'item-linha';
        div.innerHTML = `
            <div>
                <input type="text" list="${datalistId}" value="${valorInputProd}" placeholder="Digite o SKU ou nome..." oninput="tratarSelecaoProduto(${item.idUnico}, this.value, '${item.tipo}')">
                <datalist id="${datalistId}">
                    ${optionsHTML}
                </datalist>
            </div>
            <input type="number" min="1" value="${item.quantidade}" oninput="atualizarQuantidadeItem(${item.idUnico}, this.value)" placeholder="Qtd">
            <span style="font-size: 12px; color: #94a3b8; text-transform: uppercase; text-align: center;">${labelTipo}</span>
            <button class="btn btn-danger" onclick="removerLinhaItem(${item.idUnico})" style="padding: 6px 10px;">🗑️</button>
        `;
        container.appendChild(div);
    });
}

function tratarSelecaoProduto(idUnico, valorDigitado, tipo) {
    let listaProdutos = [];
    if (tipo === 'b2b') listaProdutos = produtosB2B;
    else if (tipo === 'vertuo') listaProdutos = produtosVertuo;
    else if (tipo === 'original') listaProdutos = produtosOriginal;
    else if (tipo === 'acessorios') listaProdutos = acessoriosLista;

    const prodEncontrado = listaProdutos.find(p => {
        const str = `${p.sku} - ${p.nome || p.descricao || ''}`;
        return str === valorDigitado || valorDigitado.includes(p.sku);
    });

    if (prodEncontrado) {
        atualizarProdutoItem(idUnico, prodEncontrado.id);
    } else {
        atualizarProdutoItem(idUnico, '');
    }
}

function atualizarPreview() {
    const preview = document.getElementById('previewMensagem');
    
    if (!clienteSelecionado) {
        preview.innerText = "Por favor, selecione um cliente para visualizar o pedido gerado.";
        return;
    }

    let b2bItens = [];
    let vertuoItens = [];
    let originalItens = [];
    let acessoriosItens = [];

    let totalCapsulasB2B = 0;
    let totalCapsulasB2C = 0;
    let totalCaixasB2C = 0;
    let totalCaixasB2B = 0;
    let totalAcessoriosEmbalagens = 0;

    itensPedido.forEach(i => {
        if (!i.produtoId) return;
        let prod = null;
        let qtd = parseInt(i.quantidade) || 1;

        if (i.tipo === 'b2b') {
            prod = produtosB2B.find(p => p.id == i.produtoId);
            if (prod) {
                let capsPorCaixa = prod.capsulas_por_caixa || 50;
                let totalCaps = qtd * capsPorCaixa;
                totalCapsulasB2B += totalCaps;
                totalCaixasB2B += qtd;
                b2bItens.push(`- ${String(qtd).padStart(2, '0')} caixa(s) - ${prod.sku} - ${prod.nome || prod.descricao} (${totalCaps} cápsulas)`);
            }
        } else if (i.tipo === 'vertuo') {
            prod = produtosVertuo.find(p => p.id == i.produtoId);
            if (prod) {
                let capsPorCaixa = prod.capsulas_caixa || prod.capsulas_por_caixa || 10;
                let totalCaps = qtd * capsPorCaixa;
                totalCapsulasB2C += totalCaps;
                totalCaixasB2C += qtd;
                vertuoItens.push(`- ${String(qtd).padStart(2, '0')} caixa(s) - ${prod.sku} - ${prod.nome || prod.descricao} (${totalCaps} cápsulas)`);
            }
        } else if (i.tipo === 'original') {
            prod = produtosOriginal.find(p => p.id == i.produtoId);
            if (prod) {
                let capsPorCaixa = prod.capsulas_caixa || prod.capsulas_por_caixa || 10;
                let totalCaps = qtd * capsPorCaixa;
                totalCapsulasB2C += totalCaps;
                totalCaixasB2C += qtd;
                originalItens.push(`- ${String(qtd).padStart(2, '0')} caixa(s) - ${prod.sku} - ${prod.nome || prod.descricao} (${totalCaps} cápsulas)`);
            }
        } else if (i.tipo === 'acessorios') {
            prod = acessoriosLista.find(p => p.id == i.produtoId);
            if (prod) {
                let qtdEmb = parseInt(prod.qtd_embalagem) || 1;
                totalAcessoriosEmbalagens += qtd;
                let nomeAcessorio = prod.nome || prod.descricao || 'Item';
                let tipoEmb = prod.tipo_embalagem || 'caixa(s)';
                // Formato idêntico ao que aprovamos: - 02 caixas - 3519/BULK - Açúcar (300 unidades cada / Total: 600 un.)
                acessoriosItens.push(`- ${String(qtd).padStart(2, '0')} ${tipoEmb} - ${prod.sku} - ${nomeAcessorio} (${qtdEmb * qtd} unidades)`);
            }
        }
    });

    if (canalAtual === 'whatsapp') {
        let texto = `Gostaria de solicitar a inserção do pedido abaixo, por favor:\n\n`;
        texto += `📌 Cliente: ${clienteSelecionado.razao || clienteSelecionado.fantasia}\n`;
        texto += `📌 NN: ${clienteSelecionado.nn}\n`;
        texto += `📌 CNPJ: ${clienteSelecionado.cnpj}\n`;
        texto += `📍 Endereço de entrega: ${clienteSelecionado.endereco || ''}, ${clienteSelecionado.bairro || ''} - ${clienteSelecionado.cidade || ''} - CEP ${clienteSelecionado.cep || ''}.\n`;

        if (b2bItens.length > 0) {
            texto += `\n☕ LINHA B2B (Nespresso Professional):\n` + b2bItens.join('\n');
        }
        if (vertuoItens.length > 0) {
            texto += `\n🌀 LINHA B2C - VERTUO:\n` + vertuoItens.join('\n');
        }
        if (originalItens.length > 0) {
            texto += `\n🔴 LINHA B2C - ORIGINAL:\n` + originalItens.join('\n');
        }
        if (acessoriosItens.length > 0) {
            texto += `\n🥄 ACESSÓRIOS:\n` + acessoriosItens.join('\n');
        }

        texto += `\n\n📦 RESUMO GERAL:\n`;
        if (totalCapsulasB2B > 0 || totalCapsulasB2C > 0) {
            let totalGeralCaps = totalCapsulasB2B + totalCapsulasB2C;
            let totalGeralCaixas = totalCaixasB2B + totalCaixasB2C;
            texto += `- Total Cápsulas: ${totalGeralCaps} cápsulas (${String(totalGeralCaixas).padStart(2, '0')} caixas no total)\n`;
        }
        if (totalAcessoriosEmbalagens > 0) {
            texto += `- Total Acessórios: ${String(totalAcessoriosEmbalagens).padStart(2, '0')} caixas\n`;
        }

        texto += `\nFico no aguardo da confirmação. Obrigado!`;
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
        texto += `- Razão Social: ${clienteSelecionado.razao || ''}\n`;
        texto += `- CNPJ: ${clienteSelecionado.cnpj || ''}\n`;
        texto += `- NN: ${clienteSelecionado.nn || ''}\n`;
        texto += `- Endereço: ${clienteSelecionado.endereco || ''}, ${clienteSelecionado.bairro || ''} - ${clienteSelecionado.cidade || ''} - CEP ${clienteSelecionado.cep || ''}\n\n`;

        texto += `Detalhes do Pedido:\n`;
        texto += `- Condição de Pagamento: Boleto faturado para 30 dias.\n\n`;
        texto += `Itens do Pedido:\n`;

        if (b2bItens.length > 0) {
            texto += `\nLINHA B2B (Nespresso Professional):\n` + b2bItens.join('\n');
        }
        if (vertuoItens.length > 0) {
            texto += `\nLINHA B2C - VERTUO:\n` + vertuoItens.join('\n');
        }
        if (originalItens.length > 0) {
            texto += `\nLINHA B2C - ORIGINAL:\n` + originalItens.join('\n');
        }
        if (acessoriosItens.length > 0) {
            texto += `\nACESSÓRIOS:\n` + acessoriosItens.join('\n');
        }

        texto += `\n\nDesde já, agradeço pela atenção e colaboração.`;
        preview.innerText = texto;
    }
}

function copiarMensagem() {
    const texto = document.getElementById('previewMensagem').innerText;
    navigator.clipboard.writeText(texto).then(() => {
        alert('Texto copiado para a área de transferência!');
    });
}
