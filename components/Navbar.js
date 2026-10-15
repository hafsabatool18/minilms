import { createClient } from '@/lib/supabase/server'
import NavbarClient from './NavbarClient'

export default async function Navbar() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let currentUser = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .single()

    currentUser = {
      name: profile?.full_name || user.email,
      role: profile?.role || 'student',
    }
  }

  return <NavbarClient user={currentUser} />
}