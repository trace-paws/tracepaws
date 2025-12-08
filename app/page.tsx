import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to dashboard (main app entry point)
  redirect('/dashboard')
}