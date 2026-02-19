import { Shield, Scale, TrendingUp } from 'lucide-react'
import Image from 'next/image'

export function ProductDirectionFeaturesSection() {
    return (
        <section className="@container py-24">
            <div className="mx-auto w-full max-w-5xl px-6">
                <div className="relative">
                    <div className="max-w-xl">
                        <span className="text-primary font-mono text-sm uppercase">Capabilities</span>
                        <h2 className="text-foreground mb-4 mt-8 text-4xl font-semibold md:text-5xl">Crypto Brokerage Capabilities</h2>
                        <p className="text-muted-foreground text-balance">
                            Qualified custody, regulatory licensing, and best-execution trading — all via API.
                        </p>
                    </div>

                    <div className="py-16 max-lg:-mx-6 max-lg:overflow-hidden max-lg:pl-6">
                        <div className="bg-background min-w-3xl ring-foreground/10 overflow-hidden rounded-2xl p-1 shadow-2xl shadow-indigo-900/35 ring-1 backdrop-blur">
                            <div className="border-background relative aspect-video origin-top rounded-xl border-l-4">
                                <Image
                                    className="object-top-left size-full object-cover"
                                    src="https://res.cloudinary.com/dohqjvu9k/image/upload/v1757920810/circle_un3f39.png"
                                    alt="app screenshot"
                                    width={2880}
                                    height={1920}
                                    sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="@4xl:gap-12 @4xl:grid-cols-3 relative grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <Shield className="fill-foreground/10 size-4" />
                            <h3 className="mt-3 font-medium">Qualified Custody</h3>
                            <p className="text-muted-foreground line-clamp-2 text-sm">Bankruptcy-remote, regulated custody held in trust for your customers — meeting the highest institutional standards.</p>
                        </div>
                        <div className="space-y-1.5">
                            <Scale className="fill-foreground/10 size-4" />
                            <h3 className="mt-3 font-medium">Regulatory Licensing</h3>
                            <p className="text-muted-foreground line-clamp-2 text-sm">Backed by an OCC-regulated national trust charter and a MAS Major Payment Institution license for global reach.</p>
                        </div>
                        <div className="space-y-1.5">
                            <TrendingUp className="fill-foreground/10 size-4" />
                            <h3 className="mt-3 font-medium">Best-Execution Trading</h3>
                            <p className="text-muted-foreground line-clamp-2 text-sm">No principal trading, no hidden spreads. Transparent pricing with best-execution routing across top liquidity venues.</p>
                        </div>
                        <div className="space-y-1.5 md:hidden">
                            <TrendingUp className="fill-foreground/10 size-4" />
                            <h3 className="mt-3 font-medium">Best-Execution Trading</h3>
                            <p className="text-muted-foreground line-clamp-2 text-sm">No principal trading, no hidden spreads. Transparent pricing with best-execution routing across top liquidity venues.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}