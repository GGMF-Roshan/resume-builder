import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { ResumeData, ResumeFormat } from '@/types/resume'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1a1a1a',
  },
  header: {
    marginBottom: 16,
    borderBottom: '2 solid #1a1a1a',
    paddingBottom: 10,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 9,
    color: '#444',
    gap: 8,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottom: '1 solid #ccc',
    paddingBottom: 3,
  },
  summaryText: {
    lineHeight: 1.5,
  },
  entry: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
  },
  entrySubtitle: {
    fontSize: 10,
    color: '#333',
    marginBottom: 3,
  },
  entryDate: {
    fontSize: 9,
    color: '#666',
  },
  description: {
    fontSize: 9.5,
    lineHeight: 1.4,
    color: '#333',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillPill: {
    fontSize: 9,
    backgroundColor: '#f0f0f0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  // Biodata-specific styles
  biodataTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  biodataSubtitle: {
    fontSize: 10,
    textAlign: 'center',
    color: '#555',
    marginBottom: 16,
  },
  table: {
    borderTop: '1 solid #ccc',
    borderLeft: '1 solid #ccc',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableLabelCell: {
    width: '35%',
    padding: 6,
    borderRight: '1 solid #ccc',
    borderBottom: '1 solid #ccc',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    backgroundColor: '#fafafa',
  },
  tableValueCell: {
    width: '65%',
    padding: 6,
    borderRight: '1 solid #ccc',
    borderBottom: '1 solid #ccc',
    fontSize: 9.5,
  },
})

function ModernResumePDF({ data }: { data: ResumeData }) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo.fullName || 'Your Name'}</Text>
        <View style={styles.contactRow}>
          {data.personalInfo.email && <Text>{data.personalInfo.email}</Text>}
          {data.personalInfo.phone && <Text>| {data.personalInfo.phone}</Text>}
          {data.personalInfo.address && <Text>| {data.personalInfo.address}</Text>}
        </View>
        <View style={styles.contactRow}>
          {data.personalInfo.linkedin && <Text>{data.personalInfo.linkedin}</Text>}
          {data.personalInfo.github && <Text>| {data.personalInfo.github}</Text>}
        </View>
      </View>

      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>{data.summary}</Text>
        </View>
      )}

      {data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {data.experience.map((exp) => (
            <View key={exp.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{exp.role}</Text>
                <Text style={styles.entryDate}>
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </Text>
              </View>
              <Text style={styles.entrySubtitle}>{exp.company}</Text>
              {exp.description && <Text style={styles.description}>{exp.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>
                  {edu.degree} {edu.field ? `- ${edu.field}` : ''}
                </Text>
                <Text style={styles.entryDate}>
                  {edu.startYear} - {edu.endYear}
                </Text>
              </View>
              <Text style={styles.entrySubtitle}>
                {edu.institution} {edu.percentage ? `| ${edu.percentage}` : ''}
              </Text>
            </View>
          ))}
        </View>
      )}

      {data.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsRow}>
            {data.skills.map((skill) => (
              <Text key={skill} style={styles.skillPill}>
                {skill}
              </Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  )
}

function BiodataPDF({ data }: { data: ResumeData }) {
  const bio = data.biodataInfo

  const rows: [string, string][] = [
    ['Full Name', data.personalInfo.fullName || '-'],
    ["Father's Name", bio?.fatherName || '-'],
    ["Mother's Name", bio?.motherName || '-'],
    ['Date of Birth', bio?.dateOfBirth || '-'],
    ['Gender', bio?.gender || '-'],
    ['Marital Status', bio?.maritalStatus || '-'],
    ['Nationality', bio?.nationality || '-'],
    ['Category', bio?.category || '-'],
    ['Religion', bio?.religion || '-'],
    ['Languages Known', bio?.languagesKnown || '-'],
    ['Email', data.personalInfo.email || '-'],
    ['Phone', data.personalInfo.phone || '-'],
    ['Address', data.personalInfo.address || '-'],
  ]

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.biodataTitle}>Bio-Data</Text>
      {data.personalInfo.fullName && (
        <Text style={styles.biodataSubtitle}>{data.personalInfo.fullName}</Text>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <View style={styles.table}>
          {rows.map(([label, value]) => (
            <View key={label} style={styles.tableRow}>
              <Text style={styles.tableLabelCell}>{label}</Text>
              <Text style={styles.tableValueCell}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      {data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Educational Qualifications</Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>
                  {edu.degree} {edu.field ? `- ${edu.field}` : ''}
                </Text>
                <Text style={styles.entryDate}>
                  {edu.startYear} - {edu.endYear}
                </Text>
              </View>
              <Text style={styles.entrySubtitle}>
                {edu.institution} {edu.percentage ? `| ${edu.percentage}` : ''}
              </Text>
            </View>
          ))}
        </View>
      )}

      {data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {data.experience.map((exp) => (
            <View key={exp.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{exp.role}</Text>
                <Text style={styles.entryDate}>
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </Text>
              </View>
              <Text style={styles.entrySubtitle}>{exp.company}</Text>
            </View>
          ))}
        </View>
      )}

      {data.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsRow}>
            {data.skills.map((skill) => (
              <Text key={skill} style={styles.skillPill}>
                {skill}
              </Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  )
}

export default function ResumePDF({
  data,
  format = 'modern',
}: {
  data: ResumeData
  format?: ResumeFormat
}) {
  return (
    <Document>
      {format === 'biodata' ? <BiodataPDF data={data} /> : <ModernResumePDF data={data} />}
    </Document>
  )
}