
import { useEffect, useState } from 'react';
import {
  getSpareParts,
  saveSpareParts,
  getTransactions
} from '../services/storage.js';

const emptyForm = {
  code: '',
  name: '',
  category: '',
  unit: '',
  description: ''
};

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

  function loadParts() {
    const allParts = getSpareParts();

    const filteredParts = allParts.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword) ||
        (item.category || '').toLowerCase().includes(keyword)
      );
    });

    setItems(filteredParts);
    setLoading(false);
  }

  useEffect(() => {
    loadParts();
  }, [search]);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage('');
    setError('');
    setShowForm(true);
  }

  function startEdit(item) {
    setForm({
      code: item.code,
      name: item.name,
      category: item.category || '',
      unit: item.unit,
      description: item.description || ''
    });

    setEditingId(item.id);
    setMessage('');
    setError('');
    setShowForm(true);
  }

  function savePart(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    const allParts = getSpareParts();

    const duplicateCode = allParts.some(
      (item) =>
        item.code.toLowerCase() === form.code.trim().toLowerCase() &&
        item.id !== editingId
    );

    if (duplicateCode) {
      setError('Kode spare part sudah digunakan.');
      return;
    }

    let updatedParts;

    if (editingId) {
      updatedParts = allParts.map((item) =>
        item.id === editingId
          ? {
              ...item,
              ...form,
              code: form.code.trim(),
              name: form.name.trim(),
              stock: item.stock
            }
          : item
      );
    } else {
      const newPart = {
        id: Date.now(),
        ...form,
        code: form.code.trim(),
        name: form.name.trim(),
        stock: 0
      };

      updatedParts = [...allParts, newPart];
    }

    saveSpareParts(updatedParts);

    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    setMessage(
      editingId
        ? 'Data spare part diperbarui.'
        : 'Spare part berhasil ditambahkan.'
    );

    loadParts();
  }

  function removePart(item) {
    const transactions = getTransactions();

    const hasTransaction = transactions.some(
      (transaction) => transaction.spare_part_id === item.id
    );

    if (hasTransaction) {
      setError('Spare part yang memiliki riwayat transaksi tidak dapat dihapus.');
      setMessage('');
      return;
    }

    if (!window.confirm(`Hapus spare part "${item.name}"?`)) {
      return;
    }

    const updatedParts = getSpareParts().filter(
      (part) => part.id !== item.id
    );

    saveSpareParts(updatedParts);

    setMessage('Spare part berhasil dihapus.');
    setError('');
    loadParts();
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">MASTER PERSEDIAAN</p>
          <h1>Data Spare Part</h1>
          <p className="muted">
            Kelola dan cari informasi spare part bengkel.
          </p>
        </div>

        {isAdmin && (
          <button className="button primary" onClick={startCreate}>
            + Tambah spare part
          </button>
        )}
      </div>

      {message && (
        <p className="alert success" role="status">{message}</p>
      )}

      {error && (
        <p className="alert error" role="alert">{error}</p>
      )}

      <section className="panel">
        <div className="toolbar">
          <label className="search-field">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="Cari spare part"
              placeholder="Cari nama, kode, atau kategori..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <span className="muted">
            {numberFormat.format(items.length)} item
          </span>
        </div>

        {showForm && (
          <form className="part-form" onSubmit={savePart}>
            <div className="form-heading">
              <h2>{editingId ? 'Edit spare part' : 'Tambah spare part'}</h2>

              <button
                className="icon-button"
                type="button"
                aria-label="Tutup form"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <div className="form-grid">
              <label>
                Kode spare part
                <input
                  required
                  maxLength="30"
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value })
                  }
                />
              </label>

              <label>
                Nama spare part
                <input
                  required
                  maxLength="120"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </label>

              <label>
                Kategori
                <input
                  maxLength="80"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />
              </label>

              <label>
                Satuan
                <input
                  required
                  maxLength="30"
                  placeholder="Contoh: pcs"
                  value={form.unit}
                  onChange={(e) =>
                    setForm({ ...form, unit: e.target.value })
                  }
                />
              </label>

              <label className="span-two">
                Keterangan
                <textarea
                  rows="2"
                  maxLength="500"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>
            </div>

            <div className="form-actions">
              <button
                className="button secondary"
                type="button"
                onClick={() => setShowForm(false)}
              >
                Batal
              </button>

              <button className="button primary" type="submit">
                {editingId ? 'Simpan perubahan' : 'Simpan spare part'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="status-message">Memuat data spare part...</p>
        ) : items.length === 0 ? (
          <p className="empty-state">
            {search
              ? 'Spare part tidak ditemukan.'
              : 'Belum ada data spare part.'}
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama spare part</th>
                  <th>Kategori</th>
                  <th>Stok</th>
                  <th>Satuan</th>
                  {isAdmin && <th>Aksi</th>}
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="code-cell">{item.code}</td>

                    <td>
                      <strong>{item.name}</strong>
                      {item.description && (
                        <small className="cell-sub">
                          {item.description}
                        </small>
                      )}
                    </td>

                    <td>{item.category || '—'}</td>

                    <td>
                      <strong className={item.stock <= 5 ? 'stock-low' : ''}>
                        {numberFormat.format(item.stock)}
                      </strong>
                      {item.stock <= 5 && (
                        <small className="cell-sub stock-low">
                          Stok menipis
                        </small>
                      )}
                    </td>

                    <td>{item.unit}</td>

                    {isAdmin && (
                      <td>
                        <div className="row-actions">
                          <button
                            className="text-button"
                            onClick={() => startEdit(item)}
                          >
                            Edit
                          </button>

                          <button
                            className="text-button danger-text"
                            onClick={() => removePart(item)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
