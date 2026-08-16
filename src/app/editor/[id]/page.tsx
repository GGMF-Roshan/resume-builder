'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  ResumeData,
  emptyResumeData,
  emptyBiodataInfo,
  Education,
  Experience,
  ResumeFormat,
} from '@/types/resume'
import dynamic from 'next/dynamic'
import ResumePDF from '@/components/ResumePDF'

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <button className="border border-white/20 rounded-md px-4 py-2 text-sm" disabled>
        Loading PDF...
      </button>
    ),
  }
)

const inputClass =
  'w-full border border-white/20 bg-transparent rounded-md px-3 py-2 outline-none focus:border-white/40'

export default function EditorPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isNew = params.id === 'new'

  const [resumeId, setResumeId] = useState<string | null>(isNew ? null : (params.id as string))
  const [title, setTitle] = useState('Untitled Resume')
  const [format, setFormat] = useState<ResumeFormat>(
    (searchParams.get('format') as ResumeFormat) || 'modern'
  )
  const [data, setData] = useState<ResumeData>(
    format === 'biodata'
      ? { ...emptyResumeData, biodataInfo: emptyBiodataInfo }
      : emptyResumeData
  )
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (!isNew) {
      loadResume()
    }
  }, [])

  const loadResume = async () => {
    const { data: resume, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !resume) {
      router.push('/dashboard')
      return
    }

    setTitle(resume.title)
    setFormat(resume.format as ResumeFormat)
    const loadedData = resume.data as ResumeData
    if (resume.format === 'biodata' && !loadedData.biodataInfo) {
      loadedData.biodataInfo = emptyBiodataInfo
    }
    setData(loadedData)
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    if (isNew && !resumeId) {
      const { data: newResume, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title,
          format,
          data,
        })
        .select()
        .single()

      if (error) {
        alert('Error saving: ' + error.message)
        setSaving(false)
        return
      }

      setResumeId(newResume.id)
      router.push(`/editor/${newResume.id}`)
    } else {
      const { error } = await supabase
        .from('resumes')
        .update({ title, data, format })
        .eq('id', resumeId)

      if (error) {
        alert('Error saving: ' + error.message)
      } else {
        alert('Saved successfully!')
      }
    }
    setSaving(false)
  }

  const updateBiodata = (field: keyof NonNullable<ResumeData['biodataInfo']>, value: string) => {
    setData({
      ...data,
      biodataInfo: { ...(data.biodataInfo || emptyBiodataInfo), [field]: value },
    })
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startYear: '',
      endYear: '',
      percentage: '',
    }
    setData({ ...data, education: [...data.education, newEdu] })
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setData({
      ...data,
      education: data.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    })
  }

  const removeEducation = (id: string) => {
    setData({ ...data, education: data.education.filter((edu) => edu.id !== id) })
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    }
    setData({ ...data, experience: [...data.experience, newExp] })
  }

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setData({
      ...data,
      experience: data.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    })
  }

  const removeExperience = (id: string) => {
    setData({ ...data, experience: data.experience.filter((exp) => exp.id !== id) })
  }

  const [skillInput, setSkillInput] = useState('')

  const addSkill = () => {
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      setData({ ...data, skills: [...data.skills, skillInput.trim()] })
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setData({ ...data, skills: data.skills.filter((s) => s !== skill) })
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between sticky top-0 bg-black py-4 z-10 border-b border-white/20 gap-3">
        <div className="flex-1">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold border-none outline-none flex-1 bg-transparent w-full"
          />
          <p className="text-xs text-muted-foreground mt-0.5">
            {format === 'biodata' ? 'Indian Bio-data' : 'Modern Resume'}
          </p>
        </div>
        <div className="flex gap-2">
          <PDFDownloadLink
            document={<ResumePDF data={data} format={format} />}
            fileName={`${title || 'resume'}.pdf`}
            style={{
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#fff',
              textDecoration: 'none',
              display: 'inline-block',
              backgroundColor: 'transparent',
            }}
          >
            {({ loading }) => (loading ? 'Preparing...' : 'Download PDF')}
          </PDFDownloadLink>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-white text-black px-4 py-2 text-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Personal Info */}
      <section className="space-y-3">
        <h2 className="font-semibold text-lg">Personal Information</h2>
        <input
          placeholder="Full Name"
          value={data.personalInfo.fullName}
          onChange={(e) =>
            setData({ ...data, personalInfo: { ...data.personalInfo, fullName: e.target.value } })
          }
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Email"
            value={data.personalInfo.email}
            onChange={(e) =>
              setData({ ...data, personalInfo: { ...data.personalInfo, email: e.target.value } })
            }
            className={inputClass}
          />
          <input
            placeholder="Phone"
            value={data.personalInfo.phone}
            onChange={(e) =>
              setData({ ...data, personalInfo: { ...data.personalInfo, phone: e.target.value } })
            }
            className={inputClass}
          />
        </div>
        <input
          placeholder="Address"
          value={data.personalInfo.address}
          onChange={(e) =>
            setData({ ...data, personalInfo: { ...data.personalInfo, address: e.target.value } })
          }
          className={inputClass}
        />
        {format === 'modern' && (
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="LinkedIn URL"
              value={data.personalInfo.linkedin}
              onChange={(e) =>
                setData({
                  ...data,
                  personalInfo: { ...data.personalInfo, linkedin: e.target.value },
                })
              }
              className={inputClass}
            />
            <input
              placeholder="GitHub URL"
              value={data.personalInfo.github}
              onChange={(e) =>
                setData({ ...data, personalInfo: { ...data.personalInfo, github: e.target.value } })
              }
              className={inputClass}
            />
          </div>
        )}
      </section>

      {/* Bio-data Specific Fields */}
      {format === 'biodata' && (
        <section className="space-y-3">
          <h2 className="font-semibold text-lg">Personal Details</h2>
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Father's Name"
              value={data.biodataInfo?.fatherName || ''}
              onChange={(e) => updateBiodata('fatherName', e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Mother's Name"
              value={data.biodataInfo?.motherName || ''}
              onChange={(e) => updateBiodata('motherName', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              placeholder="Date of Birth"
              value={data.biodataInfo?.dateOfBirth || ''}
              onChange={(e) => updateBiodata('dateOfBirth', e.target.value)}
              className={inputClass}
            />
            <select
              value={data.biodataInfo?.gender || ''}
              onChange={(e) => updateBiodata('gender', e.target.value)}
              className={inputClass}
            >
              <option value="" className="bg-black">Gender</option>
              <option value="Male" className="bg-black">Male</option>
              <option value="Female" className="bg-black">Female</option>
              <option value="Other" className="bg-black">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={data.biodataInfo?.maritalStatus || ''}
              onChange={(e) => updateBiodata('maritalStatus', e.target.value)}
              className={inputClass}
            >
              <option value="" className="bg-black">Marital Status</option>
              <option value="Single" className="bg-black">Single</option>
              <option value="Married" className="bg-black">Married</option>
            </select>
            <input
              placeholder="Nationality"
              value={data.biodataInfo?.nationality || ''}
              onChange={(e) => updateBiodata('nationality', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Category (General/OBC/SC/ST etc.)"
              value={data.biodataInfo?.category || ''}
              onChange={(e) => updateBiodata('category', e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Religion"
              value={data.biodataInfo?.religion || ''}
              onChange={(e) => updateBiodata('religion', e.target.value)}
              className={inputClass}
            />
          </div>
          <input
            placeholder="Languages Known (comma separated)"
            value={data.biodataInfo?.languagesKnown || ''}
            onChange={(e) => updateBiodata('languagesKnown', e.target.value)}
            className={inputClass}
          />
        </section>
      )}

      {/* Summary */}
      <section className="space-y-3">
        <h2 className="font-semibold text-lg">Summary</h2>
        <textarea
          placeholder="Brief professional summary..."
          value={data.summary}
          onChange={(e) => setData({ ...data, summary: e.target.value })}
          className={`${inputClass} h-24`}
        />
      </section>

      {/* Education */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Education</h2>
          <button onClick={addEducation} className="text-sm underline">
            + Add
          </button>
        </div>
        {data.education.map((edu) => (
          <div key={edu.id} className="border border-white/20 rounded-md p-3 space-y-2 relative">
            <button
              onClick={() => removeEducation(edu.id)}
              className="absolute top-2 right-2 text-xs text-red-400"
            >
              Remove
            </button>
            <input
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Field of Study"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input
                placeholder="Start Year"
                value={edu.startYear}
                onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="End Year"
                value={edu.endYear}
                onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Percentage/CGPA"
                value={edu.percentage}
                onChange={(e) => updateEducation(edu.id, 'percentage', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        ))}
      </section>

      {/* Experience */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Work Experience</h2>
          <button onClick={addExperience} className="text-sm underline">
            + Add
          </button>
        </div>
        {data.experience.map((exp) => (
          <div key={exp.id} className="border border-white/20 rounded-md p-3 space-y-2 relative">
            <button
              onClick={() => removeExperience(exp.id)}
              className="absolute top-2 right-2 text-xs text-red-400"
            >
              Remove
            </button>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Role"
                value={exp.role}
                onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Start Date"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="End Date"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                disabled={exp.current}
                className={`${inputClass} disabled:opacity-40`}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
              />
              Currently working here
            </label>
            <textarea
              placeholder="Description of responsibilities..."
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              className={`${inputClass} h-20`}
            />
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="space-y-3">
        <h2 className="font-semibold text-lg">Skills</h2>
        <div className="flex gap-2">
          <input
            placeholder="Add a skill and press Enter"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addSkill()
              }
            }}
            className={`flex-1 ${inputClass}`}
          />
          <button onClick={addSkill} className="border border-white/20 rounded-md px-4 py-2 text-sm">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <span
              key={skill}
              className="bg-white/10 rounded-full px-3 py-1 text-sm flex items-center gap-2"
            >
              {skill}
              <button onClick={() => removeSkill(skill)} className="text-red-400">
                ×
              </button>
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}