import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-[#162E55] text-white sticky top-0 z-50">
      <div className="w-[370px] max-w-full mx-auto px-4 py-3 flex items-center gap-3">
        {/* OAK Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/oak-foundation-logo.png"
            alt="Oak Foundation"
            width={72}
            height={26}
            className="h-5 w-auto object-contain"
            priority
          />
        </Link>

        {/* Separator */}
        <div className="w-px h-4 bg-white/20 flex-shrink-0" />

        {/* Event Title */}
        <span className="text-[11px] font-semibold tracking-wider uppercase text-white/90 truncate">
          Partner Convening 2026
        </span>
      </div>
    </header>
  )
}
