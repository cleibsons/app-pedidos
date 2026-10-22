'use strict';
const SUPABASE_URL = 'https://awllwrltulzmjdcchlxs.supabase.co';
const SUPABASE_KEY = 'sb_publishable__Cj-tdVffbiigN0-YczRkw_eVLEUIMZ';
let supabaseClient;
if (typeof supabase !== 'undefined') supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const dashboardCatalogs = [
    {table:'clientes', id:'clientes',label:'Clientes',url:'clientes.html',icon:'users'},
    {table:'produtos_b2b',id:'b2b',label:'Cápsulas B2B',url:'produtos_b2b.html',icon:'cup'},
    {table:'produtos_b2c',id:'b2c',label:'Cápsulas B2C',url:'produtos_b2c.html',icon:'home'},
    {table:'acessorios',id:'acessorios',label:'Acessórios',url:'acessorios.html',icon:'box'}
];

async function carregarResumo() {
    const refresh=document.getElementById('refreshDashboard');
    const status=document.getElementById('dashboardStatus');
    refresh.disabled=true; status.textContent='Atualizando seus cadastros...';
    let failures=0;
    const counts={};
    await Promise.all(dashboardCatalogs.map(async catalog=>{
        const value=document.getElementById('count-'+catalog.id);
        const note=document.getElementById('note-'+catalog.id);
        value.textContent='…';
        try {
            const {count,error}=await supabaseClient.from(catalog.table).select('*',{count:'exact',head:true});
            if(error)throw error;
            if(typeof count!=='number')throw Error('Total indisponível');
            counts[catalog.id]=count;
            value.textContent=count.toLocaleString('pt-BR');
            note.textContent=count===1?'registro cadastrado':'registros cadastrados';
        } catch {
            failures++;value.textContent='—';note.textContent='Não foi possível consultar';
        }
    }));
    const body=document.getElementById('dashboardClients');
    body.replaceChildren();
    try {
        const {data,error}=await supabaseClient.from('clientes').select('id,nn,fantasia,razao,cidade').order('razao',{ascending:true}).limit(5);
        if(error)throw error;
        if(!data?.length) {
            const row=body.insertRow();const cell=row.insertCell();cell.colSpan=3;cell.className='empty-state';cell.textContent='Sua lista de clientes começa aqui. Cadastre seu primeiro cliente.';
        } else data.forEach(client=>{
            const row=body.insertRow();
            const cell=row.insertCell();const wrap=document.createElement('div');wrap.className='client-identity';
            const badge=document.createElement('span');badge.className='client-avatar';
            const name=client.fantasia && client.fantasia!=='EMPTY'?client.fantasia:client.razao || 'Cliente sem nome';
            badge.textContent=name.slice(0,2).toUpperCase();
            const info=document.createElement('div');const title=document.createElement('strong');title.textContent=name;
            const subtitle=document.createElement('small');subtitle.textContent=client.razao || '—';info.append(title,subtitle);wrap.append(badge,info);cell.append(wrap);
            row.insertCell().textContent=client.nn || '—';row.insertCell().textContent=client.cidade || '—';
        });
    } catch {
        failures++;const row=body.insertRow();const cell=row.insertCell();cell.colSpan=3;cell.className='empty-state';cell.textContent='Não foi possível consultar os clientes. Tente atualizar o painel.';
    }
    const totalIds=['b2b','b2c','acessorios'];
    const catalogOk=totalIds.every(id=>typeof counts[id]==='number');
    const total=catalogOk?totalIds.reduce((sum,id)=>sum+counts[id],0):null;
    document.getElementById('catalogTotal').textContent=total===null?'—':total.toLocaleString('pt-BR');
    for(const id of totalIds) {
        document.getElementById('bar-'+id).style.width=total?((counts[id]/total)*100)+'%':'0%';
        document.getElementById('legend-'+id).textContent=typeof counts[id]==='number'?counts[id].toLocaleString('pt-BR'):'—';
    }
    status.textContent=failures?'Alguns dados não puderam ser consultados. Use Atualizar para tentar novamente.':'Atualizado às '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})+'.';
    status.classList.toggle('status-error',failures>0);
    refresh.disabled=false;
}

document.addEventListener('DOMContentLoaded',async()=>{
    const now=new Date();
    document.getElementById('dashboardDate').textContent=new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(now);
    const hour=now.getHours();document.getElementById('greetingTime').textContent=hour<12?'Bom dia':hour<18?'Boa tarde':'Boa noite';
    document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=window.centralIcon(el.dataset.icon));
    try {
        if(!supabaseClient)throw Error('Conexão indisponível');
        const {data,error}=await supabaseClient.auth.getSession();if(error)throw error;
        if(!data.session){location.replace('login.html');return;}
        document.getElementById('refreshDashboard').addEventListener('click',carregarResumo);
        await carregarResumo();
    } catch {
        location.replace('login.html');
    }
});
