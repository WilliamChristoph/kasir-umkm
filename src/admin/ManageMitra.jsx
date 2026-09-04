import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { get } from '../../utils/storage'

const ManageMitra = ({ session }) => {
  const [search, setSearch] = useState({
    namaToko: '',
    namaPemilik: '',
    email: '',
    status: ''
  })
  const [users] = useState(() => get('users') || [])
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (search.namaToko ? user.storeName.toLowerCase().includes(search.namaToko.toLowerCase()) : true) &&
      (search.namaPemilik ? user.ownerName.toLowerCase().includes(search.namaPemilik.toLowerCase()) : true) &&
      (search.email ? user.email.toLowerCase().includes(search.email.toLowerCase()) : true) &&
      (search.status ? user.status === search.status : true)
    
    return matchesSearch
  }
  
  const handleBan = (userId) => {
    const user = users.find(u => u.id === userId)
    if (!user) return
    
    const durasiOptions = [
      { label: '1 Hari', value: 1 },
      { label: '3 Hari', value: 3 },
      { label: '7 Hari', value: 7 },
      { label: '14 Hari', value: 14 },
      { label: '30 Hari', value: 30 },
      { label: '60 Hari', value: 60 }
    ]
    
    const [selectedDurasi, setSelectedDurasi] = useState(1)
    
    const showBanModal = true // This would need state management
    
    // For now, just mark as banned immediately for demo
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, status: 'banned', bannedUntil: new Date(Date.now() + selectedDurasi * 24 * 60 * 60 * 1000).toISOString() }
      }
      return u
    })
    
    set('users', updatedUsers)
  }
  
  const handleSuspend = (userId) => {
    const user = users.find(u => u.id === userId)
    if (!user) return
    
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, suspended: true, status: 'suspended' }
      }
      return u
    })
    
    set('users', updatedUsers)
  }
  
  const handleInspect = (userId) => {
    // Navigate to inspect page - in a real router, use navigate
    // window.location.href = `/admin/mitra/${userId}`
    alert(`Inspect user ${userId}`)
  }
  
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-card p-4 shadow-sm">
        <input 
          type="text" 
          placeholder="Cari nama toko, pemilik, email..."
          value={search.namaToko}
          onChange={(e) => setSearch({ ...search, namaToko: e.target.value })}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <input 
          type="text" 
          placeholder="Cari nama pemilik..."
          value={search.namaPemilik}
          onChange={(e) => setSearch({ ...search, namaPemilik: e.target.value })}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <input 
          type="email" 
          placeholder="Cari email..."
          value={search.email}
          onChange={(e) => setSearch({ ...search, email: e.target.value })}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <select 
          value={search.status}
          onChange={(e) => setSearch({ ...search, status: e.target.value })}
          className="w-full rounded-md border px-3 py-2 text-sm mt-2"
        >
          <option value="">Filter Status</option>
          <option value="active">Aktif</option>
          <option value="banned">Dibanned</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map(user => (
          <div key={user.id} className="rounded-xl bg-card p-4 shadow-sm">
            <div className="flex justify-between align-items-start mb-3">
              <div>
                <h3 className="font-medium">{user.storeName}</h3>
                <p className="text-sm text-muted-italic">{user.ownerName}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${user.status === 'active' ? 'bg-green-100 text-green-800' : user.status === 'banned' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}}`>
                {user.status}
              </span>
            </div>
            <p className="text-sm text-muted-italic">{user.email}</p>
            <p className="text-sm">{user.phone}</p>
            <p className="text-xs text-muted-italic">Daftar: {user.tanggalDaftar || new Date().toLocaleDateString()}</p>
            
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => handleInspect(user.id)}
                className="flex-1 btn btn-outline text-sm"
              >
                Inspect
              </button>
              <button 
                onClick={() => handleBan(user.id)}
                className="flex-1 btn btn-outline text-sm"
              >
                Ban
              </button>
              <button 
                onClick={() => handleSuspend(user.id)}
                className="flex-1 btn btn-outline text-sm"
              >
                Suspend
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredUsers.length === 0 && (
        <p className="text-sm text-muted-italic text-center">Tidak ada mitra ditemukan</p>
      )}
    </div>
  )
}

export default ManageMitra