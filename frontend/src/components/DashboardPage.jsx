import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

const numberFormat = new Intl.NumberFormat('id-ID');
const dateFormat = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/dashboard').then(setData).catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-heading">
        <div><p className="eyebrow">RINGKASAN</p><h1>Dashboard</h1><p className="muted">Pantau kondisi persediaan bengkel hari ini.</p></div>
      </div>
      {loading && <p className="status-message">Memuat ringkasan...</p>}
      {error && <p className="alert error" role="alert">{error}</p>}
      {data && <>
        <section className="stats-grid" aria-label="Ringkasan persediaan">
          <article className="stat-card"><span className="stat-icon blue">▤</span><p>Total jenis spare part</p><strong>{numberFormat.format(data.summary.part_count)}</strong><small>Item terdaftar</small></article>
          <article className="stat-card"><span className="stat-icon green">▥</span><p>Total stok tersedia</p><strong>{numberFormat.format(data.summary.total_stock)}</strong><small>Unit seluruh spare part</small></article>
          <article className="stat-card"><span className="stat-icon orange">!</span><p>Stok menipis</p><strong>{numberFormat.format(data.summary.low_stock_count)}</strong><small>Stok 5 atau kurang</small></article>
          <article className="stat-card"><span className="stat-icon teal">⇄</span><p>Pergerakan hari ini</p><strong>{numberFormat.format(data.summary.today_in + data.summary.today_out)}</strong><small>Masuk {numberFormat.format(data.summary.today_in)} · Keluar {numberFormat.format(data.summary.today_out)}</small></article>
        </section>
        <section className="panel">
          <div className="panel-heading"><div><h2>Transaksi terbaru</h2><p className="muted">Lima aktivitas persediaan terakhir.</p></div></div>
          {!data.recentTransactions.length ? <p className="empty-state">Belum ada transaksi yang tercatat.</p> :
            <div className="table-wrap"><table><thead><tr><th>Spare part</th><th>Jenis</th><th>Jumlah</th><th>Dicatat oleh</th><th>Waktu</th></tr></thead>
              <tbody>{data.recentTransactions.map((row) => <tr key={row.id}><td><strong>{row.spare_part_name}</strong><small className="cell-sub">{row.spare_part_code}</small></td>
                <td><span className={`badge ${row.type}`}>{row.type === 'in' ? 'Barang masuk' : 'Barang keluar'}</span></td>
                <td>{numberFormat.format(row.quantity)}</td><td>{row.recorded_by}</td><td>{dateFormat.format(new Date(row.created_at))}</td></tr>)}</tbody></table></div>}
        </section>
      </>}
    </>
  );
}
