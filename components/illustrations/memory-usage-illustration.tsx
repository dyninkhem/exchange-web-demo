import { cn } from '@/lib/utils'

export const MemoryUsageIllustration = () => (
    <div className="mt-auto h-fit border-t border-dashed pt-6">
        <div className="space-y-2.5">
            <span className="text-foreground block text-sm font-medium">Memory Usage</span>
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground text-sm">56 GB / 128 GB</span>
                <span className="text-foreground">45%</span>
            </div>
            <div
                className={cn(
                    'before:bg-linear-to-r before:z-1 before:inset-ring-1 before:inset-ring-foreground/10 before:absolute before:inset-0 before:w-2/5 before:rounded-full before:from-sky-500 before:to-emerald-400 before:duration-1000 before:ease-in-out',
                    'bg-muted relative mt-1.5 h-2 rounded-full',
                    'after:bg-linear-to-r after:blur-xs after:absolute after:inset-0 after:w-2/5 after:from-sky-500 after:to-emerald-400 after:opacity-50 after:duration-1000 after:ease-in-out',
                    'group-hover:before:w-4/5 group-hover:after:w-4/5'
                )}
            />
        </div>
    </div>
)