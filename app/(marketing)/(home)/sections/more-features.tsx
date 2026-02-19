import { Card } from '@/components/ui/card'
import { UptimeIllustration } from '@/components/illustrations/uptime-illustration'
import { KeysIllustration } from '@/components/illustrations/keys-illustration'
import { CurrencyIllustration } from '@/components/illustrations/currency-illustration'
import { MemoryUsageIllustration } from '@/components/illustrations/memory-usage-illustration'
import { ChipIllustration } from '@/components/illustrations/chip-illustration'
import { Shield } from 'lucide-react'

export function MoreFeatures() {
    return (
        <section className="relative">
            <div
                aria-hidden
                className="mask-b-from-65% pointer-events-none absolute -left-2 right-0 -mt-12 sm:-top-24 lg:inset-x-0 lg:-top-32">
                <svg
                    viewBox="0 0 2400 1653"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-foreground/15 fill-background/35 w-full">
                    <path
                        d="M6.81602 605.752L38.684 642.748C42.4362 647.104 44.5 652.662 44.5 658.411V1628.23C44.5 1641.59 55.4076 1652.38 68.7652 1652.23L2375.26 1626.76C2388.42 1626.62 2399 1615.92 2399 1602.76V2L2153.06 247.941C2144.06 256.943 2131.85 262 2119.12 262H90.4852C84.094 262 77.9667 264.549 73.4616 269.083L7.97632 334.98C3.50795 339.476 1 345.558 1 351.897V590.089C1 595.838 3.06383 601.396 6.81602 605.752Z"
                        stroke="currentColor"
                    />
                </svg>
            </div>

            <div className="@container relative py-16 lg:py-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div>
                        <span className="text-primary font-mono text-sm uppercase">What you get</span>
                        <div className="mt-8 grid items-end gap-6 md:grid-cols-2">
                            <h2 className="text-foreground text-4xl font-semibold md:text-5xl">Everything you need to launch crypto, nothing you don't</h2>
                            <div className="lg:pl-12">
                                <p className="text-muted-foreground text-balance">Regulated infrastructure, enterprise security, and developer-first tooling — built for scale from day one.</p>
                            </div>
                        </div>
                    </div>
                    <div className="@xl:grid-cols-2 @3xl:grid-cols-3 mt-16 grid gap-2 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] *:shadow-lg *:shadow-black/5 lg:-mx-8">
                        <Card className="group grid grid-rows-[auto_1fr] gap-8 rounded-2xl p-8">
                            <div>
                                <h3 className="text-foreground font-semibold">99.9% Uptime SLA</h3>
                                <p className="text-muted-foreground mt-3">Always-on infrastructure with automatic failover and global redundancy. Your users trade around the clock, so we never sleep.</p>
                            </div>

                            <UptimeIllustration />
                        </Card>

                        <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
                            <div>
                                <h3 className="text-foreground font-semibold">Sandbox Environment</h3>
                                <p className="text-muted-foreground mt-3">Full testing environment that mirrors production. Validate trading, transfers, and custody flows before going live.</p>
                            </div>

                            <div
                                aria-hidden
                                className="bg-linear-to-b border-background -m-8 flex flex-col justify-center border-x from-transparent to-zinc-50 p-8">
                                <KeysIllustration />
                            </div>
                        </Card>
                        <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
                            <div>
                                <h3 className="text-foreground font-semibold">Multi-Asset Support</h3>
                                <p className="text-muted-foreground mt-3">BTC, ETH, SOL, LTC, PYUSD, PAXG, and 20+ digital assets — with more added regularly.</p>
                            </div>

                            <div
                                aria-hidden
                                className="bg-linear-to-b border-background -m-8 flex flex-col justify-center border-x from-transparent to-zinc-50 p-8">
                                <CurrencyIllustration />
                            </div>
                        </Card>
                        <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
                            <div>
                                <h3 className="text-foreground font-semibold">Enterprise Security</h3>
                                <p className="text-muted-foreground mt-3">Role-based access, audit trails, and fine-grained API key controls keep your platform locked down by default.</p>
                            </div>

                            <div className="relative mb-6 flex">
                                <Shield className="stroke-background fill-background drop-shadow-purple-900/15 m-auto size-24 drop-shadow-2xl" />
                                <Shield className="absolute inset-0 m-auto size-32 stroke-purple-900/25 stroke-[0.1]" />
                                <Shield className="mask-b-from-35% absolute inset-0 m-auto size-24 fill-purple-100/50 stroke-purple-400 stroke-[0.1]" />
                                <Shield
                                    strokeDasharray="0.2 0.2"
                                    className="absolute inset-0 m-auto size-40 stroke-purple-900/15 stroke-[0.1]"
                                />
                                <Shield
                                    strokeDasharray="0.2 0.2"
                                    className="absolute inset-0 m-auto size-48 stroke-purple-900/5 stroke-[0.1]"
                                />
                            </div>
                        </Card>
                        <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
                            <div>
                                <h3 className="text-foreground font-semibold">Real-time Webhooks</h3>
                                <p className="text-muted-foreground mt-3">Event-driven notifications for every state change — orders, transfers, identity verifications, and settlements.</p>
                            </div>

                            <MemoryUsageIllustration />
                        </Card>
                        <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
                            <div>
                                <h3 className="text-foreground font-semibold">Instant Settlement</h3>
                                <p className="text-muted-foreground mt-3">T+0 settlement eliminates counterparty risk and accelerates your cash flow. No more waiting for clearing.</p>
                            </div>

                            <ChipIllustration />
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}