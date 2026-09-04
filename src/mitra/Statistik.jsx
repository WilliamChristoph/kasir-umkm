import { useAuth } from '../context/AuthContext'
import { get } from '../../utils/storage'
import Toast from '../../components/Toast'

const Statistik = () => {
  const { session } = useAuth()
  const users = get('users') || []
  const user = users.find(u => u.id === session.userId)
  const products = user ? user.products : []
  const transactions = user ? user.transactions : []
  const expenses = user ? user.expenses : []
  
  // Hitung statistik
  let totalProdukTerjual = 0
  let totalTransaksi = transactions.length
  let totalPemasukan = 0
  let totalPengeluaran = 0
  
  transactions.forEach(tx => {
    totalPemasukan += tx.total
    totalProdukTerjual += tx.items.reduce((sum, item) => sum + item.quantity, 0)
  })
  
  products.forEach(prod => {
    totalPengeluaran += prod.buyPrice * (prod.totalTerjual || 0)
  })
  
  const keuntungan = totalPemasukan - totalPengeluaran
  
  // Handle modal modal awal
  const [showModalAwal, setShowModalAwal] = useState(false)
  
  const handleSimpanModal = () => {
    setShowModalAwal(false)
    Toast({ title: 'Modal Disimpan', description: 'Modal awal berhasil disimpan', variant: 'success' })
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Modal Modal Awal */}
      {showModalAwal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="rounded-xl bg-white p-6 max-w-sm w-full shadow-lg">
            <h3 className="font-medium mb-4">Modal Awal</h3>
            <Input type="number" placeholder="Rp [________]" />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowModalAwal(false)} className="flex-1 btn btn-outline">Batal</button>
              <button onClick={() => handleSimpanModal()} className="flex-1 btn btn-primary">Simpan</button>
            </div>
          </div>
        </div>
      )}
      
      <button onClick={() => setShowModalAwal(true)} className="mb-6 btn btn-primary">
        + Tambah Modal Awal
      </button>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-card p-4 shadow-sm">
          <div className="text-3xl font-bold">{totalProdukTerjual}</div>
          <div className="text-sm text-muted-italic">Total Produk Terjual</div>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-sm">
          <div className="text-3xl font-bold">{totalTransaksi}</div>
          <div className="text-sm text-muted-italic">Total Transaksi</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-card p-4 shadow-sm">
          <div className="text-3xl font-bold">{formatRupiah(totalPemasukan)}</div>
          <div className="text-sm text-muted-italic">Total Pemasukan</div>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-sm">
          <div className="text-3xl font-bold">{formatRupiah(totalPengeluaran)}</div>
          <div className="text-sm text-muted-italic">Total Pengeluaran</div>
        </div>
      </div>
      
      <div className="mt-4 rounded-xl bg-card p-4 shadow-sm">
        <div className="text-3xl font-bold text-green-600">{formatRupiah(keuntungan)}</div>
        <div className="text-sm text-muted-italic">Keuntungan</div>
      </div>
      
      {/* Riwayat Transaksi */}
      <h2 className="mb-4 text-xl font-bold">Riwayat Transaksi</h2>
      
      {transactions.length === 0 && (
        <p className="text-muted-italic">Belum ada transaksi</p>
      )}
      
      {transactions.length > 0 && (
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
      )}
      
      {/* Data Expense */}
      <div className="mt-6 rounded-xl bg-card p-4 shadow-sm">
        <h3 className="font-medium mb-3">Tambah Pengeluaran</h3>
        <Input placeholder="Nama" />
        <Input type="number" placeholder="Jumlah" />
        <Input type="date" />
        <button className="mt-2 btn btn-primary">Simpan</button>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-muted-italic">Pengeluaran Barang: -</p>
        <p className="text-sm font-medium">Total Pengeluaran: Rp0</p>
      </div>
    </div>
  )
}

const formatRupiah = (amount) => {
  if (amount === undefined || amount === null) return 'Rp0'
  return 'Rp' + amount.toLocaleString('id-ID')
}

export default Statistik