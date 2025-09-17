import ProfileCompletionForm from '@/components/forms/profile-completion-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Complete Your Profile - REBALL',
  description: 'Complete your REBALL profile to access training sessions and materials.',
}

export default function ProfileCompletionPage() {
  return <ProfileCompletionForm />
}
