import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import HeroHeader from "@/components/header"
import { ChevronRight, CirclePlay } from 'lucide-react'
import { Spotify } from '@/components/ui/svgs/spotify'
import { Supabase } from '@/components/ui/svgs/supabase'
import { Beacon } from '@/components/ui/svgs/beacon'
import { ProductIllustration } from "@/components/ui/illustrations/product-illustration"

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main
                role="main"
                className="overflow-x-hidden pb-6">
                <section>
                    <div className="relative pb-36 pt-24 md:pt-36 lg:pt-44">
                        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-12">
                            <div className="md:w-1/2">
                                <div>
                                    <h1 className="max-w-md text-balance text-5xl font-medium md:text-6xl">Simple payments for startups</h1>
                                    <p className="text-muted-foreground mb-8 mt-4 max-w-2xl text-balance text-xl">One tool that does it all. Search, generate, analyze, and chat—right inside Tailark.</p>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="pl-4 pr-2.5">
                                            <Link href="#link">
                                                <span className="text-nowrap">Get Started</span>
                                                <ChevronRight className="opacity-50" />
                                            </Link>
                                        </Button>
                                        <Button
                                            key={2}
                                            asChild
                                            size="lg"
                                            variant="outline"
                                            className="pl-3.5 pr-4">
                                            <Link href="#link">
                                                <CirclePlay className="fill-primary/25 stroke-primary" />
                                                <span className="text-nowrap">Watch video</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <p className="text-muted-foreground">Trusted by teams at :</p>
                                    <div className="**:fill-foreground mt-6 flex w-full max-w-md flex-wrap items-center gap-8 *:w-fit">
                                        <Spotify
                                            height={26}
                                            width="auto"
                                        />
                                        <Supabase
                                            height={24}
                                            width="auto"
                                        />
                                        <Beacon
                                            height={18}
                                            width="auto"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="perspective-near z-20 mt-24 translate-x-12 md:absolute md:-right-6 md:bottom-16 md:left-1/2 md:top-40 md:mt-0 md:translate-x-0">
                            <div className="before:border-foreground/5 before:bg-foreground/5 relative h-full max-w-3xl before:pointer-events-none before:absolute before:-inset-x-4 before:bottom-7 before:top-0 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border">
                                <div className="max-lg:max-h-160 bg-background rounded-(--radius) shadow-black/6.5 ring-border relative h-full -translate-y-12 skew-x-6 overflow-hidden border border-transparent shadow-xl ring-1">
                                    <ProductIllustration className="xl:scale-57 2xl:scale-65 scale-99 lg:scale-56 border-transparent sm:scale-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}