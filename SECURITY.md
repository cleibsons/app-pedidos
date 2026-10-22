# Proteção de acesso da Central Nespresso

Em 22/10/2026 foi aplicada a migração Supabase `restrict_central_access_to_authorized_members`.

As tabelas `public.clientes`, `public.produtos_b2b`, `public.produtos_b2c` e `public.acessorios` usam RLS. Visitantes (`anon`) não têm privilégios nessas tabelas. Usuários autenticados precisam constar em `private.central_members` para ler, cadastrar, editar ou excluir registros. O cadastro de membros só pode ser administrado pelo proprietário do banco; o aplicativo não recebe permissão para conceder acesso. Privilégios de TRUNCATE e demais operações administrativas foram retirados do papel `authenticated`.

A única conta previamente existente e confirmada foi autorizada durante a migração. Novas contas do Supabase Auth não recebem acesso automaticamente. A lista de membros usa o ID de Auth e não depende de metadados que o usuário pode editar.

Validação: 12 cenários no banco verificaram bloqueio de visitantes, bloqueio de contas sem autorização e CRUD da conta autorizada nas quatro tabelas. Os testes ocorreram em transação revertida e não deixaram registros. A verificação de segurança do Supabase não apresentou mais erros de RLS. A proteção contra senhas vazadas continua sendo uma configuração separada do Supabase Auth.

[Documentação de RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
