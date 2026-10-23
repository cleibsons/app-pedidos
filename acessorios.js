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

// Base completa de Acessórios para carga automática inicial
const ACESSORIOS_INICIAIS = [
    { id: 1729531001, sku: '3541', nome: 'Pires LUME Cappuccino 12 Unidades', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 12, preco_embalagem: '78,65', preco_unid: '6,55', foto: '', observacoes: '' },
    { id: 1729531002, sku: '3545', nome: 'Pires LUME Espresso 12 Unidades', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 12, preco_embalagem: '73,08', preco_unid: '6,09', foto: '', observacoes: '' },
    { id: 1729531003, sku: '3532', nome: 'Xícaras LUME Cappuccino (180 Ml) 12 Unidades', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 12, preco_embalagem: '144,90', preco_unid: '12,08', foto: '', observacoes: '' },
    { id: 1729531004, sku: '3533', nome: 'Xícaras LUME Espresso (80 Ml) 12 Unidades', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 12, preco_embalagem: '111,20', preco_unid: '9,27', foto: '', observacoes: '' },
    { id: 1729531005, sku: '3791', nome: 'Canecas Lume', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '220,00', preco_unid: '110,00', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531006, sku: '3790', nome: 'Xícaras Lume Espresso', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '190,00', preco_unid: '95,00', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531007, sku: '3793', nome: 'Xícaras Lume Lungo', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '220,00', preco_unid: '110,00', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531008, sku: '3519/BULK', nome: 'Açúcar (300 unidades)', tipo_embalagem: 'Caixa Bulk', qtd_embalagem: 300, preco_embalagem: '27,30', preco_unid: '0,09', foto: '', observacoes: '' },
    { id: 1729531009, sku: '3516/BULK', nome: 'Açúcar Branco B2C (bulk - 500 sticks)', tipo_embalagem: 'Caixa Bulk', qtd_embalagem: 500, preco_embalagem: '160,00', preco_unid: '0,32', foto: '', observacoes: '' },
    { id: 1729531010, sku: '3517', nome: 'Sachê de Açúcar Mascavo (60 Sachês)', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 60, preco_embalagem: '55,00', preco_unid: '0,92', foto: '', observacoes: '' },
    { id: 1729531011, sku: '3562', nome: 'Mexedores de Bambu - Pequeno (100 Unid.)', tipo_embalagem: 'Pacote', qtd_embalagem: 100, preco_embalagem: '13,65', preco_unid: '0,14', foto: '', observacoes: '' },
    { id: 1729531012, sku: '3561', nome: 'Mexedores de Bambu - Médio (100 Unid.)', tipo_embalagem: 'Pacote', qtd_embalagem: 100, preco_embalagem: '16,80', preco_unid: '0,17', foto: '', observacoes: '' },
    { id: 1729531013, sku: '132077', nome: 'Caneca Térmica Terracotta Pequena', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '170,00', preco_unid: '170,00', foto: '', observacoes: '' },
    { id: 1729531014, sku: '136877', nome: 'Caneca Térmica Laranja Média', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '180,00', preco_unid: '180,00', foto: '', observacoes: '' },
    { id: 1729531015, sku: '136876', nome: 'Caneca Térmica Aquarelle Grande', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '190,00', preco_unid: '190,00', foto: '', observacoes: '' },
    { id: 1729531016, sku: '142170', nome: 'Caneca Térmica Sage Green Pequena', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '170,00', preco_unid: '170,00', foto: '', observacoes: '' },
    { id: 1729531017, sku: '142172', nome: 'Caneca Térmica Vanilla Ice Média', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '180,00', preco_unid: '180,00', foto: '', observacoes: '' },
    { id: 1729531018, sku: '142171', nome: 'Caneca Térmica Smokey Blue Grande', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '190,00', preco_unid: '190,00', foto: '', observacoes: '' },
    { id: 1729531019, sku: '128003', nome: 'Cantuccini 10 unidades (12g Cada)', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 10, preco_embalagem: '60,00', preco_unid: '6,00', foto: '', observacoes: '' },
    { id: 1729531020, sku: '5023/R1', nome: 'Cappucinatore Device CS20 (1 unidade)', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '60,95', preco_unid: '60,95', foto: '', observacoes: '' },
    { id: 1729531021, sku: '3430', nome: 'Xícaras Loop Mug', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '130,00', preco_unid: '65,00', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531022, sku: '3436', nome: 'Xícaras Loop Espresso', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '100,00', preco_unid: '50,00', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531023, sku: '3432', nome: 'Xícaras Loop Gran Lungo', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '130,00', preco_unid: '65,00', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531024, sku: '3434', nome: 'Xícaras Loop Lungo', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '130,00', preco_unid: '65,00', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531025, sku: '128557', nome: 'Container de Reciclagem', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '90,00', preco_unid: '90,00', foto: '', observacoes: '' },
    { id: 1729531026, sku: '3581', nome: 'Copos Iced Reveal', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '335,00', preco_unid: '167,50', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531027, sku: '142268', nome: 'Chocolate Amargo 40 Unidades (5g Cada)', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 40, preco_embalagem: '100,00', preco_unid: '2,50', foto: '', observacoes: '' },
    { id: 1729531028, sku: '3594-BRA-BK', nome: 'Espumador de Leite Aeroccino3 110V - Preto', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '576,00', preco_unid: '576,00', foto: '', observacoes: '' },
    { id: 1729531029, sku: '3594-BRA-RE', nome: 'Espumador de Leite Aeroccino3 110V - Vermelho', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '576,00', preco_unid: '576,00', foto: '', observacoes: '' },
    { id: 1729531030, sku: '3594-BRB-BK', nome: 'Espumador de Leite Aeroccino3 220V - Preto', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '576,00', preco_unid: '576,00', foto: '', observacoes: '' },
    { id: 1729531031, sku: '3594-BRBRE-', nome: 'Espumador de Leite Aeroccino3 220V - Vermelho', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '576,00', preco_unid: '576,00', foto: '', observacoes: '' },
    { id: 1729531032, sku: '4194-BRA-SI-NE', nome: 'Espumador de Leite Aeroccino 4 110V', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '708,00', preco_unid: '708,00', foto: '', observacoes: '' },
    { id: 1729531033, sku: '4194-BRB-SI-NE', nome: 'Espumador de Leite Aeroccino 4 220V', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '708,00', preco_unid: '708,00', foto: '', observacoes: '' },
    { id: 1729531034, sku: '3795', nome: 'Porta Cápsulas Lume Mia', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '180,00', preco_unid: '180,00', foto: '', observacoes: '' },
    { id: 1729531035, sku: '157508', nome: 'Porta Cápsulas Display Mia LE 2026', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '185,00', preco_unid: '185,00', foto: '', observacoes: '' },
    { id: 1729531036, sku: '142267', nome: 'Chocolate ao Leite 40 Unidades (5g Cada)', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 40, preco_embalagem: '100,00', preco_unid: '2,50', foto: '', observacoes: '' },
    { id: 1729531037, sku: '5105.01', nome: 'New Cappuccinattore Kit (100 unidades)', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 100, preco_embalagem: '115,50', preco_unid: '1,16', foto: '', observacoes: '' },
    { id: 1729531038, sku: '137101', nome: 'Tampa Para Copos Descartáveis 360-600ml', tipo_embalagem: 'Pacote', qtd_embalagem: 1, preco_embalagem: '11,52', preco_unid: '11,52', foto: '', observacoes: '' },
    { id: 1729531039, sku: '137102', nome: 'Tampa Para Copos Descartáveis 240ml', tipo_embalagem: 'Pacote', qtd_embalagem: 1, preco_embalagem: '8,87', preco_unid: '8,87', foto: '', observacoes: '' },
    { id: 1729531040, sku: '3529', nome: 'Conjunto de Bandeja Origin', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '175,00', preco_unid: '175,00', foto: '', observacoes: '' },
    { id: 1729531041, sku: '3524', nome: 'Xícaras Origens Espresso', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '200,00', preco_unid: '100,00', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531042, sku: '3527', nome: 'Xícaras Origens Lungo', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '210,00', preco_unid: '105,00', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531043, sku: '5313/12', nome: 'Pires Espresso (12 unidades)', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 12, preco_embalagem: '262,50', preco_unid: '21,88', foto: '', observacoes: '' },
    { id: 1729531044, sku: '122661', nome: 'Pixie Espresso Istanbul', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '95,00', preco_unid: '95,00', foto: '', observacoes: '' },
    { id: 1729531045, sku: '122520', nome: 'Pixie Espresso Paris', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '95,00', preco_unid: '95,00', foto: '', observacoes: '' },
    { id: 1729531046, sku: '122660', nome: 'Pixie Espresso Rio', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '95,00', preco_unid: '95,00', foto: '', observacoes: '' },
    { id: 1729531047, sku: '125413', nome: 'Pixie Lungo Buenos Aires', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '100,00', preco_unid: '100,00', foto: '', observacoes: '' },
    { id: 1729531048, sku: '125412', nome: 'Pixie Lungo Cape Town', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '100,00', preco_unid: '100,00', foto: '', observacoes: '' },
    { id: 1729531049, sku: '125411', nome: 'Pixie Lungo Shangai', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '100,00', preco_unid: '100,00', foto: '', observacoes: '' },
    { id: 1729531050, sku: '125408', nome: 'Pixie Lungo Stockholm', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '100,00', preco_unid: '100,00', foto: '', observacoes: '' },
    { id: 1729531051, sku: '125409', nome: 'Pixie Lungo Tokyo', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '100,00', preco_unid: '100,00', foto: '', observacoes: '' },
    { id: 1729531052, sku: '125410', nome: 'Pixie Lungo Vienna', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '100,00', preco_unid: '100,00', foto: '', observacoes: '' },
    { id: 1729531053, sku: '3555', nome: 'Porta Cápsulas - Alessi Double', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '500,00', preco_unid: '500,00', foto: '', observacoes: '' },
    { id: 1729531054, sku: '3585', nome: 'Porta Cápsulas Cubo', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '165,00', preco_unid: '165,00', foto: '', observacoes: '' },
    { id: 1729531055, sku: '5405/1', nome: 'Porta-Cápsulas - Hotéis (quartos)', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '126,00', preco_unid: '126,00', foto: '', observacoes: '' },
    { id: 1729531056, sku: '140961', nome: 'Porta-Cápsulas Drawer Display', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '345,00', preco_unid: '345,00', foto: '', observacoes: '' },
    { id: 1729531057, sku: '5003/1', nome: 'Porta-Cápsulas Showcase', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '210,00', preco_unid: '210,00', foto: '', observacoes: '' },
    { id: 1729531058, sku: '36645/40', nome: 'PURE Collection BULK 20 Esp & 20 Lungo Saucer', tipo_embalagem: 'Caixa Bulk', qtd_embalagem: 40, preco_embalagem: '622,00', preco_unid: '15,55', foto: '', observacoes: '' },
    { id: 1729531059, sku: '5119', nome: 'Copos Descartáveis 110ml (50 Und)', tipo_embalagem: 'Pacote', qtd_embalagem: 50, preco_embalagem: '7,88', preco_unid: '0,16', foto: '', observacoes: '' },
    { id: 1729531060, sku: '5120', nome: 'Copos Descartáveis 240ml (30 Und)', tipo_embalagem: 'Pacote', qtd_embalagem: 30, preco_embalagem: '6,62', preco_unid: '0,22', foto: '', observacoes: '' },
    { id: 1729531061, sku: '5116', nome: 'Copos Descartáveis 360ml (35 Und)', tipo_embalagem: 'Pacote', qtd_embalagem: 35, preco_embalagem: '11,24', preco_unid: '0,32', foto: '', observacoes: '' },
    { id: 1729531062, sku: '124963', nome: 'Taças Reveal para Cafés Intensos', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '245,00', preco_unid: '122,50', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531063, sku: '125010', nome: 'Taças Reveal para Cafés Equilibrados', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '245,00', preco_unid: '122,50', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531064, sku: '123941', nome: 'Caneca Térmica Travel', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '130,00', preco_unid: '130,00', foto: '', observacoes: '' },
    { id: 1729531065, sku: '5499', nome: 'Porta Cápsulas Vertical', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '230,00', preco_unid: '230,00', foto: '', observacoes: '' },
    { id: 1729531066, sku: '134509', nome: 'Vertuo Alto Mug', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '270,00', preco_unid: '135,00', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531067, sku: '134508', nome: 'Xícaras Double Espresso Vertuo', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '235,00', preco_unid: '117,50', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531068, sku: '134502', nome: 'Xícaras Espresso Vertuo', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '220,00', preco_unid: '110,00', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531069, sku: '134504', nome: 'Xícaras Gran Lungo Vertuo', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 2, preco_embalagem: '235,00', preco_unid: '117,50', foto: '', observacoes: 'Conjunto com 2 unidades' },
    { id: 1729531070, sku: '3787', nome: 'Vertuo Sharing Pot Carafe', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '360,00', preco_unid: '360,00', foto: '', observacoes: '' },
    { id: 1729531071, sku: '3417', nome: 'Porta Cápsulas Bonbonnière', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '120,00', preco_unid: '120,00', foto: '', observacoes: '' },
    { id: 1729531072, sku: '3425', nome: 'Colheres VIEW - Grande (Bulk 12 unidades)', tipo_embalagem: 'Caixa Bulk', qtd_embalagem: 12, preco_embalagem: '65,60', preco_unid: '5,47', foto: '', observacoes: '' },
    { id: 1729531073, sku: '144331', nome: 'Colheres VIEW - Média (Bulk 12 unidades)', tipo_embalagem: 'Caixa Bulk', qtd_embalagem: 12, preco_embalagem: '55,02', preco_unid: '4,59', foto: '', observacoes: '' },
    { id: 1729531074, sku: '143773', nome: 'Colheres VIEW - Pequena (BULK 12 unidades)', tipo_embalagem: 'Caixa Bulk', qtd_embalagem: 12, preco_embalagem: '51,62', preco_unid: '4,30', foto: '', observacoes: '' },
    { id: 1729531075, sku: '3419', nome: 'VIEW Discovery Box', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '215,00', preco_unid: '215,00', foto: '', observacoes: '' },
    { id: 1729531076, sku: '3741/BULK', nome: 'VIEW Set of 12 Big Saucers (in bulk)', tipo_embalagem: 'Caixa Bulk', qtd_embalagem: 12, preco_embalagem: '342,80', preco_unid: '28,57', foto: '', observacoes: '' },
    { id: 1729531077, sku: '3735/BULK', nome: 'VIEW Set of 12 Espresso Cups (in bulk)', tipo_embalagem: 'Caixa Bulk', qtd_embalagem: 12, preco_embalagem: '128,40', preco_unid: '10,70', foto: '', observacoes: '' },
    { id: 1729531078, sku: '3736/BULK', nome: 'VIEW Set of 12 Lungo Cups (in bulk)', tipo_embalagem: 'Caixa Bulk', qtd_embalagem: 12, preco_embalagem: '171,10', preco_unid: '14,26', foto: '', observacoes: '' },
    { id: 1729531079, sku: '3738/BULK', nome: 'VIEW Set of 12 Mugs (in bulk)', tipo_embalagem: 'Caixa Bulk', qtd_embalagem: 12, preco_embalagem: '191,50', preco_unid: '15,96', foto: '', observacoes: '' },
    { id: 1729531080, sku: '3739/BULK', nome: 'Copos de Receita View (12 Unid. BULK)', tipo_embalagem: 'Caixa Bulk', qtd_embalagem: 12, preco_embalagem: '191,50', preco_unid: '15,96', foto: '', observacoes: '' },
    { id: 1729531081, sku: '3740/BULK', nome: 'VIEW Set of 12 Small Saucers (in bulk)', tipo_embalagem: 'Caixa Bulk', qtd_embalagem: 12, preco_embalagem: '244,30', preco_unid: '20,36', foto: '', observacoes: '' },
    { id: 1729531082, sku: '3785', nome: 'Colheres de Café VIEW - Grande (6 unidades)', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 6, preco_embalagem: '125,00', preco_unid: '20,83', foto: '', observacoes: '' },
    { id: 1729531083, sku: '3784', nome: 'Colheres de Café VIEW - Médio (6 unidades)', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 6, preco_embalagem: '110,00', preco_unid: '18,33', foto: '', observacoes: '' },
    { id: 1729531084, sku: '3783', nome: 'Colheres de Café VIEW - Pequeno (6 Unidades)', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 6, preco_embalagem: '100,00', preco_unid: '16,67', foto: '', observacoes: '' },
    { id: 1729531085, sku: '103059', nome: 'Porta Cápsulas B2B Moment N', tipo_embalagem: 'Promocional', qtd_embalagem: 1, preco_embalagem: '0,00', preco_unid: '0,00', foto: '', observacoes: 'Produto promocional / somente bonificação' },
    { id: 1729531086, sku: '890941/4', nome: 'Sacola de Reciclagem', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '0,00', preco_unid: '0,00', foto: '', observacoes: 'Sem valor na tabela' },
    { id: 1729531087, sku: '139891', nome: 'Display Drawer Pro', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '294,00', preco_unid: '294,00', foto: '', observacoes: '' },
    { id: 1729531088, sku: '143063', nome: 'Porta Cápsulas Vertical Pro', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '499,00', preco_unid: '499,00', foto: '', observacoes: '' },
    { id: 1729531089, sku: '143086', nome: 'Porta Insumos Vertical', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '499,00', preco_unid: '499,00', foto: '', observacoes: '' },
    { id: 1729531090, sku: '146227', nome: 'Hotel Condiment Tray', tipo_embalagem: 'Unidade', qtd_embalagem: 1, preco_embalagem: '110,00', preco_unid: '110,00', foto: '', observacoes: '' },
    { id: 1729531091, sku: '146928', nome: 'B2B Hotel Capsule Box (8 pcs)', tipo_embalagem: 'Caixa / Kit', qtd_embalagem: 8, preco_embalagem: '150,00', preco_unid: '18,75', foto: '', observacoes: '' }
];

