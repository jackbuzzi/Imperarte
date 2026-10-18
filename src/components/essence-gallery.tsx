import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type GalleryPhoto = { src: string; alt: string; label: string };

export function EssenceGallery({ photos, className }: { photos: GalleryPhoto[]; className?: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActive(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    return () => { api.off('select', onSelect); };
  }, [api]);

  useEffect(() => {
    if (!api || paused || photos.length < 2) return;
    const timer = window.setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(timer);
  }, [api, paused, photos.length]);

  return (
    <Carousel opts={{ loop: true, align: 'start' }} setApi={setApi} className={className}>
      <div className="relative" onPointerDown={() => setPaused(true)}>
        <CarouselContent className="-ml-0">
          {photos.map((photo, i) => (
            <CarouselItem key={photo.src} className="pl-0" aria-roledescription="slide" aria-label={`Foto ${i + 1} de ${photos.length}: ${photo.alt}`}>
              <img src={photo.src} alt={photo.alt} loading="lazy" className="aspect-square w-full rounded-md bg-secondary/50 object-cover" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 border-0 bg-background/85 backdrop-blur data-[state=inactive]:opacity-100" aria-label="Foto anterior" onClick={() => setPaused(true)} />
        <CarouselNext className="right-3 top-1/2 -translate-y-1/2 border-0 bg-background/85 backdrop-blur data-[state=inactive]:opacity-100" aria-label="Próxima foto" onClick={() => setPaused(true)} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-muted-foreground">{photos[active]?.label}</p>
        <div className="flex items-center gap-2">
          {photos.map((photo, i) => (
            <Button key={photo.src} variant="ghost" size="icon" aria-label={`Mostrar foto ${i + 1}: ${photo.label}`} aria-current={i === active} onClick={() => { setPaused(true); api?.scrollTo(i); }} className={cn('h-6 w-6 p-0', i === active ? 'text-primary' : 'text-muted-foreground/50')}>
              <span className={cn('h-2 w-2 rounded-full bg-current transition-transform', i === active && 'scale-125')} />
            </Button>
          ))}
        </div>
      </div>
    </Carousel>
  );
}
