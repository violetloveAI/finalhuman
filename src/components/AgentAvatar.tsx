interface Props {
  accent: string;
  variant: 'validator' | 'developer' | 'delivery' | 'customer';
  size?: number;
}

export function AgentAvatar({ accent, variant, size = 120 }: Props) {
  const gid = `g-${variant}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className="agent-avatar-svg"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0a0f1c" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`${gid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="112" height="112" rx="14" fill={`url(#${gid})`} stroke={accent} strokeOpacity="0.6" strokeWidth="1.5" />
      <path d="M14 26 L26 14 M94 14 L106 26 M14 94 L26 106 M94 106 L106 94" stroke={accent} strokeOpacity="0.5" strokeWidth="1.5" />
      {variant === 'customer' ? (
        <>
          <circle cx="60" cy="44" r="15" fill={`url(#${gid}-body)`} />
          <path d="M32 98 C32 74 45 66 60 66 C75 66 88 74 88 98 Z" fill={`url(#${gid}-body)`} />
          <path d="M55 68 L60 82 L65 68 L60 66 Z" fill={accent} opacity="0.9" />
          <path d="M53 66 L60 62 L67 66 L65 69 L55 69 Z" fill={accent} opacity="0.7" />
        </>
      ) : (
        <>
          <circle cx="60" cy="45" r="16" fill={`url(#${gid}-body)`} />
          {variant === 'validator' && (
            <>
              <rect x="47" y="41" width="12" height="8" rx="3" fill="none" stroke="#dbeafe" strokeWidth="1.6" />
              <rect x="61" y="41" width="12" height="8" rx="3" fill="none" stroke="#dbeafe" strokeWidth="1.6" />
              <path d="M59 45 L61 45" stroke="#dbeafe" strokeWidth="1.6" />
            </>
          )}
          {variant === 'developer' && (
            <>
              <rect x="46" y="40" width="28" height="7" rx="3.5" fill="#dbeafe" opacity="0.55" />
              <circle cx="53" cy="43" r="1.6" fill={accent} />
              <circle cx="60" cy="43" r="1.6" fill={accent} />
              <circle cx="67" cy="43" r="1.6" fill={accent} />
            </>
          )}
          {variant === 'delivery' && (
            <>
              <path d="M48 41 Q60 35 72 41" stroke="#dbeafe" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M50 47 Q60 52 70 47" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          )}
          <path
            d={
              variant === 'delivery'
                ? 'M28 100 C30 76 44 66 60 66 C80 66 92 82 94 100 L78 100 C76 88 70 78 60 78 C48 78 40 88 38 100 Z'
                : 'M30 100 C30 76 44 66 60 66 C76 66 90 76 90 100 Z'
            }
            fill={`url(#${gid}-body)`}
          />
          {variant === 'developer' && (
            <path d="M52 70 L60 78 L68 70 L68 76 L60 84 L52 76 Z" fill={accent} opacity="0.6" />
          )}
        </>
      )}
      <line x1="10" y1="34" x2="26" y2="34" stroke={accent} strokeOpacity="0.45" strokeWidth="1" />
      <line x1="10" y1="38" x2="22" y2="38" stroke={accent} strokeOpacity="0.3" strokeWidth="1" />
      <line x1="94" y1="86" x2="110" y2="86" stroke={accent} strokeOpacity="0.45" strokeWidth="1" />
      <line x1="98" y1="90" x2="110" y2="90" stroke={accent} strokeOpacity="0.3" strokeWidth="1" />
    </svg>
  );
}
