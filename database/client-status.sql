alter table public.clientes add column ativo boolean not null default true, add column status_alterado_em timestamptz, add column status_alterado_por uuid;
create function public.registrar_status_cliente() returns trigger language plpgsql security invoker set search_path='' as $fn$
begin
 if tg_op='INSERT' then new.status_alterado_em:=null;new.status_alterado_por:=null;
 elsif new.ativo is distinct from old.ativo then new.status_alterado_em:=clock_timestamp();new.status_alterado_por:=auth.uid();
 else new.status_alterado_em:=old.status_alterado_em;new.status_alterado_por:=old.status_alterado_por;
 end if;
 return new;
end;$fn$;
create trigger registrar_status_cliente before insert or update on public.clientes for each row execute function public.registrar_status_cliente();
create function public.validar_cliente_ativo_venda() returns trigger language plpgsql security invoker set search_path='' as $fn$
declare cliente_ativo boolean;
begin
 select ativo into cliente_ativo from public.clientes where id=new.cliente_id for share;
 if cliente_ativo is distinct from true then raise exception 'Cliente inativo ou indisponível. Reative o cadastro antes de registrar uma nova venda.';end if;
 return new;
end;$fn$;
create trigger validar_cliente_ativo_venda before insert on public.vendas_pedidos for each row execute function public.validar_cliente_ativo_venda();
revoke execute on function public.registrar_status_cliente(),public.validar_cliente_ativo_venda() from public,anon,authenticated;
revoke delete on public.clientes from authenticated;
notify pgrst,'reload schema';
