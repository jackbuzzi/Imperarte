CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY "Public can view active categories" ON public.categories;
DROP POLICY "Admins can create categories" ON public.categories;
DROP POLICY "Admins can update categories" ON public.categories;
DROP POLICY "Admins can delete categories" ON public.categories;
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT TO anon, authenticated USING (is_active = true OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Public can view active products" ON public.products;
DROP POLICY "Admins can create products" ON public.products;
DROP POLICY "Admins can update products" ON public.products;
DROP POLICY "Admins can delete products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create products" ON public.products FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Public can view images of active products" ON public.product_images;
DROP POLICY "Admins can create product images" ON public.product_images;
DROP POLICY "Admins can update product images" ON public.product_images;
DROP POLICY "Admins can delete product images" ON public.product_images;
CREATE POLICY "Public can view images of active products" ON public.product_images FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND (p.is_active = true OR private.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Admins can create product images" ON public.product_images FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update product images" ON public.product_images FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete product images" ON public.product_images FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
DROP FUNCTION public.has_role(uuid, public.app_role);