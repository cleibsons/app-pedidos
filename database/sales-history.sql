
create table public.historico_importacoes (
 id text primary key,
 arquivo text not null,
 ano integer not null check (ano between 2000 and 2100),
 data_corte date not null,
 total_capsulas bigint not null,
 linhas integer not null,
 criado_em timestamptz not null default now()
);
create table public.historico_mensal (
 importacao_id text not null references public.historico_importacoes(id) on delete restrict,
 cliente_id bigint not null references public.clientes(id) on delete restrict,
 mes date not null check (extract(day from mes)=1),
 saldo_capsulas bigint not null,
 linha_origem integer not null,
 primary key(cliente_id,mes),
 unique(importacao_id,linha_origem,mes)
);
create index historico_mensal_importacao_idx on public.historico_mensal(importacao_id);
create index historico_mensal_mes_idx on public.historico_mensal(mes);
create table public.vendas_pedidos (
 id uuid primary key,
 codigo bigint generated always as identity unique,
 cliente_id bigint not null references public.clientes(id) on delete restrict,
 data_venda date not null,
 canal text not null check(canal in ('whatsapp','email','manual')),
 origem text not null check(origem in ('compositor','manual')),
 itens jsonb not null default '[]' check(jsonb_typeof(itens)='array'),
 capsulas_informadas integer check(capsulas_informadas>0),
 capsulas integer not null default 0 check(capsulas>=0),
 total_centavos bigint check(total_centavos>=0),
 numero_externo text check(length(numero_externo) between 1 and 80),
 observacao text not null default '' check(length(observacao)<=2000),
 conferencia_importacao boolean not null default false,
 cancelado boolean not null default false,
 motivo_cancelamento text,
 criado_por uuid not null default auth.uid() references auth.users(id),
 criado_em timestamptz not null default now(),
 atualizado_em timestamptz not null default now(),
 numeros_historico jsonb not null default '[]'
);
create unique index vendas_pedidos_numero_idx on public.vendas_pedidos(lower(btrim(numero_externo))) where numero_externo is not null;
create index vendas_pedidos_cliente_data_idx on public.vendas_pedidos(cliente_id,data_venda);
create index vendas_pedidos_data_idx on public.vendas_pedidos(data_venda);
create index vendas_pedidos_criador_idx on public.vendas_pedidos(criado_por);
create table public.vendas_devolucoes (
 id uuid primary key,
 cliente_id bigint not null references public.clientes(id) on delete restrict,
 data_devolucao date not null,
 capsulas integer not null check(capsulas>0),
 pedido_id uuid references public.vendas_pedidos(id) on delete restrict,
 referencia text not null default '' check(length(referencia)<=120),
 observacao text not null check(length(btrim(observacao)) between 3 and 2000),
 conferencia_importacao boolean not null default false,
 cancelado boolean not null default false,
 motivo_cancelamento text,
 criado_por uuid not null default auth.uid() references auth.users(id),
 criado_em timestamptz not null default now(),
 atualizado_em timestamptz not null default now()
);
create index vendas_devolucoes_cliente_data_idx on public.vendas_devolucoes(cliente_id,data_devolucao);
create index vendas_devolucoes_pedido_idx on public.vendas_devolucoes(pedido_id);
create index vendas_devolucoes_criador_idx on public.vendas_devolucoes(criado_por);
create table public.vendas_metas (
 mes date primary key check(extract(day from mes)=1),
 meta_positivacao integer not null check(meta_positivacao between 0 and 100000)
);
insert into public.vendas_metas(mes,meta_positivacao) values ('2026-10-01',37);

alter table public.historico_importacoes enable row level security;
alter table public.historico_mensal enable row level security;
alter table public.vendas_pedidos enable row level security;
alter table public.vendas_devolucoes enable row level security;
alter table public.vendas_metas enable row level security;
create policy central_read on public.historico_importacoes for select to authenticated using ((select auth.uid()) in (select user_id from private.central_members));
create policy central_read on public.historico_mensal for select to authenticated using ((select auth.uid()) in (select user_id from private.central_members));
create policy central_sales on public.vendas_pedidos to authenticated using ((select auth.uid()) in (select user_id from private.central_members)) with check ((select auth.uid()) in (select user_id from private.central_members));
create policy central_returns on public.vendas_devolucoes to authenticated using ((select auth.uid()) in (select user_id from private.central_members)) with check ((select auth.uid()) in (select user_id from private.central_members));
create policy central_targets on public.vendas_metas to authenticated using ((select auth.uid()) in (select user_id from private.central_members)) with check ((select auth.uid()) in (select user_id from private.central_members));
revoke all on public.historico_importacoes,public.historico_mensal,public.vendas_pedidos,public.vendas_devolucoes,public.vendas_metas from public,anon,authenticated;
grant select on public.historico_importacoes,public.historico_mensal,public.vendas_pedidos,public.vendas_devolucoes,public.vendas_metas to authenticated;
grant insert(id,cliente_id,data_venda,canal,origem,itens,capsulas_informadas,numero_externo,observacao,conferencia_importacao) on public.vendas_pedidos to authenticated;
grant update(numero_externo,cancelado,motivo_cancelamento) on public.vendas_pedidos to authenticated;
grant usage,select on sequence public.vendas_pedidos_codigo_seq to authenticated;
grant insert(id,cliente_id,data_devolucao,capsulas,pedido_id,referencia,observacao,conferencia_importacao) on public.vendas_devolucoes to authenticated;
grant update(cancelado,motivo_cancelamento) on public.vendas_devolucoes to authenticated;
grant insert(mes,meta_positivacao),update(meta_positivacao) on public.vendas_metas to authenticated;

