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

let clientes = [];
let formInicial='';
let salvando=false;
const assinaturaForm=()=>JSON.stringify(Array.from(new FormData(document.getElementById('clienteForm')).entries()));

document.addEventListener("DOMContentLoaded", async () => {
    if (await protegerPagina()) {
        await carregarClientesNuvem();
    }
});

/* CARREGAR CLIENTES DA NUVEM */
async function carregarClientesNuvem() {
    const tbody = document.getElementById('clientesTableBody');
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--muted); padding: 24px;">🔄 Carregando clientes da nuvem...</td></tr>`;

    if (!supabaseClient) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--danger); padding: 24px;">❌ Erro ao conectar com o Supabase.</td></tr>`;
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('clientes')
            .select('*');

        if (error) {
            console.error('Erro ao buscar clientes:', error);
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--danger); padding: 24px;">❌ Erro ao carregar dados: ${error.message}</td></tr>`;
            return;
        }

        clientes = data || [];
        renderizarTabela();
    } catch (err) {
        console.error('Erro de conexão:', err);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--danger); padding: 24px;">❌ Falha na conexão com a nuvem.</td></tr>`;
    }
}


let paginaAtual=1;
const tamanhoPagina=20;
const texto = value => (!value || value === 'EMPTY') ? '' : String(value);
const normalizar = value => texto(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const escapar = value => texto(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function aviso(mensagem) { const el=document.getElementById('clientNotice');el.textContent=mensagem;el.hidden=!mensagem; }
function renderizarTabela() {
 const tbody=document.getElementById('clientesTableBody');
 const cidadeSelect=document.getElementById('cidadeFiltro');
 const selecionada=cidadeSelect.value;
 const cidades=[...new Set(clientes.map(c=>texto(c.cidade)).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 cidadeSelect.innerHTML='<option value="">Todas as cidades</option>'+cidades.map(c=>'<option value="'+escapar(c)+'">'+escapar(c)+'</option>').join('');
 cidadeSelect.value=selecionada;
 const termo=normalizar(document.getElementById('searchInput').value);
 const semTelefone=document.getElementById('contatoFiltro').value==='sem';
 const ordem=document.getElementById('ordemFiltro').value;
 const digitos=termo.replace(/\D/g,'');
 const filtrados=clientes.filter(c=>{
   const campos=[c.nn,c.fantasia,c.razao,c.cnpj,c.contato,c.telefone];
   const encontrou=campos.some(v=>normalizar(v).includes(termo)) ||
     (!!digitos && /^[\d\s()./+\-]+$/.test(termo) && [c.cnpj,c.telefone].some(v=>texto(v).replace(/\D/g,'').includes(digitos)));
   return encontrou && (!selecionada||texto(c.cidade)===selecionada) && (!semTelefone||!texto(c.telefone).trim());
 }).sort((a,b)=>ordem==='recente' ? (Date.parse(b.created_at)||0)-(Date.parse(a.created_at)||0) : (texto(a.fantasia)||texto(a.razao)).localeCompare(texto(b.fantasia)||texto(b.razao),'pt-BR'));
 const paginas=Math.max(1,Math.ceil(filtrados.length/tamanhoPagina));
 paginaAtual=Math.min(paginaAtual,paginas);
 const inicio=(paginaAtual-1)*tamanhoPagina;
 tbody.innerHTML='';
 filtrados.slice(inicio,inicio+tamanhoPagina).forEach(c=>{
   const tr=document.createElement('tr');
   tr.innerHTML='<td><button class="client-open" data-action="ver"><span class="client-name">'+escapar(texto(c.fantasia)||c.razao||'Sem nome')+'</span><span class="client-sub">'+escapar(c.razao)+'</span></button></td>'+
   '<td data-label="NN">'+escapar(c.nn)+'</td><td data-label="CNPJ">'+escapar(c.cnpj)+'</td>'+
   '<td data-label="Cidade / Bairro">'+escapar(c.cidade||'Não informado')+'<small class="client-sub">'+escapar(c.bairro)+'</small></td>'+
   '<td data-label="Contato">'+escapar(c.contato||'Não informado')+'<small class="client-sub">'+escapar(c.telefone)+'</small></td>'+
   '<td><div class="row-actions"><button class="btn btn-view" data-action="ver">Ver</button><button class="btn btn-edit" data-action="editar">Editar</button><details><summary aria-label="Mais ações">•••</summary><button class="btn btn-danger" data-action="excluir">Excluir</button></details></div></td>';
   tr.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
      const action=button.dataset.action;
      if(action==='ver')visualizarCliente(c.id);
      if(action==='editar')editarCliente(c.id);
      if(action==='excluir')excluirCliente(c.id);
   }));tbody.appendChild(tr);
 });
 if(!filtrados.length)tbody.innerHTML='<tr><td colspan="6">Nenhum cliente encontrado. Tente outro termo ou limpe os filtros.</td></tr>';
 document.getElementById('clientCount').textContent=filtrados.length+' de '+clientes.length+' clientes';
 document.getElementById('pageSummary').textContent=filtrados.length ? 'Mostrando '+(inicio+1)+'–'+Math.min(inicio+tamanhoPagina,filtrados.length)+' de '+filtrados.length : '0 resultados';
 document.getElementById('prevPage').disabled=paginaAtual<=1;
 document.getElementById('nextPage').disabled=paginaAtual>=paginas;
}
function filtrarClientes(){paginaAtual=1;renderizarTabela();}
function mudarPagina(delta){paginaAtual+=delta;renderizarTabela();}
function limparFiltros(){['searchInput','cidadeFiltro','contatoFiltro'].forEach(id=>document.getElementById(id).value='');document.getElementById('ordemFiltro').value='nome';filtrarClientes();}

/* VISUALIZAR DETALHES */

function visualizarCliente(id){
 const c=clientes.find(item=>item.id===id);if(!c)return;
 const campos=[['NN',c.nn],['CNPJ',c.cnpj],['Nome fantasia',c.fantasia],['Razão social',c.razao],['Contato',c.contato],['Telefone / WhatsApp',c.telefone],['Endereço',c.endereco],['Bairro',c.bairro],['Cidade / UF',c.cidade],['CEP',c.cep]];
 const el=document.getElementById('detalhesConteudo');
 el.innerHTML=campos.map(([label,value])=>'<div class="detail-item"><div class="detail-label">'+label+'</div><div class="detail-value">'+escapar(texto(value)||'Não informado')+'</div></div>').join('');
 const actions=document.createElement('div');actions.className='detail-actions';actions.style.gridColumn='1 / -1';
 [['Copiar CNPJ',c.cnpj],['Copiar NN',c.nn]].forEach(([label,value])=>{
 const b=document.createElement('button');b.className='btn btn-secondary';b.textContent=label;b.disabled=!texto(value);
 b.onclick=async()=>{try{await navigator.clipboard.writeText(texto(value));b.textContent='Copiado';}catch{b.textContent='Não foi possível copiar';}};actions.appendChild(b);
 });
 const numero=texto(c.telefone).replace(/\D/g,'');
 if(numero.length>=10 && numero.length<=13){
 const a=document.createElement('a');a.className='btn btn-primary';a.textContent='WhatsApp';a.target='_blank';a.rel='noopener noreferrer';
 a.href='https://wa.me/'+((numero.length===10||numero.length===11)?'55':'')+numero;actions.appendChild(a);
 }
 const edit=document.createElement('button');edit.className='btn btn-edit';edit.textContent='Editar cliente';edit.onclick=()=>{fecharModalDetalhes();editarCliente(c.id);};actions.appendChild(edit);
 
 const historyLink=document.createElement('a');historyLink.className='btn btn-primary';historyLink.href='historico.html?cliente='+encodeURIComponent(c.id);historyLink.textContent='Histórico de vendas';actions.appendChild(historyLink);
 el.appendChild(actions);
 const historyBox=document.createElement('section');historyBox.className='detail-item';historyBox.style.gridColumn='1 / -1';historyBox.textContent='Carregando histórico de cápsulas…';el.appendChild(historyBox);
 const currentMonth=CentralSales.today().slice(0,7),year=currentMonth.slice(0,4);
 CentralSales.all('vendas_saldos_mensais','mes,saldo',q=>q.eq('cliente_id',c.id).gte('mes',year+'-01-01').lt('mes',(Number(year)+1)+'-01-01').order('mes')).then(rows=>{
  if(!historyBox.isConnected)return;
  const monthBalance=Number(rows.find(r=>r.mes===currentMonth+'-01')?.saldo||0),annual=rows.filter(r=>r.mes<=currentMonth+'-01').reduce((n,r)=>n+Number(r.saldo),0);
  historyBox.replaceChildren();const title=document.createElement('h3');title.textContent='Histórico de cápsulas';title.style.fontSize='15px';
  const summary=document.createElement('p');summary.textContent=CentralSales.monthTitle(currentMonth)+': '+CentralSales.num(monthBalance)+' cápsulas · '+(monthBalance>0?'Positivado':'A positivar');
  const total=document.createElement('p');total.textContent='Acumulado no ano até este mês: '+CentralSales.num(annual)+' cápsulas';total.style.marginTop='9px';
  const link=document.createElement('a');link.href=historyLink.href;link.className='text-link';link.textContent='Ver meses, pedidos e devoluções';historyBox.append(title,summary,total,link);
 }).catch(()=>{if(historyBox.isConnected)historyBox.textContent='Não foi possível carregar o histórico. Use Histórico de vendas para tentar novamente.';});
 document.getElementById('detalhesModal').style.display='flex';
 document.querySelector('#detalhesModal .close-btn').focus();
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
 if(salvando)return false;
 if(formAlterado() && !confirm('Descartar as alterações não salvas?'))return false;
 document.getElementById('clienteModal').style.display='none';
 document.getElementById('clienteForm').reset();formInicial='';return true;
}

async function salvarCliente(e) {
    e.preventDefault();
    if(salvando)return;
    const id = document.getElementById('clienteId').value;
    document.getElementById('formStatus').textContent='';

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

    const button=document.querySelector('#clienteForm button[type=submit]');
    salvando=true;button.disabled=true;button.textContent='Salvando…';
    try {
    const { error, data } = id
      ? await supabaseClient.from('clientes').update(Object.fromEntries(Object.entries(dadosCliente).filter(([key])=>key!=='id'))).eq('id',parseInt(id)).select('id')
      : await supabaseClient.from('clientes').insert([dadosCliente]).select('id');
    if(!error && (!data || data.length!==1))throw Error('O salvamento não foi confirmado. Verifique seu acesso e tente novamente.');


    if (error) {
        document.getElementById('formStatus').textContent='Não foi possível salvar: '+error.message;
    } else {
        formInicial='';salvando=false;fecharModal();
        aviso('Cliente salvo com sucesso.');
        await carregarClientesNuvem();
    }
    } catch(error){document.getElementById('formStatus').textContent='Não foi possível salvar: '+error.message;}
    finally{salvando=false;button.disabled=false;button.textContent='Salvar cliente';}
}

function editarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (cliente) abrirModal(cliente);
}

