import { Badge } from '@/components/ui/badge'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const TIME_SLOTS = ['9-10', '10-11', '11-12', '12-1', '1-2', '2-3', '3-4', '4-5', '5-6']

const subjectStyles: Record<string, { bg: string, border: string }> = {
  'Digital Forensics': { bg: '#e8f5e9', border: '#014D4E' },
  'Compiler': { bg: '#e8f4f4', border: '#014D4E' },
  'Compiler Lab': { bg: '#e8f4f4', border: '#014D4E' },
  'Information Security': { bg: '#fff8e1', border: '#b45309' },
  'Information Security Lab': { bg: '#fff8e1', border: '#b45309' },
  'Networking Devices': { bg: '#f3e8ff', border: '#7c3aed' },
  'Networking Devices Lab': { bg: '#f3e8ff', border: '#7c3aed' },
  'Digital Forensics Lab': { bg: '#e8f5e9', border: '#014D4E' },
  'Operating System': { bg: '#fce8f0', border: '#be185d' },
}

const timetable: Record<string, Record<string, { subject: string, room: string } | null>> = {
  'Monday': {
    '9-10': null, '10-11': { subject: 'Networking Devices Lab', room: 'CC' },
    '11-12': { subject: 'Networking Devices Lab', room: 'CC' }, '12-1': null,
    '1-2': null, '2-3': { subject: 'Digital Forensics Lab', room: 'RC-NW' },
    '3-4': { subject: 'Digital Forensics Lab', room: 'RC-NW' }, '4-5': null, '5-6': null,
  },
  'Tuesday': {
    '9-10': { subject: 'Digital Forensics', room: '5222' },
    '10-11': { subject: 'Compiler Lab', room: '5203' },
    '11-12': { subject: 'Compiler Lab', room: '5203' }, '12-1': null, '1-2': null,
    '2-3': { subject: 'Compiler', room: '5119' },
    '3-4': { subject: 'Information Security', room: '5119' }, '4-5': null, '5-6': null,
  },
  'Wednesday': {
    '9-10': null, '10-11': null, '11-12': null,
    '12-1': { subject: 'Networking Devices', room: '5119' }, '1-2': null,
    '2-3': null, '3-4': null,
    '4-5': { subject: 'Networking Devices Lab', room: 'CC' },
    '5-6': { subject: 'Networking Devices Lab', room: 'CC' },
  },
  'Thursday': {
    '9-10': { subject: 'Digital Forensics', room: '5222' },
    '10-11': { subject: 'Information Security Lab', room: 'CC' },
    '11-12': { subject: 'Information Security Lab', room: 'CC' },
    '12-1': { subject: 'Networking Devices', room: '5119' },
    '1-2': { subject: 'Information Security', room: '5119' },
    '2-3': null, '3-4': null, '4-5': null, '5-6': null,
  },
  'Friday': {
    '9-10': null,
    '10-11': { subject: 'Information Security', room: '5119' },
    '11-12': { subject: 'Compiler', room: '5119' },
    '12-1': { subject: 'Digital Forensics', room: '5222' },
    '1-2': { subject: 'Compiler', room: '5306' },
    '2-3': { subject: 'Operating System', room: '5119' },
    '3-4': null, '4-5': null, '5-6': null,
  },
}

