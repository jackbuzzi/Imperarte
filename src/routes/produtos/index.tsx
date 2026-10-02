import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductCard } from '@/components/product-card';
import { fetchCatalog } from '@/lib/catalog';

export const Route = createFileRoute('/produtos/')({ validateSearch: (search: Record<string, unknown>): { categoria?: string } => ({ categoria: typeof search['categoria'] === 'string' ? search['categoria'] : undefined }), head: () => ({ meta: [
  { title: 'Produtos | Imperarte Móveis' }, { name: 'description', content: 'Conheça as cadeiras, banquetas, mesas, bistrôs, booths e aparadores da Imperarte Móveis e peça orçamento.' },
  { property: 'og:title', content: 'Produtos | Imperarte Móveis' }, { property: 'og:description', content: 'Móveis em madeira com personalidade. Explore a coleção Imperarte.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
] }), component: ProductsPage });

function ProductsPage() {
  const { categoria } = Route.useSearch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('all');
  const { data, isPending, error } = useQuery({ queryKey: ['catalog'], queryFn: fetchCatalog });
  useEffect(() => { setSelected(data?.categories.find(c => c.slug === categoria)?.id ?? 'all'); }, [categoria, data]);
  const products = data?.products.filter(p => selected === 'all' || p.category_id === selected) ?? [];
  return <><SiteHeader /><main><div className="border-b border-border bg-secondary/40 px-5 py-14 sm:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase text-primary">Coleção Imperarte</p><h1 className="mt-3 text-5xl font-semibold sm:text-6xl">Nossos produtos</h1><p className="mt-4 max-w-2xl text-muted-foreground">Peças em madeira com personalidade para espaços que merecem ser lembrados.</p></div></div><div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">{data && <div className="mb-10"><h2 className="mb-5 text-3xl font-semibold">Categorias</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{data.categories.map(c => <Button key={c.id} variant="ghost" onClick={() => { setSelected(c.id); void navigate({ to: '/produtos', search: { categoria: c.slug }, replace: true }); }} className={`h-auto flex-col overflow-hidden border border-border p-0 text-foreground ${selected === c.id ? 'ring-2 ring-primary' : ''}`}><img src={c.image_url || undefined} alt="" className="aspect-square w-full bg-secondary/40 object-contain p-2" /><span className="w-full truncate px-2 py-3 text-center text-sm">{c.name}</span></Button>)}</div></div>}<div className="mb-8 flex gap-2 overflow-x-auto pb-2"><Button variant={selected === 'all' ? 'default' : 'outline'} onClick={() => { setSelected('all'); void navigate({ to: '/produtos', search: {}, replace: true }); }}>Todos</Button>{data?.categories.map(c => <Button key={c.id} variant={selected === c.id ? 'default' : 'outline'} onClick={() => { setSelected(c.id); void navigate({ to: '/produtos', search: { categoria: c.slug }, replace: true }); }}>{c.name}</Button>)}</div>{isPending && <p className="py-20 text-center text-muted-foreground">Carregando produtos...</p>}{error && <p className="py-20 text-center text-destructive">Não foi possível carregar os produtos. Tente novamente.</p>}{!isPending && !error && <><p className="mb-5 text-sm text-muted-foreground">{products.length} {products.length === 1 ? 'produto' : 'produtos'}</p><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map(p => <ProductCard key={p.id} product={p} category={data.categories.find(c => c.id === p.category_id)?.name} />)}</div>{products.length === 0 && <p className="py-20 text-center text-muted-foreground">Nenhum produto nesta categoria.</p>}</>}</div></main><SiteFooter /></>;
}