let acessorios = [];
let itemSimulacaoAtual = null;

document.addEventListener("DOMContentLoaded", async () => {
    if (await protegerPagina()) {
        await carregarAcessoriosNuvem();
    }
});

/* CARREGAR ACESSÓRIOS DA NUVEM (COM CARGA AUTOMÁTICA SE VAZIO) */
async function carregarAcessoriosNuvem() {
    const tbody = document.getElementById('acessoriosTableBody');
    tbody.innerHTML = `<p class="pro-status">Carregando catálogo de acessórios...</p>`;

    if (!supabaseClient) {
        acessorios = [...ACESSORIOS_INICIAIS];
        renderizarTabela();
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('acessorios')
            .select('*');

        if (error) {
            console.warn('Tabela ainda não sincronizada no Supabase, exibindo catálogo padrão:', error.message);
            acessorios = [...ACESSORIOS_INICIAIS];
            renderizarTabela();
            return;
        }

        // Se a tabela existir no Supabase mas estiver vazia, insere todos os itens automaticamente!
        if (!data || data.length === 0) {
            tbody.innerHTML = `<p class="pro-status">Carregando catálogo de acessórios...</p>`;
            const { error: insertError } = await supabaseClient
                .from('acessorios')
                .upsert(ACESSORIOS_INICIAIS);

            if (insertError) {
                console.warn('Aviso ao gravar carga inicial no Supabase:', insertError.message);
            }
            acessorios = [...ACESSORIOS_INICIAIS];
        } else {
            acessorios = data;
        }

        // Ordena alfabeticamente pela descrição
        acessorios.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
        renderizarTabela();
    } catch (err) {
        console.error('Erro de conexão:', err);
        acessorios = [...ACESSORIOS_INICIAIS];
        renderizarTabela();
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


// Categorias e ordem conforme os prints da Nespresso Professional enviados pelo usuário.
// Fotos oficiais verificadas por SKU no catálogo Nespresso (outubro de 2026).
// Não altera as fotos cadastradas no Supabase.
const FOTOS_OFICIAIS_ACESSORIOS = {
  "3425": "https://www.nespresso.com/ecom/medias/sys_master/public/13435455209502/A-1065-Discovey-Box-desktop-2000x2000.png",
  "3430": "https://www.nespresso.com/ecom/medias/sys_master/public/51586744254494/loop-mug.png",
  "3434": "https://www.nespresso.com/ecom/medias/sys_master/public/51586744188958/loop-lungo.png",
  "3517": "https://www.nespresso.com/ecom/medias/sys_master/public/51586740355102/brown-sugar-revamp.png",
  "3524": "https://www.nespresso.com/ecom/medias/sys_master/public/51586746023966/origin-espresso.png",
  "3527": "https://www.nespresso.com/ecom/medias/sys_master/public/51586746220574/origin-lungo.png",
  "3532": "https://www.nespresso.com/ecom/medias/sys_master/public/17366245441566.png",
  "3533": "https://www.nespresso.com/ecom/medias/sys_master/public/17366240755742.png",
  "3541": "https://www.nespresso.com/ecom/medias/sys_master/public/17366253469726/lume-pro-large-saucer-2x.png",
  "3545": "https://www.nespresso.com/ecom/medias/sys_master/public/17366251012126.png",
  "3561": "https://www.nespresso.com/ecom/medias/sys_master/public/14093400440862/2000x2000-Mexedores-de-Bambu-Receitas.png",
  "3562": "https://www.nespresso.com/ecom/medias/sys_master/public/14093121683486/2000x2000-Mexedores-de-Bambu-Cafe-s..png",
  "3581": "https://www.nespresso.com/ecom/medias/sys_master/public/51586744156190/reveal-cold-coffee.png",
  "3783": "https://www.nespresso.com/ecom/medias/sys_master/public/51586741075998/view-small-spoon.png",
  "3784": "https://www.nespresso.com/ecom/medias/sys_master/public/51586741469214/view-medium-spoon.png",
  "5116": "https://www.nespresso.com/ecom/medias/sys_master/public/28410061750302/CoposDescartaveis-360ml-2000x2000.png",
  "5119": "https://www.nespresso.com/ecom/medias/sys_master/public/15309189349406/CoposDescartaveis-110ml-2000x2000.png",
  "5120": "https://www.nespresso.com/ecom/medias/sys_master/public/15309487439902/CoposDescartaveis-240ml-2000x2000.png",
  "122520": "https://www.nespresso.com/ecom/medias/sys_master/public/51586747465758/pixie-espresso-cup-paris.png",
  "122661": "https://www.nespresso.com/ecom/medias/sys_master/public/51586746974238/pixie-espresso-cup-istanbul.png",
  "124963": "https://www.nespresso.com/ecom/medias/sys_master/public/51586745761822/reveal-espresso-intense.png",
  "125010": "https://www.nespresso.com/ecom/medias/sys_master/public/51586745892894/reveal-espresso-mild-full.png",
  "125408": "https://www.nespresso.com/ecom/medias/sys_master/public/51586747695134/pixie-lungo-cups-stockholm.png",
  "125409": "https://www.nespresso.com/ecom/medias/sys_master/public/51586747629598/pixie-lungo-cup-tokyo.png",
  "125410": "https://www.nespresso.com/ecom/medias/sys_master/public/51586747564062/pixie-lungo-cup-vienna.png",
  "125411": "https://www.nespresso.com/ecom/medias/sys_master/public/51586747498526/pixie-lungo-cups-shanghai.png",
  "128003": "https://www.nespresso.com/ecom/medias/sys_master/public/51586740486174/cantuccini-biscuits.png",
  "128557": "https://www.nespresso.com/ecom/medias/sys_master/public/51586740944926/recycling-bin.png",
  "134504": "https://www.nespresso.com/ecom/medias/sys_master/public/51586743566366/gran-lungo-coffee-vl.png",
  "134508": "https://www.nespresso.com/ecom/medias/sys_master/public/51586743435294/double-espresso-coffee-lungo-vl.png",
  "134509": "https://www.nespresso.com/ecom/medias/sys_master/public/51586743795742/coffee-large-mug-vl.png",
  "137101": "https://www.nespresso.com/ecom/medias/sys_master/public/15814731628574/A-1232-ResponsivePLPImage.png",
  "137102": "https://www.nespresso.com/ecom/medias/sys_master/public/15814729170974/A-1231-ResponsivePLPImage.png",
  "139891": "https://www.nespresso.com/ecom/medias/sys_master/public/31518229168158/display-drawer-pro-2x.png",
  "140961": "https://www.nespresso.com/ecom/medias/sys_master/public/51586740092958/drawer-dispenser-ol.png",
  "142170": "https://www.nespresso.com/ecom/medias/sys_master/public/46051758997534/Sagegreen-PLPimage-nomad-travel-mug-terracotta-2x.png",
  "142171": "https://www.nespresso.com/ecom/medias/sys_master/public/46051756441630/blue-ResponsivePLPImage-3Q.png",
  "142172": "https://www.nespresso.com/ecom/medias/sys_master/public/46051755720734/Vanilla-ResponsivePLPImage-3Q.png",
  "142268": "https://www.nespresso.com/ecom/medias/sys_master/public/51586740158494/dark-cocoa-chocolate.png",
  "143063": "https://www.nespresso.com/ecom/medias/sys_master/public/35123102679070/A-1407-PLP-320x320.png",
  "143086": "https://www.nespresso.com/ecom/medias/sys_master/public/35131679113246/A-1408-PLP-320x320.png",
  "143773": "https://www.nespresso.com/ecom/medias/sys_master/public/13435747663902/A-1065-Discovey-Box-desktop-2000x2000.png",
  "3594-BRA-BK": "https://www.nespresso.com/ecom/medias/sys_master/public/51585559167006/aeroccino-3-black.png",
  "3594-BRA-RE": "https://www.nespresso.com/ecom/medias/sys_master/public/51585557757982/aeroccino-3-red.png",
  "3594-BRB-BK": "https://www.nespresso.com/ecom/medias/sys_master/public/51585559625758/aeroccino-3-black.png",
  "3594-BRBRE-": "https://www.nespresso.com/ecom/medias/sys_master/public/51585558413342/aeroccino-3-red.png",
  "4194-BRA-SI-NE": "https://www.nespresso.com/ecom/medias/sys_master/public/51585559855134/aeroccino-4-refresh-on-frontview.png",
  "4194-BRB-SI-NE": "https://www.nespresso.com/ecom/medias/sys_master/public/51585559986206/aeroccino-4-refresh-on-frontview.png",
  "5003/1": "https://www.nespresso.com/ecom/medias/sys_master/public/17147513831454/5003-1-2000x2000-1-.png",
  "3739/BULK": "https://www.nespresso.com/ecom/medias/sys_master/public/10392978096158/A-0176-VIEW-Recipe-2000X2000-2.png"
};
function fotosAcessorio(a) {
 const oficial=FOTOS_OFICIAIS_ACESSORIOS[String(a.sku || '').trim().toUpperCase()];
 const cadastrada=typeof a.foto === 'string' ? a.foto.trim() : '';
 return [...new Set([oficial,cadastrada].filter(Boolean))];
}

const CATEGORIAS_ACESSORIOS = [
 ['leite','Espumadores de leite','Prepare receitas com leite com os espumadores Aeroccino.'],
 ['degustacao','Para acompanhar','Chocolates, biscoitos, açúcar e organização dos acompanhamentos.'],
 ['reciclagem','Para reciclar','Soluções para guardar e encaminhar cápsulas usadas para reciclagem.'],
 ['xicaras','Canecas Térmicas, Xícaras & Mexedores','Peças para servir e apreciar seu café, no trabalho ou onde estiver.'],
 ['dispensadores','Porta-Cápsulas','Organize seus cafés e complete seu espaço de café.'],
 ['outros','Outros','Acessórios sem correspondência nas categorias acima.']
];
function normalizarAcessorio(valor) {
 return String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
}
function categoriaAcessorio(a) {
 const nome=normalizarAcessorio(a.nome);
 // Peças de manutenção e reposição não são espumadores nem itens de reciclagem.
 if (/descalc|limpeza|pastilha|filtro|cappucc?in.*(kit|device)/.test(nome)) return 'outros';
 if (/aeroccino|espumador de leite/.test(nome)) return 'leite';
 // Porta-insumos acompanha açúcar e biscoitos no print do catálogo profissional.
 if (/chocolat|biscoit|cookie|shortbread|cantuccini|acucar|adocante|porta.?insumos/.test(nome)) return 'degustacao';
 if (/recicla/.test(nome)) return 'reciclagem';
 if (/porta.?capsul|drawer|showcase|discovery box|capsule box/.test(nome)) return 'dispensadores';
 // Tampas avulsas e acessórios de serviço não identificados ficam em Outros.
 if (/tampa|bandeja|tray|carafe|guardanapo/.test(nome)) return 'outros';
 if (/termic|travel|tumbler|xicara|pires|caneca|copo|taca|pixie|pure collection|mug|saucer|cups|mexedor|colher/.test(nome)) return 'xicaras';
 return 'outros';
}
function elementoAcessorio(tag, classe, texto) {
 const el=document.createElement(tag);el.className=classe || '';if(texto!=null)el.textContent=texto;return el;
}
function renderizarTabela() {
 const grid=document.getElementById('acessoriosTableBody');
 const nav=document.getElementById('categoriasNav');
 grid.replaceChildren();nav.replaceChildren();
 const termo=normalizarAcessorio(document.getElementById('searchInput').value.trim());
 const filtrados=acessorios.filter(a=>[a.nome,a.sku,a.tipo_embalagem,...CATEGORIAS_ACESSORIOS.find(c=>c[0]===categoriaAcessorio(a)).slice(1)].some(v=>normalizarAcessorio(v).includes(termo)));
 document.getElementById('acessoriosContagem').textContent=filtrados.length+' '+(filtrados.length===1?'acessório':'acessórios');
 if(!filtrados.length){grid.append(elementoAcessorio('p','pro-status','Nenhum acessório encontrado. Tente outro nome, SKU ou coleção.'));return;}
 for(const [slug,titulo,descricao] of CATEGORIAS_ACESSORIOS){
  const itens=filtrados.filter(a=>categoriaAcessorio(a)===slug);if(!itens.length)continue;
  const link=elementoAcessorio('a','pro-category-link',titulo);link.href='#acessorios-'+slug;nav.append(link);
  const section=elementoAcessorio('section','pro-category');section.id='acessorios-'+slug;section.setAttribute('aria-labelledby','titulo-'+slug);
  const banner=elementoAcessorio('header','pro-category-banner');
  const copy=elementoAcessorio('div','pro-category-copy');
  const heading=elementoAcessorio('h2','pro-category-title',titulo);heading.id='titulo-'+slug;
  copy.append(elementoAcessorio('span','pro-category-eyebrow','Nespresso Professional'),heading,elementoAcessorio('p','pro-category-description',descricao),elementoAcessorio('span','pro-category-count',itens.length+' acessórios'));
  banner.append(copy);const lista=elementoAcessorio('div','pro-grid');section.append(banner,lista);grid.append(section);
  for(const a of itens){
   const card=elementoAcessorio('article','pro-card');
   const foto=elementoAcessorio('div','pro-photo');
   const fallback=elementoAcessorio('span','pro-photo-fallback','N');fallback.setAttribute('aria-label','Foto indisponível');foto.append(fallback);
   const fontes=fotosAcessorio(a);if(fontes.length){const img=document.createElement('img');img.alt=a.nome || 'Acessório';img.loading='lazy';img.decoding='async';img.addEventListener('load',()=>fallback.hidden=true);img.addEventListener('error',()=>{if(fontes.length){img.src=fontes.shift();}else{img.remove();fallback.hidden=false;}});img.src=fontes.shift();foto.append(img);}
   const corpo=elementoAcessorio('div','pro-card-body');
   const qtd=parseInt(a.qtd_embalagem)||1;const preco=converterParaNumero(a.preco_embalagem);
   corpo.append(elementoAcessorio('span','pro-sku','SKU '+(a.sku||'—')),elementoAcessorio('h3','pro-name',a.nome||'Acessório'),elementoAcessorio('p','pro-pack',(a.tipo_embalagem||'Unidade')+' · '+qtd+' unid.'));
   const footer=elementoAcessorio('div','pro-card-footer');
   const valor=elementoAcessorio('div','pro-price');valor.append(elementoAcessorio('strong','',preco>0?'R$ '+formatarMoeda(preco):'Bonificação / S/V'),elementoAcessorio('span','','por embalagem'));
   footer.append(valor,elementoAcessorio('p','pro-pack',preco>0?'R$ '+formatarMoeda(preco/qtd)+' por unidade':'Sem valor de venda'));
   const detalhes=elementoAcessorio('button','btn pro-details','Ver detalhes e simular');detalhes.type='button';detalhes.setAttribute('aria-label','Ver detalhes e simular '+a.nome);detalhes.addEventListener('click',()=>visualizarAcessorio(a.id));footer.append(detalhes);
   const gestao=elementoAcessorio('div','pro-manage');
   for(const [label,acao,classe] of [['Editar',editarAcessorio,''],['Excluir',excluirAcessorio,'pro-delete']]){
    const botao=elementoAcessorio('button',classe,label);botao.type='button';botao.setAttribute('aria-label',label+' '+a.nome);botao.addEventListener('click',()=>acao(a.id));gestao.append(botao);
   }
   footer.append(gestao);corpo.append(footer);card.append(foto,corpo);lista.append(card);
  }
 }
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
        <div class="detail-item full-width" style="grid-column:span 2;text-align:center;background:#fff;">
            ${criarImagemAcessorio(a, true)}
        </div>
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
            <div class="detail-label">PREÇO (EMBALAGEM FECHADA)</div>
            <div class="detail-value" style="color: var(--success); font-weight: bold;">R$ ${formatarMoeda(precoEmbNum)}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">CUSTO UNITÁRIO (POR PEÇA)</div>
            <div class="detail-value">R$ ${formatarMoeda(precoUnidNum)}</div>
        </div>
        
        <!-- SIMULADOR DE CONVERSÃO DE PEDIDO -->
        <div class="detail-item full-width" style="grid-column: span 2; background: var(--field); border: 1px solid var(--brand); border-radius: 8px; padding: 14px; margin-top: 6px;">
            <div class="detail-label" style="color: var(--brand); font-weight: bold; margin-bottom: 10px;">🧮 SIMULADOR RÁPIDO PARA PEDIDO (EVITA ERRO DE CONTAGEM)</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: center;">
                <div>
                    <label style="font-size: 12px; color: var(--muted); display: block; margin-bottom: 4px;">Qtd de Embalagens/Caixas a pedir:</label>
                    <input type="number" id="simCaixasInput" value="1" min="1" oninput="simularPorCaixas()" style="width: 100%; padding: 8px; background: var(--surface); border: 1px solid var(--line); color: #fff; border-radius: 6px;">
                </div>
                <div>
                    <label style="font-size: 12px; color: var(--muted); display: block; margin-bottom: 4px;">Total de Peças/Unidades soltas:</label>
                    <input type="number" id="simUnidadesInput" value="${qtd}" min="1" step="${qtd}" oninput="simularPorUnidades()" style="width: 100%; padding: 8px; background: var(--surface); border: 1px solid var(--line); color: #fff; border-radius: 6px;">
                </div>
            </div>
            <div id="resultadoSimulacao" style="margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--surface); display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px; color: var(--muted);">Lançar no pedido: <strong style="color: var(--brand);">1 ${a.tipo_embalagem || 'Embalagem'}</strong> (${qtd} peças no total)</span>
                <span style="font-size: 16px; font-weight: bold; color: var(--success);">Total: R$ ${formatarMoeda(precoEmbNum)}</span>
            </div>
        </div>

        <div class="detail-item full-width" style="grid-column: span 2;">
            <div class="detail-label">OBSERVAÇÕES</div>
            <div class="detail-value" style="font-size: 13px; color: var(--muted);">${a.observacoes || 'Nenhuma observação cadastrada.'}</div>
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
        <span style="font-size: 13px; color: var(--muted);">Lançar no pedido: <strong style="color: var(--brand);">${caixas} ${itemSimulacaoAtual.tipo_embalagem || 'Embalagem(ns)'}</strong> (${totalUnidades} peças no total)</span>
        <span style="font-size: 16px; font-weight: bold; color: var(--success);">Total: R$ ${formatarMoeda(valorTotal)}</span>
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
        <span style="font-size: 13px; color: var(--muted);">Para atender ${unidadesDesejadas} unid., lance: <strong style="color: var(--brand);">${caixasNecessarias} ${itemSimulacaoAtual.tipo_embalagem || 'Embalagem(ns)'}</strong> (Total real: ${unidadesReais} peças)</span>
        <span style="font-size: 16px; font-weight: bold; color: var(--success);">Total: R$ ${formatarMoeda(valorTotal)}</span>
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

    if (supabaseClient) {
        const { error } = await supabaseClient
            .from('acessorios')
            .upsert([dadosAcessorio]);

        if (error) {
            alert('Erro ao salvar no Supabase (verifique se a tabela acessorios foi criada no SQL Editor): ' + error.message);
            return;
        }
    }

    fecharModal();
    carregarAcessoriosNuvem();
}

function editarAcessorio(id) {
    const item = acessorios.find(a => a.id === id);
    if (item) abrirModal(item);
}

async function excluirAcessorio(id) {
    if (confirm("Tem certeza que deseja excluir este acessório?")) {
        if (supabaseClient) {
            const { error } = await supabaseClient
                .from('acessorios')
                .delete()
                .eq('id', id);

            if (error) {
                alert('Erro ao excluir do banco de dados: ' + error.message);
                return;
            }
        }
        carregarAcessoriosNuvem();
    }
}

// Apresentação das fotos sem alterar os dados do acessório.
function criarImagemAcessorio(acessorio, detalhes = false) {
    const fontes = fotosAcessorio(acessorio);
    const foto = fontes.shift() || '';
    if (!foto) return '<span role="img" aria-label="Acessório sem foto" style="font-size:24px">🥄</span>';
    const imagem = document.createElement('img');
    imagem.src = foto;
    imagem.alt = String(acessorio.nome || 'Acessório Nespresso');
    imagem.width = detalhes ? 320 : 54;
    imagem.height = detalhes ? 320 : 54;
    imagem.loading = detalhes ? 'eager' : 'lazy';
    imagem.decoding = 'async';
    imagem.style.cssText = 'object-fit:contain;max-width:100%;border-radius:6px;background:#fff;vertical-align:middle;';
    if (fontes.length) imagem.dataset.fallback = fontes[0];
    imagem.setAttribute('onerror', "if(this.dataset.fallback){const src=this.dataset.fallback;delete this.dataset.fallback;this.src=src;}else{this.hidden=true;this.nextElementSibling.hidden=false;}");
    return imagem.outerHTML + '<span role="img" aria-label="Imagem indisponível" hidden style="font-size:24px">🥄</span>';
}
