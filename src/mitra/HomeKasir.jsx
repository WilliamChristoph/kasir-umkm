import { useAuth } from '../context/AuthContext'
import { get } from '../utils/storage'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

const HomeKasir = () => {
  const { session } = useAuth()
  const users = get('users') || []
  const user = users.find(u => u.id === session.userId)
  const products = user ? user.products : []
  
  const [cart, setCart] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [customerMoney, setCustomerMoney] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  
  const totalHarga = cart.reduce((sum, item) => sum + item.total, 0)
  
  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product.id)
    if (existing) {
      if (existing.quantity + 1 <= product.stock) {
        existing.quantity += 1
        existing.total = existing.quantity * product.sellPrice
      }
    } else if (product.stock > 0) {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        quantity: 1,
        sellPrice: product.sellPrice,
        buyPrice: product.buyPrice,
        total: product.sellPrice
      }])
    } else {
      Toast({ title: 'Stok Habis', description: 'Stok produk ini habis', variant: 'error' })
    }
  }
  
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId))
  }
  
  const incrementQuantity = (item) => {
    const product = products.find(p => p.id === item.productId)
    if (product && item.quantity + 1 <= product.stock) {
      item.quantity += 1
      item.total = item.quantity * item.sellPrice
    }
  }
  
  const decrementQuantity = (item) => {
    if (item.quantity > 1) {
      item.quantity -= 1
      item.total = item.quantity * item.sellPrice
    } else {
      removeFromCart(item.productId)
    }
  }
  
  const handleBayar = () => {
    if (parseInt(customerMoney) < totalHarga) {
      Toast({ title: 'Uang Kurang', description: `Uang pembayaran kurang Rp${totalHarga - parseInt(customerMoney)}`, variant: 'error' })
      return
    }
    
    const change = parseInt(customerMoney) - totalHarga
    
    // Simpan transaksi
    const transaction = {
      id: `TRX-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        buyPrice: item.buyPrice,
        sellPrice: item.sellPrice
      })),
      
      total: totalHarga,
      customerMoney: parseInt(customerMoney),
      change: change
    }
    
    // Kurangi stok
    const updatedProducts = products.map(prod => {
      const cartItem = cart.find(c => c.productId === prod.id)
      if (cartItem) {
        return { ...prod, stock: prod.stock - cartItem.quantity, totalTerjual: (prod.totalTerjual || 0) + cartItem.quantity }
      }
      return prod
    })
    
    // Tambahkan ke transaksi user
    const updatedUser = users.find(u => u.id === session.userId)
    if (updatedUser) {
      updatedUser.transactions = [...updatedUser.transactions, transaction]
      updatedUser.products = updatedProducts
      
      const allUsers = get('users') || []
      const idx = allUsers.findIndex(u => u.id === session.userId)
      if (idx !== -1) {
        allUsers[idx] = updatedUser
        set('users', allUsers)
      }
    }
    
    setCart([])
    setShowPaymentModal(false)
    setCustomerMoney('')
    
    // Simpan users yang sudah diupdate
    set('users', users => {
      const u = users.find(x => x.id === session.userId)
      if (u) {
        const idx = users.indexOf(u)
        users[idx] = updatedUser
      }
      return users
    })
    
    Toast({ title: 'Transaksi Berhasil', description: 'Pembayaran berhasil diterima', variant: 'success' })
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Kasir</h1>
        <p className="text-muted-italic">Toko: {user ? user.storeName : 'Toko'}</p>
      </header>
      
      {/* Daftar Produk */}
      <div className="grid grid-cols-1 gap-4">
        {products.map(product => (
          <div key={product.id} className="rounded-xl bg-card p-4 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex justify-between align-items-start">
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-base font-bold">{formatRupiah(product.sellPrice)}</p>
                <p className="text-sm text-muted-italic">Stok: {product.stock}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => addToCart(product)}
                  className="flex-1 btn btn-primary text-sm"
                  disabled={product.stock === 0}
                >
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Keranjang */}
      {cart.length > 0 && (
        <div className="mt-6 rounded-xl bg-card p-4 max-w-md">
          <h3 className="font-medium mb-3">Keranjang</h3>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between align-items-baseline pb-2 border-b">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm">{formatRupiah(item.total)}</span>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-sm font-medium">
              <span>Total</span>
              <span>{formatRupiah(totalHarga)}</span>
            </div>
            <Input 
              type="number" 
              placeholder="Uang pelanggan"
              value={customerMoney}
              onChange={(e) => setCustomerMoney(e.target.value)}
              className="mt-2 block w-full rounded-md border-input px-3 py-2"
            />
            <div className="mt-3">
              <span className="text-sm text-muted-italic">Kembalian: {formatRupiah(parseInt(customerMoney) - totalHarga)}</span>
            </div>
          </div>
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="w-full btn btn-primary mt-3"
            disabled={parseInt(customerMoney) < totalHarga}
          >
            BAYAR
          </button>
        </div>
      )}
      
      {showPaymentModal && (
        <Modal 
          open={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)}
          title="Pembayaran"
        >
          <div className="space-y-4">
            <p className="font-medium">Total: {formatRupiah(totalHarga)}</p>
            <Input 
              type="number" 
              placeholder="Uang Pelanggan" 
              value={customerMoney}
              onChange={(e) => setCustomerMoney(e.target.value)}
            />
            <p className="font-medium">Kembalian: {formatRupiah(parseInt(customerMoney) - totalHarga)}</p>
            <div className="flex gap-2">
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 btn btn-outline">Batal</button>
              <button onClick={() => handleBayar()} className="flex-1 btn btn-primary" disabled={parseInt(customerMoney) < totalHarga}>
                Selesai
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      {showSuccess && (
        <Toast title="Transaksi Berhasil" description="Transaksi telah berhasil disimpan" variant="success" />
      )}
    </div>
  )
}

const formatRupiah = (amount) => {
  if (amount === undefined || amount === null) return 'Rp0'
  return 'Rp' + amount.toLocaleString('id-ID')
}

export default HomeKasir