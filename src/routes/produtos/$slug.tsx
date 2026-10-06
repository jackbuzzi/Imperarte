import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PhotoLightbox } from '@/components/photo-lightbox';
import { fetchCatalog, quoteLink } from '@/lib/catalog';

export const Route = createFileRoute('/produtos/$slug')({ head: () => ({ meta: [
  { title: 'Detalhes do produto | Imperarte Móveis' }, { name: 'description', content: 'Confira os detalhes dos móveis da Imperarte Móveis e solicite um orçamento.' },
  { property: 'og:title', content: 'Detalhes do produto | Imperarte Móveis' }, { property: 'og:description', content: 'Confira os detalhes e solicite seu orçamento para um móvel Imperarte.' },
  { property: 'og:type', content: 'product' }, { name: 'twitter:card', content: 'summary_large_image' },
] }), component: ProductDetail });
function ProductDetail() {
  const { slug } = Route.useParams();
  const { data, isPending } = useQuery({ queryKey: ['catalog'], queryFn: fetchCatalog });
  const product = data?.products.find(p => p.slug === slug);
  const photos = product ? [product.image_url, ...(product.product_images?.sort((a,b) => a.display_order-b.display_order).map(p => p.image_url) ?? [])].filter((p): p is string => !!p) : [];
  return <><SiteHeader /><main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-8 sm:px-8 sm:py-14"><Link to="/produtos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Voltar aos produtos</Link>{isPending ? <p className="py-24 text-center">Carregando produto...</p> : !product ? <h1 className="py-24 text-center text-4xl">Produto não encontrado</h1> : <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-14"><div className="grid gap-3"><div className="aspect-square overflow-hidden rounded-md bg-secondary/40"><PhotoLightbox src={photos[0] || ''} alt={product.name} /></div>{photos.length > 1 && <div className="grid grid-cols-3 gap-3">{photos.slice(1).map((src, i) => <div key={src} className="aspect-square overflow-hidden rounded-md bg-secondary/40"><PhotoLightbox src={src} alt={`${product.name} — foto ${i + 2}`} /></div>)}</div>}</div><div><p className="text-xs font-bold uppercase text-primary">{data?.categories.find(c => c.id === product.category_id)?.name}</p><h1 className="mt-3 font-catalog text-4xl font-semibold leading-tight break-words sm:text-5xl">{product.name}</h1><div className="mt-7 h-px bg-border" /><h2 className="mt-7 text-2xl font-semibold">Sobre a peça</h2><p className="mt-4 whitespace-pre-line text-lg leading-8 text-muted-foreground">{product.description}</p><Button asChild size="lg" className="mt-9 w-full sm:w-auto"><a href={quoteLink(product.name)} target="_blank" rel="noopener noreferrer"><MessageCircle /> Pedir orçamento no WhatsApp</a></Button><p className="mt-3 text-sm text-muted-foreground">Fale diretamente com a Imperarte Móveis.</p></div></div>}</main><SiteFooter /></>;
}
