import type { ReactNode } from 'react'
import { Switch } from '../ui/Switch'

interface SettingRowProps {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  icon?: ReactNode
}

export function SettingRow({
  title,
  description,
  checked,
  onChange,
  label,
  icon,
}: SettingRowProps) {
  return (
    <div className="setting-row">
      {icon ? <span className="setting-row__icon">{icon}</span> : null}
      <div className="setting-row__copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  )
}
