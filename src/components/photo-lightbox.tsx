import { useState } from 'react';
import { Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
export function PhotoLightbox({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="ghost" className="relative h-full w-full p-0" aria-label={`Ampliar foto de ${alt}`}><img src={src} alt={alt} className="h-full w-full object-contain p-4" /><span className="absolute bottom-3 right-3 rounded bg-background p-2 text-foreground"><Expand className="h-4 w-4" /></span></Button></DialogTrigger><DialogContent className="max-h-[90vh] max-w-5xl overflow-auto"><DialogTitle className="font-display text-2xl">{alt}</DialogTitle><img src={src} alt={alt} className="mx-auto max-h-[75vh] w-full object-contain" /></DialogContent></Dialog>;
}
