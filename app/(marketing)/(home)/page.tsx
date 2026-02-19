import React from 'react'

import { LogoCloud } from '@/components/logo-cloud'

import { PlatformFeatures } from '@/app/(marketing)/(home)/sections/platform-features'
import { AnalyticsFeatures } from '@/app/(marketing)/(home)/sections/analytics-features'
import { TestimonialsSection } from '@/app/(marketing)/(home)/sections/testimonials-section'
import { CallToAction } from '@/components/call-to-action'
import { ProductDirectionFeaturesSection } from '@/app/(marketing)/(home)/sections/product-direction-features'
import { MoreFeatures } from '@/app/(marketing)/(home)/sections/more-features'
import HeroSection from '@/components/hero/HeroSection'

export default function Home() {
    return (
        <>
            <section>
                <div className="bg-muted">
                    <HeroSection />
                </div>
                <LogoCloud />
            </section>
            <AnalyticsFeatures />
            <PlatformFeatures />
            <ProductDirectionFeaturesSection />
            <MoreFeatures />
            <TestimonialsSection />
            <CallToAction />
        </>
    )
}