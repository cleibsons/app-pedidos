'use strict';
const SUPABASE_URL='https://awllwrltulzmjdcchlxs.supabase.co';
const SUPABASE_KEY='sb_publishable__Cj-tdVffbiigN0-YczRkw_eVLEUIMZ';
let supabaseClient;
try { if(typeof supabase!=='undefined')supabaseClient=supabase.createClient(SUPABASE_URL,SUPABASE_KEY); } catch { /* Forms show a connection error. */ }
function authMessage(error) {
 const code=error?.code || '';
 if(code==='invalid_credentials')return 'Senha atual incorreta. Tente novamente.';
 if(code==='weak_password')return 'A senha não atende aos requisitos. Use uma senha mais forte, com letras, números e símbolos.';
 if(code==='same_password')return 'Escolha uma senha diferente da atual.';
 if(code==='reauthentication_not_valid')return 'Código inválido ou expirado. Solicite outro código.';
 if(code==='session_not_found'||code==='refresh_token_not_found'||error?.status===401)return 'Sua sessão expirou. Entre novamente para continuar.';
 if(error?.status===429||code.includes('rate_limit'))return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
 if(code==='otp_expired'||code==='otp_disabled')return 'O link expirou ou já foi utilizado. Solicite um novo link.';
 return 'Não foi possível concluir. Verifique sua conexão e tente novamente.';
}
function formMessage(id,text,ok=false){const el=document.getElementById(id);el.textContent=text;el.classList.toggle('message-success',ok);}
function setBusy(form,busy,label){const button=form.querySelector('[type=submit]');button.disabled=busy;button.textContent=busy?'Aguarde…':label;form.setAttribute('aria-busy',String(busy));}
function bindPasswordToggles(){document.querySelectorAll('[data-password]').forEach(button=>button.addEventListener('click',()=>{const input=document.getElementById(button.dataset.password);const show=input.type==='password';input.type=show?'text':'password';button.textContent=show?'Ocultar':'Mostrar';button.setAttribute('aria-pressed',String(show));}));}
if(supabaseClient) supabaseClient.auth.onAuthStateChange(event=>{
 if(event==='SIGNED_OUT')sessionStorage.removeItem('central-password-recovery');
 if(event==='PASSWORD_RECOVERY'){
   sessionStorage.setItem('central-password-recovery','1');
   if(!location.pathname.endsWith('/redefinir-senha.html'))location.replace('redefinir-senha.html');
 }
});

