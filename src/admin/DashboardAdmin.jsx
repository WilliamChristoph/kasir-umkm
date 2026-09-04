import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { get } from '../../utils/storage'

const DashboardAdmin = () => {
  const { session } = useAuth()
  
  // Initialize dummy data if first run
  useEffect(() => {
    const flag = get('initialized')
    if (!flag) {
      // Create dummy mitra
      const dummyMitra1 = {
        id: 'MITRA001',
        storeName: 'Toko Maju Jaya',
        ownerName: 'Budi',
        email: 'budi@example.com',
        phone: '08123456789',
        password: 'password',
        uniqueCode: 'TOKO001',
        status: 'active',
        bannedUntil: null,
        suspended: false,
        initialCapital: 5000000,
        products: [
          { id: 'P001', name: 'Indomie Goreng', buyPrice: 2500, sellPrice: 3000, stock: 50, totalTerjual: 0 },
          { id: 'P002', name: 'Air Mineral', buyPrice: 1000, sellPrice: 1500, stock: 100, totalTerjual: 0 }
        ],
        transactions: [],
        expenses: []
      }
      
      const dummyMitra2 = {
        id: 'MITRA002',
        storeName: 'Toko Berkah',
        ownerName: 'Siti',
        email: 'siti@example.com',
        phone: '08987654321',
        password: 'password',
        uniqueCode: 'TOKO002',
        status: 'active',
        bannedUntil: null,
        suspended: false,
        initialCapital: 5000000,
        products: [
          { id: 'P003', name: 'Beras', buyPrice: 3000, sellPrice: 3600, stock: 30, totalTerjual: 0 }
        ],
        transactions: [],
        expenses: []
      }
      
      const dummyMitra3 = {
        id: 'MITRA003',
        storeName: 'Warung Sejahtera',
        ownerName: 'Ahmed',
        email: 'ahmed@example.com',
        phone: '085555555555',
        password: 'password',
        uniqueCode: 'TOKO003',
        status: 'active',
        bannedUntil: null,
        suspended: false,
        initialCapital: 5000000,
        products: [],
        transactions: [],
        expenses: []
      }
      
      const users = [dummyMitra1, dummyMitra2, dummyMitra3]
      set('users', users)
      set('initialized', true)
    }
  }, [])
  
  // Get data from localStorage
  const usersFromStorage = get('users') || []
  const productsFromStorage = get('products') || []
  const transactionsFromStorage = get('transactions') || []
  
  // Calculate stats
  const totalMitra = usersFromStorage.length
  const mitraAktif = usersFromStorage.filter(u => u.status === 'active').length
  const mitraDibanned = usersFromStorage.filter(u => u.bannedUntil && new Date() < new Date(u.bannedUntil)).length
  const mitraSuspended = usersFromStorage.filter(u => u.suspended).length
  
  const totalProduk = productsFromStorage.length
  const totalTransaksi = transactionsFromStorage.length
  
  let totalPemasukan = 0
  let totalPengeluaran = 0
  
  transactionsFromStorage.forEach(tx => {
    totalPemasukan += tx.total
  })
  
  productsFromStorage.forEach(prod => {
    totalPengeluaran += prod.buyPrice * (prod.totalTerjual || 0)
  })
  
  const keuntungan = totalPemasukan - totalPengeluaran
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-card p-4 shadow-sm">
          <div className="text-3xl font-bold">{totalMitra}</div>
          <div className="text-sm text-muted-italic">Total Mitra</div>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-sm">
          <div className="text-3xl font-bold">{mitraAktif}</div>
          <div className="text-sm text-muted-italic">Mitra Aktif</div>
        </div>
      </div>
      <div className="rounded-xl bg-yellow-50 p-4">
        <div className="text-xl font-bold text-yellow-600">{mitraDibanned}</div>
        <div className="text-sm text-yellow-600/80">Mitra Dibanned</div>
      </div>
      <div className="rounded-xl bg-red-50 p-4">
        <div className="text-xl font-bold text-red-600">{mitraSuspended}</div>
        <div className="text-sm text-red-600/80">Mitra Suspended</div>
      </div>
    </div>
    
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="rounded-xl bg-card p-4 shadow-sm">
        <div className="text-3xl font-bold">{totalProduk}</div>
        <div className="text-sm text-muted-italic">Total Produk</div>
      </div>
      <div className="rounded-xl bg-card p-4 shadow-sm">
        <div className="text-3xl font-bold">{totalTransaksi}</div>
        <div className="text-sm text-muted-italic">Total Transaksi</div>
      </div>
    </div>
    
    <div className="mt-6 bg-card p-4 rounded-xl">
      <div className="text-2xl font-bold">{formatRupiah(keuntungan)}</div>
      <div className="text-sm text-muted-italic">Keuntungan Total</div>
    </div>
  )
}

const formatRupiah = (amount) => {
  if (amount === undefined || amount === null) return 'Rp0'
  return 'Rp' + amount.toLocaleString('id-ID')
}

export default DashboardAdmin