import { useAuth } from '../context/AuthContext'
import { get } from '../../utils/storage'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import Toast from '../../components/Toast'

const Gudang = () => {
  const { session } = useAuth()
  const users = get('users') || []
  const user = users.find(u => u.id === session.userId)
  const products = user ? user.products : []
  
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [showAddStock, setShowAddStock] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [addProductData, setAddProductData] = useState({
    name: '',
    buyPrice: '',
    sellPrice: ''
  })
  const [addStockData, setAddStockData] = useState({
    productId: '',
    amount: ''
  })
  
  const handleAddProduct = () => {
    const newProduct = {
      id: `P${products.length + 1}`,
      name: addProductData.name,
      buyPrice: parseFloat(addProductData.buyPrice) || 0,
      sellPrice: 0, // Akan dihitung otomatis
      stock: parseInt(addStockData.amount) || 0,
      totalTerjual: 0
    }
    
    // Auto calculate sell price: buyPrice * 1.2
    if (newProduct.buyPrice > 0) {
      newProduct.sellPrice = Math.round(newProduct.buyPrice * 1.2)
    }
    
    setAddProductData({ name: '', buyPrice: '', sellPrice: '' })
    setAddStockData({ productId: '', amount: '' })
    
    const allUsers = get('users') || []
    const idx = allUsers.findIndex(u => u.id === session.userId)
    if (idx !== -1) {
      allUsers[idx].products = [...allUsers[idx].products, newProduct]
      set('users', allUsers)
    }
    Toast({ title: 'Produk Ditambahkan', description: 'Produk baru berhasil ditambahkan', variant: 'success' })
  }
  
  const handleEditProduct = (product) => {
    setEditProduct(product)
    setAddProductData({
      name: product.name,
      buyPrice: product.buyPrice,
      sellPrice: product.sellPrice
    })
    setShowEditProduct(true)
  }
  
  const handleSaveEdit = () => {
    const allUsers = get('users') || []
    const idx = allUsers.findIndex(u => u.id === session.userId)
    if (idx !== -1) {
      const productIdx = allUsers[idx].products.findIndex(p => p.id === editProduct.id)
      if (productIdx !== -1) {
        allUsers[idx].products[productIdx].name = addProductData.name
        allUsers[idx].products[productIdx].buyPrice = parseFloat(addProductData.buyPrice) || 0
        allUsers[idx].products[productIdx].sellPrice = Math.round(allUsers[idx].products[productIdx].buyPrice * 1.2)
      }
      set('users', allUsers)
    }
    setShowEditProduct(false)
    Toast({ title: 'Produk Diubah', description: 'Produk berhasil diubah', variant: 'success' })
  }
  
  const handleHapusProduct = (productId) => {
    const confirm = window.confirm('Hapus Produk? Data produk akan dihapus dari daftar produk.')
    if (confirm) {
      const allUsers = get('users') || []
      const idx = allUsers.findIndex(u => u.id === session.userId)
      if (idx !== -1) {
        allUsers[idx].products = allUsers[idx].products.filter(p => p.id !== productId)
        set('users', allUsers)
      }
      Toast({ title: 'Produk Dihapus', description: 'Produk berhasil dihapus', variant: 'success' })
    }
  }
  
  const handleTambahStok = () => {
    const { productId, amount } = addStockData
    const amountNum = parseInt(amount) || 0
    
    const allUsers = get('users') || []
    const idx = allUsers.findIndex(u => u.id === session.userId)
    if (idx !== -1) {
      const productIdx = allUsers[idx].products.findIndex(p => p.id === productId)
      if (productIdx !== -1) {
        allUsers[idx].products[productIdx].stock += amountNum
      }
      set('users', allUsers)
    }
    setAddStockData({ productId: '', amount: '' })
    Toast({ title: 'Stok Ditambahkan', description: 'Stok produk berhasil ditambahkan', variant: 'success' })
  }
  
  const handleDeleteProductConfirm = (productId) => {
    // Already handled in handleHapusProduct
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Gudang</h1>
      </header>
      
      {/* Tambah Produk */}
      {showAddProduct && (
        <Modal title="Tambah Produk">
          <Input placeholder="Nama Produk" value={addProductData.name} onChange={(e) => setAddProductData({ ...addProductData, name: e.target.value })} />
          <Input type="number" placeholder="Harga Beli" value={addProductData.buyPrice} onChange={(e) => setAddProductData({ ...addProductData, buyPrice: e.target.value })} />
          <p className="text-sm text-muted-italic">Harga Jual akan otomatis dihitung (Buy Price × 1.2)</p>
          <Input type="number" placeholder="Stok Awal" value={addStockData.amount} onChange={(e) => setAddStockData({ ...addStockData, amount: e.target.value })} />
          
          <div className="flex gap-2 mt-4">
            <button onClick={() => setShowAddProduct(false)} className="flex-1 btn btn-outline">Batal</button>
            <button onClick={() => handleAddProduct()} className="flex-1 btn btn-primary">Simpan</button>
          </div>
        </Modal>
      )}
      
      <button onClick={() => setShowAddProduct(true)} className="mb-4 btn btn-primary">
        + Tambah Produk
      </button>
      
      {/* Tabel Produk */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="p-3 text-left text-xs font-medium text-muted-italic">Produk</th>
              <th className="p-3 text-left text-xs font-medium text-muted-italic">Harga Beli</th>
              <th className="p-3 text-left text-xs font-medium text-muted-italic">Harga Jual</th>
              <th className="p-3 text-left text-xs font-medium text-muted-italic">Stok</th>
              <th className="p-3 text-left text-xs font-medium text-muted-italic">Terjual</th>
              <th className="p-3 text-left text-xs font-medium text-muted-italic">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3 text-sm">{formatRupiah(product.buyPrice)}</td>
                <td className="p-3 text-sm">{formatRupiah(product.sellPrice)}</td>
                <td className="p-3 text-sm">{product.stock}</td>
                <td className="p-3 text-sm">{product.totalTerjual || 0}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEditProduct(product)} className="text-primary hover:underline text-sm">Edit</button>
                    <button onClick={() => handleHapusProduct(product.id)} className="text-destructive hover:underline text-sm">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Tambah Stok Modal */}
      {showAddStock && (
        <Modal title="Tambah Stok">
          <select className="w-full rounded-md border px-3 py-2 mb-3">
            <option value="">Pilih Produk</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <Input type="number" placeholder="Jumlah Stok" value={addStockData.amount} onChange={(e) => setAddStockData({ ...addStockData, amount: e.target.value })} />
          
          <div className="flex gap-2 mt-4">
            <button onClick={() => setShowAddStock(false)} className="flex-1 btn btn-outline">Batal</button>
            <button onClick={() => handleTambahStok()} className="flex-1 btn btn-primary">Tambah Stok</button>
          </div>
        </Modal>
      )}
      
      {products.length > 0 && (
        <button onClick={() => setShowAddStock(true)} className="mb-4 btn btn-primary">
          + Tambah Stok
        </button>
      )}
      
      {products.length === 0 && <p className="text-muted-italic">Belum ada produk</p>}
    </div>
  )
}

const formatRupiah = (amount) => {
  if (amount === undefined || amount === null) return 'Rp0'
  return 'Rp' + amount.toLocaleString('id-ID')
}

export default Gudang