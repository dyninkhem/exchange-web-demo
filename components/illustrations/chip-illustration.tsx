import { LogoIcon } from '@/components/logo'

export const ChipIllustration = () => {
    return (
        <div
            data-theme="dark"
            className="inset-ring-1 inset-ring-white bg-background/25 before:bg-linear-to-b relative w-fit rounded-2xl border p-1 before:absolute before:inset-0 before:rounded-2xl before:to-blue-500/15">
            <div className="inset-ring-foreground/15 inset-ring-1 inset-shadow-2xs inset-shadow-white grid grid-rows-[auto_1fr_auto] gap-1 rounded-lg bg-zinc-700 p-2 shadow-xl shadow-black/25">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-1">
                    <div className="flex size-2">
                        <div className="bg-background border-foreground/50 m-auto size-1.5 rounded-full border"></div>
                    </div>
                    <div className="h-2 bg-[repeating-linear-gradient(90deg,var(--color-background),var(--color-background)_1px,transparent_1px,transparent_6px)]"></div>
                    <div className="flex size-2">
                        <div className="bg-background border-foreground/50 m-auto size-1.5 rounded-full border"></div>
                    </div>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto]">
                    <div className="w-2 bg-[repeating-linear-gradient(var(--color-background),var(--color-background)_1px,transparent_1px,transparent_6px)]"></div>
                    <div className="p-2">
                        <div className="bg-background border-foreground/25 size-16 rounded-2xl border p-1">
                            <div className="inset-ring-foreground/35 bg-linear-to-br inset-ring-1 flex size-full rounded-[11px] from-emerald-600/50 to-indigo-600/50 shadow-md shadow-indigo-600/15">
                                <LogoIcon
                                    className="m-auto size-5 text-white drop-shadow-md"
                                    uniColor
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-2 bg-[repeating-linear-gradient(var(--color-background),var(--color-background)_1px,transparent_1px,transparent_6px)]"></div>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-1">
                    <div className="flex size-2">
                        <div className="bg-background border-foreground/50 m-auto size-1.5 rounded-full border"></div>
                    </div>
                    <div className="h-2 bg-[repeating-linear-gradient(90deg,var(--color-background),var(--color-background)_1px,transparent_1px,transparent_6px)]"></div>
                    <div className="flex size-2">
                        <div className="bg-background border-foreground/50 m-auto size-1.5 rounded-full border"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}