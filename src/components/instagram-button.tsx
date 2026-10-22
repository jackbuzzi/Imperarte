import { Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import { instagramHandle, instagramUrl } from '@/lib/catalog';

type InstagramButtonProps = {
  variant?: 'solid' | 'outline' | 'icon';
  showHandle?: boolean;
  label?: string;
  className?: string;
};

const variants = {
  solid: 'instagram-surface px-5 py-3 text-instagram-foreground shadow-instagram hover:brightness-110',
  outline: 'border border-instagram/45 bg-background px-5 py-3 text-instagram hover:bg-instagram/8',
  icon: 'instagram-surface h-10 w-10 rounded-full text-instagram-foreground shadow-instagram hover:brightness-110',
} as const;

export function InstagramButton({
  variant = 'solid',
  showHandle = false,
  label = 'Seguir no Instagram',
  className,
}: InstagramButtonProps) {
  return (
    <a
      href={instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Seguir a Imperarte Móveis no Instagram, ${instagramHandle}`}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-semibold whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variants[variant],
        className,
      )}
    >
      <Instagram className={variant === 'icon' ? 'h-5 w-5' : 'h-5 w-5'} />
      {variant !== 'icon' && <span>{label}</span>}
      {showHandle && <span className="opacity-80">{instagramHandle}</span>}
    </a>
  );
}
