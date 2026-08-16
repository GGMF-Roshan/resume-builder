'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteResumeButton({ resumeId }: { resumeId: string }) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const confirmed = window.confirm('Are you sure you want to delete this resume?')
    if (!confirmed) return

    setDeleting(true)
    const { error } = await supabase.from('resumes').delete().eq('id', resumeId)

    if (error) {
      alert('Error deleting: ' + error.message)
      setDeleting(false)
      return
    }

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
    >
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}