import Link from 'next/link'

const metroStations = [
  { name: 'Dwarka Mor', line: 'Blue Line', distance: '1.8 km', time: '~7 min auto', note: 'Closest metro to NSUT' },
  { name: 'Dwarka Sector 14', line: 'Blue Line', distance: '2.2 km', time: '~9 min auto', note: '' },
  { name: 'Dwarka Sector 13', line: 'Blue Line', distance: '2.8 km', time: '~11 min auto', note: '' },
  { name: 'Dwarka Sector 8', line: 'Blue Line', distance: '3.2 km', time: '~13 min auto', note: '' },
  { name: 'Dwarka Sector 21', line: 'Blue Line', distance: '4.1 km', time: '~16 min auto', note: 'Airport Express interchange' },
  { name: 'Dwarka Sector 9', line: 'Blue Line', distance: '3.6 km', time: '~14 min auto', note: '' },
  { name: 'Dwarka Sector 10', line: 'Blue Line', distance: '3.9 km', time: '~15 min auto', note: '' },
]

const transportModes = [
  { mode: 'Auto Rickshaw', icon: '🛺', info: 'Available 24/7 outside main gate. Avg fare ₹30-50 to nearest metro.' },
  { mode: 'College Bus', icon: '🚌', info: 'Route 4 departs 7:45 AM. Multiple routes covering Dwarka sectors.' },
  { mode: 'E-Rickshaw', icon: '⚡', info: 'Available near Dwarka Mor metro. Fare ₹10-20 to campus.' },
  { mode: 'Cab (Ola/Uber)', icon: '🚗', info: 'Available. Avg 8-12 min wait time from campus gate.' },
  { mode: 'DTC Bus', icon: '🟥', info: 'Route 764 and 747 serve NSUT. Every 20-30 mins.' },
]

const busRoutes = [
  { route: 'DTC 764', stops: 'NSUT → Dwarka Mor → Uttam Nagar → Janakpuri', timing: 'Every 20 min' },
  { route: 'DTC 747', stops: 'NSUT → Dwarka Sector 21 Metro → Dwarka Sec 12', timing: 'Every 30 min' },
  { route: 'College Bus R4', stops: 'NSUT → Sector 10 → Sector 7 → Sector 4', timing: '7:45 AM, 5:00 PM' },
]

export default function TransportPage() {
  return (
    <div className="space-y-6 font-inter" style={{ color: '#0a0a0a' }}>
      <div>
        <h1 className="font-playfair text-3xl font-bold" style={{ color: '#0a0a0a' }}>Transport</h1>
        <p className="font-inter text-sm mt-1" style={{ color: '#666666' }}>NSUT Dwarka • 28.6109°N, 77.0379°E</p>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#e0ddd8' }}>
        <div className="p-4 border-b" style={{ backgroundColor: '#014D4E', borderColor: 'rgba(250,249,246,0.1)' }}>
          <h2 className="font-playfair font-bold text-base" style={{ color: '#FAF9F6' }}>NSUT Location & Nearby Area</h2>
        </div>
        <div className="h-72 w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5!2d77.0379!3d28.6109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1b7b4b4b4b4b%3A0x4b4b4b4b4b4b4b4b!2sNSUT%20Dwarka!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="p-3 border-t" style={{ backgroundColor: '#FAF9F6', borderColor: '#e0ddd8' }}>
          <p className="font-inter text-xs" style={{ color: '#888888' }}>Sector 3, Dwarka, New Delhi - 110078</p>
        </div>
      </div>

      {/* Metro Stations */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e0ddd8' }}>
        <div className="p-4 border-b" style={{ backgroundColor: '#014D4E', borderColor: 'rgba(250,249,246,0.1)' }}>
          <h2 className="font-playfair font-bold text-base" style={{ color: '#FAF9F6' }}>Nearest Metro Stations</h2>
          <p className="font-inter text-xs mt-0.5" style={{ color: 'rgba(250,249,246,0.65)' }}>All on Blue Line • Ordered by distance from NSUT</p>
        </div>
        <div className="divide-y" style={{ divideColor: '#e0ddd8' }}>
          {metroStations.map((station, i) => (
            <div key={station.name} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors" style={{ backgroundColor: '#ffffff' }}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#014D4E', color: '#FAF9F6' }}>
                  {i + 1}
                </div>
                <div>
                  <p className="font-inter font-medium text-sm" style={{ color: '#0a0a0a' }}>{station.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-inter text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#1d4ed8', color: '#ffffff', fontSize: '10px' }}>
                      Blue Line
                    </span>
                    <span className="font-inter text-xs" style={{ color: '#888888' }}>{station.distance}</span>
                    {station.note && <span className="font-inter text-xs" style={{ color: '#014D4E' }}>• {station.note}</span>}
                  </div>
                </div>
              </div>
              <span className="font-inter text-xs px-2 py-1 rounded-lg border" style={{ backgroundColor: '#FAF9F6', borderColor: '#e0ddd8', color: '#444444' }}>
                {station.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bus Routes */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e0ddd8' }}>
        <div className="p-4 border-b" style={{ backgroundColor: '#014D4E', borderColor: 'rgba(250,249,246,0.1)' }}>
          <h2 className="font-playfair font-bold text-base" style={{ color: '#FAF9F6' }}>Bus Routes</h2>
        </div>
        <div className="p-4 space-y-3" style={{ backgroundColor: '#ffffff' }}>
          {busRoutes.map(bus => (
            <div key={bus.route} className="p-3 rounded-xl border" style={{ backgroundColor: '#FAF9F6', borderColor: '#e0ddd8' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-inter text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: '#014D4E', color: '#FAF9F6' }}>
                  {bus.route}
                </span>
                <span className="font-inter text-xs" style={{ color: '#666666' }}>{bus.timing}</span>
              </div>
              <p className="font-inter text-xs mt-1" style={{ color: '#444444' }}>{bus.stops}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transport Modes */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e0ddd8' }}>
        <div className="p-4 border-b" style={{ backgroundColor: '#014D4E', borderColor: 'rgba(250,249,246,0.1)' }}>
          <h2 className="font-playfair font-bold text-base" style={{ color: '#FAF9F6' }}>Available Transport Modes</h2>
        </div>
        <div className="p-4 space-y-3" style={{ backgroundColor: '#ffffff' }}>
          {transportModes.map(t => (
            <div key={t.mode} className="flex gap-3 p-3 rounded-xl border transition-colors hover:bg-gray-50" style={{ borderColor: '#e0ddd8', backgroundColor: '#FAF9F6' }}>
              <span className="text-2xl">{t.icon}</span>
              <div>
                <p className="font-inter font-semibold text-sm" style={{ color: '#0a0a0a' }}>{t.mode}</p>
                <p className="font-inter text-xs mt-0.5" style={{ color: '#666666' }}>{t.info}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
