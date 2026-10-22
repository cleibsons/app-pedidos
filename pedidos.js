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

let canalAtual = 'whatsapp';
let clientesLista = [];
let clienteSelecionado = null;

let produtosB2B = [];
let produtosVertuo = [];
let produtosOriginal = [];
let acessoriosLista = [];

let itensPedido = [];
let proximoItemId = 0;

document.addEventListener("DOMContentLoaded", async () => {
    if (await protegerPagina()) {
        await carregarDadosNuvem();
    }
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
        
        registrarBusca(document.getElementById('buscaClienteInput'), {
            obter: () => clientesLista,
            valor: textoCliente,
            titulo: c => c.fantasia || c.razao || 'Cliente sem nome',
            detalhe: c => [c.razao, `NN: ${c.nn || '—'}`, `CNPJ: ${c.cnpj || '—'}`].filter(Boolean).join(' · '),
            busca: c => [c.fantasia, c.razao, c.nn, c.cnpj].join(' '),
            escolher: c => {
                document.getElementById('buscaClienteInput').value = textoCliente(c);
                mostrarClienteSelecionado(c);
            }
        });

        // 2. Carrega Produtos B2B
        const resB2B = await supabaseClient.from('produtos_b2b').select('*');
        produtosB2B = resB2B.data || [];

        // 3. Carrega Produtos B2C (Vertuo e Original)
        const resB2C = await supabaseClient.from('produtos_b2c').select('*');
        const todosB2C = resB2C.data || [];
        
        produtosVertuo = todosB2C.filter(p => p.sistema && p.sistema.toLowerCase() === 'vertuo');
        produtosOriginal = todosB2C.filter(p => p.sistema && p.sistema.toLowerCase() === 'original');

        // 4. Carrega Acessórios da Nuvem
        const resAcessorios = await supabaseClient.from('acessorios').select('*');
        acessoriosLista = resAcessorios.data || [];

    } catch (err) {
        console.error('Erro ao carregar dados do Supabase:', err);
    }
}

function selecionarCanal(canal, logistica) {
    canalAtual = canal;
    if (logistica) document.getElementById('tipoLogisticaInput').value = logistica;
    const tipo = document.getElementById('tipoLogisticaInput').value;
    for (const [id, ativo] of [['cardWhats', canal === 'whatsapp'], ['cardEmail', canal === 'email' && tipo === 'broker'], ['cardEmail3a', canal === 'email' && tipo === 'estoque3a']]) {
        document.getElementById(id).classList.toggle('active', ativo);
        document.getElementById(id).setAttribute('aria-pressed', String(ativo));
    }
    document.getElementById('secaoEmailOpcoes').style.display = canal === 'email' ? 'block' : 'none';
    atualizarPreview();
}

function textoCliente(c) { return `${c.fantasia ? c.fantasia + ' · ' : ''}${c.razao || ''} - NN: ${c.nn || ''} (CNPJ: ${c.cnpj || ''})`; }
function selecionarClientePorBusca() {
    const valor = normalizarBusca(document.getElementById('buscaClienteInput').value.trim());
    const encontrados = clientesLista.filter(c => valor && [textoCliente(c), `${c.razao || ''} - NN: ${c.nn || ''} (CNPJ: ${c.cnpj || ''})`, c.razao, c.fantasia, c.nn, c.cnpj].some(v => v != null && normalizarBusca(v) === valor));
    mostrarClienteSelecionado(encontrados.length === 1 ? encontrados[0] : null);
}
function mostrarClienteSelecionado(cliente) {
    clienteSelecionado = cliente;
    const infoCard = document.getElementById('clienteInfoCard');
    infoCard.style.display = clienteSelecionado ? 'block' : 'none';
    infoCard.replaceChildren();
    if (clienteSelecionado) {
        const c = clienteSelecionado;
        for (const [label, valor] of [['Razão social', c.razao], ['Nome fantasia', c.fantasia], ['CNPJ', c.cnpj], ['NN', c.nn], ['Endereço', `${c.endereco || ''}, ${c.bairro || ''} - ${c.cidade || ''} - CEP ${c.cep || ''}`]]) {
            const linha = document.createElement('div'), titulo = document.createElement('strong');
            titulo.textContent = label + ': '; linha.append(titulo, String(valor || 'Não informado')); infoCard.append(linha);
        }
    }
    atualizarPreview();
}

