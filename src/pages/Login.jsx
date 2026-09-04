import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { loginAsAdmin, loginMitra, registerMitra, session } = useAuth()
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [showCodeTab, setShowCodeTab] = useState(false)
  const [loginMethod, setLoginMethod] = useState('email')
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  })
  const [codeData, setCodeData] = useState({
    code: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const handleAdminLogin = () => {
    setShowAdminModal(true)
  }
  
  const handleAdminCodeSubmit = (code) => {
    const result = loginAsAdmin(code)
    if (result.success) {
      setSuccess('Login sebagai admin berhasil')
      setTimeout(() => {
        setShowAdminModal(false)
        setSuccess('')
      }, 1500)
    } else {
      setError(result.error)
    }
  }
  
  const handleEmailLogin = (e) => {
    e.preventDefault()
    const result = loginMitra(formData.emailOrPhone, formData.password, false)
    if (result.success) {
      setSuccess('Login berhasil')
      setTimeout(() => {
        setShowAdminModal(false)
        setError('')
        setSuccess('')
      }, 1500)
    } else {
      setError(result.error)
    }
  }
  
  const handleCodeLogin = (e) => {
    e.preventDefault()
    const result = loginMitra(codeData.code, '', true)
    if (result.success) {
      setSuccess('Login berhasil')
      setTimeout(() => {
        setShowAdminModal(false)
        setError('')
        setSuccess('')
      }, 1500)
    } else {
      setError(result.error)
    }
  }
  
  return (
    <div className="min-h-screen bg-background p-4 max-w-md mx-auto">
      <div className="max-w-md mx-auto">
        <div className="p-6 rounded-xl bg-card shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">POS UMKM</h2>
          
          {/* Admin Login Modal */}
          {showAdminModal && (
            <div className="mt-4 p-4 rounded-xl bg-muted">
              <h3 className="font-medium mb-3">Login Admin</h3>
              <p className="text-sm opacity-70 mb-4">Masukkan kode admin</p>
              <input 
                type="password"
                placeholder="admin123"
                className="w-full rounded-md border px-3 py-2 mb-3"
                defaultValue="admin123"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 btn btn-outline"
                >
                  Batalkan
                </button>
                <button 
                  onClick={() => handleAdminCodeSubmit(document.querySelector('input').value)}
                  className="flex-1 btn btn-primary"
                >
                  Login
                </button>
              </div>
              {error && <p className="mt-2 text-sm text-error">{error}</p>}
            </div>
          )}
          
          {/* Main Login Form */}
          <form onSubmit={handleEmailLogin} className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email / No. Handphone</label>
              <Input 
                type="email" 
                placeholder="masukkan email atau nomor handphone"
                value={formData.emailOrPhone}
                onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input 
                type="password" 
                placeholder="masukkan password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            
            <button type="submit" className="w-full btn btn-primary">
              Login
            </button>
            
            <p className="mt-4 text-sm text-muted-italic text-center">
              {session.role === 'mitra' && <span>Sudah login sebagai mitra</span>}
            </p>
            
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-italic">
                Belum punya akun? <a href="/register" className="underline font-medium">Daftar segera</a>
              </p>
            </div>
          </form>
          
          {/* Kode Unik Tab */}
          {showCodeTab && (
            <div className="mt-6 p-4 rounded-xl bg-muted">
              <h3 className="font-medium mb-3">Login dengan Kode Unik</h3>
              <p className="text-sm opacity-70 mb-4">Masukkan kode unik Anda untuk login</p>
              <Input 
                type="text" 
                placeholder="TOKO001"
                value={codeData.code}
                onChange={(e) => setCodeData({ ...codeData, code: e.target.value })}
                required
              />
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => setShowCodeTab(false)}
                  className="flex-1 btn btn-outline"
                >
                  Batalkan
                </button>
                <button 
                  onClick={() => handleCodeLogin()}
                  className="flex-1 btn btn-primary"
                >
                  Login
                </button>
              </div>
              {error && <p className="mt-2 text-sm text-error">{error}</p>}
            </div>
          )}
          
          <p className="mt-6 text-sm text-center">
            {showAdminModal ? '' : (
              <span>Belum punya akun? <a href="/register" className="underline font-medium">Daftar segera</a></span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage