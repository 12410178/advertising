import { useEffect, useMemo, useState } from 'react';
import {
  Activity, Bell, Check, ChevronDown, Filter,
  LayoutDashboard, MousePointer2, Settings, ShieldAlert,
  ShieldCheck, X, Menu, FileDown, Info, ChevronLeft, ChevronRight
} from 'lucide-react';

const PAGE_SIZE = 10;

// Data contoh dipakai hanya ketika file dataset lokal tidak berhasil dimuat.
// Ganti dengan dataset asli saat tersedia.
const DEMO_EVENTS = [
  { click_id: 'CLK-001', ip_address: '192.0.2.10', device: 'Mobile', timestamp: '2026-10-19T08:10:00', classification: 'Valid', is_fraudulent: false, risk_score: 18, browser: 'Chrome', operating_system: 'Android', click_duration: 3, scroll_depth: 65, click_frequency: 1, VPN_usage: false, proxy_usage: false },
  { click_id: 'CLK-002', ip_address: '192.0.2.11', device: 'Desktop', timestamp: '2026-10-19T09:15:00', classification: 'Fraud', is_fraudulent: true, risk_score: 87, browser: 'Edge', operating_system: 'Windows', click_duration: 1, scroll_depth: 5, click_frequency: 12, VPN_usage: true, proxy_usage: false },
  { click_id: 'CLK-003', ip_address: '192.0.2.12', device: 'Mobile', timestamp: '2026-10-19T10:20:00', classification: 'Valid', is_fraudulent: false, risk_score: 22, browser: 'Safari', operating_system: 'iOS', click_duration: 5, scroll_depth: 72, click_frequency: 1, VPN_usage: false, proxy_usage: false },
  { click_id: 'CLK-004', ip_address: '192.0.2.13', device: 'Tablet', timestamp: '2026-10-19T11:05:00', classification: 'Fraud', is_fraudulent: true, risk_score: 79, browser: 'Chrome', operating_system: 'Android', click_duration: 1, scroll_depth: 8, click_frequency: 9, VPN_usage: false, proxy_usage: true },
  { click_id: 'CLK-005', ip_address: '192.0.2.14', device: 'Desktop', timestamp: '2026-10-19T12:40:00', classification: 'Valid', is_fraudulent: false, risk_score: 15, browser: 'Firefox', operating_system: 'Windows', click_duration: 4, scroll_depth: 58, click_frequency: 1, VPN_usage: false, proxy_usage: false }
];

const navigation = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'events', label: 'Click events', Icon: MousePointer2 },
  { id: 'fraud', label: 'Fraud monitoring', Icon: ShieldAlert },
  { id: 'blocked', label: 'Blocked IPs', Icon: ShieldCheck }
];

const descriptions = {
  overview:
    'Ringkasan aktivitas klik iklan, jumlah event fraud dan valid, fraud rate, serta status sistem ClickGuard.',
  events:
    'Daftar aktivitas klik secara terperinci. Cari dan filter event berdasarkan ID klik, alamat IP, perangkat, browser, waktu, atau status klasifikasi.',
  fraud:
    'Pemantauan event yang terindikasi fraud, termasuk klasifikasi, risk score, dan indikator risiko yang tersedia pada dataset.',
  blocked:
    'Pemeriksaan alamat IP terkait aktivitas berisiko serta status pemblokiran berdasarkan data yang benar-benar tersedia. Sinyal VPN atau proxy tidak otomatis berarti IP sudah diblokir.',
  settings:
    'Informasi konfigurasi aplikasi, koneksi backend, sumber data, dan status integrasi sistem ClickGuard.'
};

const numberFormat = n => new Intl.NumberFormat('id-ID').format(n);
const percent = n => `${n.toFixed(1).replace('.', ',')}%`;

