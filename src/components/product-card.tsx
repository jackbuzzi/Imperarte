import { Link } from '@tanstack/react-router';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { quoteLink, type Product } from '@/lib/catalog';

export function ProductCard({ product, category }: { product: Product; category?: string | undefined }) {
  return <article className="group overflow-hidden rounded-md border border-border bg-card">
    <Link to="/produtos/$slug" params={{ slug: product.slug }} className="block aspect-[4/4.5] overflow-hidden bg-secondary/40"><img src={product.image_url || undefined} alt={product.name} loading="lazy" className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" /></Link>
    <div className="p-5"><span className="text-xs font-semibold uppercase text-primary">{category}</span><Link to="/produtos/$slug" params={{ slug: product.slug }} className="mt-1 flex items-start justify-between gap-2"><h3 className="text-2xl font-semibold">{product.name}</h3><ArrowUpRight className="mt-2 h-4 w-4 shrink-0" /></Link><p className="mt-2 min-h-14 text-sm leading-6 text-muted-foreground">{product.description}</p><Button asChild className="mt-5 w-full"><a href={quoteLink(product.name)} target="_blank" rel="noopener noreferrer"><MessageCircle /> Pedir orçamento</a></Button></div>
  </article>;
}
