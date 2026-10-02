import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { ArrowLeft, LogOut, Plus, Trash2, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

type Category = Tables<'categories'>;
type Product = Tables<'products'>;
type Picture = Tables<'product_images'>;
type Slide = Tables<'home_slides'>;
type Editor = 'category' | 'product' | 'slide';
const emptyCategory = { name: '', description: '', image_url: '', display_order: 0, is_active: true };
const emptyProduct = { name: '', description: '', image_url: '', category_id: '', display_order: 0, is_active: true, is_featured: false };
const emptySlide = { label: '', title: '', description: '', image_url: '', display_order: 0, is_active: true };
const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const Route = createFileRoute('/admin')({ head: () => ({ meta: [
  { title: 'Administração | Imperarte Móveis' }, { name: 'description', content: 'Acesso administrativo ao catálogo da Imperarte Móveis.' },
  { property: 'og:title', content: 'Administração | Imperarte Móveis' }, { property: 'og:description', content: 'Painel de gerenciamento do catálogo Imperarte.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' },
] }), component: Admin });

function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tab, setTab] = useState<Editor>('product');
  const [editing, setEditing] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [slideForm, setSlideForm] = useState(emptySlide);
  const [saving, setSaving] = useState(false);

  async function checkAccess(current: User | null) {
    setUser(current);
    if (!current) { setAuthorized(false); setLoading(false); return; }
    const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', current.id).eq('role', 'admin').maybeSingle();
    setAuthorized(!error && !!data);
    setLoading(false);
  }
  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }) => { if (alive) void checkAccess(data.user); });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => { if (alive) void checkAccess(session?.user ?? null); });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);
  async function refresh() {
    const [cats, prods, pics, home] = await Promise.all([
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('products').select('*').order('display_order'),
      supabase.from('product_images').select('*').order('display_order'),
      supabase.from('home_slides').select('*').order('display_order'),
    ]);
    if (cats.error || prods.error || pics.error || home.error) { setMessage('Não foi possível carregar o catálogo.'); return; }
    setCategories(cats.data); setProducts(prods.data); setPictures(pics.data); setSlides(home.data);
  }
  useEffect(() => { if (authorized) void refresh(); }, [authorized]);
  async function signIn(event: React.FormEvent) {
    event.preventDefault(); setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage('Não foi possível entrar. Confira seu e-mail e senha.');
  }
  async function upload(file: File, target: 'category' | 'product' | 'gallery' | 'slide') {
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) { setMessage('Escolha uma imagem de até 10 MB.'); return; }
    setSaving(true); setMessage('');
    const path = `${crypto.randomUUID()}.${file.name.split('.').pop()?.toLowerCase() || 'jpg'}`;
    const { error } = await supabase.storage.from('catalogo').upload(path, file, { contentType: file.type });
    setSaving(false);
    if (error) { setMessage('Não foi possível enviar a foto.'); return; }
    const url = supabase.storage.from('catalogo').getPublicUrl(path).data.publicUrl;
    if (target === 'category') setCategoryForm(v => ({ ...v, image_url: url }));
    if (target === 'product') setProductForm(v => ({ ...v, image_url: url }));
    if (target === 'slide') setSlideForm(v => ({ ...v, image_url: url }));
    if (target === 'gallery' && editing) {
      const { error: photoError } = await supabase.from('product_images').insert({ product_id: editing, image_url: url, alt_text: productForm.name, display_order: pictures.filter(p => p.product_id === editing).length });
      if (photoError) setMessage('Não foi possível vincular a foto ao produto.'); else await refresh();
    }
  }
  function begin(type: Editor, item?: Category | Product | Slide) {
    setTab(type); setEditing(item?.id ?? null); setMessage('');
    if (type === 'slide') { const slide = item as Slide | undefined; setSlideForm(slide ? { label: slide.label, title: slide.title, description: slide.description, image_url: slide.image_url, display_order: slide.display_order, is_active: slide.is_active } : emptySlide); }
    else if (type === 'category') { const category = item as Category | undefined; setCategoryForm(category ? { name: category.name, description: category.description, image_url: category.image_url ?? '', display_order: category.display_order, is_active: category.is_active } : emptyCategory); }
    else { const product = item as Product | undefined; setProductForm(product ? { name: product.name, description: product.description, image_url: product.image_url ?? '', category_id: product.category_id, display_order: product.display_order, is_active: product.is_active, is_featured: product.is_featured } : { ...emptyProduct, category_id: categories[0]?.id ?? '' }); }
  }
  async function save(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setMessage('');
    if (tab === 'slide') {
      if (!slideForm.image_url) { setSaving(false); setMessage('Escolha uma imagem para o slide.'); return; }
      const result = editing ? await supabase.from('home_slides').update(slideForm).eq('id', editing) : await supabase.from('home_slides').insert(slideForm);
      setSaving(false);
      if (result.error) { setMessage(`Não foi possível salvar: ${result.error.message}`); return; }
      setMessage('Alterações salvas.'); setEditing(null); await refresh(); return;
    }
    const form = tab === 'category' ? categoryForm : productForm;
    const table = tab === 'category' ? 'categories' : 'products';
    const payload = { ...form, slug: slugify(form.name), image_url: form.image_url || null };
    const result = editing
      ? await supabase.from(table).update(payload).eq('id', editing)
      : await supabase.from(table).insert(payload);
    setSaving(false);
    if (result.error) { setMessage(`Não foi possível salvar: ${result.error.message}`); return; }
    setMessage('Alterações salvas.'); setEditing(null); await refresh();
  }
  async function remove(type: Editor, id: string) {
    if (!window.confirm('Excluir este item definitivamente?')) return;
    const result = type === 'category' ? await supabase.from('categories').delete().eq('id', id) : type === 'slide' ? await supabase.from('home_slides').delete().eq('id', id) : await supabase.from('products').delete().eq('id', id);
    if (result.error) setMessage('Não foi possível excluir. Remova os produtos associados antes de excluir a categoria.'); else await refresh();
  }
  async function removePhoto(id: string) {
    if (!window.confirm('Excluir esta foto?')) return;
    const { error } = await supabase.from('product_images').delete().eq('id', id);
    if (error) setMessage('Não foi possível excluir a foto.'); else await refresh();
  }
  return <><SiteHeader /><main className="mx-auto min-h-[65vh] max-w-7xl px-5 py-12 sm:px-8"><p className="text-xs font-bold uppercase text-primary">Imperarte Móveis</p><h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Administração</h1>
    {loading ? <p className="mt-10">Carregando...</p> : !user ? <form onSubmit={signIn} className="mt-10 max-w-sm space-y-5"><div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} /></div><div><Label htmlFor="password">Senha</Label><Input id="password" type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></div><Button type="submit" className="w-full">Entrar</Button></form> : !authorized ? <div className="mt-10"><p>Esta conta não tem acesso à administração.</p><Button className="mt-4" variant="outline" onClick={() => supabase.auth.signOut()}>Sair</Button></div> : <>
      <div className="mt-8 flex flex-wrap items-center gap-3 border-b border-border pb-5"><Button variant={tab === 'product' ? 'default' : 'outline'} onClick={() => begin('product')}>Produtos</Button><Button variant={tab === 'category' ? 'default' : 'outline'} onClick={() => begin('category')}>Categorias</Button><Button variant={tab === 'slide' ? 'default' : 'outline'} onClick={() => begin('slide')}>Slides</Button><Button variant="outline" className="ml-auto" onClick={() => supabase.auth.signOut()}><LogOut /> Sair</Button></div>
      {tab === 'product' && <div className="mt-6 max-w-sm"><Label htmlFor="filter-category">Organizar produtos por categoria</Label><select id="filter-category" className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}><option value="all">Todas as categorias</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>}
      <div className="mt-8 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]"><div><div className="mb-5 flex items-center justify-between"><h2 className="text-3xl font-semibold">{tab === 'product' ? 'Produtos' : tab === 'category' ? 'Categorias' : 'Slides da página inicial'}</h2><Button variant="outline" onClick={() => begin(tab)}><Plus /> Novo</Button></div><div className="min-w-0 divide-y divide-border border-y border-border">{(tab === 'product' ? products.filter(p => categoryFilter === 'all' || p.category_id === categoryFilter) : tab === 'category' ? categories : slides).map(item => <div key={item.id} className="flex min-w-0 items-center gap-3 py-4 sm:gap-4"><img src={item.image_url || undefined} alt="" className="h-12 w-12 shrink-0 rounded bg-secondary/40 object-contain sm:h-16 sm:w-16" /><div className="min-w-0 flex-1 overflow-hidden"><p className="font-semibold">{'name' in item ? item.name : item.title}</p><p className="truncate text-sm text-muted-foreground">{'description' in item ? item.description : ''}</p>{tab === 'product' && <p className="text-xs text-primary">{categories.find(c => c.id === (item as Product).category_id)?.name}</p>}<p className="truncate text-xs text-muted-foreground">{item.is_active ? 'Visível' : 'Oculto'}</p></div><Button variant="ghost" size="icon" aria-label={`Editar ${'name' in item ? item.name : item.title}`} onClick={() => begin(tab, item)}><Pencil /></Button><Button variant="ghost" size="icon" aria-label={`Excluir ${'name' in item ? item.name : item.title}`} onClick={() => remove(tab, item.id)}><Trash2 /></Button></div>)}</div></div>
      <form onSubmit={save} className="min-w-0 space-y-5 border-t-2 border-primary bg-secondary/30 p-5"><h2 className="text-2xl font-semibold">{editing ? 'Editar' : 'Adicionar'} {tab === 'product' ? 'produto' : tab === 'category' ? 'categoria' : 'slide'}</h2>
      {tab === 'slide' ? <><div><Label htmlFor="slide-label">Etiqueta</Label><Input id="slide-label" value={slideForm.label} onChange={e => setSlideForm(v => ({ ...v, label: e.target.value }))} /></div><div><Label htmlFor="slide-title">Título</Label><Input id="slide-title" required value={slideForm.title} onChange={e => setSlideForm(v => ({ ...v, title: e.target.value }))} /></div><div><Label htmlFor="slide-description">Texto</Label><Textarea id="slide-description" rows={4} value={slideForm.description} onChange={e => setSlideForm(v => ({ ...v, description: e.target.value }))} /></div></> : <><div><Label htmlFor="item-name">Nome</Label><Input id="item-name" required value={tab === 'product' ? productForm.name : categoryForm.name} onChange={e => tab === 'product' ? setProductForm(v => ({ ...v, name: e.target.value })) : setCategoryForm(v => ({ ...v, name: e.target.value }))} /></div><div><Label htmlFor="item-description">Descrição</Label><Textarea id="item-description" rows={4} value={tab === 'product' ? productForm.description : categoryForm.description} onChange={e => tab === 'product' ? setProductForm(v => ({ ...v, description: e.target.value })) : setCategoryForm(v => ({ ...v, description: e.target.value }))} /></div>{tab === 'product' && <div><Label htmlFor="category">Categoria</Label><select id="category" required className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3" value={productForm.category_id} onChange={e => setProductForm(v => ({ ...v, category_id: e.target.value }))}><option value="">Selecione</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>}</>}
      <div><Label htmlFor="main-photo">{tab === 'slide' ? 'Imagem do slide' : 'Foto principal'}</Label><Input id="main-photo" type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) void upload(file, tab); }} />{(tab === 'slide' ? slideForm.image_url : tab === 'product' ? productForm.image_url : categoryForm.image_url) && <img src={tab === 'slide' ? slideForm.image_url : tab === 'product' ? productForm.image_url : categoryForm.image_url} alt="Prévia da foto" className="mt-3 h-32 w-32 bg-background object-contain" />}</div><div><Label htmlFor="order">Ordem de exibição</Label><Input id="order" type="number" value={tab === 'slide' ? slideForm.display_order : tab === 'product' ? productForm.display_order : categoryForm.display_order} onChange={e => { const display_order = Number(e.target.value); if (tab === 'slide') setSlideForm(v => ({ ...v, display_order })); else if (tab === 'product') setProductForm(v => ({ ...v, display_order })); else setCategoryForm(v => ({ ...v, display_order })); }} /></div><label className="flex items-center gap-2"><input type="checkbox" checked={tab === 'slide' ? slideForm.is_active : tab === 'product' ? productForm.is_active : categoryForm.is_active} onChange={e => { const is_active = e.target.checked; if (tab === 'slide') setSlideForm(v => ({ ...v, is_active })); else if (tab === 'product') setProductForm(v => ({ ...v, is_active })); else setCategoryForm(v => ({ ...v, is_active })); }} /> Visível no site</label>{tab === 'product' && <label className="flex items-center gap-2"><input type="checkbox" checked={productForm.is_featured} onChange={e => setProductForm(v => ({ ...v, is_featured: e.target.checked }))} /> Destaque na página inicial</label>}
      <Button type="submit" disabled={saving} className="w-full">{saving ? 'Aguarde...' : 'Salvar'}</Button>
      {tab === 'product' && editing && <div className="border-t border-border pt-5"><Label htmlFor="gallery">Fotos adicionais</Label><Input id="gallery" type="file" accept="image/*" multiple onChange={async e => { for (const file of Array.from(e.target.files ?? [])) await upload(file, 'gallery'); }} /><div className="mt-3 flex flex-wrap gap-2">{pictures.filter(p => p.product_id === editing).map(p => <div key={p.id} className="relative"><img src={p.image_url} alt={p.alt_text} className="h-20 w-20 object-contain" /><Button type="button" size="icon" variant="destructive" className="absolute right-0 top-0 h-6 w-6" aria-label="Excluir foto" onClick={() => removePhoto(p.id)}><Trash2 /></Button></div>)}</div></div>}</form></div>
    </>}{message && <p role="status" className="mt-5 text-sm text-primary">{message}</p>}<Link to="/" className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Voltar ao site</Link></main><SiteFooter /></>;
}