function normalizeEvent(e, index) {
  const fraudulent =
    e.is_fraudulent === true ||
    String(e.is_fraudulent).toLowerCase() === 'true' ||
    String(e.classification || '').toLowerCase() === 'fraud';

  return {
    ...e,
    click_id: e.click_id ?? e.clickId ?? `CLICK-${index + 1}`,
    ip_address: e.ip_address ?? e.ip ?? '-',
    device: e.device ?? 'Unknown',
    timestamp: e.timestamp ?? e.date ?? '-',
    classification: fraudulent ? 'Fraud' : 'Valid',
    is_fraudulent: fraudulent,
    risk_score: Number(e.risk_score ?? e.riskScore ?? (fraudulent ? 75 : 20)),
    browser: e.browser ?? '-',
    operating_system: e.operating_system ?? e.os ?? '-',
    click_duration: e.click_duration ?? '-',
    scroll_depth: e.scroll_depth ?? '-',
    click_frequency: e.click_frequency ?? '-',
    VPN_usage: Boolean(e.VPN_usage ?? e.vpn_usage),
    proxy_usage: Boolean(e.proxy_usage ?? e.Proxy_usage)
  };
}

function csvEscape(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function downloadCsv(filename, rows) {
  const csv = '\uFEFF' + rows.map(row => row.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function Sidebar({ active, onNavigate, open, onClose, eventCount }) {
  return (
    <>
      {open && (
        <button
          className="mobile-scrim"
          aria-label="Tutup menu"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Activity size={22} /></div>
          <div>
            <b>ClickGuard</b>
            <small>FRAUD INTELLIGENCE</small>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav>
          {navigation.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`nav-item ${active === id ? 'active' : ''}`}
              onClick={() => {
                onNavigate(id);
                onClose();
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active === id && <i />}
            </button>
          ))}
        </nav>

        <button
          className={`nav-item settings-item ${active === 'settings' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('settings');
            onClose();
          }}
        >
          <Settings size={18} />
          <span>Pengaturan</span>
        </button>

        <div className="workspace-card">
          <div className="ws-head">
            <span className="status-dot" />
            Status dataset
          </div>
          <p>Dataset lokal dimuat untuk analisis event klik.</p>
          <small>EVENT TERBACA · {numberFormat(eventCount)}</small>
        </div>

        <div className="sidebar-foot">
          SISTEM DETEKSI FRAUD KLIK IKLAN DIGITAL<br />
          Proyek Penelitian · Kelompok 2
        </div>
      </aside>
    </>
  );
}

function Header({ onMenu, onNotifications, notificationOpen, unread }) {
  return (
    <header className="topbar">
      <div className="top-left">
        <button
          className="icon-button mobile-menu"
          onClick={onMenu}
          aria-label="Buka navigasi"
        >
          <Menu size={19} />
        </button>
        <span className="crumb">
          Workspace <b>/</b> <strong>ClickGuard</strong>
        </span>
      </div>

      <div className="top-actions">
        <button
          className={`icon-button notification ${notificationOpen ? 'pressed' : ''}`}
          onClick={onNotifications}
          aria-label="Notifikasi"
          aria-expanded={notificationOpen}
        >
          <Bell size={18} />
          {unread && <i />}
        </button>

        <div className="profile">
          <div className="avatar">A4</div>
          <div>
            <b>Frontend workspace</b>
            <small>Kelompok 2</small>
          </div>
        </div>
      </div>
    </header>
  );
}

function Metric({ title, value, sub, Icon, tone, delay }) {
  return (
    <article className="metric-card lift" style={{ '--delay': `${delay}ms` }}>
      <div className="metric-top">
        <span>{title}</span>
        <span className={`metric-icon ${tone}`}>
          <Icon size={19} />
        </span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-bottom">
        <span>{sub}</span>
        <span className="metric-glow" />
      </div>
    </article>
  );
}

function EventTable({ events, onSelect, page, setPage }) {
  const pageCount = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageEvents = events.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>CLICK ID</th>
              <th>IP ADDRESS</th>
              <th>DEVICE</th>
              <th>TIMESTAMP</th>
              <th>CLASSIFICATION</th>
              <th>RISK</th>
            </tr>
          </thead>

          <tbody>
            {pageEvents.map(event => (
              <tr
                key={event.click_id}
                tabIndex="0"
                onClick={() => onSelect(event)}
                onKeyDown={ev => {
                  if (ev.key === 'Enter') onSelect(event);
                }}
              >
                <td><b>{event.click_id}</b></td>
                <td className="mono">{event.ip_address}</td>
                <td>{event.device}</td>
                <td>{event.timestamp}</td>
                <td>
                  <span className={`class-pill ${event.is_fraudulent ? 'fraud' : 'valid'}`}>
                    <i />
                    {event.classification}
                  </span>
                </td>
                <td>
                  <span className="risk-track">
                    <i
                      style={{
                        width: `${Math.max(0, Math.min(100, event.risk_score))}%`,
                        background: event.is_fraudulent ? 'var(--rose)' : 'var(--blue)'
                      }}
                    />
                  </span>
                  <small>{event.risk_score}</small>
                </td>
              </tr>
            ))}

            {!pageEvents.length && (
              <tr>
                <td colSpan="6">Tidak ada data yang cocok dengan filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer pagination-footer">
        <span className="pagination-info">
          Halaman {safePage} dari {pageCount} · {events.length} event
        </span>

        <nav className="pagination-controls" aria-label="Navigasi halaman tabel">
          <button
            className="pagination-nav"
            disabled={safePage <= 1}
            onClick={() => setPage(safePage - 1)}
          >
            <ChevronLeft size={14} /> <span>Sebelumnya</span>
          </button>

          {Array.from({ length: pageCount }, (_, i) => i + 1)
            .filter(n => n === 1 || n === pageCount || Math.abs(n - safePage) <= 1)
            .map(n => (
              <button
                key={n}
                className={`pagination-page ${n === safePage ? 'page-active' : ''}`}
                aria-current={n === safePage ? 'page' : undefined}
                aria-label={`Halaman ${n}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}

          <button
            className="pagination-nav"
            disabled={safePage >= pageCount}
            onClick={() => setPage(safePage + 1)}
          >
            <span>Berikutnya</span> <ChevronRight size={14} />
          </button>
        </nav>
      </div>
    </>
  );
}

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [active, setActive] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);

  const [classFilter, setClassFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let alive = true;

    fetch('/data/demoEvents.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        const list = Array.isArray(data)
          ? data
          : (data.events ?? data.data ?? []);

        if (!Array.isArray(list)) {
          throw new Error('Format JSON harus berupa array event.');
        }

        if (alive) setEvents(list.map(normalizeEvent));
      })
      .catch(error => {
        if (alive) {
          setEvents(DEMO_EVENTS.map(normalizeEvent));
          setLoadError(
            'Mode demo aktif: dataset lokal tidak berhasil dimuat. Angka dan event yang tampil adalah data contoh, bukan data produksi.'
          );
        }
        console.error('Gagal memuat dataset lokal; menggunakan data demo:', error);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => events.filter(event =>
    (classFilter === 'all' ||
      (classFilter === 'fraud'
        ? event.is_fraudulent
        : !event.is_fraudulent)) &&
    (deviceFilter === 'all' ||
      String(event.device).toLowerCase() === deviceFilter)
  ), [events, classFilter, deviceFilter]);

  const shown = active === 'fraud'
    ? filtered.filter(event => event.is_fraudulent)
    : active === 'blocked'
      ? filtered.filter(event => event.VPN_usage || event.proxy_usage)
      : filtered;

  useEffect(() => {
    setPage(1);
  }, [active, classFilter, deviceFilter]);

  const total = filtered.length;
  const fraudCount = filtered.filter(event => event.is_fraudulent).length;
  const validCount = total - fraudCount;
  const fraudRate = total ? fraudCount / total * 100 : 0;

  const downloadReport = () => {
    const rows = [
      ['Laporan ClickGuard', 'Periode 1–19 Oktober 2026'],
      ['Tanggal laporan', '19 Oktober 2026'],
      [],
      [
        'No', 'Click ID', 'Tanggal event', 'IP Address', 'Perangkat',
        'Status', 'Risk score', 'Alasan', 'Keterangan', 'Kesimpulan'
      ]
    ];

    events.forEach((event, index) => {
      const reason = event.is_fraudulent
        ? [
            event.VPN_usage && 'VPN terdeteksi',
            event.proxy_usage && 'Proxy terdeteksi',
            Number(event.click_frequency) > 0 &&
              'Frekuensi klik tercatat'
          ].filter(Boolean).join('; ') || 'Event berlabel fraud pada dataset'
        : 'Event berlabel valid pada dataset';

      rows.push([
        index + 1,
        event.click_id,
        event.timestamp,
        event.ip_address,
        event.device,
        event.classification,
        event.risk_score,
        reason,
        'Klasifikasi mengikuti dataset; belum diverifikasi backend',
        event.is_fraudulent
          ? 'Perlu ditinjau'
          : 'Valid menurut label dataset'
      ]);
    });

    rows.push([]);
    rows.push(['Ringkasan', `Total ${events.length} event`]);
    rows.push(['Event berlabel fraud', fraudCount]);
    rows.push(['Event berlabel valid', validCount]);
    rows.push([
      'Kesimpulan',
      'Klasifikasi mengikuti dataset dan perlu validasi backend.'
    ]);

    downloadCsv('clickguard-laporan-1-19-oktober-2026.csv', rows);
  };

  const title = {
    overview: 'Overview',
    events: 'Click events',
    fraud: 'Fraud monitoring',
    blocked: 'Blocked IPs',
    settings: 'Pengaturan'
  }[active];

  return (
    <div className="app-shell">
      <Sidebar
        active={active}
        onNavigate={setActive}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        eventCount={events.length}
      />

      <div className="main-shell">
        <Header
          onMenu={() => setMobileOpen(true)}
          onNotifications={() => {
            setNotifyOpen(value => !value);
            setNotificationsRead(true);
          }}
          notificationOpen={notifyOpen}
          unread={!notificationsRead}
        />

        {notifyOpen && (
          <div className="notification-pop">
            <div className="pop-title">
              <b>Notifikasi</b>
              <button
                onClick={() => setNotifyOpen(false)}
                aria-label="Tutup"
              >
                <X size={15} />
              </button>
            </div>

            <p>
              <span className="notif-dot red" />
              {fraudCount} event berlabel fraud pada dataset.
            </p>
            <p>
              <span className="notif-dot blue" />
              Dataset memuat {numberFormat(events.length)} event.
            </p>
            <small>Notifikasi berdasarkan dataset lokal, bukan alert backend.</small>
          </div>
        )}

        <main className="content">
          <div className="eyebrow">
            <span /> AD FRAUD DETECTION SYSTEM
          </div>

          <div className="title-row">
            <div>
              <h1>{title}</h1>
              <p className="lead">{descriptions[active]}</p>
            </div>

            <div className="toolbar">
              {active !== 'settings' && (
                <button
                  className={`btn-filter ${filterOpen ? 'selected' : ''}`}
                  onClick={() => setFilterOpen(value => !value)}
                  aria-expanded={filterOpen}
                >
                  <Filter size={16} />
                  Filter data
                  <ChevronDown size={14} />
                </button>
              )}

              <button className="btn-download" onClick={downloadReport}>
                <FileDown size={16} />
                Unduh Laporan
              </button>
            </div>
          </div>

          {loadError && (
            <div className="demo-banner">
              <Info size={18} />
              {loadError}
            </div>
          )}

          {loading && <p>Memuat dataset...</p>}

          {filterOpen && active !== 'settings' && (
            <div className="filter-panel">
              <div className="filter-heading">
                <b>Filter event</b>
                <button
                  onClick={() => setFilterOpen(false)}
                  aria-label="Tutup filter"
                >
                  <X size={15} />
                </button>
              </div>

              <label>
                Klasifikasi
                <select
                  value={classFilter}
                  onChange={event => setClassFilter(event.target.value)}
                >
                  <option value="all">Semua</option>
                  <option value="fraud">Fraud</option>
                  <option value="valid">Valid</option>
                </select>
              </label>

              <label>
                Perangkat
                <select
                  value={deviceFilter}
                  onChange={event => setDeviceFilter(event.target.value)}
                >
                  <option value="all">Semua perangkat</option>
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                  <option value="tablet">Tablet</option>
                </select>
              </label>

              <button
                className="clear-filter"
                onClick={() => {
                  setClassFilter('all');
                  setDeviceFilter('all');
                }}
              >
                Reset filter
              </button>

              <span className="filter-result">
                Menampilkan {filtered.length} event
              </span>
            </div>
          )}

          {active === 'settings' ? (
            <section className="panel settings-panel">
              <div className="panel-head">
                <div>
                  <h2>Status integrasi</h2>
                  <p>Informasi koneksi dashboard</p>
                </div>
                <span className="status-chip">
                  <span />Belum terhubung
                </span>
              </div>

              <div className="setting-row">
                <div>
                  <b>Backend</b>
                  <p>Endpoint API belum dikonfigurasi.</p>
                </div>
                <span className="status-chip">Offline</span>
              </div>

              <div className="setting-row">
                <div>
                  <b>Sumber data</b>
                  <p>Dataset JSON lokal · {events.length} event terbaca.</p>
                </div>
                <span className="status-chip">
                  <Check size={13} />Terbaca
                </span>
              </div>

              <div className="setting-row">
                <div>
                  <b>Model deteksi</b>
                  <p>Status training dan inferensi belum diverifikasi.</p>
                </div>
                <span className="status-chip">Belum diverifikasi</span>
              </div>
            </section>
          ) : (
            <>
              {active === 'overview' && (
                <>
                  <section className="metrics-grid">
                    <Metric
                      title="Total click events"
                      value={numberFormat(total)}
                      sub="Event pada dataset"
                      Icon={MousePointer2}
                      tone="blue"
                      delay={0}
                    />
                    <Metric
                      title="Fraud flagged"
                      value={numberFormat(fraudCount)}
                      sub="Event berlabel fraud"
                      Icon={ShieldAlert}
                      tone="rose"
                      delay={60}
                    />
                    <Metric
                      title="Valid traffic"
                      value={numberFormat(validCount)}
                      sub="Event berlabel valid"
                      Icon={ShieldCheck}
                      tone="green"
                      delay={120}
                    />
                    <Metric
                      title="Fraud rate"
                      value={percent(fraudRate)}
                      sub="Proporsi event berlabel fraud"
                      Icon={Activity}
                      tone="violet"
                      delay={180}
                    />
                  </section>

                  <section className="panel model-panel model-panel-progress14">
                    <div className="panel-head">
                      <div>
                        <h2>Model status</h2>
                        <p>Kesiapan model deteksi</p>
                      </div>
                      <span className="status-chip">
                        <span />Belum terhubung
                      </span>
                    </div>

                    <div className="model-illustration">
                      <div className="orb orb-a" />
                      <div className="orb orb-b" />
                      <div className="model-icon"><Activity size={25} /></div>
                      <b>Model belum diverifikasi</b>
                      <p>
                        Status model dan hasil deteksi perlu dikonfirmasi
                        melalui integrasi backend.
                      </p>
                    </div>

                    <div className="model-source">
                      <span>Status integrasi</span>
                      <code>Belum dikonfigurasi</code>
                    </div>
                  </section>
                </>
              )}

              <section className="panel events-panel">
                <div className="panel-head events-head">
                  <div>
                    <h2>
                      {active === 'fraud'
                        ? 'Fraud events'
                        : active === 'blocked'
                          ? 'Risk signals'
                          : 'Click event records'}
                    </h2>
                    <p>{shown.length} event · pilih baris untuk detail</p>
                  </div>
                  <span className="table-badge">{shown.length} events</span>
                </div>

                <EventTable
                  events={shown}
                  onSelect={setSelected}
                  page={page}
                  setPage={setPage}
                />
              </section>
            </>
          )}

          <footer>
            <span>© 2026 ClickGuard · Sistem Deteksi Fraud Klik Iklan Digital</span>
            <span className="footer-state">
              <i />Dataset lokal · backend belum terhubung
            </span>
          </footer>
        </main>
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <section
            className="detail-modal"
            onClick={event => event.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <small>DETAIL EVENT</small>
                <h3>{selected.click_id}</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Tutup detail"
              >
                <X size={18} />
              </button>
            </div>

            <div className="detail-status">
              <span className={`class-pill ${selected.is_fraudulent ? 'fraud' : 'valid'}`}>
                {selected.classification}
              </span>
              <b>Risk score {selected.risk_score}/100</b>
            </div>

            <div className="detail-grid">
              {[
                ['IP address', selected.ip_address],
                ['Timestamp', selected.timestamp],
                ['Device', selected.device],
                ['Browser', selected.browser],
                ['OS', selected.operating_system],
                ['Click duration', `${selected.click_duration}s`],
                ['Scroll depth', `${selected.scroll_depth}%`],
                ['Click frequency', selected.click_frequency],
                ['VPN usage', selected.VPN_usage ? 'Yes' : 'No'],
                ['Proxy usage', selected.proxy_usage ? 'Yes' : 'No']
              ].map(([key, value]) => (
                <div key={key}>
                  <small>{key}</small>
                  <b>{value}</b>
                </div>
              ))}
            </div>

            <p className="modal-note">
              Klasifikasi dan risk score mengikuti nilai yang tersedia pada
              dataset. Hasil ini belum diverifikasi oleh backend.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;