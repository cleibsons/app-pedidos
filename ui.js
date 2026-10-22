(() => {
    'use strict';
    const icons = {
        grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
        users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M15 3a4 4 0 0 1 0 8"/><circle cx="9" cy="7" r="4"/>',
        cup: '<path d="M18 8h1a3 3 0 1 1 0 6h-1M3 8h15v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM6 2v2m4-2v2m4-2v2"/>',
        home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-8h6v8"/>',
        box: '<path d="m12 3 9 5v9l-9 5-9-5V8Zm0 9L3 8m9 4 9-4m-9 4v10M7.5 5.5l9 5"/>',
        bag: '<path d="M5 7h14l2 14H3ZM9 8V6a3 3 0 0 1 6 0v2"/>',
        search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
        arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
        logout: '<path d="M9 21H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5m7 14 5-5-5-5m-7 5h12"/>',
        menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
        plus: '<path d="M12 5v14M5 12h14"/>',
        check: '<path d="m5 12 4 4L19 6"/>',
        clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 6a8 8 0 0 1 13 3M5 15a8 8 0 0 0 13 3"/>'
    };
    const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.grid}</svg>`;
    window.centralIcon = icon;
    const routes = [
        ['index.html', 'Visão geral', 'grid', 'PRINCIPAL'],
        ['pedidos.html', 'Novo pedido', 'bag', 'OPERAÇÃO'],
        ['clientes.html', 'Clientes', 'users', ''],
        ['produtos_b2b.html', 'Cápsulas B2B', 'cup', 'CATÁLOGOS'],
        ['produtos_b2c.html', 'Cápsulas B2C', 'home', ''],
        ['acessorios.html', 'Acessórios', 'box', '']
    ];
    const current = location.pathname.split('/').pop() || 'index.html';
    const page = routes.find(r => r[0] === current) || routes[0];
    let links = '';
    routes.forEach(([href,label,symbol,group]) => {
        if (group) links += `<p class="nav-label">${group}</p>`;
        links += `<a href="${href}" class="side-link${current === href ? ' active' : ''}"${current === href ? ' aria-current="page"' : ''}>${icon(symbol)}<span>${label}</span>${current === href ? '<span class="nav-dot"></span>' : ''}</a>`;
    });
    document.body.insertAdjacentHTML('afterbegin', `
        <a class="skip-link" href="#mainContent">Ir para o conteúdo</a>
        <aside class="sidebar" id="sidebar" aria-label="Menu principal">
            <a class="brand" href="index.html" aria-label="Central Nespresso — início"><span class="brand-lockup"><img class="brand-logo" src="https://logospng.org/wp-content/uploads/nespresso.png" alt="Nespresso" referrerpolicy="no-referrer" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="brand-fallback" hidden>NESPRESSO</span><small>CENTRAL DE PEDIDOS</small></span></a>
            <nav aria-label="Navegação principal">${links}</nav>
            <div class="sidebar-bottom"><div class="workspace-note">${icon('check')}<div>Seu espaço de trabalho<small>Clientes, catálogos e pedidos</small></div></div><button class="side-link logout-btn" id="logoutButton">${icon('logout')}<span>Sair da conta</span></button></div>
        </aside>
        <button class="sidebar-overlay" id="sidebarOverlay" aria-label="Fechar menu" hidden></button>
        <header class="topbar"><div class="topbar-left"><button class="icon-button menu-toggle" id="menuToggle" aria-controls="sidebar" aria-expanded="false" aria-label="Abrir menu">${icon('menu')}</button><span class="breadcrumb">Workspace <span>/</span> <strong>${page[1]}</strong></span></div>
            <form class="global-search" action="clientes.html" method="get" role="search">${icon('search')}<input name="q" type="search" aria-label="Buscar clientes" placeholder="Buscar cliente por nome, CNPJ ou NN..."><kbd>↵</kbd></form>
            <div class="profile"><span class="avatar" id="profileAvatar">N</span><div><strong id="profileName">Minha conta</strong><small>Central Nespresso</small></div></div>
        </header>`);
    const main = document.querySelector('.container');
    if (main) { main.id = 'mainContent'; main.setAttribute('role','main'); main.setAttribute('tabindex','-1'); }
    const toggle = document.getElementById('menuToggle');
    const overlay = document.getElementById('sidebarOverlay');
    function setMenu(open) { document.body.classList.toggle('menu-open',open); toggle.setAttribute('aria-expanded',String(open)); overlay.hidden = !open; }
    toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    overlay.addEventListener('click', () => setMenu(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(false); document.querySelectorAll('.modal').forEach(m=>m.style.display='none'); } });
    // Busca global reaproveita os filtros já existentes em clientes.html.
    const search = document.getElementById('searchInput');
    if (search) { search.setAttribute('aria-label','Pesquisar nesta página'); const query = new URLSearchParams(location.search).get('q'); if (current === 'clientes.html' && query) search.value = query; }
    document.querySelectorAll('label').forEach(label => { const control=label.parentElement.querySelector('input,select,textarea'); if(control?.id) label.htmlFor=control.id; });
    document.querySelectorAll('.close-btn').forEach(button=>button.setAttribute('aria-label','Fechar janela'));
    document.querySelectorAll('.modal').forEach(modal => { modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); const h=modal.querySelector('h2'); if(h) {if(!h.id)h.id=modal.id+'Title';modal.setAttribute('aria-labelledby',h.id);} modal.addEventListener('click',e=>{if(e.target===modal)modal.style.display='none';}); });
    // Mantém a navegação por teclado nos seletores de canal existentes.
    document.querySelectorAll('.canal-card').forEach(card => { card.tabIndex=0;card.setAttribute('role','button');card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click();}}); });
    document.getElementById('logoutButton').addEventListener('click', async event => {
        const button=event.currentTarget;button.disabled=true;
        try { if(typeof supabaseClient==='undefined'||!supabaseClient)throw Error('Sem conexão'); const {error}=await supabaseClient.auth.signOut();if(error)throw error;location.replace('login.html'); }
        catch { alert('Não foi possível sair. Verifique sua conexão e tente novamente.');button.disabled=false; }
    });
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            if(typeof supabaseClient==='undefined'||!supabaseClient)return;
            const {data,error}=await supabaseClient.auth.getSession(); if(error||!data.session)return;
            const user=data.session.user;
            const name=user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Minha conta';
            document.getElementById('profileName').textContent=name;
            document.getElementById('profileAvatar').textContent=name.slice(0,2).toUpperCase();
            const greeting=document.getElementById('greetingName');if(greeting)greeting.textContent=name;
        } catch { /* A proteção de sessão da página trata falhas de acesso. */ }
    });
})();
