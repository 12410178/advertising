import { useEffect, useMemo, useState } from 'react';
import {
  Activity, Bell, Check, ChevronDown, CircleHelp, Filter,
  LayoutDashboard, MousePointer2, Settings, ShieldAlert,
  ShieldCheck, X, Menu, CalendarDays, FileDown, Info,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const PAGE_SIZE = 10;
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const navigation = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'events', label: 'Click events', Icon: MousePointer2 },
  { id: 'fraud', label: 'Fraud monitoring', Icon: ShieldAlert },
  { id: 'blocked', label: 'Blocked IPs', Icon: ShieldCheck }
];

const descriptions = {
  overview:
    'Overview menyajikan ringkasan aktivitas klik iklan dan indikator potensi fraud. Pengguna dapat melihat total event, traffic valid, event fraud, dan fraud rate. Grafik Traffic overview membantu memahami perubahan volume klik berdasarkan waktu. Halaman ini menjadi titik awal untuk menelusuri aktivitas yang perlu diperiksa.',
  events:
    'Click events menampilkan catatan aktivitas klik secara terperinci. Tabel memuat ID klik, alamat IP, perangkat, waktu, klasifikasi, dan risk score. Filter dan pagination membantu pengguna menelusuri seluruh event. Klik salah satu baris untuk melihat detail aktivitas dan indikator pendukung.',
  fraud:
    'Fraud monitoring memusatkan perhatian pada event yang diberi label fraud. Pengguna dapat meninjau IP, waktu aktivitas, perangkat, dan risk score. Detail event membantu memeriksa indikator seperti frekuensi klik, VPN, atau proxy. Klasifikasi perlu ditinjau sebelum dijadikan dasar tindakan.',
  blocked:
    'Blocked IPs menampilkan alamat IP yang memiliki sinyal risiko dalam dataset. Pengguna dapat memeriksa event terkait dan indikator VPN atau proxy. Sinyal risiko tidak berarti IP telah diblokir secara nyata. Status pemblokiran aktual perlu dikonfirmasi melalui backend keamanan.',
  settings:
    'Pengaturan menyediakan informasi konfigurasi dan integrasi ClickGuard. Pengguna dapat memeriksa status koneksi backend. Informasi ini membantu memahami sumber data dan kesiapan integrasi. Konfigurasi lanjutan dapat ditambahkan setelah backend tersedia.'
};

const numberFormat = value => new Intl.NumberFormat('id-ID').format(value);
const percent = value => `${value.toFixed(1).replace('.', ',')}%`;

function asBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  const text = String(value ?? '').trim().toLowerCase();
  return text === 'true' || text === '1' || text === 'yes' || text === 'ya';
}

function getEventTimestamp(event) {
  const candidates = [
    event?.timestamp, event?.datetime, event?.date, event?.event_timestamp,
    event?.eventTimestamp, event?.event_time, event?.eventTime,
    event?.click_time, event?.clickTime, event?.created_at, event?.createdAt,
    event?.date_time, event?.dateTime, event?.click_date, event?.clickDate,
    event?.time
  ];
  return candidates.find(value => value !== undefined && value !== null && value !== '' && value !== '-') ?? null;
}

function normalizeEvent(event, index) {
  const fraudulent =
    asBoolean(event.is_fraudulent ?? event.isFraudulent) ||
    String(event.classification ?? '').toLowerCase() === 'fraud';

  return {
    ...event,
    click_id: event.click_id ?? event.clickId ?? `CLICK-${index + 1}`,
    ip_address: event.ip_address ?? event.ip ?? '-',
    device: event.device ?? 'Unknown',
    timestamp: getEventTimestamp(event) ?? '-',
    classification: fraudulent ? 'Fraud' : 'Valid',
    is_fraudulent: fraudulent,
    risk_score: Number(event.risk_score ?? event.riskScore ?? (fraudulent ? 75 : 20)),
    browser: event.browser ?? '-',
    operating_system: event.operating_system ?? event.os ?? '-',
    click_duration: event.click_duration ?? '-',
    scroll_depth: event.scroll_depth ?? '-',
    click_frequency: event.click_frequency ?? '-',
    VPN_usage: asBoolean(event.VPN_usage ?? event.vpn_usage),
    proxy_usage: asBoolean(event.proxy_usage ?? event.Proxy_usage)
  };
}

function csvEscape(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function downloadCsv(filename, rows) {
  const csv = '\uFEFF' + rows.map(row => row.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Sidebar({ active, onNavigate, open, onClose, eventCount }) {
  return (
    <>
      {open && <button className="mobile-scrim" aria-label="Tutup menu" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Activity size={22} /></div>
          <div><b>ClickGuard</b><small>FRAUD INTELLIGENCE</small></div>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {navigation.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`nav-item ${active === id ? 'active' : ''}`}
              onClick={() => { onNavigate(id); onClose(); }}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active === id && <i />}
            </button>
          ))}
        </nav>
        <button
          className={`nav-item settings-item ${active === 'settings' ? 'active' : ''}`}
          onClick={() => { onNavigate('settings'); onClose(); }}
        >
          <Settings size={18} /><span>Pengaturan</span>
        </button>
        <div className="workspace-card">
          <div className="ws-head"><span className="status-dot" />Status dataset</div>
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
        <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Buka navigasi">
          <Menu size={19} />
        </button>
        <span className="crumb">Workspace <b>/</b> <strong>ClickGuard</strong></span>
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
          <div><b>Frontend workspace</b><small>Kelompok 2</small></div>
        </div>
      </div>
    </header>
  );
}

function Tooltip({ children }) {
  const [show, setShow] = useState(false);
  return (
    <span className="tooltip-wrap" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <button
        className="help-trigger"
        aria-label="Keterangan grafik"
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onClick={() => setShow(value => !value)}
      >
        <CircleHelp size={15} />
      </button>
      {show && <span role="tooltip" className="tooltip-pop">{children}</span>}
    </span>
  );
}

