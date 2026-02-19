import { Globe } from 'lucide-react'

export const KeysIllustration = () => (
    <div
        aria-hidden
        className="@4xl:aspect-auto flex aspect-video items-center justify-center text-white">
        <div className="relative mx-auto flex w-fit gap-3">
            <div className="border-foreground/15 absolute -inset-x-6 inset-y-0 border-y border-dashed"></div>
            <div className="border-foreground/15 absolute -inset-y-6 inset-x-0 border-x border-dashed"></div>
            <div className="ring-foreground inset-shadow-sm inset-shadow-white/25 relative flex aspect-square size-16 items-center rounded-[7px] border border-white/25 bg-zinc-700 p-3 shadow-lg shadow-black/35 ring">
                <span className="absolute right-2 top-1 block text-sm">fn</span>
                <Globe className="mt-auto size-4" />
            </div>
            <div className="ring-foreground inset-shadow-sm inset-shadow-white/25 relative flex aspect-square size-16 items-center justify-center rounded-[7px] border border-white/25 bg-zinc-700 p-3 shadow-lg shadow-black/35 ring">
                <span>K</span>
            </div>
        </div>
    </div>
)