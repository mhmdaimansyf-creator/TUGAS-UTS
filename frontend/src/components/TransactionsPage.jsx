import { useCallback, useEffect, useState } from 'react';
import { api, jsonBody } from '../services/api.js';

const dateFormat = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
const numberFormat = new Intl.NumberFormat('id-ID');

export default function TransactionsPage({ isAdmin }) {
  const [items, setItems] = useState([]);
  const [parts, setParts] = useState([]);
  const [form, setForm] = useState({ sparePartId: '', type: 'in', quantity: '', notes: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTransactions = useCallback(async () => {
    const result = await api('/transactions');
    setItems(result.items);
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [history, partList] = await Promise.all([
          api('/transactions'),
          isAdmin ? api('/spare-parts') : Promise.resolve({ items: [] })
        ]);
        setItems(history.items);
        setParts(partList.items);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAdmin]);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const result = await api('/transactions', {
        method: 'POST',
        body: jsonBody({ ...form, sparePartId: Number(form.sparePartId), quantity: Number(form.quantity) })
      });
      setMessage(result.message);
      setForm({ ...form, quantity: '', notes: '' });
      await loadTransactions();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">AKTIVITAS STOK</p><h1>Barang Masuk dan Keluar</h1><p className="muted">Catat perubahan stok dan lihat riwayat transaksi.</p></div></div>
      {message && <p className="alert success" role="status">{message}</p>}
      {error && <p className="alert error" role="alert">{error}</p>}
      {isAdmin && <section className="panel transaction-form-panel"><div className="panel-heading"><div><h2>Catat transaksi</h2><p className="muted">Stok akan diperbarui setelah transaksi tersimpan.</p></div></div>
        {!parts.length ? <p className="empty-state">Tambahkan data spare part sebelum mencatat transaksi.</p> :
          <form onSubmit={submit} className="transaction-form">
            <label>Jenis transaksi<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="in">Barang masuk</option><option value="out">Barang keluar</option></select></label>
            <label>Spare part<select required value={form.sparePartId} onChange={(e) => setForm({ ...form, sparePartId: e.target.value })}><option value="">Pilih spare part</option>{parts.map((part) => <option key={part.id} value={part.id}>{part.code} — {part.name} (stok {part.stock})</option>)}</select></label>
            <label>Jumlah<input required type="number" min="1" step="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
            <label>Keterangan<input maxLength="500" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
            <button className="button primary transaction-submit" type="submit">Simpan transaksi</button>
          </form>}
      </section>}
      <section className="panel">
        <div className="panel-heading"><div><h2>Riwayat transaksi</h2><p className="muted">Menampilkan hingga 500 transaksi terbaru.</p></div></div>
        {loading ? <p className="status-message">Memuat riwayat...</p> : items.length === 0 ? <p className="empty-state">Belum ada transaksi yang tercatat.</p> :
          <div className="table-wrap"><table><thead><tr><th>Tanggal</th><th>Spare part</th><th>Jenis</th><th>Jumlah</th><th>Dicatat oleh</th><th>Keterangan</th></tr></thead><tbody>
            {items.map((row) => <tr key={row.id}><td>{dateFormat.format(new Date(row.created_at))}</td><td><strong>{row.spare_part_name}</strong><small className="cell-sub">{row.spare_part_code}</small></td>
              <td><span className={`badge ${row.type}`}>{row.type === 'in' ? 'Barang masuk' : 'Barang keluar'}</span></td><td>{numberFormat.format(row.quantity)} {row.unit}</td><td>{row.recorded_by}</td><td>{row.notes || '—'}</td></tr>)}
          </tbody></table></div>}
      </section>
    </>
  );
}
