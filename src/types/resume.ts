export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  address: string
  linkedin?: string
  github?: string
}

export interface BiodataInfo {
  fatherName: string
  motherName: string
  dateOfBirth: string
  gender: string
  maritalStatus: string
  nationality: string
  category: string
  religion: string
  languagesKnown: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startYear: string
  endYear: string
  percentage: string
}

export interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export type ResumeFormat = 'modern' | 'biodata'

export interface ResumeData {
  personalInfo: PersonalInfo
  biodataInfo?: BiodataInfo
  summary: string
  education: Education[]
  experience: Experience[]
  skills: string[]
}

export const emptyBiodataInfo: BiodataInfo = {
  fatherName: '',
  motherName: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  nationality: 'Indian',
  category: '',
  religion: '',
  languagesKnown: '',
}

export const emptyResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
  },
  summary: '',
  education: [],
  experience: [],
  skills: [],
}