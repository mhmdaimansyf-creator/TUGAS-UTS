
import { useEffect, useState } from 'react';
import { getSpareParts, getTransactions } from '../services/storage.js';

const numberFormat = new Intl.NumberFormat('id-ID');

const dateFormat = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short'
});

export default function ReportsPage() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const inventory = getSpareParts();
    const transactions = getTransactions()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 500);

    setReport({
      inventory,
      transactions,
      generatedAt: new Date().toISOString()
    });
  }, []);

  return (
    <>
      <div className="page-heading print-heading">
        <div>
          <p className="eyebrow">LAPORAN</p>
          <h1>Laporan Persediaan</h1>
          <p className="muted">
            Kondisi stok dan pergerakan persediaan berdasarkan data yang tersimpan.
          </p>
        </div>

        <button
          className="button primary no-print"
          onClick={() => window.print()}
          disabled={!report}
        >
          Cetak laporan
        </button>
      </div>

      {report && (
        <>
          <p className="report-meta">
            Dicetak pada {dateFormat.format(new Date(report.generatedAt))}
            {' · '}
            {numberFormat.format(report.inventory.length)} jenis spare part
          </p>

          <section className="panel report-panel">
            <div className="panel-heading">
              <div>
                <h2>Posisi persediaan</h2>
                <p className="muted">Jumlah stok saat laporan dibuat.</p>
              </div>
            </div>

            {!report.inventory.length ? (
              <p className="empty-state">Belum ada data persediaan.</p>
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
                    </tr>
                  </thead>
                  <tbody>
                    {report.inventory.map((item) => (
                      <tr key={item.id}>
                        <td className="code-cell">{item.code}</td>
                        <td><strong>{item.name}</strong></td>
                        <td>{item.category || '—'}</td>
                        <td>{numberFormat.format(item.stock)}</td>
                        <td>{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="panel report-panel">
            <div className="panel-heading">
              <div>
                <h2>Riwayat transaksi</h2>
                <p className="muted">Maksimal 500 transaksi terakhir.</p>
              </div>
            </div>

            {!report.transactions.length ? (
              <p className="empty-state">
                Belum ada transaksi yang tercatat.
              </p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Spare part</th>
                      <th>Jenis</th>
                      <th>Jumlah</th>
                      <th>Dicatat oleh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.transactions.map((row) => (
                      <tr key={row.id}>
                        <td>{dateFormat.format(new Date(row.created_at))}</td>
                        <td>
                          {row.spare_part_name}
                          <small className="cell-sub">
                            {row.spare_part_code}
                          </small>
                        </td>
                        <td>
                          {row.type === 'in' ? 'Barang masuk' : 'Barang keluar'}
                        </td>
                        <td>
                          {numberFormat.format(row.quantity)} {row.unit}
                        </td>
                        <td>{row.recorded_by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}
