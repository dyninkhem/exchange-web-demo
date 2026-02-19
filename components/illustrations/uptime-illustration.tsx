export const UptimeIllustration = () => (
    <div
        aria-hidden
        className="mt-auto h-fit space-y-2.5 overflow-hidden border-t border-dashed pt-6">
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Uptime</span>
            <span className="text-foreground">99.9%</span>
        </div>
        <div className="mask-x-from-90%">
            <div className="flex w-[200%] justify-between gap-px duration-700 ease-in-out group-hover:translate-x-[-50%]">
                {Array.from({ length: 56 }).map((_, index) => (
                    <div
                        key={index}
                        className="[:nth-child(10)]:bg-muted-foreground/50 [:nth-child(11)]:bg-muted-foreground/50 [:nth-child(22)]:bg-muted-foreground/50 [:nth-child(23)]:bg-muted-foreground/50 [:nth-child(24)]:bg-muted-foreground/50 [:nth-child(32)]:bg-muted-foreground/50 h-7 w-1 rounded bg-emerald-500"></div>
                ))}
            </div>
        </div>
    </div>
)