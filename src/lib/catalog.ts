import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Category = Tables<'categories'>;
export type Product = Tables<'products'> & { product_images?: Tables<'product_images'>[] };

export async function fetchCatalog() {
  const [categories, products] = await Promise.all([
    supabase.from('categories').select('*').eq('is_active', true).order('display_order'),
    supabase.from('products').select('*,product_images(*)').eq('is_active', true).order('display_order'),
  ]);
  if (categories.error) throw categories.error;
  if (products.error) throw products.error;
  return { categories: categories.data, products: products.data as Product[] };
}

export const quoteLink = (name?: string) => `https://wa.me/5547992007200?text=${encodeURIComponent(name ? `Olá! Gostaria de pedir um orçamento para ${name}.` : 'Olá! Gostaria de falar com a Imperarte Móveis.')}`;
