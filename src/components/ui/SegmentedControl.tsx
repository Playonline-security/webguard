import type { LucideIcon } from 'lucide-react'
import { cx } from '../../lib/cx'

export interface SegmentOption<T extends string> {
  value: T
  label: string
  icon?: LucideIcon
}

interface SegmentedControlProps<T extends string> {
  label: string
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  size?: 'sm' | 'md'
  className?: string
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cx('segmented', `segmented--${size}`, className)}
      role="group"
      aria-label={label}
    >
      {options.map((option) => {
        const Icon = option.icon
        return (
          <button
            key={option.value}
            type="button"
            className={cx('segmented__option', value === option.value && 'is-active')}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {Icon ? <Icon size={14} aria-hidden="true" /> : null}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
