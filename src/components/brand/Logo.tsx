import { cx } from '../../lib/cx'

interface LogoProps {
  tone?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
  className?: string
}

export function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span className={cx('brand-mark', `brand-mark--${size}`)} aria-hidden="true">
      <svg viewBox="0 0 40 44" focusable="false">
        <path
          d="M20 2 37 8.5v11.2C37 30.8 30.2 38.4 20 42 9.8 38.4 3 30.8 3 19.7V8.5Z"
          fill="currentColor"
        />
        <path
          d="M10.5 15.5 15 28l5-9 5 9 4.5-12.5"
          fill="none"
          stroke="var(--mark-ink, #f3f5f1)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function Logo({
  tone = 'dark',
  size = 'md',
  showWordmark = true,
  className,
}: LogoProps) {
  return (
    <span className={cx('brand-lockup', `brand-lockup--${tone}`, className)}>
      <BrandMark size={size} />
      {showWordmark ? (
        <span className="brand-lockup__word">
          Web<span>Guard</span>
        </span>
      ) : (
        <span className="sr-only">WebGuard</span>
      )}
    </span>
  )
}
