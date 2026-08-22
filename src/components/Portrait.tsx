import { ImageOff } from 'lucide-react';

interface Props {
  src?: string;
  name: string;
  accent: string;
  variant: 'validator' | 'developer' | 'delivery' | 'customer';
  className?: string;
  interactive?: boolean;
  face?: boolean;
}

export function Portrait({ src, name, accent, variant, className = '', interactive = false, face = false }: Props) {
  const portraitClass =
    `${className} ${interactive ? 'portrait-interactive' : ''} ${face ? 'portrait-face' : ''}`.trim();
  if (src) {
    return (
      <div className={`portrait ${portraitClass}`} style={{ ['--accent' as string]: accent }}>
        <img className="portrait-img" src={src} alt={name} draggable={false} />
        <span className="portrait-glow" />
      </div>
    );
  }
  return (
    <div className={`portrait portrait-placeholder ${portraitClass}`} style={{ ['--accent' as string]: accent }}>
      <span className="portrait-glow" />
      <svg className="portrait-silhouette" viewBox="0 0 120 200" aria-hidden="true">
        <circle cx="60" cy="52" r="24" />
        <path d="M20 190 C22 128 40 100 60 100 C80 100 98 128 100 190 Z" />
        {variant === 'validator' && (
          <>
            <rect x="42" y="46" width="16" height="10" rx="4" className="portrait-sil-cut" />
            <rect x="62" y="46" width="16" height="10" rx="4" className="portrait-sil-cut" />
          </>
        )}
        {variant === 'developer' && <rect x="40" y="45" width="40" height="9" rx="4.5" className="portrait-sil-cut" />}
        {variant === 'delivery' && <path d="M44 44 Q60 36 76 44" className="portrait-sil-cut" strokeWidth="4" fill="none" />}
        {variant === 'customer' && <path d="M52 100 L60 118 L68 100 L60 96 Z" className="portrait-sil-cut" />}
      </svg>
      <span className="portrait-note">
        <ImageOff size={13} />
        立绘待替换 · {name}
      </span>
    </div>
  );
}
