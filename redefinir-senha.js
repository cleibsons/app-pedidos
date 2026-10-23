'use strict';
let validReset=false;
async function validarLink(){
 try{
  if(!supabaseClient)throw Error('connection');
  const params=new URLSearchParams(location.hash.slice(1));
  const query=new URLSearchParams(location.search);
  if(params.has('error')||query.has('error'))throw {code:'otp_expired'};
  const {data,error}=await supabaseClient.auth.getUser();if(error)throw error;
  if(!data?.user || sessionStorage.getItem('central-password-recovery')!=='1')throw {code:'otp_expired'};
  validReset=true;document.getElementById('resetEmail').value=data.user.email||'';
  document.getElementById('resetForm').hidden=false;formMessage('resetStatus','');
  document.getElementById('resetPassword').focus();
  history.replaceState(null,'',location.pathname);
 }catch(error){
  sessionStorage.removeItem('central-password-recovery');
  formMessage('resetStatus',error?.message==='connection'?'Não foi possível conectar. Recarregue a página e tente novamente.':'Este link é inválido, expirou ou já foi usado. Solicite um novo link por e-mail.');
  document.getElementById('resetLoginLink').hidden=false;
  history.replaceState(null,'',location.pathname);
 }
}
bindPasswordToggles();
document.getElementById('resetForm').addEventListener('submit',async event=>{
 event.preventDefault();const form=event.currentTarget;if(!validReset||form.getAttribute('aria-busy')==='true')return;
 const password=document.getElementById('resetPassword').value;
 if(password!==document.getElementById('resetConfirm').value){formMessage('resetStatus','A confirmação não corresponde à nova senha.');return;}
 if(password.length<8){formMessage('resetStatus','Use pelo menos 8 caracteres.');return;}
 setBusy(form,true,'Salvar nova senha');
 try{
  const {data,error}=await supabaseClient.auth.updateUser({password});if(error)throw error;if(!data?.user)throw Error('missing_user');
  form.reset();form.hidden=true;validReset=false;sessionStorage.removeItem('central-password-recovery');
  formMessage('resetStatus','Senha atualizada. Seu próximo acesso já pode ser feito com a nova senha.',true);
  document.getElementById('resetContinue').hidden=false;
 }catch(error){formMessage('resetStatus',authMessage(error));}
 finally{setBusy(form,false,'Salvar nova senha');}
});
validarLink();

