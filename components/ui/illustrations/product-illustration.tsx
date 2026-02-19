'use client'
import { LogoIcon } from '@/components/logo'
import { House, ChevronsUpDown, TrendingUp, ChartPie, Lightbulb, Cog, UsersRound, Brain, BookOpen, Menu } from 'lucide-react'
import { InteractiveLineChart } from "@/components/ui/illustrations/interactive-line-chart"
import { Openai as OpenAI } from '@/components/ui/svgs/openai'
import { cn } from '@/lib/utils'

export const ProductIllustration = ({ className }: { className?: string }) => {
    return (
        <div className={cn('min-w-screen bg-background dark:bg-background/95 sm:scale-97 xl:scale-74 lg:scale-89 2xl:max-w-340 2xl:min-w-300 grid origin-top-left scale-95 border-t lg:grid-cols-[auto_1fr]', className)}>
            <div className="p-4.5 grid w-72 grid-rows-[auto_1fr] max-lg:hidden">
                <div className="hover:bg-foreground/5 flex cursor-pointer items-center gap-2 rounded-lg p-1">
                    <div className="inset-ring-1 inset-ring-foreground/15 bg-radial flex size-7 rounded-md from-zinc-500/75 to-zinc-500 *:size-4">
                        <LogoIcon
                            uniColor
                            className="text-primary-foreground m-auto drop-shadow"
                        />
                    </div>
                    <span className="text-sm font-medium">Tailark Pro</span>
                    <ChevronsUpDown className="ml-auto size-3.5 opacity-50" />
                </div>

                <div className="mt-5 flex flex-col gap-1.5">
                    {[
                        { icon: House, label: 'Dashboard', active: true },
                        { icon: ChartPie, label: 'Analytics', active: false },
                        { icon: Lightbulb, label: 'AI Insights', active: false },
                        { icon: Brain, label: 'Predictions', active: false },
                        { icon: BookOpen, label: 'Reports', active: false },
                        { icon: UsersRound, label: 'Customers', active: false },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3.5 py-2 text-sm font-medium ${item.active ? 'bg-illustration ring-border-illustration shadow-black/6.5 shadow-xs ring-1' : 'text-muted-foreground hover:bg-foreground/3 hover:text-foreground transition-colors'}`}>
                            <item.icon className="size-4 opacity-75" />
                            {item.label}
                        </div>
                    ))}

                    <div className="py-4">
                        <div className="text-muted-foreground pl-3.5 text-xs font-medium">Projects</div>
                        <div className="mt-3 flex flex-col gap-1.5">
                            {[
                                { color: 'bg-primary', label: 'pro.tailark.com', active: true },
                                { color: 'bg-muted-foreground/75', label: 'tailark.com', active: false },
                                { color: 'bg-muted-foreground/75', label: 'irung.me', active: false },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className={cn('hover:bg-foreground/3 flex cursor-pointer items-center gap-3 rounded-lg px-3.5 py-2 text-sm font-medium', item.active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground transition-colors')}>
                                    <div className="flex size-4 *:m-auto">
                                        <div className={cn('size-2 rounded-full', item.color)} />
                                    </div>

                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-muted-foreground hover:bg-foreground/3 hover:text-foreground mt-auto flex cursor-pointer items-center gap-3 rounded-lg px-3.5 py-2 font-medium transition-colors">
                        <Cog className="size-4 opacity-75" />
                        Settings
                    </div>
                </div>
            </div>
            <div className="lg:py-1 lg:pr-1">
                <ProductContentIllustration />
            </div>
        </div>
    )
}

export const ProductContentIllustration = () => {
    return (
        <div className="ring-border shadow-black/6.5 dark:bg-card bg-card/95 shadow ring-1 lg:rounded-xl">
            <div className="max-h-237 no-scrollbar mask-b-from-95% p-2">
                <div className="flex items-center gap-1 px-1.5 pt-2 lg:hidden">
                    <div className="flex size-9 cursor-pointer *:m-auto *:size-5">
                        <Menu />
                    </div>
                    <div className="text-lg font-medium">Home</div>
                </div>
                <div className="flex gap-2 px-3.5 pt-2 *:cursor-pointer max-lg:mt-6">
                    <div className="flex items-center gap-2 rounded-full border p-1 pl-2.5">
                        <div className="text-muted-foreground text-nowrap text-xs font-medium">Revenue</div>
                        <div className="bg-card ring-border shadow-black/6.5 flex size-5 cursor-pointer rounded-full shadow ring-1 *:m-auto">
                            <ChevronsUpDown className="size-3.5 opacity-50" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border p-1 pl-2.5">
                        <div className="text-muted-foreground text-nowrap text-xs font-medium">Last 30 days</div>
                        <div className="bg-card ring-border shadow-black/6.5 flex size-5 cursor-pointer rounded-full shadow ring-1 *:m-auto">
                            <ChevronsUpDown className="size-3.5 opacity-50" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border p-1 pl-2.5">
                        <div className="text-muted-foreground text-nowrap text-xs font-medium">Daily</div>
                        <div className="bg-card ring-border shadow-black/6.5 flex size-5 cursor-pointer rounded-full shadow ring-1 *:m-auto">
                            <ChevronsUpDown className="size-3.5 opacity-50" />
                        </div>
                    </div>
                </div>
                <div className="p-3 max-lg:mt-6 lg:p-6">
                    <div className="mb-6 space-y-1.5">
                        <div className="text-foreground font-medium">Overview</div>
                        <div className="text-muted-foreground text-sm">Your main activities data</div>
                    </div>
                    <div className="*:ring-border-illustration *:bg-illustration *:shadow-black/6.5 grid grid-cols-2 gap-1.5 *:flex *:flex-col *:justify-between *:rounded-xl *:p-4 *:shadow *:ring-1 md:grid-cols-4 lg:gap-3 lg:*:p-5">
                        <div>
                            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                Total Balance
                                <div className="flex items-center gap-1">
                                    <div className="rounded-xs flex size-3 bg-emerald-600">
                                        <TrendingUp className="m-auto size-2 text-white" />
                                    </div>
                                    <span className="border-t border-transparent text-[11px] font-medium text-emerald-600 dark:text-emerald-400">65%</span>
                                </div>
                            </div>
                            <div className="mt-8">
                                <span className="text-foreground align-baseline text-xl font-semibold">$23,056</span>
                                <span className="text-foreground/50 align-baseline text-xl font-bold">.56</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-muted-foreground text-xs">Orders</div>
                            <div className="text-foreground mt-8 align-baseline text-xl font-semibold">562</div>
                        </div>

                        <div>
                            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                Customers
                                <div className="flex items-center gap-1">
                                    <div className="rounded-xs flex size-3 bg-rose-600">
                                        <TrendingUp className="m-auto size-2 text-white" />
                                    </div>
                                    <span className="border-t border-transparent text-[11px] font-medium text-rose-600 dark:text-rose-400">5%</span>
                                </div>
                            </div>
                            <div className="text-foreground mt-8 align-baseline text-xl font-semibold">456</div>
                        </div>

                        <div>
                            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                Recurring Revenue
                                <div className="flex items-center gap-1">
                                    <div className="rounded-xs flex size-3 bg-emerald-600">
                                        <TrendingUp className="m-auto size-2 text-white" />
                                    </div>
                                    <span className="border-t border-transparent text-[11px] font-medium text-emerald-600 dark:text-emerald-400">65%</span>
                                </div>
                            </div>
                            <div className="mt-8">
                                <span className="text-foreground align-baseline text-xl font-semibold">$23,056</span>
                                <span className="text-foreground/50 align-baseline text-xl font-bold">.56</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="space-y-1.5 px-3 lg:px-6">
                        <div className="text-foreground font-medium">Activity</div>
                        <div className="text-muted-foreground text-sm">Visitors and page views</div>
                    </div>
                    <div className="mt-4 pb-6">
                        <InteractiveLineChart />
                    </div>
                </div>

                <div className="relative z-10 p-3 lg:p-6">
                    <div className="space-y-1.5">
                        <div className="text-foreground font-medium">AI Insights</div>
                        <div className="text-muted-foreground text-sm">Your data interpreted in a understable language</div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="relative">
                            <div className="bg-linear-to-r/increasing absolute inset-0 rounded-full from-pink-400 via-teal-400 to-purple-400 opacity-15 blur dark:opacity-10"></div>

                            <div className="shadow-black/6.5 ring-border-illustration bg-illustration relative z-10 rounded-xl p-6 shadow-md ring-1">
                                <div className="flex gap-3">
                                    <OpenAI className="size-3.5 shrink-0" />

                                    <div>
                                        <p className="text-muted-foreground -mt-0.5 text-[13px]">
                                            <span className="text-foreground font-medium">AI Insights:</span> Your revenue increased by 23% compared to last month. Top performing products are driving 65% of total sales.
                                        </p>

                                        <button className="text-primary mt-3 text-xs font-medium">View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="shadow-black/6.5 ring-border-illustration bg-illustration relative z-10 rounded-xl p-6 shadow ring-1">
                                <div className="flex gap-3">
                                    <OpenAI className="size-3.5 shrink-0" />

                                    <div>
                                        <p className="text-muted-foreground -mt-0.5 text-[13px]">
                                            <span className="text-foreground font-medium">Critical:</span> Customer churn rate has increased by 12% this week. Immediate attention required for retention strategies.
                                        </p>

                                        <button className="text-primary mt-3 text-xs font-medium">View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}