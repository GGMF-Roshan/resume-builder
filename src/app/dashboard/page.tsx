import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DeleteResumeButton from '@/components/DeleteResumeButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: resumes } = await supabase
    .from('resumes')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Resumes</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
        <Link
          href="/new"
          className="rounded-md bg-white text-black px-4 py-2 text-sm"
        >
          + Create Resume
        </Link>
      </div>

      {!resumes || resumes.length === 0 ? (
        <p className="text-muted-foreground">No resumes yet. Create your first one!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="border border-white/20 rounded-lg p-4 hover:border-white/40 transition-colors relative"
            >
              <Link href={`/editor/${resume.id}`}>
                <h2 className="font-medium pr-16">{resume.title}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {resume.format === 'modern' ? 'Modern Resume' : 'Bio-data'}
                </p>
              </Link>
              <div className="absolute top-4 right-4">
                <DeleteResumeButton resumeId={resume.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}