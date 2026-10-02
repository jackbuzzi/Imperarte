CREATE TABLE public.home_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT '',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.home_slides TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.home_slides TO authenticated;
GRANT ALL ON public.home_slides TO service_role;
ALTER TABLE public.home_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active home slides" ON public.home_slides FOR SELECT TO anon, authenticated USING (is_active = true OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create home slides" ON public.home_slides FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update home slides" ON public.home_slides FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete home slides" ON public.home_slides FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE TRIGGER home_slides_set_updated_at BEFORE UPDATE ON public.home_slides FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.home_slides (label, title, description, image_url, display_order) VALUES
('Cadeiras', 'Madeira que transforma espaços', 'Design, cuidado e personalidade em cada detalhe.', '/__l5e/assets-v1/83cb92e0-11c1-419e-b656-00e7045596a9/cadeira-alasca.png', 1),
('Booths', 'Conforto que convida a ficar', 'Soluções para ambientes comerciais com identidade.', '/__l5e/assets-v1/a767eed2-6ecb-431d-8f3c-a1779892d6eb/booth-capitone-duplo.jpg', 2),
('Banquetas', 'Presença em cada ambiente', 'Peças versáteis para bares, cafés e projetos especiais.', '/__l5e/assets-v1/edb2ee96-5090-4758-99de-3e24acce7c91/banqueta-franca.jpg', 3);