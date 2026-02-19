import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CtaIllustration } from '@/components/illustrations/cta-illustration'

export function CallToAction() {
    return (
        <section className="relative border-b">
            <div className="mask-b-from-65% absolute inset-0">
                <CtaIllustration />
            </div>
            <div className="relative mx-auto max-w-5xl px-6">
                <div className="relative overflow-hidden p-8 md:px-32 md:py-20">
                    <div className="relative text-center">
                        <h2 className="text-balance text-4xl font-semibold md:text-5xl">Launch Crypto on Your Platform</h2>
                        <p className="text-muted-foreground mb-6 mt-4 text-balance">See how Paxos can power your crypto offering with regulated, enterprise-grade infrastructure.</p>

                        <Button asChild>
                            <Link href="#">Contact Sales</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}