import { useState } from "react";

const navigation = [
  { label: "Overview", icon: "▦", active: true },
  { label: "Click events", icon: "↗" },
  { label: "Fraud monitoring", icon: "◇" },
  { label: "Blocked IPs", icon: "⊘" },
  { label: "Pengaturan", icon: "⚙" },
];

function Sidebar({ open, onNavigate }) {
  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <a className="brand" href="#overview" aria-label="ClickGuard Overview">
        <span className="brand-mark">⌁</span>
        <span>
          <strong>ClickGuard</strong>
          <small>FRAUD INTELLIGENCE</small>
        </span>
      </a>

      <div className="sidebar-section-label">WORKSPACE</div>
      <nav className="navigation" aria-label="Navigasi utama">
        {navigation.map((item) => (
          <button
            type="button"
            key={item.label}
            className={`nav-item ${item.active ? "active" : ""}`}
            onClick={() => onNavigate(item.label)}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
            {item.active && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="status-dot" />
        <div>
          <strong>Workspace aktif</strong>
          <p>Fondasi dashboard ClickGuard</p>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ onMenuClick }) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="menu-button"
        onClick={onMenuClick}
        aria-label="Buka navigasi"
      >
        ☰
      </button>
      <div className="breadcrumb">
        <span>Workspace</span>
        <span className="breadcrumb-divider">/</span>
        <strong>ClickGuard</strong>
      </div>
      <div className="profile">
        <div className="avatar">CG</div>
        <div className="profile-copy">
          <strong>Frontend workspace</strong>
          <span>ClickGuard</span>
        </div>
      </div>
    </header>
  );
}

function ContentPanel({ title, description, children, className = "" }) {
  return (
    <section className={`content-panel ${className}`}>
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Overview");

  function handleNavigate(label) {
    setActivePage(label);
    setSidebarOpen(false);
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          type="button"
          className="mobile-overlay"
          aria-label="Tutup navigasi"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        open={sidebarOpen}
        onNavigate={handleNavigate}
      />

      <div className="main-shell">
        <Topbar onMenuClick={() => setSidebarOpen((value) => !value)} />

        <main className="main-content" id="overview">
          <div className="page-intro">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              AD FRAUD DETECTION SYSTEM
            </div>
            <h1>{activePage}</h1>
            <p className="page-description">
              Fondasi antarmuka ClickGuard untuk membantu meninjau aktivitas
              klik iklan dan mengembangkan pemantauan potensi fraud pada tahap
              berikutnya.
            </p>
          </div>

          <div className="structure-grid">
            <ContentPanel
              title="Struktur dashboard"
              description="Kerangka utama halaman dan area konten"
              className="structure-panel"
            >
              <div className="structure-preview">
                <div className="preview-sidebar">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="preview-content">
                  <div className="preview-line preview-line-long" />
                  <div className="preview-line" />
                  <div className="preview-cards">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="preview-block" />
                </div>
              </div>
              <div className="panel-footnote">
                <span className="status-dot" />
                Layout dasar siap dikembangkan
              </div>
            </ContentPanel>

            <ContentPanel
              title="Komponen frontend"
              description="Bagian antarmuka yang dapat digunakan kembali"
            >
              <div className="component-list">
                <div className="component-row">
                  <span className="component-icon">S</span>
                  <div><strong>Sidebar</strong><p>Navigasi utama aplikasi</p></div>
                  <span className="component-tag">Ready</span>
                </div>
                <div className="component-row">
                  <span className="component-icon">H</span>
                  <div><strong>Topbar</strong><p>Breadcrumb dan profil workspace</p></div>
                  <span className="component-tag">Ready</span>
                </div>
                <div className="component-row">
                  <span className="component-icon">P</span>
                  <div><strong>Content panel</strong><p>Wadah konten modular</p></div>
                  <span className="component-tag">Ready</span>
                </div>
                <div className="component-row">
                  <span className="component-icon">R</span>
                  <div><strong>Responsive layout</strong><p>Adaptasi desktop dan mobile</p></div>
                  <span className="component-tag">Ready</span>
                </div>
              </div>
            </ContentPanel>
          </div>

          <ContentPanel
            title="Area pengembangan berikutnya"
            description="Ruang untuk menghubungkan data dan visualisasi pada progres selanjutnya"
            className="next-panel"
          >
            <div className="next-placeholder">
              <div className="placeholder-icon">⌁</div>
              <strong>Dashboard siap dikembangkan</strong>
              <p>
                Kartu ringkasan, grafik traffic, tabel event, dan status model
                akan ditambahkan sesuai progres implementasi berikutnya.
              </p>
            </div>
          </ContentPanel>

          <footer className="page-footer">
            <span>© 2026 ClickGuard · Fraud Intelligence</span>
            <span>React frontend foundation</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