async function excluirCliente(id) {
    if (confirm("Excluir permanentemente este cliente? Esta ação não pode ser desfeita pela página.")) {
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

function valoresForm(){return JSON.stringify(Array.from(document.querySelectorAll('#clienteForm input')).map(el=>[el.id,el.value]));}
function formAlterado(){return !!formInicial && formInicial!==valoresForm();}
const abrirOriginal=abrirModal;
abrirModal=function(cliente=null){abrirOriginal(cliente);formInicial=valoresForm();document.getElementById('nnInput').focus();};
document.addEventListener('click',event=>{
 const modal=document.getElementById('clienteModal');
 if(event.target===modal){event.stopImmediatePropagation();fecharModal();}
},true);
document.addEventListener('keydown',event=>{
 if(event.key==='Escape' && document.getElementById('clienteModal').style.display==='flex'){
 event.preventDefault();event.stopImmediatePropagation();fecharModal();
 }
},true);
window.addEventListener('beforeunload',event=>{if(formAlterado()||salvando){event.preventDefault();event.returnValue='';}});

document.addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const modal=Array.from(document.querySelectorAll('.modal')).find(el=>el.style.display==='flex');
 if(!modal)return;
 const controls=Array.from(modal.querySelectorAll('button:not(:disabled),a[href],input:not([type=hidden]),select,textarea')).filter(el=>el.getClientRects().length);
 const first=controls[0],last=controls[controls.length-1];
 if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
 else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
});


