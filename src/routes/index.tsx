import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductCard } from '@/components/product-card';
import { fetchCatalog, quoteLink } from '@/lib/catalog';
import alasca from '@/assets/products/cadeira-alasca.png.asset.json';
import booth from '@/assets/products/booth-capitone-duplo.jpg.asset.json';
import mesa from '@/assets/products/mesa-berlim.jpg.asset.json';
import banqueta from '@/assets/products/banqueta-franca.jpg.asset.json';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Imperarte Móveis | Móveis em madeira para ambientes únicos' },
    { name: 'description', content: 'Conheça cadeiras, banquetas, mesas, bistrôs, booths e aparadores da Imperarte Móveis em Rio Negrinho, SC. Peça seu orçamento pelo WhatsApp.' },
    { property: 'og:title', content: 'Imperarte Móveis | Móveis em madeira para ambientes únicos' },
    { property: 'og:description', content: 'Explore o catálogo de móveis da Imperarte e solicite um orçamento pelo WhatsApp.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: Home,
});

const slides = [
  { image: alasca.url, label: 'Cadeiras', title: 'Madeira que transforma espaços', text: 'Design, cuidado e personalidade em cada detalhe.' },
  { image: booth.url, label: 'Booths', title: 'Conforto que convida a ficar', text: 'Soluções para ambientes comerciais com identidade.' },
  { image: banqueta.url, label: 'Banquetas', title: 'Presença em cada ambiente', text: 'Peças versáteis para bares, cafés e projetos especiais.' },
];
function Home() {
  const [active, setActive] = useState(0);
  const { data } = useQuery({ queryKey: ['catalog'], queryFn: fetchCatalog });
  useEffect(() => { const timer = window.setInterval(() => setActive(v => (v + 1) % slides.length), 6500); return () => clearInterval(timer); }, []);
  return <><SiteHeader /><main>
    <section className="relative isolate flex min-h-[68svh] items-end overflow-hidden bg-wood-deep sm:min-h-[76svh]">
      {slides.map((slide, i) => <img key={slide.title} src={slide.image} alt={slide.title} className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0'}`} />)}
      <div className="absolute inset-0 -z-10 bg-foreground/55" />
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-20 text-primary-foreground sm:px-8 sm:pb-20">
        <p className="mb-4 text-xs font-bold uppercase text-silver">Imperarte Móveis / {slides[active].label}</p>
        <h1 className="max-w-2xl text-5xl font-semibold leading-none sm:text-7xl">{slides[active].title}</h1>
        <p className="mt-6 max-w-lg text-lg">{slides[active].text}</p>
        <div className="mt-9 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/produtos">Conheça os produtos <ArrowRight /></Link></Button><Button asChild size="lg" variant="secondary"><a href={quoteLink()} target="_blank" rel="noopener noreferrer"><MessageCircle /> Solicitar orçamento</a></Button></div>
        <div className="mt-10 flex items-center gap-3"><Button variant="secondary" size="icon" aria-label="Slide anterior" onClick={() => setActive((active + slides.length - 1) % slides.length)}><ArrowLeft /></Button>{slides.map((s, i) => <Button key={s.label} variant="ghost" size="icon" onClick={() => setActive(i)} aria-label={`Mostrar slide ${i + 1}`} className="h-8 w-8 text-primary-foreground">{String(i + 1).padStart(2, '0')}</Button>)}<Button variant="secondary" size="icon" aria-label="Próximo slide" onClick={() => setActive((active + 1) % slides.length)}><ArrowRight /></Button></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"><div className="grid items-center gap-10 md:grid-cols-2 md:gap-16"><div><p className="text-xs font-bold uppercase text-primary">Nossa essência</p><h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Feitos para durar. Criados para encantar.</h2><p className="mt-6 text-base leading-8 text-muted-foreground">A Imperarte Móveis une beleza, funcionalidade e o aconchego da madeira. Fabricamos móveis para lojistas, restaurantes, bares e cafés, com atenção ao desenho e ao acabamento de cada peça.</p><Button asChild variant="outline" className="mt-7"><Link to="/produtos">Explorar o catálogo <ArrowRight /></Link></Button></div><img src={mesa.url} alt="Mesa Berlim em madeira" loading="lazy" className="aspect-[4/3] w-full rounded-md bg-secondary/50 object-contain p-4" /></div></section>
    <section className="bg-secondary/40 py-16 sm:py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase text-primary">Coleção Imperarte</p><h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Nossos móveis</h2></div><Button asChild variant="outline"><Link to="/produtos">Ver todos <ArrowRight /></Link></Button></div><div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{data?.products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} category={data.categories.find(c => c.id === p.category_id)?.name} />)}</div></div></section>
    <section className="bg-primary py-16 text-primary-foreground sm:py-20"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 sm:px-8 md:flex-row md:items-center"><div><h2 className="text-4xl font-semibold">Seu próximo projeto começa aqui.</h2><p className="mt-3 opacity-85">Conte com a Imperarte para encontrar a peça ideal.</p></div><Button asChild size="lg" variant="secondary"><a href={quoteLink()} target="_blank" rel="noopener noreferrer"><MessageCircle /> Conversar no WhatsApp</a></Button></div></section>
  </main><SiteFooter /></>;
}
