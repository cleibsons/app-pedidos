'use strict';
let accountUser=null;
let loadingAccount=false;
if(supabaseClient)supabaseClient.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT')location.replace('login.html');});
async function carregarConta(){
 if(loadingAccount)return;loadingAccount=true;
 const status=document.getElementById('accountLoading');status.textContent='Carregando sua conta…';document.getElementById('accountRetry').hidden=true;
 try{
  if(!supabaseClient)throw Error('connection');
  const {data:sessionData,error:sessionError}=await supabaseClient.auth.getSession();
  if(sessionError)throw sessionError;
  if(!sessionData?.session){location.replace('login.html');return;}
  const {data,error}=await supabaseClient.auth.getUser();
  if(error){if(error.status===401||error.code==='session_not_found'||error.code==='refresh_token_not_found'){location.replace('login.html');return;}throw error;}
  if(!data?.user){location.replace('login.html');return;}
  accountUser=data.user;
  const meta=accountUser.user_metadata || {};
  document.getElementById('fullName').value=meta.full_name || meta.name || '';
  document.getElementById('contactPhone').value=meta.phone || meta.phone_number || accountUser.phone || '';
  document.getElementById('accountEmail').value=accountUser.email || '';
  document.getElementById('passwordEmail').value=accountUser.email || '';
  document.getElementById('profileFields').disabled=false;
  document.getElementById('passwordFields').disabled=false;
  renderAccountIdentity(accountUser);
  status.textContent='';
 }catch{status.textContent='Não foi possível carregar sua conta. Verifique a conexão e tente novamente.';document.getElementById('accountRetry').hidden=false;}
 finally{loadingAccount=false;}
}
function renderAccountIdentity(user){
 const name=user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Minha conta';
 document.getElementById('accountName').textContent=name;
 document.getElementById('accountAvatar').textContent=name.slice(0,2).toUpperCase();
 if(window.centralRenderProfile)window.centralRenderProfile(user);
}
document.addEventListener('DOMContentLoaded',()=>{
 bindPasswordToggles();
 document.getElementById('accountRetry').addEventListener('click',carregarConta);
 document.getElementById('profileForm').addEventListener('submit',async event=>{
  event.preventDefault();const form=event.currentTarget;if(form.getAttribute('aria-busy')==='true'||!accountUser)return;
  const full_name=document.getElementById('fullName').value.trim();
  const phone=document.getElementById('contactPhone').value.trim();
  if(!full_name){formMessage('profileMessage','Informe seu nome.');document.getElementById('fullName').focus();return;}
  const digits=phone.replace(/\D/g,'');
  if(phone && (!/^[+()\d\s.-]+$/.test(phone)||digits.length<10||digits.length>15)){formMessage('profileMessage','Informe um telefone com DDD, entre 10 e 15 dígitos.');document.getElementById('contactPhone').focus();return;}
  setBusy(form,true,'Salvar meus dados');formMessage('profileMessage','');
  document.getElementById('fullName').readOnly=true;document.getElementById('contactPhone').readOnly=true;
  try{
    const {data,error}=await supabaseClient.auth.updateUser({data:{full_name,phone}});
    if(error)throw error;if(!data?.user)throw Error('missing_user');
    accountUser=data.user;renderAccountIdentity(accountUser);
    formMessage('profileMessage','Seus dados foram atualizados.',true);
  }catch(error){formMessage('profileMessage',authMessage(error));}
  finally{setBusy(form,false,'Salvar meus dados');document.getElementById('fullName').readOnly=false;document.getElementById('contactPhone').readOnly=false;}
 });
 document.getElementById('passwordForm').addEventListener('submit',async event=>{
  event.preventDefault();const form=event.currentTarget;if(form.getAttribute('aria-busy')==='true'||!accountUser)return;
  const current=document.getElementById('currentPassword').value;
  const password=document.getElementById('newPassword').value;
  if(password!==document.getElementById('confirmPassword').value){formMessage('passwordMessage','A confirmação não corresponde à nova senha.');return;}
  if(password.length<8){formMessage('passwordMessage','Use pelo menos 8 caracteres.');return;}
  if(current===password){formMessage('passwordMessage','Escolha uma senha diferente da atual.');return;}
  setBusy(form,true,'Atualizar senha');formMessage('passwordMessage','');
  try{
   // Verify the current password without allowing an account switch.
   const {data:identity,error:identityError}=await supabaseClient.auth.signInWithPassword({email:accountUser.email,password:current});
   if(identityError)throw identityError;
   if(identity?.user?.id!==accountUser.id)throw Error('identity_mismatch');
   const attributes={password,current_password:current};
   const nonce=document.getElementById('securityCode').value.trim();if(nonce)attributes.nonce=nonce;
   const {data,error}=await supabaseClient.auth.updateUser(attributes);
   if(error)throw error;if(!data?.user)throw Error('missing_user');
   form.reset();document.getElementById('passwordEmail').value=accountUser.email || '';
   document.getElementById('nonceGroup').hidden=true;
   form.querySelectorAll('[data-password]').forEach(button=>{document.getElementById(button.dataset.password).type='password';button.textContent='Mostrar';button.setAttribute('aria-pressed','false');});
   formMessage('passwordMessage','Senha atualizada. Use a nova senha no próximo acesso.',true);
  }catch(error){
   if(['reauthentication_needed','reauthentication_not_valid'].includes(error.code)){
    document.getElementById('nonceGroup').hidden=false;
    formMessage('passwordMessage','Confirme a alteração com um código por e-mail. Clique em “Enviar código de confirmação”.');
   }else formMessage('passwordMessage',authMessage(error));
  }finally{setBusy(form,false,'Atualizar senha');}
 });
 document.getElementById('requestCode').addEventListener('click',async event=>{
  const button=event.currentTarget;button.disabled=true;
  try{const {error}=await supabaseClient.auth.reauthenticate();if(error)throw error;formMessage('passwordMessage','Código enviado. Digite o código e clique em Atualizar senha.',true);}
  catch(error){formMessage('passwordMessage',authMessage(error));}finally{button.disabled=false;}
 });
 carregarConta();
});

