-- Internal trigger helpers are SECURITY DEFINER because they mutate protected commerce state.
-- They are not client-callable RPCs and must not be executable by anon/authenticated roles.
revoke execute on function public.apply_order_inventory_transition() from public, anon, authenticated;
revoke execute on function public.enforce_delivery_status_transition() from public, anon, authenticated;
revoke execute on function public.enforce_order_status_transition() from public, anon, authenticated;
