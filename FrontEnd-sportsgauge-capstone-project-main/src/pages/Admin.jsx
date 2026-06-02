import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { API_BASE } from '../utils/api.js'

export default function Admin() {
  const [athletes, setAthletes] = useState([])
  
  // Filters
  const [stateFilter, setStateFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [sportFilter, setSportFilter] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/athletes`)
      .then(res => res.json())
      .then(data => setAthletes(data))
  }, [])

  const filteredAthletes = athletes.filter(a => {
    return (
      (stateFilter ? a.state.toLowerCase().includes(stateFilter.toLowerCase()) : true) &&
      (genderFilter ? a.gender === genderFilter : true) &&
      (sportFilter ? a.sports_interest.toLowerCase().includes(sportFilter.toLowerCase()) : true)
    )
  })

  return (
    <div className="page-shell">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-ki-saffron">Admin Control Center</h1>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4"><p className="text-xs text-theme-muted">New Registrations</p><p className="text-2xl font-bold">{athletes.length}</p></div>
          <div className="glass-card p-4"><p className="text-xs text-theme-muted">New Coach Applications</p><p className="text-2xl font-bold">8</p></div>
          <div className="glass-card p-4"><p className="text-xs text-theme-muted">Assessment Verification Issues</p><p className="text-2xl font-bold">{athletes.reduce((n, a) => n + (a.assessments || []).filter(x => x.validation_status !== 'Valid').length, 0)}</p></div>
          <div className="glass-card p-4"><p className="text-xs text-theme-muted">System Alerts</p><p className="text-2xl font-bold">3</p></div>
        </div>
        
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Filter by State" 
              className="input-field bg-ki-dark-2"
              value={stateFilter}
              onChange={e => setStateFilter(e.target.value)}
            />
            <select 
              className="input-field bg-ki-dark-2"
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value)}
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input 
              type="text" 
              placeholder="Filter by Sport" 
              className="input-field bg-ki-dark-2"
              value={sportFilter}
              onChange={e => setSportFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="glass-card p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Registered Athletes & Results</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Sport</th>
                <th className="py-3 px-4">Assessments</th>
              </tr>
            </thead>
            <tbody>
              {filteredAthletes.map(a => (
                <tr key={a.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-semibold text-ki-saffron">{a.full_name}</td>
                  <td className="py-3 px-4">{a.age}y / {a.gender}</td>
                  <td className="py-3 px-4">{a.district}, {a.state}</td>
                  <td className="py-3 px-4">{a.sports_interest}</td>
                  <td className="py-3 px-4">
                    {a.assessments.length === 0 ? (
                      <span className="text-gray-500 text-sm">None</span>
                    ) : (
                      <div className="space-y-2">
                        {a.assessments.map((test, idx) => (
                          <div key={idx} className="text-sm bg-ki-dark-2 p-2 rounded border border-white/10 flex justify-between items-center">
                            <span className="capitalize font-medium">{test.test_name}: {test.score}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${test.validation_status === 'Valid' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {test.validation_status} ({test.ai_confidence}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredAthletes.length === 0 && (
                <tr><td colSpan="5" className="py-6 text-center text-gray-500">No athletes found matching filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
