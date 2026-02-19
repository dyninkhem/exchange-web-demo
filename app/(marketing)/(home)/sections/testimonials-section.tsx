import { Testimonials } from '@/components/testimonials'

export function TestimonialsSection() {
    return (
        <section className="py-24">
            <div className="mx-auto w-full max-w-5xl px-6">
                <div className="mx-auto mb-16 max-w-2xl space-y-6 text-center">
                    <span className="text-primary font-mono text-sm uppercase">Testimonials</span>
                    <h2 className="text-foreground mt-8 text-balance text-4xl font-semibold md:text-5xl">Powering crypto for the world's most trusted brands</h2>
                    <p className="text-muted-foreground text-balance text-lg">From fintechs to global banks, enterprises choose Paxos to bring regulated crypto to their customers.</p>
                </div>

                <Testimonials />
            </div>
        </section>
    )
}