'use client'

import * as React from 'react'
import { MoonStar, SunDim } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const ThemeToggle = ({ className }: { className?: string }) => {
    const [mounted, setMounted] = React.useState(false)
    const { theme, setTheme } = useTheme()

    const toggleTheme = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }, [theme, setTheme])

    React.useEffect(() => {
        setMounted(true)
    }, [])

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 't' || e.key === 'T') {
                const target = e.target as HTMLElement
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                    return
                }
                toggleTheme()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [toggleTheme])

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                className={cn('size-8 rounded-full', className)}
                aria-label="Toggle theme">
                <SunDim className="size-5!" />
            </Button>
        )
    }

    return (
        <Button
            onClick={toggleTheme}
            variant="ghost"
            className={cn('size-8 rounded-full', className)}
            aria-label="Toggle theme">
            {theme === 'dark' ? <SunDim className="size-5!" /> : <MoonStar />}
        </Button>
    )
}
