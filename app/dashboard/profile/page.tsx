import { createClient } from '@/lib/supabase/server'
import ProfilePhoto from '@/components/profile-photo'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const studentDetails = [
    { label: 'Full Name', value: 'Manya Jain', icon: '👤' },
    { label: 'Roll Number', value: '2023UIN3365', icon: '🎓' },
    { label: 'Branch / Department', value: 'Information Technology (IT)', icon: '🏛' },
    { label: 'Academic Year', value: '2023 – 2027', icon: '📆' },
    { label: 'Semester', value: '6th Semester', icon: '📚' },
    { label: 'Email ID', value: user?.email || '2023UIN3365@nsut.ac.in', icon: '📧' },
    { label: 'Mobile Number', value: '+91 98765 43210', icon: '📱' },
    { label: "Parent's Name", value: 'Mr. Rajesh Jain', icon: '👨‍👧' },
    { label: 'University', value: 'Netaji Subhas University of Technology (NSUT)', icon: '🏫' },
    { label: 'Campus', value: 'East Campus, Dwarka, New Delhi – 110078', icon: '📍' },
    { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A', icon: '🗓' },
  ]

  return (
    <div className="space-y-6 font-inter w-full">
      <div>
        <h1 className="font-playfair text-3xl font-bold" style={{ color: '#0a0a0a' }}>My Profile</h1>
        <p className="font-inter text-sm mt-1" style={{ color: '#666666' }}>Your student information</p>
      </div>

      <div className="w-full rounded-3xl border overflow-hidden" style={{ borderColor: '#e0ddd8' }}>
        {/* Teal header */}
        <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6" style={{ backgroundColor: '#014D4E' }}>
          <ProfilePhoto />
          <div className="text-center md:text-left flex-1">
            <h2 className="font-playfair text-3xl font-bold" style={{ color: '#FAF9F6' }}>Manya Jain</h2>
            <p className="font-inter text-base mt-1" style={{ color: 'rgba(250,249,246,0.75)' }}>2023UIN3365</p>
            <p className="font-inter text-sm mt-0.5" style={{ color: 'rgba(250,249,246,0.6)' }}>Information Technology • 6th Semester • NSUT</p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-inter text-xs" style={{ backgroundColor: 'rgba(250,249,246,0.12)', color: '#FAF9F6' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#4ade80' }} />
              Active Student
            </div>
          </div>
        </div>

        {/* Details table */}
        <div className="w-full" style={{ backgroundColor: '#ffffff' }}>
          <div className="p-4 border-b" style={{ borderColor: '#e0ddd8', backgroundColor: '#FAF9F6' }}>
            <h3 className="font-playfair font-semibold text-base" style={{ color: '#0a0a0a' }}>Student Details</h3>
          </div>
          <table className="w-full">
            <tbody>
              {studentDetails.map((detail, idx) => (
                <tr key={detail.label} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#FAF9F6' }}>
                  <td className="px-6 py-4 border-b w-1/3" style={{ borderColor: '#e0ddd8' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-base">{detail.icon}</span>
                      <span className="font-inter text-sm font-medium" style={{ color: '#444444' }}>{detail.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b" style={{ borderColor: '#e0ddd8' }}>
                    <span className="font-inter text-sm" style={{ color: '#0a0a0a' }}>{detail.value}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