function Metric({ title, value, sub, Icon, tone, delay }) {
  return (
    <article className="metric-card lift" style={{ '--delay': `${delay}ms` }}>
      <div className="metric-top">
        <span>{title}</span>
        <span className={`metric-icon ${tone}`}><Icon size={19} /></span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-bottom"><span>{sub}</span><span className="metric-glow" /></div>
    </article>
  );
}

/*
 * Parse timestamps into browser-local Date values so bucket labels match the
 * user's local clock. Date-only strings are parsed as local calendar dates.
 */
function parseTrafficDate(row) {
  const candidates = [
    row?.timestamp, row?.datetime, row?.date,
    row?.event_timestamp, row?.eventTimestamp, row?.event_time, row?.eventTime,
    row?.click_time, row?.clickTime, row?.created_at, row?.createdAt,
    row?.date_time, row?.dateTime, row?.click_date, row?.clickDate,
    row?.bucket, row?.period, row?.time, row?._id
  ];
  const candidate = candidates.find(value =>
    value !== undefined && value !== null && value !== '' && value !== '-'
  );

  if (candidate instanceof Date) {
    return Number.isNaN(candidate.getTime()) ? null : new Date(candidate);
  }

  if (candidate && typeof candidate === 'object') {
    const year = Number(candidate.year ?? candidate.y);
    const month = Number(candidate.month ?? candidate.m);
    const day = Number(candidate.day ?? candidate.d);
    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day) && month >= 1 && month <= 12) {
      const hour = Number(candidate.hour ?? candidate.h ?? 0);
      const minute = Number(candidate.minute ?? candidate.min ?? 0);
      return new Date(year, month - 1, day, Number.isFinite(hour) ? hour : 0, Number.isFinite(minute) ? minute : 0);
    }
    const nested = candidate.date ?? candidate.$date ?? candidate.timestamp ?? candidate.$oid;
    if (nested !== undefined && nested !== null) return parseTrafficDate({ timestamp: nested });
    return null;
  }

  if (candidate === undefined || candidate === null || candidate === '' || candidate === '-') return null;

  if (typeof candidate === 'number') {
    const date = new Date(Math.abs(candidate) < 1e12 ? candidate * 1000 : candidate);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const text = String(candidate).trim();
  if (!text) return null;

  // MongoDB ObjectId stores its creation timestamp in the first 8 hex digits.
  if (/^[a-f0-9]{24}$/i.test(text)) {
    const seconds = Number.parseInt(text.slice(0, 8), 16);
    const date = new Date(seconds * 1000);
    if (!Number.isNaN(date.getTime())) return date;
  }

  // Indonesian DD/MM/YYYY or DD-MM-YYYY timestamps, with optional time.
  const dayFirstMatch = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:[ T]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (dayFirstMatch) {
    const [, day, month, year, hour = '0', minute = '0', second = '0'] = dayFirstMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
    if (
      date.getFullYear() === Number(year) &&
      date.getMonth() === Number(month) - 1 &&
      date.getDate() === Number(day) &&
      !Number.isNaN(date.getTime())
    ) return date;
  }

  // YYYY-MM-DD and SQL-style local datetime without an explicit timezone.
  const localMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?)?$/);
  if (localMatch) {
    const [, year, month, day, hour = '0', minute = '0', second = '0', fraction = '0'] = localMatch;
    const millis = Number(`0.${fraction}`) * 1000;
    const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second), Math.floor(millis));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readNumericField(row, keys) {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== '') {
      const value = Number(row[key]);
      if (Number.isFinite(value)) return Math.max(0, value);
    }
  }
  return undefined;
}

function normalizeTrafficRows(rows) {
  return rows.map((row, index) => {
    const rawFraudField = row?.fraud;
    const fraudFieldIsLabel = typeof rawFraudField === 'boolean' || (
      typeof rawFraudField === 'string' && rawFraudField.trim() !== '' && !Number.isFinite(Number(rawFraudField))
    );
    const fraudValue = readNumericField(row, [
      'fraudCount', 'fraud_count', ...(!fraudFieldIsLabel ? ['fraud'] : []),
      'fraudEvents', 'fraud_events', 'fraudulentCount', 'fraudClicks', 'fraud_clicks'
    ]);
    const totalValue = readNumericField(row, [
      'totalEvents', 'total_events', 'total', 'eventCount', 'event_count',
      'eventTotal', 'count', 'clickCount', 'click_count', 'clicks', 'totalClicks'
    ]);
    const validValue = readNumericField(row, [
      'validCount', 'valid_count', 'valid', 'validEvents', 'valid_events', 'validClicks', 'valid_clicks'
    ]);

    const date = parseTrafficDate(row);
    const hasAggregateFields = fraudValue !== undefined || totalValue !== undefined || validValue !== undefined;

    // Some endpoints return one row per click instead of pre-aggregated counts.
    // Recognize those rows too, so valid/fraud events are not discarded.
    if (!hasAggregateFields) {
      const rawClassification = String(row?.classification ?? row?.status ?? row?.label ?? '').trim().toLowerCase();
      const fraudFlag = row?.is_fraudulent ?? row?.isFraudulent ?? row?.fraudulent ??
        (typeof row?.fraud === 'boolean' || (typeof row?.fraud === 'string' && !Number.isFinite(Number(row.fraud))) ? row.fraud : undefined);
      const hasClassification = ['fraud', 'valid', 'legitimate', 'non-fraud', 'nonfraud'].includes(rawClassification) || fraudFlag !== undefined;
      if (!date || !hasClassification) return null;
      const isFraud = asBoolean(fraudFlag) || ['fraud'].includes(rawClassification);
      return { date, total: 1, fraud: isFraud ? 1 : 0, valid: isFraud ? 0 : 1, order: index };
    }

    const fraud = fraudValue ?? 0;
    const valid = validValue ?? Math.max(0, (totalValue ?? fraud) - fraud);
    const total = totalValue ?? (fraud + valid);

    return { date, total, fraud, valid, order: index };
  }).filter(row => row && Number.isFinite(row.total) && Number.isFinite(row.fraud) && Number.isFinite(row.valid))
    .sort((a, b) => {
      if (a.date && b.date) return a.date.getTime() - b.date.getTime();
      if (a.date) return -1;
      if (b.date) return 1;
      return a.order - b.order;
    });
}

