import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const { registerMitra, session } = useAuth()
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    uniqueCode: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = (e) => {
    e.preventDefault()
    const result = registerMitra(formData)
    if (result.success) {
      setSuccess('Registrasi berhasil!')
      setTimeout(() => {
        setSuccess('')
        // Auto login and navigate to home
        window.location.href = '/home'
      }, 1500)
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 max-w-md mx-auto">
      <div className="max-w-md mx-auto">
        <div className="p-6 rounded-xl bg-card shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Daftar Mitra</h2>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nama Toko</label>
              <Input 
                placeholder="Toko Maju Jaya"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Nama Pemilik Toko</label>
              <Input 
                placeholder="Budi"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input 
                type="email"
                placeholder="budi@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">No. Handphone</label>
              <Input 
                placeholder="08123456789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input 
                type="password"
                placeholder="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Kode Unik</label>
              <Input 
                placeholder="TOKO001"
                value={formData.uniqueCode}
                onChange={(e) => setFormData({ ...formData, uniqueCode: e.target.value })}
                required
              />
            </div>
            
            {error && <p className="text-sm text-error mb-3">{error}</p>}
            
            <button type="submit" className="w-full btn btn-primary">
              Daftar
            </button>
            
            <p className="mt-4 text-sm text-center text-muted-italic">
              Sudah punya akun? <a href="/login" className="underline font-medium">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage