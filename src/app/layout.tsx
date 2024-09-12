import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Script from 'next/script'
import { Toaster } from '@/components/ui/toaster'
import { DashBoard } from '@/app/dashboard'

export const metadata: Metadata = {
  title: 'PLSS Teste',
  description: 'Frontend teste de admição PLSS',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://kit.fontawesome.com/9edb9e3e09.js"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body>
        <section className="relative">
          <DashBoard />
          <main className="pb-20 ml-0 lg:mb-0 lg:ml-64">{children}</main>
          <Toaster />
        </section>
      </body>
    </html>
  )
}