function periodConfig(period) {
  if (period === 'hour') return { count: 12, interval: 'hour', label: 'Per jam' };
  if (period === 'week') return { count: 12, interval: 'day', label: 'Per minggu' };
  if (period === 'month') return { count: 12, interval: 'day', label: 'Per bulan' };
  return { count: 8, interval: 'day', label: 'Per tahun' };
}

function startOfHour(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date) {
  return new Date(date.getFullYear(), 0, 1);
}

function dayOrdinal(date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
}

function hourLabel(date) {
  return `${String(date.getHours()).padStart(2, '0')}:00`;
}

function dayLabel(date) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(date);
}

function monthLabel(date) {
  return new Intl.DateTimeFormat('id-ID', { month: 'short', year: '2-digit' }).format(date);
}

function createTimeline(period, now = new Date()) {
  const count = periodConfig(period).count;
  const timeline = [];

  // Oldest period first, current period at the far right.
  for (let offset = count - 1; offset >= 0; offset -= 1) {
    let date;
    let label;

    if (period === 'hour') {
      date = startOfHour(now);
      date.setHours(date.getHours() - offset);
      label = hourLabel(date);
    } else if (period === 'week') {
      // The weekly point labels are anchored to today, then exactly 7 days apart.
      date = startOfDay(now);
      date.setDate(date.getDate() - offset * 7);
      label = dayLabel(date);
    } else if (period === 'month') {
      date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      label = monthLabel(date);
    } else {
      date = new Date(now.getFullYear() - offset, 0, 1);
      label = String(date.getFullYear());
    }

    timeline.push({
      key: `${period}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${period === 'hour' ? date.getHours() : ''}`,
      date,
      label,
      total: 0,
      valid: 0,
      fraud: 0
    });
  }

  return timeline;
}

function getBucketIndex(eventDate, timeline, period, now = new Date()) {
  if (!(eventDate instanceof Date) || Number.isNaN(eventDate.getTime())) return -1;

  if (period === 'hour') {
    const eventHour = startOfHour(eventDate).getTime();
    return timeline.findIndex(bucket => bucket.date.getTime() === eventHour);
  }

  if (period === 'week') {
    const daysAgo = dayOrdinal(startOfDay(now)) - dayOrdinal(startOfDay(eventDate));
    if (daysAgo < 0) return -1;
    const weeksAgo = Math.floor(daysAgo / 7);
    const index = timeline.length - 1 - weeksAgo;
    return index >= 0 && index < timeline.length ? index : -1;
  }

  if (period === 'month') {
    const monthsAgo = (now.getFullYear() - eventDate.getFullYear()) * 12 + now.getMonth() - eventDate.getMonth();
    if (monthsAgo < 0) return -1;
    const index = timeline.length - 1 - monthsAgo;
    return index >= 0 && index < timeline.length ? index : -1;
  }

  const yearsAgo = now.getFullYear() - eventDate.getFullYear();
  if (yearsAgo < 0) return -1;
  const index = timeline.length - 1 - yearsAgo;
  return index >= 0 && index < timeline.length ? index : -1;
}

function aggregateRowsIntoTimeline(rows, period, now = new Date()) {
  const timeline = createTimeline(period, now);
  for (const row of rows) {
    if (!row.date || Number.isNaN(row.date.getTime())) continue;
    const index = getBucketIndex(row.date, timeline, period, now);
    if (index < 0) continue;
    timeline[index].valid += row.valid;
    timeline[index].fraud += row.fraud;
    timeline[index].total += row.total;
  }
  return timeline;
}

function bucketsFromApi(rows, period, now = new Date()) {
  const normalizedRows = normalizeTrafficRows(rows).filter(
    row => row.date instanceof Date && !Number.isNaN(row.date.getTime())
  );
  return {
    buckets: aggregateRowsIntoTimeline(normalizedRows, period, now),
    rows: normalizedRows,
    hasDatedRows: normalizedRows.length > 0,
    hasEvents: normalizedRows.some(row => row.total > 0)
  };
}

function bucketsFromEvents(events, period, now = new Date()) {
  const rows = events.map(event => {
    const date = parseTrafficDate({ timestamp: getEventTimestamp(event) });
    if (!date) return null;
    const fraudulent = asBoolean(event.is_fraudulent ?? event.isFraudulent) ||
      String(event.classification ?? '').toLowerCase() === 'fraud';
    return {
      date,
      total: 1,
      fraud: fraudulent ? 1 : 0,
      valid: fraudulent ? 0 : 1
    };
  }).filter(Boolean);
  return {
    buckets: aggregateRowsIntoTimeline(rows, period, now),
    rows,
    hasDatedRows: rows.length > 0,
    hasEvents: rows.length > 0
  };
}

function extractTrafficRows(payload) {
  if (Array.isArray(payload)) return payload;
  const candidates = [
    payload?.data,
    payload?.data?.data,
    payload?.data?.traffic,
    payload?.traffic,
    payload?.result?.data,
    payload?.result?.traffic,
    payload?.items
  ];
  return candidates.find(Array.isArray) || [];
}

