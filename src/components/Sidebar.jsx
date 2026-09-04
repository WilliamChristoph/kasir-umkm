const Sidebar = ({ isMobile = false, onToggle, userRole }) => {
  const menuItems = [
    { path: '/home', label: '🏠 Home / Kasir', icon: 'Home' },
    { path: '/gudang', label: '📦 Gudang', icon: 'Package' },
    { path: '/statistik', label: '📊 Statistik', icon: 'Chart' },
  ]
  
  return (
    <aside 
      className={`fixed left-0 top-0 h-full w-64 bg-sidebar transition-transform duration-300 ${isMobile ? 'transform -translate-x-full' : ''} shadow-lg z-40`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="h-full p-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">POS UMKM</h2>
          <button 
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path className="stroke-2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <a 
              key={item.path}
              href={item.path}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${item.path === window.location.pathname ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-gray-100'}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        
        <div className="mt-10 pt-6 border-t">
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            🚪 Log Out
          </button>
        </div>
      </div>
    </aside>
  )
}

Sidebar.displayName = 'Sidebar'

export default Sidebar