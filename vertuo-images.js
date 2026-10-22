// Fotos extraídas do PDF Linha Vertuo fornecido pelo proprietário do catálogo.
// Associação exata por SKU ou nome; não altera os registros do Supabase.
const FOTOS_VERTUO = Object.freeze([
  {
    "sku": "7023.80",
    "name": "Melozio Decaffeinato",
    "src": "assets/vertuo/7023-80.png",
    "sourcePage": 1
  },
  {
    "sku": "7041.80",
    "name": "Odacio",
    "src": "assets/vertuo/7041-80.png",
    "sourcePage": 1
  },
  {
    "sku": "7088.80",
    "name": "Stormio",
    "src": "assets/vertuo/7088-80.png",
    "sourcePage": 1
  },
  {
    "sku": "7042.80",
    "name": "Intenso",
    "src": "assets/vertuo/7042-80.png",
    "sourcePage": 1
  },
  {
    "sku": "7001.80",
    "name": "Alto Ambrato",
    "src": "assets/vertuo/7001-80.png",
    "sourcePage": 1
  },
  {
    "sku": "7038.80",
    "name": "Alto Onice",
    "src": "assets/vertuo/7038-80.png",
    "sourcePage": 1
  },
  {
    "sku": "7006.80",
    "name": "Carafe Pour-Over Style",
    "src": "assets/vertuo/7006-80.png",
    "sourcePage": 1
  },
  {
    "sku": "7091.80",
    "name": "Gran Lungo Mater Origin - Costa Rica",
    "src": "assets/vertuo/7091-80.png",
    "sourcePage": 1
  },
  {
    "sku": "7027.80",
    "name": "Gran Lungo Mater Origin - El Salvador",
    "src": "assets/vertuo/7027-80.png",
    "sourcePage": 1
  },
  {
    "sku": "7090.80",
    "name": "Gran Lungo Mater Origin - Colômbia",
    "src": "assets/vertuo/7090-80.png",
    "sourcePage": 1
  },
  {
    "sku": "7026.80",
    "name": "Gran Lungo Mater Origin - México",
    "src": "assets/vertuo/7026-80.png",
    "sourcePage": 2
  },
  {
    "sku": "7092.80",
    "name": "Bianco Doppio",
    "src": "assets/vertuo/7092-80.png",
    "sourcePage": 2
  },
  {
    "sku": "7030.80",
    "name": "Bianco Forte",
    "src": "assets/vertuo/7030-80.png",
    "sourcePage": 2
  },
  {
    "sku": "7295.80",
    "name": "Golden Caramel",
    "src": "assets/vertuo/7295-80.png",
    "sourcePage": 2
  },
  {
    "sku": "7292.80",
    "name": "Sweet Vanilia",
    "src": "assets/vertuo/7292-80.png",
    "sourcePage": 2
  },
  {
    "sku": "7057.80",
    "name": "Sweet Vanilia Decaffeinato",
    "src": "assets/vertuo/7057-80.png",
    "sourcePage": 2
  },
  {
    "sku": "7294.80",
    "name": "Roasted Hazelnut",
    "src": "assets/vertuo/7294-80.png",
    "sourcePage": 2
  },
  {
    "sku": "7296.80",
    "name": "Rich Chocolate",
    "src": "assets/vertuo/7296-80.png",
    "sourcePage": 2
  },
  {
    "sku": "7273.80",
    "name": "Peppermint Pinwheel",
    "src": "assets/vertuo/7273-80.png",
    "sourcePage": 2
  },
  {
    "sku": "7283.80",
    "name": "Gingerbread",
    "src": "assets/vertuo/7283-80.png",
    "sourcePage": 2
  },
  {
    "sku": "7072.80",
    "name": "Pumpkin Spice Cake",
    "src": "assets/vertuo/7072-80.png",
    "sourcePage": 3
  },
  {
    "sku": "7076.80",
    "name": "Maple Pecan",
    "src": "assets/vertuo/7076-80.png",
    "sourcePage": 3
  },
  {
    "sku": "7087.80",
    "name": "Cinnamon Apple Crisp",
    "src": "assets/vertuo/7087-80.png",
    "sourcePage": 3
  }
]);

function normalizarNomeVertuo(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
        .replace(/\bmater origin\b/g, 'master origin').replace(/\bvanilia\b/g, 'vanilla')
        .replace(/[^a-z0-9]+/g, ' ').trim();
}

function normalizarSkuVertuo(value) {
    const text = String(value ?? '').trim().replace(/\s+/g, '').replace(',', '.');
    const decimal = text.match(/^(\d{4})\.(\d{1,2})$/);
    if (decimal) return decimal[1] + '.' + decimal[2].padEnd(2, '0');
    if (/^\d{6}$/.test(text)) return text.slice(0, 4) + '.' + text.slice(4);
    if (/^\d{4}$/.test(text)) return text + '.80';
    return text;
}

function obterFotoProdutoB2C(produto) {
    const cadastrada = typeof produto.foto === 'string' ? produto.foto.trim() : '';
    if (cadastrada) return cadastrada;
    if (normalizarNomeVertuo(produto.sistema) !== 'vertuo') return '';
    const sku = normalizarSkuVertuo(produto.sku);
    const porSku = FOTOS_VERTUO.find(item => item.sku === sku);
    if (porSku) return porSku.src;
    const nome = normalizarNomeVertuo(produto.nome);
    if (!nome) return '';
    const porNome = FOTOS_VERTUO.find(item => {
        const completo = normalizarNomeVertuo(item.name);
        const semCategoria = completo.replace(/^gran lungo master origin /, '');
        return nome === completo || nome === semCategoria;
    });
    return porNome ? porNome.src : '';
}

function criarImagemProdutoB2C(produto, detalhes = false) {
    const foto = obterFotoProdutoB2C(produto);
    if (!foto) return '<span role="img" aria-label="Cápsula sem foto" style="font-size: 24px;">☕</span>';
    // Usa atributos do DOM para escapar nome e endereço antes de inserir o HTML.
    const imagem = document.createElement('img');
    imagem.src = foto;
    imagem.alt = String(produto.nome || 'Cápsula de café');
    imagem.width = detalhes ? 77 : 54;
    imagem.height = detalhes ? 77 : 54;
    imagem.loading = detalhes ? 'eager' : 'lazy';
    imagem.decoding = 'async';
    imagem.style.cssText = 'object-fit:contain;border-radius:6px;background:#fff;vertical-align:middle;';
    imagem.setAttribute('onerror', "this.hidden=true;this.nextElementSibling.hidden=false;");
    return imagem.outerHTML + '<span role="img" aria-label="Imagem indisponível" hidden style="font-size:24px">☕</span>';
}