function apiRange(period, now) {
  const count = periodConfig(period).count;
  let start;
  if (period === 'hour') {
    start = startOfHour(now);
    start.setHours(start.getHours() - (count - 1));
  } else if (period === 'week') {
    // Include all seven calendar days for every seven-day bucket, including the oldest one.
    start = startOfDay(now);
    start.setDate(start.getDate() - (count * 7 - 1));
  } else if (period === 'month') {
    start = new Date(now.getFullYear(), now.getMonth() - (count - 1), 1);
  } else {
    start = new Date(now.getFullYear() - (count - 1), 0, 1);
  }
  return { start, end: new Date(now) };
}

/*
 * Preview-only scatter data. It is deliberately deterministic so points do not
 * jump around on each render. Never used when the API contains usable traffic
 * or when the local dataset has enough dated rows. These points are explicitly
 * labelled as illustrative in the chart, not as historical event records.
 */
function createDemoScatterData(buckets, period) {
  const count = Math.max(1, buckets.length);
  const cellWidth = 100 / count;
  const phase = { hour: 0.15, week: 0.8, month: 1.35, year: 2.05 }[period] ?? 0.15;
  const offsets = [-0.36, -0.18, 0, 0.18, 0.36];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const noise = (bucketIndex, sampleIndex, seriesSeed) => {
    const raw = Math.sin((bucketIndex + 1) * 12.9898 + (sampleIndex + 1) * 78.233 + seriesSeed * 37.719) * 43758.5453;
    return (raw - Math.floor(raw)) * 2 - 1;
  };

  const means = [];
  const samples = [];

  buckets.forEach((bucket, index) => {
    const t = count === 1 ? 0.5 : index / (count - 1);
    const validMean = Math.round(clamp(
      22 + 5.1 * Math.sin(index * 1.28 + phase) + 3.0 * Math.cos(index * 0.62 + 0.7) + 1.8 * (t - 0.5),
      13, 34
    ));
    const fraudMean = Math.round(clamp(
      5.4 + 2.25 * Math.sin(index * 1.17 + phase + 0.6) + 1.05 * Math.cos(index * 0.72 + 0.25),
      1, 10
    ));
    const total = validMean + fraudMean;

    means.push({ ...bucket, valid: validMean, fraud: fraudMean, total, isSynthetic: true });

    [
      { series: 'Valid', mean: validMean, spread: 8.5, seed: 1 },
      { series: 'Fraud', mean: fraudMean, spread: 3.8, seed: 2 }
    ].forEach(({ series, mean, spread, seed }) => {
      offsets.forEach((offset, sampleIndex) => {
        const value = Math.round(clamp(
          mean + noise(index, sampleIndex, seed + phase * 10) * spread,
          series === 'Valid' ? 4 : 0,
          series === 'Valid' ? 38 : 14
        ));
        samples.push({
          x: ((index + 0.5) / count) * 100 + offset * cellWidth,
          count: value,
          series,
          label: bucket.label,
          bucketIndex: index,
          sampleIndex,
          total,
          validTotal: validMean,
          fraudTotal: fraudMean,
          fraudRate: total ? fraudMean / total * 100 : 0,
          isSynthetic: true
        });
      });
    });
  });

  return { means, samples };
}

