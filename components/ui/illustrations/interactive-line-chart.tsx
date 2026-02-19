'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const chartData = [
    { date: 'Dec 1', people: 1200, views: 2100 },
    { date: 'Dec 3', people: 1350, views: 2300 },
    { date: 'Dec 5', people: 1900, views: 3400 },
    { date: 'Dec 7', people: 1750, views: 3100 },
    { date: 'Dec 9', people: 2400, views: 4200 },
    { date: 'Dec 11', people: 2200, views: 3900 },
    { date: 'Dec 13', people: 2850, views: 5100 },
    { date: 'Dec 15', people: 3100, views: 5400 },
    { date: 'Dec 17', people: 2900, views: 5000 },
    { date: 'Dec 19', people: 3600, views: 6300 },
    { date: 'Dec 21', people: 4100, views: 7200 },
    { date: 'Dec 23', people: 3800, views: 6800 },
    { date: 'Dec 25', people: 4500, views: 8100 },
    { date: 'Dec 27', people: 5200, views: 9200 },
    { date: 'Dec 29', people: 4900, views: 8700 },
    { date: 'Dec 31', people: 5800, views: 10500 },
]

export const InteractiveLineChart = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [animX, setAnimX] = useState(300)
    const [displayIndex, setDisplayIndex] = useState(0)
    const targetX = useRef(300)
    const rafId = useRef<number | undefined>(undefined)

    const width = 600
    const height = 200
    const padding = { top: 20, right: 20, bottom: 40, left: 20 }

    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    const maxPeople = Math.max(...chartData.map((d) => d.people))
    const maxViews = Math.max(...chartData.map((d) => d.views))
    const maxValue = Math.max(maxPeople, maxViews)

    const getX = useCallback((index: number) => padding.left + (index / (chartData.length - 1)) * chartWidth, [chartWidth])
    const getY = (value: number) => padding.top + chartHeight - (value / maxValue) * chartHeight

    const createSmoothPath = (data: number[]) => {
        const points = data.map((value, index) => ({ x: getX(index), y: getY(value) }))

        if (points.length < 2) return ''

        let path = `M ${points[0].x} ${points[0].y}`

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? i : i - 1]
            const p1 = points[i]
            const p2 = points[i + 1]
            const p3 = points[i + 2 >= points.length ? i + 1 : i + 2]

            const cp1x = p1.x + (p2.x - p0.x) / 6
            const cp1y = p1.y + (p2.y - p0.y) / 6
            const cp2x = p2.x - (p3.x - p1.x) / 6
            const cp2y = p2.y - (p3.y - p1.y) / 6

            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
        }

        return path
    }

    const peoplePath = createSmoothPath(chartData.map((d) => d.people))
    const viewsPath = createSmoothPath(chartData.map((d) => d.views))

    useEffect(() => {
        const animate = () => {
            setAnimX((prev) => {
                const diff = targetX.current - prev
                if (Math.abs(diff) < 0.5) return targetX.current
                return prev + diff * 0.15
            })
            rafId.current = requestAnimationFrame(animate)
        }
        rafId.current = requestAnimationFrame(animate)
        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current)
        }
    }, [])

    useEffect(() => {
        if (hoveredIndex !== null) {
            targetX.current = getX(hoveredIndex)
            queueMicrotask(() => setDisplayIndex(hoveredIndex))
        }
    }, [hoveredIndex, getX])

    const segmentWidth = chartWidth / (chartData.length - 1)

    return (
        <div className="relative w-full">
            <svg
                width="100%"
                viewBox={`0 0 ${width} ${height}`}
                className="overflow-visible">
                <path
                    d={viewsPath}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeOpacity={hoveredIndex !== null ? 0.2 : 1}
                    strokeWidth={1}
                    className="transition-all duration-200 ease-out"
                />

                <path
                    d={peoplePath}
                    fill="none"
                    stroke="var(--color-muted-foreground)"
                    strokeOpacity={hoveredIndex !== null ? 0.2 : 0.5}
                    strokeWidth={1}
                    className="transition-all duration-200 ease-out"
                />

                <defs>
                    <clipPath id="highlight-clip">
                        <rect
                            x={animX - segmentWidth * 1.5}
                            y={0}
                            width={segmentWidth * 3}
                            height={height}
                        />
                    </clipPath>
                </defs>

                <g
                    clipPath="url(#highlight-clip)"
                    style={{ opacity: hoveredIndex !== null ? 1 : 0, transition: 'opacity 100ms' }}>
                    <path
                        d={viewsPath}
                        fill="none"
                        stroke="var(--color-primary)"
                    />
                    <path
                        d={peoplePath}
                        fill="none"
                        stroke="var(--color-muted-foreground)"
                    />
                </g>

                <line
                    x1={animX}
                    y1={padding.top}
                    x2={animX}
                    y2={height - padding.bottom}
                    stroke="var(--color-border)"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    style={{ opacity: hoveredIndex !== null ? 1 : 0, transition: 'opacity 100ms ease-out' }}
                />

                {/* Data points and hover areas */}
                {chartData.map((point, index) => (
                    <g key={index}>
                        {/* Hover area */}
                        <rect
                            x={getX(index) - chartWidth / chartData.length / 2}
                            y={padding.top}
                            width={chartWidth / chartData.length}
                            height={chartHeight}
                            fill="transparent"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="cursor-pointer"
                        />

                        {/* Points - always rendered for smooth transitions */}
                        <circle
                            cx={getX(index)}
                            cy={getY(point.views)}
                            r={hoveredIndex === index ? 3 : 0}
                            fill="var(--color-primary)"
                            stroke="var(--color-illustration)"
                            strokeWidth={2}
                        />
                        <circle
                            cx={getX(index)}
                            cy={getY(point.people)}
                            r={hoveredIndex === index ? 3 : 0}
                            fill="var(--color-muted-foreground)"
                            stroke="var(--color-illustration)"
                            strokeWidth={2}
                        />
                    </g>
                ))}

                {chartData
                    .filter((_, i) => i % 2 === 0 || i === chartData.length - 1)
                    .map((point) => {
                        const originalIndex = chartData.findIndex((d) => d.date === point.date)
                        return (
                            <text
                                key={point.date}
                                x={getX(originalIndex)}
                                y={height - 10}
                                textAnchor="middle"
                                fontSize="6px"
                                fill="var(--muted-foreground)">
                                {point.date}
                            </text>
                        )
                    })}
            </svg>

            <div
                data-theme="dark"
                className="pointer-events-none absolute z-10 transition-all duration-200 ease-out"
                style={{
                    left: `${(getX(displayIndex) / width) * 100}%`,
                    top: '0',
                    transform: 'translateX(-50%)',
                    opacity: hoveredIndex !== null ? 1 : 0,
                }}>
                <div className="bg-illustration ring-border rounded-lg px-3 py-2 text-xs shadow-lg ring-1 backdrop-blur-sm">
                    <div className="mb-1.5 font-medium opacity-80">Sat, {chartData[displayIndex].date}</div>

                    <div className="flex items-center gap-1.5">
                        <span className="bg-primary size-2 rounded-full" />
                        <span className="opacity-70">People</span>
                        <span className="ml-auto pl-8 font-semibold">{chartData[displayIndex].people.toLocaleString()}</span>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5">
                        <span className="bg-muted-foreground size-2 rounded-full" />
                        <span className="opacity-70">Views</span>
                        <span className="ml-auto pl-8 font-semibold">{chartData[displayIndex].views.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div
                className="pointer-events-none absolute transition-all duration-200 ease-out"
                style={{
                    left: `${(getX(displayIndex) / width) * 100}%`,
                    bottom: '0',
                    transform: 'translateX(-50%)',
                    opacity: hoveredIndex !== null ? 1 : 0,
                }}>
                <div className="absolute -translate-x-1/2 -translate-y-[150%] text-nowrap rounded-full bg-black px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-black">{chartData[displayIndex].date}</div>
            </div>
        </div>
    )
}