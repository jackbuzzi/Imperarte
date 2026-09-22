CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
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
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active categories"
ON public.categories FOR SELECT TO anon, authenticated
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create categories"
ON public.categories FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories"
ON public.categories FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories"
ON public.categories FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  image_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active products"
ON public.products FOR SELECT TO anon, authenticated
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create products"
ON public.products FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT ALL ON public.product_images TO service_role;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view images of active products"
ON public.product_images FOR SELECT TO anon, authenticated
USING (EXISTS (
  SELECT 1 FROM public.products p
  WHERE p.id = product_id AND (p.is_active = true OR public.has_role(auth.uid(), 'admin'))
));
CREATE POLICY "Admins can create product images"
ON public.product_images FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update product images"
ON public.product_images FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete product images"
ON public.product_images FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER categories_set_updated_at BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX products_category_order_idx ON public.products(category_id, display_order);
CREATE INDEX product_images_product_order_idx ON public.product_images(product_id, display_order);

INSERT INTO public.categories (name, slug, description, image_url, display_order) VALUES
('Cadeiras', 'cadeiras', 'Cadeiras em madeira com desenho marcante, conforto e acabamento cuidadoso.', '/__l5e/assets-v1/83cb92e0-11c1-419e-b656-00e7045596a9/cadeira-alasca.png', 1),
('Banquetas', 'banquetas', 'Modelos altos para bancadas, bares, restaurantes e cozinhas.', '/__l5e/assets-v1/edb2ee96-5090-4758-99de-3e24acce7c91/banqueta-franca.jpg', 2),
('Mesas', 'mesas', 'Mesas robustas e versáteis para diferentes composições.', '/__l5e/assets-v1/15dc2f93-fcae-48b6-9488-637dcab0e648/mesa-berlim.jpg', 3),
('Bistrôs', 'bistros', 'Mesas altas que valorizam ambientes compactos e elegantes.', '/__l5e/assets-v1/cd41933f-e4da-4bef-8d31-783ac4460880/bistro-moscou.jpeg', 4),
('Booths', 'booths', 'Assentos estofados sob medida para restaurantes, cafés e espaços comerciais.', '/__l5e/assets-v1/a767eed2-6ecb-431d-8f3c-a1779892d6eb/booth-capitone-duplo.jpg', 5),
('Aparadores', 'aparadores', 'Peças funcionais para apoio, organização e destaque dos ambientes.', '/__l5e/assets-v1/b96e539d-df39-46b1-b452-11fab511864f/aparador-2-portas.jpg', 6);

INSERT INTO public.products (category_id, name, slug, description, image_url, is_featured, display_order)
SELECT id, 'Cadeira Alasca', 'cadeira-alasca', 'Cadeira em madeira escura com braços curvos e encosto cruzado. Uma peça de presença para salas de jantar e ambientes comerciais.', '/__l5e/assets-v1/83cb92e0-11c1-419e-b656-00e7045596a9/cadeira-alasca.png', true, 1 FROM public.categories WHERE slug = 'cadeiras'
UNION ALL SELECT id, 'Cadeira Bogotá', 'cadeira-bogota', 'Modelo clássico em madeira com estrutura leve, encosto curvo e detalhes arqueados.', '/__l5e/assets-v1/e090a428-5e11-45b7-ac8c-11d1bd0ab342/cadeira-bogota.png', true, 2 FROM public.categories WHERE slug = 'cadeiras'
UNION ALL SELECT id, 'Cadeira Dallas', 'cadeira-dallas', 'Cadeira de linhas retas, encosto ripado e assento estofado para conforto no uso diário.', '/__l5e/assets-v1/5d65c9a4-218c-4ce7-b144-1b80332bf1f5/cadeira-dallas.jpg', false, 3 FROM public.categories WHERE slug = 'cadeiras'
UNION ALL SELECT id, 'Banqueta França', 'banqueta-franca', 'Banqueta alta em madeira com apoio para os pés, braços delicados e encosto trabalhado.', '/__l5e/assets-v1/edb2ee96-5090-4758-99de-3e24acce7c91/banqueta-franca.jpg', true, 1 FROM public.categories WHERE slug = 'banquetas'
UNION ALL SELECT id, 'Banqueta Dallas', 'banqueta-dallas', 'Banqueta alta com encosto ripado, assento estofado e apoio metálico para os pés.', '/__l5e/assets-v1/ea829393-ffb7-4d7e-b0dc-432286fd8996/banqueta-dallas.jpg', false, 2 FROM public.categories WHERE slug = 'banquetas'
UNION ALL SELECT id, 'Mesa Berlim', 'mesa-berlim', 'Mesa em madeira de desenho limpo e estrutura firme, ideal para projetos residenciais e comerciais.', '/__l5e/assets-v1/15dc2f93-fcae-48b6-9488-637dcab0e648/mesa-berlim.jpg', true, 1 FROM public.categories WHERE slug = 'mesas'
UNION ALL SELECT id, 'Bistrô Moscou', 'bistro-moscou', 'Mesa bistrô alta com tampo redondo e base geométrica em madeira.', '/__l5e/assets-v1/cd41933f-e4da-4bef-8d31-783ac4460880/bistro-moscou.jpeg', true, 1 FROM public.categories WHERE slug = 'bistros'
UNION ALL SELECT id, 'Booth Capitonê Duplo', 'booth-capitone-duplo', 'Booth duplo estofado em capitonê, com base amadeirada e acabamento pensado para uso profissional.', '/__l5e/assets-v1/a767eed2-6ecb-431d-8f3c-a1779892d6eb/booth-capitone-duplo.jpg', true, 1 FROM public.categories WHERE slug = 'booths'
UNION ALL SELECT id, 'Booth Preto', 'booth-preto', 'Booth estofado em preto com capitonê e base em madeira, ideal para restaurantes e lounges.', '/__l5e/assets-v1/751b0641-4cc6-4b72-a591-5fdc6af272a1/booth-preto.webp', false, 2 FROM public.categories WHERE slug = 'booths'
UNION ALL SELECT id, 'Aparador 2 Portas com Nicho', 'aparador-2-portas-nicho', 'Aparador com duas portas, duas gavetas, nicho aberto e rodízios para facilitar a organização.', '/__l5e/assets-v1/b96e539d-df39-46b1-b452-11fab511864f/aparador-2-portas.jpg', true, 1 FROM public.categories WHERE slug = 'aparadores';