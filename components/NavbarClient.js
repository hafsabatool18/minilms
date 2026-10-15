'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { GraduationCap, LogOut, Menu, X } from 'lucide-react'

function getLinks(user) {
  const home = { href: '/', label: 'Home', exact: true }

  if (!user) return [home]

  if (user.role === 'teacher') {
    return [
      home,
      { href: '/dashboard', label: 'Dashboard', exact: true },
      { href: '/teacher/courses', label: 'My Courses', exact: true },
      { href: '/teacher/courses/new', label: 'New Course', exact: true },
    ]
  }

  return [
    home,
    { href: '/dashboard', label: 'Dashboard', exact: true },
    { href: '/courses', label: 'Browse Courses', exact: false },
    { href: '/my-courses', label: 'My Courses', exact: true },
  ]
}

export default function NavbarClient({ user }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = getLinks(user)

  const isActive = (link) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href)

  const linkClass = (link) =>
    `rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
      isActive(link)
        ? 'bg-brand-900/10 font-semibold text-brand-900'
        : 'text-brand-400 hover:bg-brand-900/5 hover:text-brand-900'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-surface/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--brand-900), var(--brand-600))',
            }}
          >
            <GraduationCap size={20} />
          </span>
          <span className="text-lg font-bold tracking-tight text-brand-900">
            Mini<span className="text-brand-600">LMS</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link)}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <div className="leading-tight">
                  <p className="max-w-32 truncate text-sm font-semibold text-brand-900">
                    {user.name}
                  </p>
                  <p className="text-xs capitalize text-sage">{user.role}</p>
                </div>
              </div>

              <form action="/auth/signout" method="post">
                <button type="submit" className="btn-outline">
                  <LogOut size={16} />
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-outline">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-brand-900 transition-all duration-300 hover:bg-brand-900/10 active:scale-90 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="animate-fade-in border-t border-brand-100 bg-surface/95 px-4 pb-5 pt-3 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={linkClass(link)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-brand-100 pt-4">
            {user ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 leading-tight">
                    <p className="truncate text-sm font-semibold text-brand-900">
                      {user.name}
                    </p>
                    <p className="text-xs capitalize text-sage">{user.role}</p>
                  </div>
                </div>

                <form action="/auth/signout" method="post">
                  <button type="submit" className="btn-outline">
                    <LogOut size={16} />
                    Log out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="btn-outline flex-1"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="btn-primary flex-1"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}