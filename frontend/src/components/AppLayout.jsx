const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'parts', label: 'Data Spare Part', icon: '▤' },
  { id: 'transactions', label: 'Barang Masuk & Keluar', icon: '⇄' },
  { id: 'reports', label: 'Laporan Persediaan', icon: '▧' }
];

export default function AppLayout({ user, page, setPage, onLogout, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark small" aria-hidden="true">AM</div>
          <div><strong>Abadi Motor</strong><span>Inventory System</span></div>
        </div>
        <p className="nav-caption">MENU UTAMA</p>
        <nav aria-label="Navigasi utama">
          {navigation.map((item) => (
            <button key={item.id} className={`nav-link ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}>
              <span aria-hidden="true">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="user-chip">
            <div className="avatar">{user.name.slice(0, 1).toUpperCase()}</div>
            <div className="user-details"><strong>{user.name}</strong><span>{user.role === 'admin' ? 'Admin' : 'Pemilik'}</span></div>
          </div>
          <button className="logout-button" onClick={onLogout}><span aria-hidden="true">↪</span> Keluar</button>
        </div>
      </aside>
      <main className="main-area">
        <header className="mobile-header">
          <div className="brand-mark small" aria-hidden="true">AM</div>
          <strong>Abadi Motor</strong>
          <button className="mobile-logout" onClick={onLogout}>Keluar</button>
        </header>
        <nav className="mobile-nav" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <button key={item.id} className={`mobile-nav-link ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}>
              <span aria-hidden="true">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="content-area">{children}</div>
      </main>
    </div>
  );
}
