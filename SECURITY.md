# Proteção de acesso da Central Nespresso

Em 22/10/2026 foi aplicada a migração Supabase `restrict_central_access_to_authorized_members`.

As tabelas `public.clientes`, `public.produtos_b2b`, `public.produtos_b2c` e `public.acessorios` usam RLS. Visitantes (`anon`) não têm privilégios nessas tabelas. Usuários autenticados precisam constar em `private.central_members` para ler, cadastrar, editar ou excluir registros. O cadastro de membros só pode ser administrado pelo proprietário do banco; o aplicativo não recebe permissão para conceder acesso. Privilégios de TRUNCATE e demais operações administrativas foram retirados do papel `authenticated`.

A única conta previamente existente e confirmada foi autorizada durante a migração. Novas contas do Supabase Auth não recebem acesso automaticamente. A lista de membros usa o ID de Auth e não depende de metadados que o usuário pode editar.

Validação: 12 cenários no banco verificaram bloqueio de visitantes, bloqueio de contas sem autorização e CRUD da conta autorizada nas quatro tabelas. Os testes ocorreram em transação revertida e não deixaram registros. A verificação de segurança do Supabase não apresentou mais erros de RLS. A proteção contra senhas vazadas continua sendo uma configuração separada do Supabase Auth.

[Documentação de RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)

## Histórico de cápsulas e pedidos

O histórico importado é somente leitura para o aplicativo. As tabelas historico_importacoes, historico_mensal, vendas_pedidos, vendas_devolucoes e vendas_metas usam RLS com a mesma lista private.central_members. A view vendas_saldos_mensais executa com security_invoker. Visitantes não recebem acesso.

As quantidades de cápsulas e os valores dos pedidos detalhados são calculados no banco a partir das caixas e dos catálogos. O registro preserva nome, SKU, tamanho da caixa e preço daquele pedido. Acessórios não somam cápsulas. O aplicativo só pode atualizar número externo ou cancelar um lançamento com motivo, preservando os dados originais. Devoluções vinculadas não podem superar a venda e precisam corresponder ao mesmo cliente.

Cada lançamento usa um UUID persistido no rascunho para tornar a repetição de gravação idempotente. O número externo é único e pode ser preenchido depois, sem criar outra venda. Dados importados até 22/10/2026 são saldos líquidos mensais; lançamentos retroativos exigem conferência explícita e observação para evitar sobreposição. Clientes positivados têm saldo maior que zero no mês. A meta de outubro de 2026 é 37 e pode ser ajustada por mês.

O arquivo database/sales-history.sql documenta a estrutura aplicada pela migração remota sales_history_orders_returns_and_targets. Dados da planilha e clientes não são incluídos no repositório público.

