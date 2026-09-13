insert into public.deliveries(order_id,customer_id,method,status,created_at,updated_at)
select o.id,o.customer_id,o.delivery_method,'pending',coalesce(o.created_at,now()),now()
from public.orders o
where not exists (select 1 from public.deliveries d where d.order_id=o.id);

insert into public.notifications(customer_id,type,title,body,aggregate_type,aggregate_id,action_type,action_target,dedupe_key,created_at)
select o.customer_id,'order.confirmed','Order confirmed','Your order has been confirmed and is now being prepared.','order',o.id,'open_order','/orders/'||o.id,'order.confirmed:'||o.id,coalesce(o.created_at,now())
from public.orders o
where not exists (select 1 from public.notifications n where n.dedupe_key='order.confirmed:'||o.id);

insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at)
select n.id,'in_app','sent',now()
from public.notifications n
where n.dedupe_key like 'order.confirmed:%'
and not exists (select 1 from public.notification_deliveries d where d.notification_id=n.id and d.channel='in_app');

insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at)
select n.id,'push','pending',now()
from public.notifications n
where n.dedupe_key like 'order.confirmed:%'
and not exists (select 1 from public.notification_deliveries d where d.notification_id=n.id and d.channel='push');

insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at)
select n.id,'whatsapp','pending',now()
from public.notifications n
where n.dedupe_key like 'order.confirmed:%'
and not exists (select 1 from public.notification_deliveries d where d.notification_id=n.id and d.channel='whatsapp');
