import Image from 'next/image'

export function PaxosLogo({ className }: { className?: string }) {
    return (
        <Image
            src="/paxos-logo.png"
            alt="Paxos"
            width={120}
            height={40}
            className={`dark:invert ${className ?? ''}`}
            priority
        />
    )
}
