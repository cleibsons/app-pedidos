        function mensagemErroLogin(error) {
            if (error.code === 'invalid_credentials') return 'E-mail ou senha incorretos.';
            if (error.code === 'email_not_confirmed') return 'Confirme seu e-mail antes de entrar.';
            if (error.status === 429) return 'Muitas tentativas. Aguarde um pouco e tente novamente.';
            if (error.code === 'email_provider_disabled') return 'O acesso por e-mail está desativado no Supabase.';
            if (error.status === 401 || error.status === 403) return 'Acesso recusado pelo Supabase. Verifique a configuração do projeto e da chave pública.';
            return 'Não foi possível entrar. Verifique sua conexão e tente novamente.';
        }

        async function realizarLogin(event) {
            event.preventDefault();
            const botao = document.querySelector('.btn-entrar');
            if (botao.disabled) return;
            const erroMsg = document.getElementById('erroMsg');
            const email = document.getElementById('emailInput').value.trim();
            const senha = document.getElementById('senhaInput').value;
            botao.disabled = true;
            erroMsg.textContent = 'Autenticando...';

            try {
                if (!supabaseClient) {
                    erroMsg.textContent = 'Não foi possível iniciar a conexão. Recarregue a página e verifique sua internet.';
                    return;
                }
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email,
                    password: senha
                });
                if (error) {
                    erroMsg.textContent = mensagemErroLogin(error);
                    return;
                }
                if (!data?.session) {
                    erroMsg.textContent = 'O Supabase não retornou uma sessão. Tente entrar novamente.';
                    return;
                }
                window.location.replace('index.html');
            } catch (error) {
                erroMsg.textContent = 'Não foi possível conectar ao Supabase. Verifique sua internet e tente novamente.';
            } finally {
                botao.disabled = false;
            }
        }
    
function mostrarRecuperacao(ativo){
 document.getElementById('loginForm').hidden=ativo;
 document.getElementById('recoveryForm').hidden=!ativo;
 document.getElementById('loginHeading').textContent=ativo?'Recuperar senha':'Bem-vindo de volta.';
 document.getElementById('loginIntro').textContent=ativo?'Receba um link no seu e-mail para escolher uma nova senha.':'Entre para acessar seus clientes, catálogos e pedidos.';
 if(ativo){document.getElementById('recoveryEmail').value=document.getElementById('emailInput').value;document.getElementById('recoveryEmail').focus();}
 else document.getElementById('emailInput').focus();
}
document.getElementById('forgotPassword').addEventListener('click',()=>mostrarRecuperacao(true));
document.getElementById('backToLogin').addEventListener('click',()=>mostrarRecuperacao(false));
document.getElementById('recoveryForm').addEventListener('submit',async event=>{
 event.preventDefault();const form=event.currentTarget;if(form.getAttribute('aria-busy')==='true')return;
 setBusy(form,true,'Enviar link de recuperação');formMessage('recoveryMessage','');
 try{
  if(!supabaseClient)throw Error('connection');
  const redirectTo=new URL('redefinir-senha.html',location.href).href;
  const {error}=await supabaseClient.auth.resetPasswordForEmail(document.getElementById('recoveryEmail').value.trim(),{redirectTo});
  if(error)throw error;
  formMessage('recoveryMessage','Se este e-mail estiver cadastrado, você receberá um link para redefinir sua senha. Confira também a pasta de spam.',true);
 }catch(error){formMessage('recoveryMessage',authMessage(error));}
 finally{setBusy(form,false,'Enviar link de recuperação');}
});
if(new URLSearchParams(location.search).get('recuperar')==='1')mostrarRecuperacao(true);
bindPasswordToggles();