export default function TimetablePage() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <div className="space-y-6 font-inter">
      <div>
        <h1 className="font-playfair text-3xl font-bold" style={{ color: '#0a0a0a' }}>My Timetable</h1>
        <p className="font-inter text-sm mt-1" style={{ color: '#666666' }}>Manya Jain • 2023UIN3365 • IT • 6th Semester</p>
      </div>

      {/* Today's Classes */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e0ddd8' }}>
        <div className="p-4 border-b" style={{ backgroundColor: '#014D4E', borderColor: 'rgba(250,249,246,0.1)' }}>
          <h2 className="font-playfair font-bold text-base" style={{ color: '#FAF9F6' }}>
            Today's Classes — {today}
          </h2>
        </div>
        <div className="p-4 space-y-2" style={{ backgroundColor: '#ffffff' }}>
          {DAYS.includes(today) && Object.entries(timetable[today] || {})
            .filter(([_, slot]) => slot !== null)
            .map(([time, slot]) => {
              const style = subjectStyles[slot!.subject] || { bg: '#f5f5f5', border: '#cccccc' }
              return (
                <div
                  key={time}
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{ backgroundColor: style.bg, borderColor: style.border }}
                >
                  <div>
                    <p className="font-inter font-semibold text-sm" style={{ color: '#0a0a0a' }}>{slot!.subject}</p>
                    <p className="font-inter text-xs mt-0.5" style={{ color: '#444444' }}>Room {slot!.room}</p>
                  </div>
                  <span
                    className="font-inter text-xs px-2.5 py-1 rounded-lg font-medium"
                    style={{ backgroundColor: '#014D4E', color: '#FAF9F6' }}
                  >
                    {time}
                  </span>
                </div>
              )
            })
          }
          {(!DAYS.includes(today) || Object.values(timetable[today] || {}).every(s => s === null)) && (
            <p className="font-inter text-sm text-center py-4" style={{ color: '#888888' }}>No classes today 🎉</p>
          )}
        </div>
      </div>

      {/* Subject Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(subjectStyles).filter(([k]) => !k.includes('Lab')).map(([subject, style]) => (
          <div key={subject} className="flex items-center gap-1.5 px-3 py-1 rounded-lg border" style={{ backgroundColor: style.bg, borderColor: style.border }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: style.border }} />
            <span className="font-inter text-xs font-medium" style={{ color: '#0a0a0a' }}>{subject}</span>
          </div>
        ))}
      </div>

      {/* Full Weekly Timetable */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e0ddd8' }}>
        <div className="p-4 border-b" style={{ backgroundColor: '#014D4E', borderColor: 'rgba(250,249,246,0.1)' }}>
          <h2 className="font-playfair font-bold text-base" style={{ color: '#FAF9F6' }}>Weekly Schedule</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[700px]">
            <thead>
              <tr style={{ backgroundColor: '#FAF9F6' }}>
                <th className="p-3 text-left border font-inter font-semibold w-16" style={{ borderColor: '#e0ddd8', color: '#0a0a0a' }}>Time</th>
                {DAYS.map(day => (
                  <th
                    key={day}
                    className="p-3 text-center border font-inter font-semibold"
                    style={{
                      borderColor: '#e0ddd8',
                      color: day === today ? '#FAF9F6' : '#0a0a0a',
                      backgroundColor: day === today ? '#014D4E' : '#FAF9F6',
                    }}
                  >
                    {day}
                    {day === today && <span className="block text-xs font-normal opacity-75">Today</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, rowIdx) => (
                <tr key={slot} style={{ backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#FAF9F6' }}>
                  <td
                    className="p-2 border font-inter font-medium text-xs"
                    style={{ borderColor: '#e0ddd8', color: '#0a0a0a' }}
                  >
                    {slot}
                  </td>
                  {DAYS.map(day => {
                    const cls = timetable[day][slot]
                    const style = cls ? (subjectStyles[cls.subject] || { bg: '#f5f5f5', border: '#cccccc' }) : null
                    return (
                      <td
                        key={day}
                        className="p-1 border"
                        style={{
                          borderColor: '#e0ddd8',
                          backgroundColor: day === today ? 'rgba(1,77,78,0.04)' : 'transparent',
                        }}
                      >
                        {cls && style && (
                          <div
                            className="p-2 rounded-lg border text-xs"
                            style={{ backgroundColor: style.bg, borderColor: style.border }}
                          >
                            <p className="font-inter font-semibold leading-tight" style={{ color: '#0a0a0a' }}>{cls.subject}</p>
                            <p className="font-inter mt-0.5" style={{ color: '#444444' }}>Room {cls.room}</p>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
