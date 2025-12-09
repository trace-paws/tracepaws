import { redirect } from 'next/navigation'

// Homepage redirects to dashboard (staff login required)
export default function HomePage() {
  redirect('/dashboard')
}