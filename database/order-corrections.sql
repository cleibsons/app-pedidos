alter table public.vendas_pedidos add column revisao integer not null default 1 check(revisao>0), add column edicoes_historico jsonb not null default '[]'::jsonb check(jsonb_typeof(edicoes_historico)='array');
create or replace function public.validar_venda_pedido() returns trigger
language plpgsql security invoker set search_path='' as $fn$
declare
 i jsonb; p record; qtd integer; preco bigint; pack integer; total_caps bigint:=0; total_reais bigint:=0;
 detalhes jsonb:='[]'; corte date; anterior jsonb; pos integer:=0; devolvido bigint; changed boolean;
begin
 if auth.uid() is null or not exists(select 1 from private.central_members where user_id=auth.uid()) then
  raise exception 'Sem autorização para registrar vendas.' using errcode='42501';
 end if;
 new.numero_externo:=nullif(btrim(new.numero_externo),'');
 if tg_op='INSERT' then
  new.criado_por:=auth.uid();new.criado_em:=now();new.atualizado_em:=now();new.cancelado:=false;new.motivo_cancelamento:=null;new.numeros_historico:='[]';new.edicoes_historico:='[]';new.revisao:=1;
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
  if (new.id,new.codigo,new.cliente_id,new.data_venda,new.canal,new.origem,new.capsulas,new.capsulas_informadas,new.total_centavos,new.observacao,new.conferencia_importacao,new.criado_por,new.criado_em)
    is distinct from (old.id,old.codigo,old.cliente_id,old.data_venda,old.canal,old.origem,old.capsulas,old.capsulas_informadas,old.total_centavos,old.observacao,old.conferencia_importacao,old.criado_por,old.criado_em)
   then raise exception 'A correção permite alterar apenas preços, quantidades e número do pedido.';end if;
  if old.cancelado and (new.itens,new.numero_externo,new.motivo_cancelamento) is distinct from (old.itens,old.numero_externo,old.motivo_cancelamento) then raise exception 'Pedidos cancelados não podem ser editados.';end if;
  if new.itens is distinct from old.itens then
   if old.origem<>'compositor' or old.cancelado or new.cancelado then raise exception 'Somente pedidos ativos com produtos cadastrados permitem corrigir preços e caixas.';end if;
   if jsonb_typeof(new.itens) is distinct from 'array' then raise exception 'Itens inválidos.';end if;
   if jsonb_array_length(new.itens)<>jsonb_array_length(old.itens) then raise exception 'Mantenha os mesmos produtos para corrigir o pedido.';end if;
   for i in select value from jsonb_array_elements(new.itens) loop
    anterior:=old.itens->pos;pos:=pos+1;
    if (i->>'tipo',i->>'produto_id') is distinct from (anterior->>'tipo',anterior->>'produto_id') then raise exception 'A correção deve preservar os produtos originais.';end if;
    if coalesce(i->>'quantidade','') !~ '^[0-9]{1,6}$' or coalesce(i->>'preco_centavos','') !~ '^[0-9]{1,9}$' then raise exception 'Quantidade ou preço inválido.';end if;
    qtd:=(i->>'quantidade')::integer;preco:=(i->>'preco_centavos')::bigint;
    if qtd not between 1 and 100000 or preco not between 0 and 100000000 then raise exception 'Quantidade ou preço inválido.';end if;
    pack:=(anterior->>'unidades_por_embalagem')::integer;
    if pack is null or pack<1 then raise exception 'Embalagem original inválida.';end if;
    if anterior->>'tipo'<>'acessorios' then total_caps:=total_caps+qtd::bigint*pack;end if;
    total_reais:=total_reais+qtd::bigint*pack*preco;
    detalhes:=detalhes||jsonb_build_array(anterior||jsonb_build_object('quantidade',qtd,'preco_centavos',preco));
   end loop;
   if total_caps>2147483647 or total_reais>9007199254740991 then raise exception 'Total do pedido excede o limite permitido.';end if;
   select coalesce(sum(capsulas),0) into devolvido from public.vendas_devolucoes where pedido_id=old.id and not cancelado;
   if total_caps<devolvido then raise exception 'O pedido possui % cápsulas devolvidas. A quantidade corrigida não pode ser menor.',devolvido;end if;
   new.itens:=detalhes;new.capsulas:=total_caps;new.total_centavos:=total_reais;
  end if;
  if old.cancelado and not new.cancelado then raise exception 'Um lançamento cancelado não pode ser reativado.';end if;
  if new.cancelado and not old.cancelado then
   if length(btrim(coalesce(new.motivo_cancelamento,'')))<3 then raise exception 'Informe o motivo do cancelamento.';end if;
   if exists(select 1 from public.vendas_devolucoes where pedido_id=old.id and not cancelado) then raise exception 'Cancele primeiro as devoluções vinculadas a este pedido.';end if;
  end if;
  new.numeros_historico:=old.numeros_historico;
  if new.numero_externo is distinct from old.numero_externo then
   new.numeros_historico:=old.numeros_historico||jsonb_build_array(jsonb_build_object('anterior',old.numero_externo,'novo',new.numero_externo,'em',now(),'por',auth.uid()));
  end if;
  changed:=(new.itens,new.numero_externo,new.cancelado) is distinct from (old.itens,old.numero_externo,old.cancelado);
  new.edicoes_historico:=old.edicoes_historico;
  new.revisao:=old.revisao;
  if changed then
   new.revisao:=old.revisao+1;
   new.edicoes_historico:=old.edicoes_historico||jsonb_build_array(jsonb_build_object(
    'em',clock_timestamp(),'por',auth.uid(),'revisao',new.revisao,
    'anterior',jsonb_build_object('itens',old.itens,'capsulas',old.capsulas,'total_centavos',old.total_centavos,'numero_pedido',old.numero_externo,'cancelado',old.cancelado),
    'novo',jsonb_build_object('itens',new.itens,'capsulas',new.capsulas,'total_centavos',new.total_centavos,'numero_pedido',new.numero_externo,'cancelado',new.cancelado)));
  end if;
  new.atualizado_em:=clock_timestamp();
 end if;
 return new;
end;
$fn$;

grant update(itens) on public.vendas_pedidos to authenticated;
notify pgrst,'reload schema';
