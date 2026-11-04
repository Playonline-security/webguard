import { useEffect, useRef, useState, type ReactNode } from 'react'

interface ScaledScreenProps {
  children: ReactNode
  baseWidth?: number
  baseHeight?: number
}

export function ScaledScreen({
  children,
  baseWidth = 1180,
  baseHeight = 820,
}: ScaledScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const update = () => {
      setScale(Math.min(1, element.clientWidth / baseWidth))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [baseWidth])

  return (
    <div
      className="scaled-screen"
      ref={containerRef}
      style={{ height: `${baseHeight * scale}px` }}
    >
      <div
        className="scaled-screen__inner"
        style={{
          width: `${baseWidth}px`,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
