
import { useEffect, useState } from 'react';
import {
  getSpareParts,
  getTransactions,
  saveSpareParts,
  saveTransactions
} from '../services/storage.js';

const numberFormat = new Intl.NumberFormat('id-ID');
const dateFormat = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short'
});

const emptyForm = {
  sparePartId: '',
  type: 'in',
  quantity: '',
  notes: ''
};

export default function TransactionsPage({ isAdmin, user }) {
  const [parts, setParts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function loadData() {
    setParts(getSpareParts());
    setTransactions(
      getTransactions().sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )
    );
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    const sparePart = parts.find(
      (item) => item.id === Number(form.sparePartId)
    );
    const quantity = Number(form.quantity);

    if (!sparePart) {
      setError('Pilih spare part terlebih dahulu.');
      return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError('Jumlah harus berupa angka lebih dari 0.');
      return;
    }

    if (form.type === 'out' && quantity > sparePart.stock) {
      setError('Stok spare part tidak mencukupi.');
      return;
    }

    const updatedParts = parts.map((item) => {
      if (item.id !== sparePart.id) return item;

      return {
        ...item,
        stock:
          form.type === 'in'
            ? item.stock + quantity
            : item.stock - quantity
      };
    });

    const newTransaction = {
      id: Date.now(),
      spare_part_id: sparePart.id,
      spare_part_code: sparePart.code,
      spare_part_name: sparePart.name,
      unit: sparePart.unit,
      type: form.type,
      quantity,
      notes: form.notes.trim(),
      recorded_by: user?.name || 'Admin',
      created_at: new Date().toISOString()
    };

    const updatedTransactions = [
      newTransaction,
      ...transactions
    ];

    saveSpareParts(updatedParts);
    saveTransactions(updatedTransactions);

    setParts(updatedParts);
    setTransactions(updatedTransactions);
    setForm(emptyForm);
    setMessage('Transaksi berhasil disimpan.');
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Transaksi Stok</h1>
          <p>Catat transaksi barang masuk dan keluar.</p>
        </div>
      </div>

      {isAdmin && (
        <section className="panel">
          <div className="panel-heading">
            <h2>Tambah Transaksi</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Spare Part</label>
                <select
                  name="sparePartId"
                  value={form.sparePartId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih spare part</option>
                  {parts.map((part) => (
                    <option key={part.id} value={part.id}>
                      {part.name} - Stok: {part.stock} {part.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Jenis Transaksi</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="in">Barang Masuk</option>
                  <option value="out">Barang Keluar</option>
                </select>
              </div>

              <div className="form-group">
                <label>Jumlah</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Masukkan jumlah"
                  required
                />
              </div>

              <div className="form-group">
                <label>Keterangan</label>
                <input
                  type="text"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Masukkan keterangan"
                />
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            <button type="submit" className="primary-button">
              Simpan Transaksi
            </button>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="panel-heading">
          <h2>Riwayat Transaksi</h2>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama Spare Part</th>
                <th>Jenis</th>
                <th>Jumlah</th>
                <th>Petugas</th>
                <th>Keterangan</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length > 0 ? (
                transactions.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {dateFormat.format(new Date(item.created_at))}
                    </td>
                    <td>{item.spare_part_name}</td>
                    <td>
                      {item.type === 'in'
                        ? 'Barang Masuk'
                        : 'Barang Keluar'}
                    </td>
                    <td>
                      {numberFormat.format(item.quantity)} {item.unit}
                    </td>
                    <td>{item.recorded_by}</td>
                    <td>{item.notes || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Belum ada transaksi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
