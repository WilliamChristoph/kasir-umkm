import { useAuth } from '../context/AuthContext'
import { get } from '../../utils/storage'

const InspectMitra = () => {
  const { session, logout } = useAuth()
  const params = new URL(window.location).pathname.split('/')
  const userId = params[params.length - 1]
  
  const users = get('users') || []
  const user = users.find(u => u.id === userId)
  
  if (!user) {
    return <div className="p-4">Mitra tidak ditemukan</div>
  }
  
  const products = user.products || []
  const transactions = user.transactions || []
  const expenses = user.expenses || []
  
  // Calculate stats
  let totalProdukTerjual = 0
  let totalPemasukan = 0
  let totalPengeluaran = 0
  
  transactions.forEach(tx => {
    totalProdukTerjual += tx.items.reduce((sum, item) => sum + item.quantity, 0)
    totalPemasukan += tx.total
  })
  
  products.forEach(prod => {
    totalPengeluaran += prod.buyPrice * (prod.totalTerjual || 0)
  })
  
  const keuntungan = totalPemasukan - totalPengeluaran
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Inspect Akun</h2>
        <p className="text-muted-italic">ID: {user.id}</p>
      </div>
      
      {/* Informasi Toko */}
      <div className="rounded-xl bg-card p-4 mb-6 shadow-sm">
        <h3 className="font-medium mb-4">Informasi Toko</h3>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium">Nama Toko</dt>
            <dd className="text-sm">{user.storeName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium">Pemilik</dt>
            <dd className="text-sm">{user.ownerName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium">Email</dt>
            <dd className="text-sm">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium">No. HP</dt>
            <dd className="text-sm">{user.phone}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium">Status</dt>
            <dd className={`text-sm ${user.status === 'active' ? 'text-green-600' : user.status === 'banned' ? 'text-red-600' : 'text-yellow-600'}`}>
              {user.status}
            </dd>
          </div>
        </dl>
      </div>
      
      {/* Produk / Kasir */}
      {products.length > 0 ? (
        <div className="rounded-xl bg-card p-4 mb-6 shadow-sm">
          <h3 className="font-medium mb-4">Produk / Kasir</h3>
          <div className="space-y-3">
            {products.map(prod => (
              <div key={prod.id} className="p-3 rounded-lg bg-muted">
                <p className="font-medium">{prod.name}</p>
                <p className="text-sm">
                  <span className="font-semibold">Harga Beli:</span> {formatRupiah(prod.buyPrice)}
                  <span className="text-muted-italic mx-2">|</span>
                  <span className="font-semibold">Harga Jual:</span> {formatRupiah(prod.sellPrice)}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Stok:</span> {prod.stock}
                  <span className="text-muted-italic mx-2">|</span>
                  <span className="font-semibold">Terjual:</span> {prod.totalTerjual || 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-muted-italic">Belum ada produk</p>
      )}
      
      {/* Gudang */}
      <div className="rounded-xl bg-card p-4 mb-6 shadow-sm">
        <h3 className="font-medium mb-4">Gudang</h3>
        <div className="space-y-2">
          {products.map(prod => (
            <div key={prod.id} className="p-2 rounded bg-muted/50">
              <p className="font-medium text-sm">{prod.name}</p>
              <p className="text-xs text-muted-italic">Stok: {prod.stock}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Statistik */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-card p-4">
          <div className="text-2xl font-bold">{formatRupiah(user.initialCapital)}</div>
          <div className="text-sm text-muted-italic">Modal Awal</div>
        </div>
        <div className="rounded-xl bg-card p-4">
          <div className="text-2xl font-bold">{totalProdukTerjual}</div>
          <div className="text-sm text-muted-italic">Total Produk Terjual</div>
        </div>
        <div className="rounded-xl bg-card p-4">
          <div className="text-2xl font-bold">{formatRupiah(totalPemasukan)}</div>
          <div className="text-sm text-muted-italic">Total Pemasukan</div>
        </div>
        <div className="rounded-xl bg-card p-4">
          <div className="text-2xl font-bold">{formatRupiah(totalPengeluaran)}</div>
          <div className="text-sm text-muted-italic">Total Pengeluaran</div>
        </div>
        <div className="rounded-xl bg-card p-4">
          <div className="text-2xl font-bold">{formatRupiah(keuntungan)}</div>
          <div className="text-sm text-muted-italic">Keuntungan</div>
        </div>
      </div>
      
      {/* Riwayat Transaksi */}
      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="p-3 text-left text-xs font-medium text-muted-italic">ID</th>
                <th className="p-3 text-left text-xs font-medium text-muted-italic">Tanggal</th>
                <th className="p-3 text-left text-xs font-medium text-muted-italic">Jam</th>
                <th className="p-3 text-left text-xs font-medium text-muted-italic">Produk</th>
                <th className="p-3 text-left text-xs font-medium text-muted-italic">Jumlah</th>
                <th className="p-3 text-left text-xs font-medium text-muted-italic">Total</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td className="p-3 text-xs">{tx.id}</td>
                  <td className="p-3 text-xs">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="p-3 text-xs">{new Date(tx.time).toLocaleTimeString()}</td>
                  <td className="p-3 text-xs">{tx.items.map(i => i.name).join(', ')}</td>
                  <td className="p-3 text-xs">{tx.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td className="p-3 text-xs">{formatRupiah(tx.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted-italic">Belum ada transaksi</p>
      )}
      
      <button 
        onClick={() => window.history.back()}
        className="mt-4 btn btn-outline"
      >
        ← Kembali ke Dashboard
      </button>
    </div>
  )
}

const formatRupiah = (amount) => {
  if (amount === undefined || amount === null) return 'Rp0'
  return 'Rp' + amount.toLocaleString('id-ID')
}

export default InspectMitra