function listaPorTipo(tipo) {
    return ({b2b: produtosB2B, vertuo: produtosVertuo, original: produtosOriginal, acessorios: acessoriosLista})[tipo] || [];
}
function produtoDoItem(item) { return listaPorTipo(item.tipo).find(p => String(p.id) === String(item.produtoId)); }
function lerCentavos(valor) {
    if (typeof valor === 'number') return Number.isFinite(valor) && valor >= 0 ? Math.round(valor * 100) : null;
    let texto = String(valor ?? '').trim();
    if (texto.includes(',')) texto = texto.replace(/\./g, '').replace(',', '.');
    if (!/^\d+(?:\.\d{1,2})?$/.test(texto)) return null;
    const n = Math.round(Number(texto) * 100);
    return Number.isSafeInteger(n) ? n : null;
}
function moeda(centavos) { return (centavos / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL'}); }
function textoPreco(centavos) { return centavos == null ? '' : (centavos / 100).toFixed(2).replace('.', ','); }
function unidadesPorEmbalagem(item, produto) {
    return item.tipo === 'acessorios' ? 1 : Math.max(1, Number(produto.capsulas_caixa || produto.capsulas_por_caixa) || (item.tipo === 'b2b' ? 50 : 10));
}
function resumoItem(item) {
    const produto = produtoDoItem(item), preco = lerCentavos(item.preco), qtd = Number(item.quantidade);
    if (!produto || preco == null || !Number.isSafeInteger(qtd) || qtd < 1) return null;
    const unidades = unidadesPorEmbalagem(item, produto), subtotal = preco * unidades * qtd;
    return Number.isSafeInteger(subtotal) ? {produto, preco, qtd, unidades, subtotal} : null;
}
function adicionarLinhaItem() {
    const tipo = document.getElementById('tipoItemAdd').value;
    itensPedido.push({idUnico: ++proximoItemId, tipo, produtoId:'', quantidade:1, preco:'', precoManual:false});
    renderizarItensPedido(); atualizarPreview();
    document.querySelector(`[data-item-id="${proximoItemId}"] .item-price input`).focus();
}
function removerLinhaItem(id) {
    itensPedido = itensPedido.filter(i => i.idUnico !== id); renderizarItensPedido(); atualizarPreview();
}
function atualizarProdutoItem(id, produtoId) {
    const item = itensPedido.find(i => i.idUnico === id);
    if (!item) return;
    item.produtoId = produtoId;
    if (!item.precoManual) {
        const produto = produtoDoItem(item);
        item.preco = textoPreco(produto ? lerCentavos(item.tipo === 'acessorios' ? produto.preco_embalagem : produto.preco) : null);
        document.querySelector(`[data-item-id="${id}"] .item-price input`).value = item.preco;
    }
    atualizarPreview();
}
function atualizarQuantidadeItem(id, valor) { const i = itensPedido.find(i => i.idUnico === id); if(i) {i.quantidade = valor; atualizarPreview();} }
function atualizarPrecoItem(id, valor) { const i = itensPedido.find(i => i.idUnico === id); if(i) {i.preco = valor; i.precoManual = valor.trim() !== ''; atualizarPreview();} }
function restaurarPrecoItem(id) { const i = itensPedido.find(i => i.idUnico === id); if(i) {i.precoManual = false; atualizarProdutoItem(id, i.produtoId);} }
function renderizarItensPedido() {
    fecharBusca();
    const container = document.getElementById('listaItensContainer'); container.replaceChildren();
    if (!itensPedido.length) {const p = document.createElement('p');p.className='pedido-help';p.textContent='Escolha a linha e clique em “Adicionar item” para começar.';container.append(p);return;}
    for (const item of itensPedido) {
        const div = document.createElement('div'); div.className='item-linha';div.dataset.itemId = item.idUnico;
        const unidade = item.tipo === 'acessorios' ? 'embalagem' : 'cápsula';
        const labelTipo = ({b2b:'B2B',vertuo:'Vertuo',original:'Original',acessorios:'Acessório'})[item.tipo];
        div.innerHTML = `<div class="item-price"><label for="preco_${item.idUnico}">R$ por ${unidade}</label><input id="preco_${item.idUnico}" type="text" inputmode="decimal" placeholder="Ex.: 4,30" aria-describedby="preco_nota_${item.idUnico}"><span class="item-price-note" id="preco_nota_${item.idUnico}">Somente neste pedido</span><button type="button" class="price-reset">Usar preço do catálogo</button></div><div class="item-product"><label for="produto_${item.idUnico}">Produto · ${labelTipo}</label><input id="produto_${item.idUnico}" type="text" placeholder="Digite o SKU ou nome..."></div><div class="item-qty"><label for="qtd_${item.idUnico}">${item.tipo === 'acessorios' ? 'Embalagens' : 'Caixas'}</label><input id="qtd_${item.idUnico}" type="number" min="1" step="1"></div><div class="item-sum"><label>Subtotal</label><strong class="item-subtotal">—</strong></div><button type="button" class="btn btn-danger" aria-label="Remover item">×</button>`;
        const preco = div.querySelector('.item-price input');preco.value=item.preco;preco.addEventListener('input',()=>atualizarPrecoItem(item.idUnico,preco.value));
        div.querySelector('.price-reset').addEventListener('click',()=>restaurarPrecoItem(item.idUnico));
        const produtoInput = div.querySelector('.item-product input'), produto = produtoDoItem(item);
        if(produto) produtoInput.value = `${produto.sku} - ${produto.nome || produto.descricao || ''}`;
        produtoInput.addEventListener('input',()=>tratarSelecaoProduto(item.idUnico,produtoInput.value,item.tipo));
        registrarBusca(produtoInput, {
            obter: () => listaPorTipo(item.tipo),
            valor: p => `${p.sku} - ${p.nome || p.descricao || ''}`,
            titulo: p => p.nome || p.descricao || 'Produto sem nome',
            detalhe: p => `SKU: ${p.sku || '—'} · ${labelTipo}`,
            busca: p => [p.sku, p.nome, p.descricao].join(' '),
            escolher: p => { produtoInput.value = `${p.sku} - ${p.nome || p.descricao || ''}`; atualizarProdutoItem(item.idUnico, p.id); }
        });
        const qtd = div.querySelector('.item-qty input');qtd.value=item.quantidade;qtd.addEventListener('input',()=>atualizarQuantidadeItem(item.idUnico,qtd.value));
        div.querySelector('.btn-danger').addEventListener('click',()=>removerLinhaItem(item.idUnico));container.append(div);
    }
}
function tratarSelecaoProduto(id, valor, tipo) {
    const produto = listaPorTipo(tipo).find(p => `${p.sku} - ${p.nome || p.descricao || ''}` === valor || String(p.sku) === valor.trim());
    atualizarProdutoItem(id, produto ? produto.id : '');
}
function atualizarTotais() {
    let total = 0, pendentes = 0;
    for (const item of itensPedido) {
        const resumo = resumoItem(item), linha = document.querySelector(`[data-item-id="${item.idUnico}"]`);
        if (resumo) total += resumo.subtotal; else pendentes++;
        if(linha) {
            linha.querySelector('.item-subtotal').textContent = resumo ? moeda(resumo.subtotal) : '—';
            linha.querySelector('.item-price input').setAttribute('aria-invalid', String(item.preco !== '' && lerCentavos(item.preco) == null));
            linha.querySelector('.item-qty input').setAttribute('aria-invalid', String(!Number.isSafeInteger(Number(item.quantidade)) || Number(item.quantidade)<1));
        }
    }
    document.getElementById('pedidoTotal').textContent=moeda(total);
    document.getElementById('pedidoPendencias').textContent=pendentes ? `${pendentes} item(ns) incompleto(s), fora do total` : 'Valores ajustados somente neste pedido';
    return {total, pendentes};
}

function atualizarPreview() {
    const preview = document.getElementById('previewMensagem');
    const totais = atualizarTotais();
    document.getElementById('pedidoStatus').textContent = '';
    
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
        const calculo = resumoItem(i);
        if (!calculo) return;
        let prod = null;
        let qtd = calculo.qtd;
        const valores = ` — ${moeda(calculo.preco)} / ${i.tipo === 'acessorios' ? 'embalagem' : 'cápsula'} — Subtotal: ${moeda(calculo.subtotal)}`;

        if (i.tipo === 'b2b') {
            prod = produtosB2B.find(p => p.id == i.produtoId);
            if (prod) {
                let capsPorCaixa = prod.capsulas_caixa || prod.capsulas_por_caixa || 50;
                let totalCaps = qtd * capsPorCaixa;
                totalCapsulasB2B += totalCaps;
                totalCaixasB2B += qtd;
                b2bItens.push(`- ${String(qtd).padStart(2, '0')} caixa(s) - ${prod.sku} - ${prod.nome || prod.descricao} (${totalCaps} cápsulas)${valores}`);
            }
        } else if (i.tipo === 'vertuo') {
            prod = produtosVertuo.find(p => p.id == i.produtoId);
            if (prod) {
                let capsPorCaixa = prod.capsulas_caixa || prod.capsulas_por_caixa || 10;
                let totalCaps = qtd * capsPorCaixa;
                totalCapsulasB2C += totalCaps;
                totalCaixasB2C += qtd;
                vertuoItens.push(`- ${String(qtd).padStart(2, '0')} caixa(s) - ${prod.sku} - ${prod.nome || prod.descricao} (${totalCaps} cápsulas)${valores}`);
            }
        } else if (i.tipo === 'original') {
            prod = produtosOriginal.find(p => p.id == i.produtoId);
            if (prod) {
                let capsPorCaixa = prod.capsulas_caixa || prod.capsulas_por_caixa || 10;
                let totalCaps = qtd * capsPorCaixa;
                totalCapsulasB2C += totalCaps;
                totalCaixasB2C += qtd;
                originalItens.push(`- ${String(qtd).padStart(2, '0')} caixa(s) - ${prod.sku} - ${prod.nome || prod.descricao} (${totalCaps} cápsulas)${valores}`);
            }
        } else if (i.tipo === 'acessorios') {
            prod = acessoriosLista.find(p => p.id == i.produtoId);
            if (prod) {
                let qtdEmb = parseInt(prod.qtd_embalagem) || 1;
                totalAcessoriosEmbalagens += qtd;
                let nomeAcessorio = prod.nome || prod.descricao || 'Item';
                let tipoEmb = prod.tipo_embalagem || 'caixa(s)';
                acessoriosItens.push(`- ${String(qtd).padStart(2, '0')} ${tipoEmb} - ${prod.sku} - ${nomeAcessorio} (${qtdEmb * qtd} unidades)${valores}`);
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

        texto += `\nValor total do pedido: ${moeda(totais.total)}\n`;
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
            texto += `Observação importante: Solicito o faturamento VIA ESTOQUE 3A e entrega VIA TRANSPORTADORA (Total Express) — NÃO enviar via Correios, pois o cliente não recebe mercadorias por esta modalidade.\n\n`;
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

        texto += `\n\nValor total do pedido: ${moeda(totais.total)}`;
        texto += `\n\nDesde já, agradeço pela atenção e colaboração.`;
        preview.innerText = texto;
    }
}

async function copiarMensagem() {
    atualizarPreview();
    const status = document.getElementById('pedidoStatus');
    if (!clienteSelecionado || !itensPedido.length || atualizarTotais().pendentes) {
        status.textContent='Selecione um cliente e complete produto, preço e quantidade de todos os itens antes de copiar.';
        return;
    }
    try {await navigator.clipboard.writeText(document.getElementById('previewMensagem').innerText); status.textContent='Texto copiado! Pronto para enviar.';}
    catch {status.textContent='Não foi possível copiar automaticamente. Selecione e copie o texto da pré-visualização.';}
}
function limparPedido() {
    fecharBusca();
    if ((itensPedido.length || document.getElementById('buscaClienteInput').value || document.getElementById('ordemCompraInput').value) && !confirm('Limpar o pedido atual e começar outro? Os preços ajustados também serão apagados.')) return;
    itensPedido=[]; clienteSelecionado=null;
    document.getElementById('buscaClienteInput').value='';document.getElementById('ordemCompraInput').value='';
    document.getElementById('tipoItemAdd').value='b2b';document.getElementById('clienteInfoCard').replaceChildren();document.getElementById('clienteInfoCard').style.display='none';
    renderizarItensPedido();selecionarCanal('whatsapp','broker');
    document.getElementById('pedidoStatus').textContent='Página limpa. Pronta para um novo pedido.';
    document.getElementById('buscaClienteInput').focus();window.scrollTo({top:0,behavior:'smooth'});
}

/* Lista de sugestões compartilhada: visual e navegação iguais em todos os campos. */
let buscaAberta = null;
let painelBusca = null;
function normalizarBusca(valor) {
    return String(valor ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
function fecharBusca() {
    if (buscaAberta) {
        buscaAberta.input.setAttribute('aria-expanded', 'false');
        buscaAberta.input.removeAttribute('aria-activedescendant');
    }
    buscaAberta = null;
    if (painelBusca) painelBusca.hidden = true;
}
function obterPainelBusca() {
    if (painelBusca) return painelBusca;
    painelBusca = document.createElement('div'); painelBusca.id='pedidoSugestoes'; painelBusca.className='pedido-sugestoes';
    painelBusca.setAttribute('role','listbox');painelBusca.hidden=true;document.body.append(painelBusca);
    document.addEventListener('pointerdown', e => {if (buscaAberta && e.target !== buscaAberta.input && !painelBusca.contains(e.target)) fecharBusca();});
    document.addEventListener('scroll', e => {if (buscaAberta && !painelBusca.contains(e.target)) posicionarBusca();}, true);
    window.addEventListener('resize', posicionarBusca);
    window.visualViewport?.addEventListener('resize', posicionarBusca);
    window.visualViewport?.addEventListener('scroll', posicionarBusca);
    return painelBusca;
}
function posicionarBusca() {
    if (!buscaAberta) return;
    const input=buscaAberta.input;
    if (!input.isConnected) {fecharBusca();return;}
    const r=input.getBoundingClientRect(), altura=window.visualViewport ? window.visualViewport.height + window.visualViewport.offsetTop : window.innerHeight, largura=document.documentElement.clientWidth;
    if(r.bottom<0 || r.top>altura) {fecharBusca();return;}
    const width=Math.min(Math.max(r.width, 500),largura-24), left=Math.max(12,Math.min(r.left,largura-width-12));
    const abaixo=altura-r.bottom-12, acima=r.top-12, abreAcima=abaixo<180 && acima>abaixo;
    const maxHeight=Math.min(360,Math.max(80,abreAcima?acima-8:abaixo-8));
    Object.assign(painelBusca.style,{width:`${width}px`,left:`${left}px`,maxHeight:`${maxHeight}px`,top:abreAcima?'auto':`${r.bottom+7}px`,bottom:abreAcima?`${altura-r.top+7}px`:'auto'});
}
function marcarSugestao(indice) {
    if (!buscaAberta) return;
    buscaAberta.indice=indice;
    [...painelBusca.querySelectorAll('[role=option]')].forEach((el,i)=>el.setAttribute('aria-selected',String(i===indice)));
    if(indice>=0) {
        const el=painelBusca.querySelectorAll('[role=option]')[indice];
        buscaAberta.input.setAttribute('aria-activedescendant',el.id);el.scrollIntoView({block:'nearest'});
    } else buscaAberta.input.removeAttribute('aria-activedescendant');
}
function escolherSugestao(indice) {
    if (!buscaAberta || !buscaAberta.resultados[indice]) return;
    const {input,config,resultados}=buscaAberta;
    fecharBusca();config.escolher(resultados[indice]);input.focus();fecharBusca();
}
function abrirBusca(input,config) {
    obterPainelBusca();
    if(buscaAberta && buscaAberta.input!==input) fecharBusca();
    const itens=config.obter();
    const consulta=itens.some(item=>config.valor(item)===input.value) ? '' : normalizarBusca(input.value), termos=consulta.split(/\s+/).filter(Boolean);
    const resultados=itens.filter(item=>{
        const texto=normalizarBusca(config.busca(item));
        return termos.every(termo=>texto.includes(termo)) || (/^[\d.\/-]+$/.test(consulta) && texto.replace(/\D/g,'').includes(consulta.replace(/\D/g,'')));
    });
    buscaAberta={input,config,resultados,indice:-1};painelBusca.replaceChildren();
    painelBusca.setAttribute('aria-label',input.id==='buscaClienteInput'?'Clientes encontrados':'Produtos encontrados');
    resultados.forEach((item,indice)=>{
        const opt=document.createElement('div');opt.className='pedido-sugestao';opt.id=`pedidoSugestao_${indice}`;opt.setAttribute('role','option');opt.setAttribute('aria-selected','false');
        const titulo=document.createElement('strong'),detalhe=document.createElement('span');titulo.textContent=config.titulo(item);detalhe.textContent=config.detalhe(item);opt.append(titulo,detalhe);
        opt.addEventListener('pointerdown',e=>e.preventDefault());opt.addEventListener('click',()=>escolherSugestao(indice));painelBusca.append(opt);
    });
    if(!resultados.length) {const vazio=document.createElement('p');vazio.className='pedido-busca-vazia';vazio.textContent='Nenhum resultado encontrado. Tente outro nome ou código.';painelBusca.append(vazio);}
    painelBusca.hidden=false;input.setAttribute('aria-expanded','true');input.removeAttribute('aria-activedescendant');painelBusca.scrollTop=0;posicionarBusca();
}
function registrarBusca(input,config) {
    input.removeAttribute('list');input.autocomplete='off';input.setAttribute('role','combobox');input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-expanded','false');input.setAttribute('aria-controls','pedidoSugestoes');
    input.addEventListener('focus',()=>abrirBusca(input,config));input.addEventListener('input',()=>abrirBusca(input,config));input.addEventListener('blur',fecharBusca);
    input.addEventListener('keydown',e=>{
        if(e.isComposing) return;
        if(e.key==='Escape') {fecharBusca();return;}
        if(e.key==='Tab') {fecharBusca();return;}
        if(e.key==='ArrowDown'||e.key==='ArrowUp') {
            e.preventDefault();if(!buscaAberta || buscaAberta.input!==input) abrirBusca(input,config);
            const n=buscaAberta.resultados.length;if(n) marcarSugestao((buscaAberta.indice+(e.key==='ArrowDown'?1:-1)+n)%n);
        } else if(e.key==='Enter' && buscaAberta && buscaAberta.input===input && buscaAberta.indice>=0) {e.preventDefault();escolherSugestao(buscaAberta.indice);}
    });
}
