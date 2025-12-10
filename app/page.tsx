import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to dashboard (staff login) or marketing page
  redirect('/dashboard')
}