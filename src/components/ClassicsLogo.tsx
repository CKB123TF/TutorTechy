import clsx from 'clsx'

export function ClassicsLogo({ className, ...props }: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 256 256"
      aria-hidden="true"
      className={clsx('text-neutral-950', className)}
      {...props}
    >
      <defs>
        <linearGradient id="c-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF7A59" />
          <stop offset="100%" stopColor="#FF4E68" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="256" height="256" rx="48" fill="url(#c-grad)" />
      {/* Open book */}
      <g fill="#FFECC7" stroke="#3A2A1E" strokeWidth="12" strokeLinejoin="round">
        <path d="M32 156c0-10 6-16 16-16 56 0 84 28 84 44v32c-20-20-56-28-100-24-0.7-11.3 0-20 0-36z" />
        <path d="M224 156c0-10-6-16-16-16-56 0-84 28-84 44v32c20-20 56-28 100-24 .7-11.3 0-20 0-36z" />
      </g>
      {/* Heart "page" shape */}
      <path
        d="M128 136c-18-20-34-32-34-56 0-22 17-40 38-40 12 0 23 6 30 16 7-10 18-16 30-16 21 0 38 18 38 40 0 24-16 36-34 56-12 14-22 22-34 34-12-12-22-20-34-34z"
        fill="#FFF6D6"
        stroke="#3A2A1E"
        strokeWidth="12"
        strokeLinejoin="round"
      />
    </svg>
  )
}


