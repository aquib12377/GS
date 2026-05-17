import type { Metadata } from 'next'
import Link from 'next/link'
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from 'next/font/google'
import '../globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | GS Gaming Blog',
    default: 'GS Gaming Blog — Guides, Reviews & Builds',
  },
  description: 'In-depth gaming guides, reviews, and build recommendations.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-neutral-950 text-neutral-100 font-body antialiased min-h-screen">
        <header className="border-b border-neutral-800 sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-bold tracking-tight hover:text-accent transition-colors">
              <span className="text-accent">GS</span> Gaming Blog
            </Link>
            <nav className="hidden sm:flex items-center gap-6 text-sm text-neutral-400">
              <Link href="/" className="hover:text-neutral-100 transition-colors">Posts</Link>
              <Link href="/admin" className="hover:text-accent transition-colors border border-neutral-700 px-3 py-1 rounded text-neutral-300">
                Admin
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-neutral-800 mt-24 py-10 text-center text-neutral-600 text-sm">
          <p>GS Gaming Blog &copy; {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  )
}
