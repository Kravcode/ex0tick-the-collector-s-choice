-- Create app_role enum for proper role management
CREATE TYPE public.app_role AS ENUM ('admin', 'buyer', 'seller');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Remove role column from profiles (it's now in user_roles)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Add seller rating to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS seller_rating NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_sales INTEGER DEFAULT 0;

-- Create bids table for StockX-style bidding
CREATE TABLE public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'accepted', 'rejected', 'expired', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active bids"
ON public.bids FOR SELECT
USING (status = 'active');

CREATE POLICY "Buyers can create bids"
ON public.bids FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update own bids"
ON public.bids FOR UPDATE
USING (auth.uid() = buyer_id);

-- Create asks table (seller asking prices)
CREATE TABLE public.asks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'accepted', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.asks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active asks"
ON public.asks FOR SELECT
USING (status = 'active');

CREATE POLICY "Sellers can create asks"
ON public.asks FOR INSERT
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own asks"
ON public.asks FOR UPDATE
USING (auth.uid() = seller_id);

-- Create price_history table for tracking
CREATE TABLE public.price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  price NUMERIC NOT NULL,
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view price history"
ON public.price_history FOR SELECT
USING (true);

-- Create wishlist table
CREATE TABLE public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist"
ON public.wishlist FOR ALL
USING (auth.uid() = user_id);

-- Update products table for new categories and features
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bid_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS lowest_ask NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS highest_bid NUMERIC;

-- Trigger to update product stats
CREATE OR REPLACE FUNCTION public.update_product_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
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

CREATE TRIGGER update_product_stats_on_bid
AFTER INSERT OR UPDATE ON public.bids
FOR EACH ROW EXECUTE FUNCTION public.update_product_stats();

CREATE TRIGGER update_product_stats_on_ask
AFTER INSERT OR UPDATE ON public.asks
FOR EACH ROW EXECUTE FUNCTION public.update_product_stats();

-- Function to assign default buyer role to new users
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'buyer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER assign_role_on_profile_creation
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.assign_default_role();