create function public.validar_venda_pedido() returns trigger
language plpgsql security invoker set search_path='' as $fn$
declare
 i jsonb; p record; qtd integer; preco bigint; pack integer; total_caps bigint:=0; total_reais bigint:=0;
 detalhes jsonb:='[]'; corte date;
begin
 if auth.uid() is null or not exists(select 1 from private.central_members where user_id=auth.uid()) then
  raise exception 'Sem autorização para registrar vendas.' using errcode='42501';
 end if;
 new.numero_externo:=nullif(btrim(new.numero_externo),'');
 if tg_op='INSERT' then
  new.criado_por:=auth.uid();new.criado_em:=now();new.atualizado_em:=now();new.cancelado:=false;new.motivo_cancelamento:=null;new.numeros_historico:='[]';
  if new.data_venda>(now() at time zone 'America/Sao_Paulo')::date or new.data_venda<'2000-01-01'::date then raise exception 'Informe uma data de venda válida, sem data futura.';end if;
  select max(data_corte) into corte from public.historico_importacoes;
  if new.data_venda<=corte and (not new.conferencia_importacao or length(btrim(new.observacao))<5) then raise exception 'Confirme que o lançamento não está na planilha e informe uma observação.';end if;
  if new.origem='manual' then
   if new.capsulas_informadas is null or new.capsulas_informadas<1 then raise exception 'Informe uma quantidade positiva de cápsulas.';end if;
   new.itens:='[]';new.capsulas:=new.capsulas_informadas;new.total_centavos:=null;
  else
   if jsonb_typeof(new.itens)<>'array' or jsonb_array_length(new.itens) not between 1 and 100 then raise exception 'Inclua entre 1 e 100 itens no pedido.';end if;
   for i in select value from jsonb_array_elements(new.itens) loop
    if coalesce(i->>'tipo','') not in ('b2b','vertuo','original','acessorios') then raise exception 'Tipo de produto inválido.';end if;
    qtd:=(i->>'quantidade')::integer;preco:=(i->>'preco_centavos')::bigint;
    if qtd is null or qtd not between 1 and 100000 or preco is null or preco not between 0 and 100000000 then raise exception 'Quantidade ou preço inválido.';end if;
    if i->>'tipo'='b2b' then
     select id,sku,nome,capsulas_caixa into p from public.produtos_b2b where id=(i->>'produto_id')::bigint;
    elsif i->>'tipo'='acessorios' then
     select id,sku,nome,1 as capsulas_caixa into p from public.acessorios where id=(i->>'produto_id')::bigint;
    else
     select id,sku,nome,capsulas_caixa into p from public.produtos_b2c where id=(i->>'produto_id')::bigint and lower(sistema)=i->>'tipo';
    end if;
    if not found then raise exception 'Produto não encontrado no catálogo ou sem acesso.';end if;
    pack:=case when i->>'tipo'='acessorios' then 1 else coalesce(p.capsulas_caixa,case when i->>'tipo'='b2b' then 50 else 10 end) end;
    if pack<1 then raise exception 'Quantidade de cápsulas por caixa inválida no catálogo.';end if;
    if i->>'tipo'<>'acessorios' then total_caps:=total_caps+qtd::bigint*pack;end if;
    total_reais:=total_reais+qtd::bigint*pack*preco;
    detalhes:=detalhes||jsonb_build_array(jsonb_build_object('tipo',i->>'tipo','produto_id',p.id,'sku',p.sku,'nome',p.nome,'quantidade',qtd,'unidades_por_embalagem',pack,'preco_centavos',preco));
   end loop;
   if total_caps>2147483647 or total_reais>9007199254740991 then raise exception 'Total do pedido excede o limite permitido.';end if;
   new.itens:=detalhes;new.capsulas:=total_caps;new.total_centavos:=total_reais;new.capsulas_informadas:=null;
  end if;
 else
  if (new.id,new.codigo,new.cliente_id,new.data_venda,new.canal,new.origem,new.itens,new.capsulas,new.capsulas_informadas,new.total_centavos,new.observacao,new.conferencia_importacao,new.criado_por,new.criado_em)
    is distinct from (old.id,old.codigo,old.cliente_id,old.data_venda,old.canal,old.origem,old.itens,old.capsulas,old.capsulas_informadas,old.total_centavos,old.observacao,old.conferencia_importacao,old.criado_por,old.criado_em)
   then raise exception 'Os dados da venda são preservados. Cancele o lançamento e registre a correção.';end if;
  if old.cancelado and not new.cancelado then raise exception 'Um lançamento cancelado não pode ser reativado.';end if;
  if new.cancelado and not old.cancelado then
   if length(btrim(coalesce(new.motivo_cancelamento,'')))<3 then raise exception 'Informe o motivo do cancelamento.';end if;
   if exists(select 1 from public.vendas_devolucoes where pedido_id=old.id and not cancelado) then raise exception 'Cancele primeiro as devoluções vinculadas a este pedido.';end if;
  end if;
  new.numeros_historico:=old.numeros_historico;
  if new.numero_externo is distinct from old.numero_externo then
   new.numeros_historico:=old.numeros_historico||jsonb_build_array(jsonb_build_object('anterior',old.numero_externo,'novo',new.numero_externo,'em',now(),'por',auth.uid()));
  end if;
  new.atualizado_em:=now();
 end if;
 return new;
