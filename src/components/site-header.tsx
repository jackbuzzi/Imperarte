import { Link } from '@tanstack/react-router';
import { Menu, X, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { quoteLink } from '@/lib/catalog';
import logo from '@/assets/logo.jpg.asset.json';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="relative z-30 border-b border-border bg-background">
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
      <Link to="/" aria-label="Imperarte Móveis, início"><img src={logo.url} alt="Imperarte Móveis" className="h-14 w-36 object-contain object-left" /></Link>
      <nav className="hidden items-center gap-8 text-sm font-semibold uppercase md:flex">
        <Link to="/" activeProps={{ className: 'text-primary' }}>Início</Link>
        <Link to="/produtos" activeProps={{ className: 'text-primary' }}>Produtos</Link>
        <Link to="/contato" activeProps={{ className: 'text-primary' }}>Contato</Link>
      </nav>
      <div className="hidden md:block"><Button asChild><a href={quoteLink()} target="_blank" rel="noopener noreferrer"><MessageCircle /> Solicitar orçamento</a></Button></div>
      <Button variant="ghost" size="icon" className="md:hidden" aria-label={open ? 'Fechar menu' : 'Abrir menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
    </div>
    {open && <nav className="flex flex-col gap-1 border-t border-border px-5 py-4 text-sm font-semibold uppercase md:hidden" onClick={() => setOpen(false)}><Link className="py-3" to="/">Início</Link><Link className="py-3" to="/produtos">Produtos</Link><Link className="py-3" to="/contato">Contato</Link><a className="py-3 text-primary" href={quoteLink()} target="_blank" rel="noopener noreferrer">Solicitar orçamento</a></nav>}
  </header>;
}
