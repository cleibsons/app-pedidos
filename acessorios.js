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
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #64748b; padding: 24px;">🔄 Carregando acessórios da nuvem...</td></tr>`;

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
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #60a5fa; padding: 24px;">⚡ Sincronizando catálogo inicial de acessórios com o Supabase...</td></tr>`;
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
            <div class="detail-label">PREÇO (EMBALAGEM FECHADA)</div>
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
