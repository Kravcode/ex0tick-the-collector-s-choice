-- Fix security warning: Add search_path to update_product_stats function
CREATE OR REPLACE FUNCTION public.update_product_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products
  SET 
    bid_count = (SELECT COUNT(*) FROM public.bids WHERE product_id = NEW.product_id AND status = 'active'),
    lowest_ask = (SELECT MIN(amount) FROM public.asks WHERE product_id = NEW.product_id AND status = 'active'),
    highest_bid = (SELECT MAX(amount) FROM public.bids WHERE product_id = NEW.product_id AND status = 'active')
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$;