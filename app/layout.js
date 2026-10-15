import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import ToastProvider from '@/components/ToastProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'MiniLMS',
  description: 'Teachers create courses. Students learn with an AI assistant.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ToastProvider>
          <Navbar />
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}