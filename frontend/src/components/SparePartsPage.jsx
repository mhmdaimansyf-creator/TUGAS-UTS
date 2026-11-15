import { useCallback, useEffect, useState } from 'react';
import { api, jsonBody } from '../services/api.js';

const emptyForm = { code: '', name: '', category: '', unit: '', description: '' };
const numberFormat = new Intl.NumberFormat('id-ID');

export default function SparePartsPage({ isAdmin }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadParts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api(`/spare-parts?search=${encodeURIComponent(search)}`);
      setItems(result.items);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(loadParts, 250);
    return () => clearTimeout(timer);
  }, [loadParts]);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage('');
    setShowForm(true);
  }

  function startEdit(item) {
    setForm({
      code: item.code, name: item.name, category: item.category || '',
      unit: item.unit, description: item.description || ''
    });
    setEditingId(item.id);
    setMessage('');
    setShowForm(true);
  }

  async function savePart(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await api(editingId ? `/spare-parts/${editingId}` : '/spare-parts', {
        method: editingId ? 'PUT' : 'POST',
        body: jsonBody(form)
      });
      setShowForm(false);
      setMessage(editingId ? 'Data spare part diperbarui.' : 'Spare part ditambahkan.');
      await loadParts();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function removePart(item) {
    if (!window.confirm(`Hapus spare part "${item.name}"? Data dengan riwayat transaksi tidak dapat dihapus.`)) return;
    setError('');
    setMessage('');
    try {
      const result = await api(`/spare-parts/${item.id}`, { method: 'DELETE' });
      setMessage(result.message);
      await loadParts();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <div className="page-heading">
        <div><p className="eyebrow">MASTER PERSEDIAAN</p><h1>Data Spare Part</h1><p className="muted">Kelola dan cari informasi spare part bengkel.</p></div>
        {isAdmin && <button className="button primary" onClick={startCreate}>＋ Tambah spare part</button>}
      </div>
      {message && <p className="alert success" role="status">{message}</p>}
      {error && <p className="alert error" role="alert">{error}</p>}
      <section className="panel">
        <div className="toolbar">
          <label className="search-field"><span aria-hidden="true">⌕</span><input aria-label="Cari spare part" placeholder="Cari nama, kode, atau kategori..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <span className="muted">{numberFormat.format(items.length)} item</span>
        </div>
        {showForm && <form className="part-form" onSubmit={savePart}>
          <div className="form-heading"><h2>{editingId ? 'Edit spare part' : 'Tambah spare part'}</h2><button className="icon-button" type="button" aria-label="Tutup form" onClick={() => setShowForm(false)}>×</button></div>
          <div className="form-grid">
            <label>Kode spare part<input required maxLength="30" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></label>
            <label>Nama spare part<input required maxLength="120" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Kategori<input maxLength="80" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
            <label>Satuan<input required maxLength="30" placeholder="contoh: pcs" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></label>
            <label className="span-two">Keterangan<textarea rows="2" maxLength="500" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          </div>
          <div className="form-actions"><button className="button secondary" type="button" onClick={() => setShowForm(false)}>Batal</button><button className="button primary" type="submit">{editingId ? 'Simpan perubahan' : 'Simpan spare part'}</button></div>
        </form>}
        {loading ? <p className="status-message">Memuat data spare part...</p> : items.length === 0 ? <p className="empty-state">{search ? 'Spare part tidak ditemukan.' : 'Belum ada data spare part.'}</p> :
          <div className="table-wrap"><table><thead><tr><th>Kode</th><th>Nama spare part</th><th>Kategori</th><th>Stok</th><th>Satuan</th>{isAdmin && <th>Aksi</th>}</tr></thead>
            <tbody>{items.map((item) => <tr key={item.id}><td className="code-cell">{item.code}</td><td><strong>{item.name}</strong>{item.description && <small className="cell-sub">{item.description}</small>}</td><td>{item.category || '—'}</td>
              <td><strong className={item.stock <= 5 ? 'stock-low' : ''}>{numberFormat.format(item.stock)}</strong>{item.stock <= 5 && <small className="cell-sub stock-low">Stok menipis</small>}</td><td>{item.unit}</td>
              {isAdmin && <td><div className="row-actions"><button className="text-button" onClick={() => startEdit(item)}>Edit</button><button className="text-button danger-text" onClick={() => removePart(item)}>Hapus</button></div></td>}</tr>)}</tbody></table></div>}
      </section>
    </>
  );
}