function TrafficChart({ events, period }) {
  const [apiTraffic, setApiTraffic] = useState({ status: 'loading', rows: [] });
  const [hovered, setHovered] = useState(null);
  const [now, setNow] = useState(() => new Date());

  // Update display time regularly. The API is refreshed only when the current hour changes.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const currentHourKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;
    const configuredBase = import.meta.env.VITE_API_URL;
    const baseUrl = (configuredBase || `${window.location.protocol}//${window.location.hostname}:5000`).replace(/\/+$/, '');
    const endpoint = baseUrl.endsWith('/api')
      ? `${baseUrl}/monitoring/traffic`
      : `${baseUrl}/api/monitoring/traffic`;
    const { start, end } = apiRange(period, now);
    const query = new URLSearchParams({
      interval: periodConfig(period).interval,
      startDate: start.toISOString(),
      endDate: end.toISOString()
    });

    setApiTraffic({ status: 'loading', rows: [] });
    setHovered(null);
    fetch(`${endpoint}?${query.toString()}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(payload => {
        const rows = extractTrafficRows(payload);
        if (alive) setApiTraffic({ status: rows.length ? 'success' : 'empty', rows });
      })
      .catch(error => {
        if (alive && error.name !== 'AbortError') {
          setApiTraffic({ status: 'error', rows: [], message: error.message });
        }
      });

    return () => {
      alive = false;
      controller.abort();
    };
    // currentHourKey intentionally changes only when the selected hour changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, currentHourKey]);

  const apiResult = useMemo(
    () => bucketsFromApi(apiTraffic.rows, period, now),
    [apiTraffic.rows, period, now]
  );
  const localResult = useMemo(
    () => bucketsFromEvents(events, period, now),
    [events, period, now]
  );

  const apiCurrentHasData = apiResult.buckets.some(bucket => bucket.total > 0);
  const localCurrentHasData = localResult.buckets.some(bucket => bucket.total > 0);
  let buckets;
  let useApiData = false;
  let useLocalDatedData = false;
  if (apiTraffic.status === 'success' && apiCurrentHasData) {
    buckets = apiResult.buckets;
    useApiData = true;
  } else if (localCurrentHasData) {
    buckets = localResult.buckets;
    useLocalDatedData = true;
  } else if (apiResult.hasDatedRows && apiResult.buckets.some(bucket => bucket.total > 0)) {
    buckets = apiResult.buckets;
    useApiData = true;
  } else {
    // Sumbu waktu selalu berakhir pada periode sekarang, bukan bergeser ke
    // timestamp historis terakhir yang kebetulan tersedia di dataset.
    buckets = createTimeline(period, now);
  }

  // Bila data API belum tersedia dan sampel lokal masih sedikit, gunakan
  // sebaran demo yang padat untuk preview. Periode/label tetap berasal dari
  // timeline aktual saat ini; titik simulasi diberi keterangan yang jelas.
  const hasUsableBucketData = buckets.some(bucket => bucket.total > 0);
  const useDemoCloud = !useApiData && (
    apiTraffic.status !== 'success' || localResult.rows.length < 48 || !hasUsableBucketData
  );
  const demoData = useDemoCloud ? createDemoScatterData(buckets, period) : null;
  const displayBuckets = demoData ? demoData.means : buckets;
  const hasData = Boolean(demoData) || displayBuckets.some(bucket => bucket.total > 0);

  const sampleMax = demoData ? Math.max(0, ...demoData.samples.map(point => point.count)) : 0;
  const maxValue = Math.max(
    1,
    ...displayBuckets.flatMap(bucket => [bucket.valid, bucket.fraud]),
    sampleMax
  );
  const axisMax = Math.max(1, Math.ceil(maxValue * 1.15));
  // Pusat setiap titik sejajar dengan label; sebaran demo hanya digeser
  // sedikit di dalam interval supaya banyak titik tidak menumpuk persis.
  const xFor = index => ((index + 0.5) / Math.max(1, displayBuckets.length)) * 100;
  const yFor = value => 96 - (value / axisMax) * 92;

  const validPoints = displayBuckets.map((bucket, index) => ({
    x: xFor(index), y: yFor(bucket.valid), bucket, bucketIndex: index,
    series: 'Valid', count: bucket.valid
  }));
  const fraudPoints = displayBuckets.map((bucket, index) => ({
    x: xFor(index), y: yFor(bucket.fraud), bucket, bucketIndex: index,
    series: 'Fraud', count: bucket.fraud
  }));
  const allPoints = [...validPoints, ...fraudPoints].map(point => ({
    ...point,
    total: point.bucket.total,
    validTotal: point.bucket.valid,
    fraudTotal: point.bucket.fraud,
    label: point.bucket.label,
    fraudRate: point.bucket.total ? point.bucket.fraud / point.bucket.total * 100 : 0,
    radius: Math.min(7, 3.3 + Math.sqrt(point.count) * 0.2),
    isSynthetic: Boolean(demoData)
  }));
  const cloudPoints = demoData
    ? demoData.samples.map(point => ({ ...point, y: yFor(point.count) }))
    : [];

  // Least-squares regression menghasilkan satu garis lurus panjang yang
  // mengikuti kecenderungan rata-rata sebaran, bukan zig-zag antar titik.
  const trendLine = points => {
    if (points.length < 2) return null;
    const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
    const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
    const numerator = points.reduce(
      (sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0
    );
    const denominator = points.reduce(
      (sum, point) => sum + (point.x - meanX) ** 2, 0
    );
    const slope = denominator ? numerator / denominator : 0;
    const intercept = meanY - slope * meanX;
    return {
      x1: 0,
      y1: Math.max(4, Math.min(96, slope * 0 + intercept)),
      x2: 100,
      y2: Math.max(4, Math.min(96, slope * 100 + intercept))
    };
  };
  const validTrend = trendLine(demoData ? cloudPoints.filter(point => point.series === 'Valid') : validPoints);
  const fraudTrend = trendLine(demoData ? cloudPoints.filter(point => point.series === 'Fraud') : fraudPoints);

  let sourceText;
  if (useApiData) sourceText = 'Sumber: Express API · data historis';
  else if (useDemoCloud) sourceText = 'Preview distribusi demo · titik sintetis, bukan histori aktual';
  else if (useLocalDatedData) sourceText = 'Sumber: dataset lokal · timestamp event';
  else if (apiTraffic.status === 'loading') sourceText = 'Memeriksa data historis dari API';
  else if (apiTraffic.status === 'error') sourceText = 'API tidak terhubung · data bertanggal belum tersedia';
  else sourceText = 'Belum ada data bertanggal yang dapat digambarkan';

  const chartLabel = period === 'hour' ? 'Jam' : period === 'week' ? 'Minggu' : period === 'month' ? 'Bulan' : 'Tahun';
  // Every interval receives a label so dates/months never appear to be skipped.
  const showEvery = 1;

  return (
    <>
      <div className="scatter-chart" role="group" aria-label={`Grafik garis traffic valid dan fraud per ${chartLabel.toLowerCase()}`}>
        <div className="scatter-y-axis" aria-hidden="true">
          {[3, 2, 1, 0].map(level => <span key={level}>{Math.round(axisMax * level / 3)}</span>)}
        </div>
        <div className="scatter-main">
          <div className="scatter-plot-area" onMouseLeave={() => setHovered(null)}>
            {[0, 1, 2, 3].map(level => (
              <div key={level} className="scatter-gridline" style={{ top: `${4 + (level / 3) * 92}%` }} />
            ))}
            {hasData && displayBuckets.length >= 2 && (
              <svg
                className="scatter-series-lines"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                role="img"
                aria-label="Garis tren linear biru untuk Valid dan merah untuk Fraud"
              >
                {validTrend && (
                  <line
                    className="series-line-valid"
                    x1={validTrend.x1} y1={validTrend.y1}
                    x2={validTrend.x2} y2={validTrend.y2}
                  />
                )}
                {fraudTrend && (
                  <line
                    className="series-line-fraud"
                    x1={fraudTrend.x1} y1={fraudTrend.y1}
                    x2={fraudTrend.x2} y2={fraudTrend.y2}
                  />
                )}
              </svg>
            )}
            {hasData && cloudPoints.map(point => (
              <span
                key={`sample-${point.bucketIndex}-${point.series}-${point.sampleIndex}`}
                className={`scatter-sample ${point.series === 'Valid' ? 'dot-valid' : 'dot-fraud'}`}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                aria-hidden="true"
              />
            ))}
            {hasData && allPoints.map(point => {
              const tooltipLabel = point.isSynthetic
                ? `${point.label} — ${point.series}: sekitar ${numberFormat(point.count)} event pada preview demo. Nilai ilustratif, bukan histori aktual.`
                : `${point.label} — ${point.series}: ${numberFormat(point.count)} event; total ${numberFormat(point.total)}; valid ${numberFormat(point.validTotal)}; fraud ${numberFormat(point.fraudTotal)}; fraud rate ${percent(point.fraudRate)}.`;
              return (
                <button
                  key={`${point.bucketIndex}-${point.series}`}
                  type="button"
                  className={`scatter-dot ${point.series === 'Valid' ? 'dot-valid' : 'dot-fraud'}`}
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    width: `${Math.max(9, point.radius * 2)}px`,
                    height: `${Math.max(9, point.radius * 2)}px`
                  }}
                  aria-label={tooltipLabel}
                  title={tooltipLabel}
                  onMouseEnter={() => setHovered(point)}
                  onFocus={() => setHovered(point)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setHovered(point)}
                />
              );
            })}
            {hovered && (
              <div
                className="scatter-tooltip"
                style={{
                  left: `${Math.min(70, Math.max(2, hovered.x))}%`,
                  top: `${Math.min(78, Math.max(18, hovered.y))}%`
                }}
                role="status"
                aria-live="polite"
              >
                <strong>{hovered.label} · {hovered.series}</strong>
                <span>Event {hovered.series.toLowerCase()}: <b>{numberFormat(hovered.count)}</b></span>
                <span>Total traffic interval: <b>{numberFormat(hovered.total)}</b></span>
                <span>Valid: {numberFormat(hovered.validTotal)} · Fraud: {numberFormat(hovered.fraudTotal)}</span>
                <span>Fraud rate: {percent(hovered.fraudRate)}</span>
              </div>
            )}
          </div>
          <div className="scatter-x-axis" style={{ gridTemplateColumns: `repeat(${Math.max(1, buckets.length)}, minmax(0, 1fr))` }}>
            {buckets.map((bucket, index) => (
              <span key={bucket.key ?? `${bucket.label}-${index}`} title={bucket.label}>
                {index % showEvery === 0 || index === buckets.length - 1 ? bucket.label : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
      {useDemoCloud && (
        <div className="chart-demo-note" role="note">
          Data bertanggal belum cukup untuk membentuk sebaran yang padat. Titik kecil dan garis tren pada mode preview ini adalah data simulasi untuk memperlihatkan distribusi dan regresi linear, bukan catatan event aktual.
        </div>
      )}
      {!hasData && (
        <div className="chart-empty">
          Belum ada event bertanggal yang dapat digambarkan. Periksa format timestamp pada dataset atau respons endpoint traffic.
        </div>
      )}
      <div className="scatter-axis-caption">
        Sumbu X: {chartLabel.toLowerCase()} · Sumbu Y: jumlah event. Garis biru: tren Valid; garis merah: tren Fraud.{useDemoCloud ? ' Titik kecil adalah sampel simulasi.' : ' Periode tanpa record pada sumber data ditampilkan 0.'}
      </div>
      <div className="legend">
        <span><i className="legend-blue" />Valid</span>
        <span><i className="legend-red" />Fraud</span>
        <small className="chart-source">{sourceText}</small>
      </div>
    </>
  );
}

function EventTable({ events, onSelect, page, setPage }) {
  const pageCount = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageEvents = events.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>CLICK ID</th><th>IP ADDRESS</th><th>DEVICE</th><th>TIMESTAMP</th><th>CLASSIFICATION</th><th>RISK</th>
            </tr>
          </thead>
          <tbody>
            {pageEvents.map(event => (
              <tr
                key={event.click_id}
                tabIndex="0"
                onClick={() => onSelect(event)}
                onKeyDown={keyEvent => { if (keyEvent.key === 'Enter') onSelect(event); }}
              >
                <td><b>{event.click_id}</b></td>
                <td className="mono">{event.ip_address}</td>
                <td>{event.device}</td>
                <td>{event.timestamp}</td>
                <td><span className={`class-pill ${event.is_fraudulent ? 'fraud' : 'valid'}`}><i />{event.classification}</span></td>
                <td>
                  <span className="risk-track">
                    <i style={{ width: `${Math.max(0, Math.min(100, event.risk_score))}%`, background: event.is_fraudulent ? 'var(--rose)' : 'var(--blue)' }} />
                  </span>
                  <small>{event.risk_score}</small>
                </td>
              </tr>
            ))}
            {!pageEvents.length && <tr><td colSpan="6">Tidak ada data yang cocok dengan filter.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="table-footer pagination-footer">
        <span className="pagination-info">Halaman {safePage} dari {pageCount} · {events.length} event</span>
        <nav className="pagination-controls" aria-label="Navigasi halaman tabel">
          <button className="pagination-nav" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
            <ChevronLeft size={14} /><span>Sebelumnya</span>
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1)
            .filter(number => number === 1 || number === pageCount || Math.abs(number - safePage) <= 1)
            .map(number => (
              <button
                key={number}
                className={`pagination-page ${number === safePage ? 'page-active' : ''}`}
                aria-current={number === safePage ? 'page' : undefined}
                aria-label={`Halaman ${number}`}
                onClick={() => setPage(number)}
              >{number}</button>
            ))}
          <button className="pagination-nav" disabled={safePage >= pageCount} onClick={() => setPage(safePage + 1)}>
            <span>Berikutnya</span><ChevronRight size={14} />
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
  const [period, setPeriod] = useState('hour');
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
        const list = Array.isArray(data) ? data : (data.events ?? data.data ?? []);
        if (!Array.isArray(list)) throw new Error('Format JSON harus berupa array event.');
        if (alive) setEvents(list.map(normalizeEvent));
      })
      .catch(error => {
        if (alive) setLoadError('Dataset tidak dapat dibaca. Pastikan file JSON tersedia di public/data/demoEvents.json.');
        console.error('Gagal memuat dataset:', error);
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => events.filter(event =>
    (classFilter === 'all' || (classFilter === 'fraud' ? event.is_fraudulent : !event.is_fraudulent)) &&
    (deviceFilter === 'all' || String(event.device).toLowerCase() === deviceFilter)
  ), [events, classFilter, deviceFilter]);

  const shown = active === 'fraud'
    ? filtered.filter(event => event.is_fraudulent)
    : active === 'blocked'
      ? filtered.filter(event => event.VPN_usage || event.proxy_usage)
      : filtered;

  useEffect(() => { setPage(1); }, [active, classFilter, deviceFilter]);

  const total = filtered.length;
  const fraudCount = filtered.filter(event => event.is_fraudulent).length;
  const validCount = total - fraudCount;
  const fraudRate = total ? fraudCount / total * 100 : 0;

  const downloadReport = () => {
    const rows = [
      ['Laporan ClickGuard', 'Periode 1–19 Oktober 2026'],
      ['Tanggal laporan', '19 Oktober 2026'],
      [],
      ['No', 'Click ID', 'Tanggal event', 'IP Address', 'Perangkat', 'Status', 'Risk score', 'Alasan', 'Keterangan', 'Kesimpulan']
    ];

    events.forEach((event, index) => {
      const reason = event.is_fraudulent
        ? [
            event.VPN_usage && 'VPN terdeteksi',
            event.proxy_usage && 'Proxy terdeteksi',
            Number(event.click_frequency) > 0 && 'Frekuensi klik tercatat'
          ].filter(Boolean).join('; ') || 'Event berlabel fraud pada dataset'
        : 'Event berlabel valid pada dataset';

      rows.push([
        index + 1, event.click_id, event.timestamp, event.ip_address, event.device,
        event.classification, event.risk_score, reason,
        'Klasifikasi mengikuti dataset; belum diverifikasi backend',
        event.is_fraudulent ? 'Perlu ditinjau' : 'Valid menurut label dataset'
      ]);
    });

    rows.push([]);
    rows.push(['Ringkasan', `Total ${events.length} event`]);
    rows.push(['Event berlabel fraud', fraudCount]);
    rows.push(['Event berlabel valid', validCount]);
    rows.push(['Kesimpulan', 'Klasifikasi mengikuti dataset dan perlu validasi backend.']);
    downloadCsv('clickguard-laporan-1-19-oktober-2026.csv', rows);
  };

  const title = {
    overview: 'Overview', events: 'Click events', fraud: 'Fraud monitoring',
    blocked: 'Blocked IPs', settings: 'Pengaturan'
  }[active];

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={setActive} open={mobileOpen} onClose={() => setMobileOpen(false)} eventCount={events.length} />
      <div className="main-shell">
        <Header
          onMenu={() => setMobileOpen(true)}
          onNotifications={() => { setNotifyOpen(value => !value); setNotificationsRead(true); }}
          notificationOpen={notifyOpen}
          unread={!notificationsRead}
        />

        {notifyOpen && (
          <div className="notification-pop">
            <div className="pop-title">
              <b>Notifikasi</b>
              <button onClick={() => setNotifyOpen(false)} aria-label="Tutup"><X size={15} /></button>
            </div>
            <p><span className="notif-dot red" />{fraudCount} event berlabel fraud pada dataset.</p>
            <p><span className="notif-dot blue" />Dataset memuat {numberFormat(events.length)} event.</p>
            <small>Notifikasi berdasarkan dataset lokal, bukan alert backend.</small>
          </div>
        )}

        <main className="content">
          <div className="eyebrow"><span />AD FRAUD DETECTION SYSTEM</div>
          <div className="title-row">
            <div><h1>{title}</h1><p className="lead">{descriptions[active]}</p></div>
            <div className="toolbar">
              {active !== 'settings' && (
                <button className={`btn-filter ${filterOpen ? 'selected' : ''}`} onClick={() => setFilterOpen(value => !value)} aria-expanded={filterOpen}>
                  <Filter size={16} />Filter data<ChevronDown size={14} />
                </button>
              )}
              <button className="btn-download" onClick={downloadReport}><FileDown size={16} />Unduh Laporan</button>
            </div>
          </div>

          {loadError && <div className="demo-banner"><Info size={18} />{loadError}</div>}
          {loading && <p className="loading-message">Memuat dataset...</p>}

          {filterOpen && active !== 'settings' && (
            <div className="filter-panel">
              <div className="filter-heading"><b>Filter event</b><button onClick={() => setFilterOpen(false)} aria-label="Tutup filter"><X size={15} /></button></div>
              <label>Klasifikasi
                <select value={classFilter} onChange={event => setClassFilter(event.target.value)}>
                  <option value="all">Semua</option><option value="fraud">Fraud</option><option value="valid">Valid</option>
                </select>
              </label>
              <label>Perangkat
                <select value={deviceFilter} onChange={event => setDeviceFilter(event.target.value)}>
                  <option value="all">Semua perangkat</option><option value="desktop">Desktop</option><option value="mobile">Mobile</option><option value="tablet">Tablet</option>
                </select>
              </label>
              <button className="clear-filter" onClick={() => { setClassFilter('all'); setDeviceFilter('all'); }}>Reset filter</button>
              <span className="filter-result">Menampilkan {filtered.length} event</span>
            </div>
          )}

          {active === 'settings' ? (
            <section className="panel settings-panel">
              <div className="panel-head">
                <div><h2>Status integrasi</h2><p>Informasi koneksi dashboard</p></div>
                <span className="status-chip"><span />Belum terhubung</span>
              </div>
              <div className="setting-row">
                <div><b>Backend</b><p>Endpoint API belum dikonfigurasi.</p></div><span className="status-chip">Offline</span>
              </div>
              <div className="setting-row">
                <div><b>Sumber data</b><p>Dataset JSON lokal · {events.length} event terbaca.</p></div>
                <span className="status-chip"><Check size={13} />Terbaca</span>
              </div>
              <div className="setting-row">
                <div><b>Model deteksi</b><p>Status training dan inferensi belum diverifikasi.</p></div><span className="status-chip">Belum diverifikasi</span>
              </div>
            </section>
          ) : (
            <>
              {active === 'overview' && (
                <>
                  <section className="metrics-grid">
                    <Metric title="Total click events" value={numberFormat(total)} sub="Event pada dataset" Icon={MousePointer2} tone="blue" delay={0} />
                    <Metric title="Fraud flagged" value={numberFormat(fraudCount)} sub="Event berlabel fraud" Icon={ShieldAlert} tone="rose" delay={60} />
                    <Metric title="Valid traffic" value={numberFormat(validCount)} sub="Event berlabel valid" Icon={ShieldCheck} tone="green" delay={120} />
                    <Metric title="Fraud rate" value={percent(fraudRate)} sub="Proporsi event berlabel fraud" Icon={Activity} tone="violet" delay={180} />
                  </section>
                  <section className="panels-grid">
                    <section className="panel traffic-panel">
                      <div className="panel-head">
                        <div><h2>Traffic overview</h2><p>Jumlah event Valid dan Fraud berdasarkan periode waktu</p></div>
                        <div className="chart-actions">
                          <label className="period-select-wrap" aria-label="Pilih periode grafik traffic">
                            <CalendarDays size={14} aria-hidden="true" />
                            <select className="period-select" value={period} onChange={event => setPeriod(event.target.value)} aria-label="Periode traffic">
                              <option value="hour">Per jam</option><option value="week">Per minggu</option><option value="month">Per bulan</option><option value="year">Per tahun</option>
                            </select>
                            <ChevronDown size={13} aria-hidden="true" />
                          </label>
                          <Tooltip>Garis biru menghubungkan jumlah event valid dan garis merah menghubungkan jumlah event fraud. Pilih periode untuk mengubah pengelompokan waktu; titik paling kanan mengikuti jam, tanggal, bulan, atau tahun saat ini. Arahkan kursor ke titik untuk melihat rinciannya.</Tooltip>
                        </div>
                      </div>
                      <TrafficChart events={filtered} period={period} />
                    </section>
                    <section className="panel model-panel">
                      <div className="panel-head">
                        <div><h2>Model status</h2><p>Kesiapan model deteksi</p></div>
                        <span className="status-chip"><span />Belum terhubung</span>
                      </div>
                      <div className="model-illustration">
                        <div className="orb orb-a" /><div className="orb orb-b" />
                        <div className="model-icon"><Activity size={25} /></div>
                        <b>Model belum diverifikasi</b>
                        <p>Status model dan hasil deteksi perlu dikonfirmasi melalui integrasi backend.</p>
                      </div>
                      <div className="model-source"><span>Status integrasi</span><code>Belum dikonfigurasi</code></div>
                    </section>
                  </section>
                </>
              )}
              <section className="panel events-panel">
                <div className="panel-head events-head">
                  <div>
                    <h2>{active === 'fraud' ? 'Fraud events' : active === 'blocked' ? 'Risk signals' : 'Click event records'}</h2>
                    <p>{shown.length} event · pilih baris untuk detail</p>
                  </div>
                  <span className="table-badge">{shown.length} events</span>
                </div>
                <EventTable events={shown} onSelect={setSelected} page={page} setPage={setPage} />
              </section>
            </>
          )}

          <footer>
            <span>© 2026 ClickGuard · Sistem Deteksi Fraud Klik Iklan Digital</span>
            <span className="footer-state"><i />Dataset lokal · backend belum terhubung</span>
          </footer>
        </main>
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <section className="detail-modal" onClick={event => event.stopPropagation()}>
            <div className="modal-head">
              <div><small>DETAIL EVENT</small><h3>{selected.click_id}</h3></div>
              <button onClick={() => setSelected(null)} aria-label="Tutup detail"><X size={18} /></button>
            </div>
            <div className="detail-status">
              <span className={`class-pill ${selected.is_fraudulent ? 'fraud' : 'valid'}`}>{selected.classification}</span>
              <b>Risk score {selected.risk_score}/100</b>
            </div>
            <div className="detail-grid">
              {[
                ['IP address', selected.ip_address], ['Timestamp', selected.timestamp],
                ['Device', selected.device], ['Browser', selected.browser], ['OS', selected.operating_system],
                ['Click duration', `${selected.click_duration}s`], ['Scroll depth', `${selected.scroll_depth}%`],
                ['Click frequency', selected.click_frequency], ['VPN usage', selected.VPN_usage ? 'Yes' : 'No'],
                ['Proxy usage', selected.proxy_usage ? 'Yes' : 'No']
              ].map(([key, value]) => <div key={key}><small>{key}</small><b>{value}</b></div>)}
            </div>
            <p className="modal-note">Klasifikasi dan risk score mengikuti nilai yang tersedia pada dataset. Hasil ini belum diverifikasi oleh backend.</p>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