end;
$fn$;
create trigger validar_venda_pedido before insert or update on public.vendas_pedidos for each row execute function public.validar_venda_pedido();

create function public.validar_venda_devolucao() returns trigger
language plpgsql security invoker set search_path='' as $fn$
declare p public.vendas_pedidos; corte date; devolvido bigint;
begin
 if auth.uid() is null or not exists(select 1 from private.central_members where user_id=auth.uid()) then raise exception 'Sem autorização para registrar devoluções.' using errcode='42501';end if;
 if tg_op='INSERT' then
  new.criado_por:=auth.uid();new.criado_em:=now();new.atualizado_em:=now();new.cancelado:=false;new.motivo_cancelamento:=null;
  if new.data_devolucao>(now() at time zone 'America/Sao_Paulo')::date or new.data_devolucao<'2000-01-01'::date then raise exception 'Informe uma data de devolução válida, sem data futura.';end if;
  select max(data_corte) into corte from public.historico_importacoes;
  if new.data_devolucao<=corte and (not new.conferencia_importacao or length(btrim(new.observacao))<5) then raise exception 'Confirme que a devolução não está incluída na planilha.';end if;
  if new.pedido_id is not null then
   select * into p from public.vendas_pedidos where id=new.pedido_id for update;
   if not found or p.cancelado or p.cliente_id<>new.cliente_id then raise exception 'Pedido inválido para este cliente.';end if;
   if new.data_devolucao<p.data_venda then raise exception 'A devolução não pode ser anterior à venda vinculada.';end if;
   select coalesce(sum(capsulas),0) into devolvido from public.vendas_devolucoes where pedido_id=new.pedido_id and not cancelado;
   if devolvido+new.capsulas>p.capsulas then raise exception 'A devolução supera as cápsulas restantes deste pedido.';end if;
  end if;
 else
  if (new.id,new.cliente_id,new.data_devolucao,new.capsulas,new.pedido_id,new.referencia,new.observacao,new.conferencia_importacao,new.criado_por,new.criado_em)
    is distinct from (old.id,old.cliente_id,old.data_devolucao,old.capsulas,old.pedido_id,old.referencia,old.observacao,old.conferencia_importacao,old.criado_por,old.criado_em)
   then raise exception 'Os dados da devolução são preservados. Cancele e registre a correção.';end if;
  if old.cancelado and not new.cancelado then raise exception 'Um lançamento cancelado não pode ser reativado.';end if;
  if new.cancelado and not old.cancelado and length(btrim(coalesce(new.motivo_cancelamento,'')))<3 then raise exception 'Informe o motivo do cancelamento.';end if;
  new.atualizado_em:=now();
 end if;
 return new;
end;
$fn$;
create trigger validar_venda_devolucao before insert or update on public.vendas_devolucoes for each row execute function public.validar_venda_devolucao();
revoke execute on function public.validar_venda_pedido(),public.validar_venda_devolucao() from public,anon,authenticated;

create view public.vendas_saldos_mensais with(security_invoker=true) as
select cliente_id,mes,sum(importado)::bigint as importado,sum(vendas)::bigint as vendas,sum(devolucoes)::bigint as devolucoes,sum(importado+vendas-devolucoes)::bigint as saldo
from (
 select cliente_id,mes,saldo_capsulas as importado,0::bigint as vendas,0::bigint as devolucoes from public.historico_mensal
 union all
 select cliente_id,date_trunc('month',data_venda)::date,0,capsulas,0 from public.vendas_pedidos where not cancelado
 union all
 select cliente_id,date_trunc('month',data_devolucao)::date,0,0,capsulas from public.vendas_devolucoes where not cancelado
) x group by cliente_id,mes;
revoke all on public.vendas_saldos_mensais from public,anon,authenticated;
grant select on public.vendas_saldos_mensais to authenticated;
notify pgrst,'reload schema';

