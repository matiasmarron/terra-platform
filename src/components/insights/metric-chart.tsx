type DataPoint = { date: string; value: number }

type Props = {
  data:    DataPoint[]
  color?:  string
  height?: number
}

export default function MetricChart({ data, color = '#8B5E3C', height = 64 }: Props) {
  if (data.length < 2) return null

  const width  = 300
  const pad    = 4
  const minVal = 1
  const maxVal = 5

  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2)
    const y = pad + ((maxVal - d.value) / (maxVal - minVal)) * (height - pad * 2)
    return { x, y }
  })

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')

  // Area fill path
  const areaD = [
    `M ${points[0].x.toFixed(1)} ${height}`,
    ...points.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
    `L ${points[points.length - 1].x.toFixed(1)} ${height}`,
    'Z',
  ].join(' ')

  const gradId = `grad-${color.replace('#', '')}`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ height }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>

      {/* Horizontal guide lines at 1,2,3,4,5 */}
      {[1, 2, 3, 4, 5].map((v) => {
        const y = pad + ((maxVal - v) / (maxVal - minVal)) * (height - pad * 2)
        return (
          <line
            key={v}
            x1={pad} y1={y.toFixed(1)}
            x2={width - pad} y2={y.toFixed(1)}
            stroke="#E4D9CC"
            strokeWidth="0.5"
          />
        )
      })}

      {/* Area */}
      <path d={areaD} fill={`url(#${gradId})`} />

      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Last point dot */}
      <circle
        cx={points[points.length - 1].x.toFixed(1)}
        cy={points[points.length - 1].y.toFixed(1)}
        r="3"
        fill={color}
      />
    </svg>
  )
}
