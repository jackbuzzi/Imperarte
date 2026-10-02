import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductCard } from '@/components/product-card';
import { fetchCatalog, fetchHomeSlides, quoteLink } from '@/lib/catalog';
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

const fallbackSlides = [
  { id: 'cadeiras', image_url: alasca.url, label: 'Cadeiras', title: 'Madeira que transforma espaços', description: 'Design, cuidado e personalidade em cada detalhe.' },
  { id: 'booths', image_url: booth.url, label: 'Booths', title: 'Conforto que convida a ficar', description: 'Soluções para ambientes comerciais com identidade.' },
  { id: 'banquetas', image_url: banqueta.url, label: 'Banquetas', title: 'Presença em cada ambiente', description: 'Peças versáteis para bares, cafés e projetos especiais.' },
];
const mapUrl = 'https://www.google.com/maps?q=Rua%20Domingos%20da%20Silva%2C%20111%2C%20Campo%20Len%C3%A7ol%2C%20Rio%20Negrinho%20-%20SC%2C%2089295-260&output=embed';

function Home() {
  const [active, setActive] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const { data } = useQuery({ queryKey: ['catalog'], queryFn: fetchCatalog });
  const { data: homeSlides } = useQuery({ queryKey: ['home-slides'], queryFn: fetchHomeSlides });
  const slides = homeSlides?.length ? homeSlides : fallbackSlides;
  const current = slides[active % slides.length] ?? slides[0];
  const featured = data?.products.filter(p => p.is_featured && data.categories.some(c => c.id === p.category_id)) ?? [];
  useEffect(() => { const timer = window.setInterval(() => setActive(v => v + 1), 6500); return () => clearInterval(timer); }, []);
  const move = (direction: number) => strip.current?.scrollBy({ left: direction * (strip.current.clientWidth < 600 ? 290 : 630), behavior: 'smooth' });
  return <><SiteHeader /><main>
    <section className="relative isolate flex min-h-[68svh] items-end overflow-hidden bg-wood-deep sm:min-h-[76svh]">
      {slides.map((slide, i) => <img key={slide.id} src={slide.image_url} alt={slide.label || slide.title} className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-700 ${i === active % slides.length ? 'opacity-100' : 'opacity-0'}`} />)}
      <div className="absolute inset-0 -z-10 bg-foreground/55" />
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-20 text-primary-foreground sm:px-8 sm:pb-20">
        <p className="mb-4 text-xs font-bold uppercase text-silver">Imperarte Móveis / {current?.label}</p>
        <h1 className="max-w-2xl text-5xl font-semibold leading-none sm:text-7xl">{current?.title}</h1>
        <p className="mt-6 max-w-lg text-lg">{current?.description}</p>
        <div className="mt-9 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/produtos">Conheça os produtos <ArrowRight /></Link></Button><Button asChild size="lg" variant="secondary"><a href={quoteLink()} target="_blank" rel="noopener noreferrer"><MessageCircle /> Solicitar orçamento</a></Button></div>
        <div className="mt-10 flex items-center gap-3"><Button variant="secondary" size="icon" aria-label="Slide anterior" onClick={() => setActive(v => (v - 1 + slides.length) % slides.length)}><ArrowLeft /></Button>{slides.map((s, i) => <Button key={s.id} variant="ghost" size="icon" onClick={() => setActive(i)} aria-label={`Mostrar slide ${i + 1}`} className="h-8 w-8 text-primary-foreground">{String(i + 1).padStart(2, '0')}</Button>)}<Button variant="secondary" size="icon" aria-label="Próximo slide" onClick={() => setActive(v => v + 1)}><ArrowRight /></Button></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"><p className="text-xs font-bold uppercase text-primary">Nossa coleção</p><div className="mt-3 flex items-end justify-between gap-4"><h2 className="text-4xl font-semibold sm:text-5xl">Explore por categoria</h2><Button asChild variant="outline" className="hidden sm:inline-flex"><Link to="/produtos">Ver catálogo <ArrowRight /></Link></Button></div><div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{data?.categories.map(c => <Button key={c.id} asChild variant="ghost" className="group h-auto overflow-hidden border border-border bg-card p-0 hover:border-primary"><Link to="/produtos" search={{ categoria: c.slug }} className="flex w-full flex-col"><span className="aspect-square w-full overflow-hidden bg-secondary/40"><img src={c.image_url || undefined} alt={c.name} loading="lazy" className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105" /></span><span className="w-full px-2 py-4 text-center text-xl font-semibold">{c.name}</span></Link></Button>)}</div></section>
    <section className="bg-secondary/40 py-16 sm:py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase text-primary">Seleção Imperarte</p><h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Produtos em destaque</h2></div><div className="flex shrink-0 gap-2"><Button variant="outline" size="icon" aria-label="Destaques anteriores" onClick={() => move(-1)}><ArrowLeft /></Button><Button variant="outline" size="icon" aria-label="Próximos destaques" onClick={() => move(1)}><ArrowRight /></Button></div></div><div ref={strip} className="mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 sm:gap-5" style={{ scrollbarWidth: 'none' }}>{featured.map(p => <div key={p.id} className="w-[min(78vw,300px)] shrink-0 snap-start sm:w-[calc((100%-40px)/3)]"><ProductCard product={p} category={data?.categories.find(c => c.id === p.category_id)?.name} /></div>)}</div>{featured.length === 0 && <p className="mt-8 text-muted-foreground">Em breve, novos destaques.</p>}<Button asChild variant="outline" className="mt-5"><Link to="/produtos">Ver todos os produtos <ArrowRight /></Link></Button></div></section>
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"><div className="grid items-center gap-10 md:grid-cols-2 md:gap-16"><div><p className="text-xs font-bold uppercase text-primary">Nossa essência</p><h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Feitos para durar. Criados para encantar.</h2><p className="mt-6 text-base leading-8 text-muted-foreground">A Imperarte Móveis une beleza, funcionalidade e o aconchego da madeira. Fabricamos móveis para lojistas, restaurantes, bares e cafés, com atenção ao desenho e ao acabamento de cada peça.</p><Button asChild variant="outline" className="mt-7"><Link to="/produtos">Explorar o catálogo <ArrowRight /></Link></Button></div><img src={mesa.url} alt="Mesa Berlim em madeira" loading="lazy" className="aspect-[4/3] w-full rounded-md bg-secondary/50 object-contain p-4" /></div></section>
    <section className="bg-primary py-16 text-primary-foreground sm:py-20"><div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="text-xs font-bold uppercase">Entre em contato</p><h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Vamos conversar?</h2><div className="mt-9 grid gap-8 lg:grid-cols-2 lg:items-stretch"><div className="space-y-6"><div><h3 className="text-2xl font-semibold">Onde estamos</h3><p className="mt-3 flex gap-3 leading-7"><MapPin className="mt-1 h-5 w-5 shrink-0" /><span>Rua Domingos da Silva, 111<br />Bairro Campo Lençol<br />Rio Negrinho - SC · CEP 89295-260</span></p></div><div><h3 className="text-2xl font-semibold">Telefones</h3><div className="mt-3 flex flex-col gap-2"><a href="tel:+554736447411" className="flex items-center gap-2"><Phone className="h-4 w-4" />(47) 3644-7411</a><a href="tel:+554736441919" className="flex items-center gap-2"><Phone className="h-4 w-4" />(47) 3644-1919</a><a href="tel:+5547992007200" className="flex items-center gap-2"><Phone className="h-4 w-4" />(47) 99200-7200</a></div></div><Button asChild size="lg" variant="secondary"><a href={quoteLink()} target="_blank" rel="noopener noreferrer"><MessageCircle /> Chamar no WhatsApp</a></Button></div><iframe title="Localização da Imperarte Móveis" src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="min-h-[320px] w-full rounded-md border-0 bg-background lg:h-full" /></div></div></section>
  </main><SiteFooter /></>;
}
