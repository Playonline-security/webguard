import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cx } from '../../lib/cx'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'quiet'
  | 'secondary-inverse'
  | 'quiet-inverse'
type ButtonSize = 'sm' | 'md' | 'lg'

interface CommonButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  fullWidth,
  type = 'button',
  ...rest
}: CommonButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cx(
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && 'btn--full',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  fullWidth,
  ...rest
}: CommonButtonProps & LinkProps) {
  return (
    <Link
      className={cx(
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && 'btn--full',
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
  variant?: 'plain' | 'outline'
}

export function IconButton({
  label,
  children,
  className,
  variant = 'plain',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cx('icon-btn', `icon-btn--${variant}`, className)}
      aria-label={label}
      title={label}
      {...rest}
    >
      {children}
    </button>
  )
}
