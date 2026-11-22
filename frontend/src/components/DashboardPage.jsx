
import { getSpareParts, getTransactions } from '../services/storage.js';

const numberFormat = new Intl.NumberFormat('id-ID');

const dateFormat = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short'
});

function isToday(dateValue) {
  const date = new Date(dateValue);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export default function DashboardPage() {
  const spareParts = getSpareParts();
  const transactions = getTransactions();

  const todayTransactions = transactions.filter((item) =>
    isToday(item.created_at)
  );

  const todayIn = todayTransactions
    .filter((item) => item.type === 'in')
    .reduce((total, item) => total + Number(item.quantity), 0);

  const todayOut = todayTransactions
    .filter((item) => item.type === 'out')
    .reduce((total, item) => total + Number(item.quantity), 0);

  const summary = {
    part_count: spareParts.length,
    total_stock: spareParts.reduce(
      (total, item) => total + Number(item.stock), 0
    ),
    low_stock_count: spareParts.filter(
      (item) => Number(item.stock) <= 5
    ).length,
    today_in: todayIn,
    today_out: todayOut
  };

  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.created_at) - new Date(a.created_at) ||
        b.id - a.id
    )
    .slice(0, 5);

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">RINGKASAN</p>
          <h1>Dashboard</h1>
          <p className="muted">
            Pantau kondisi persediaan bengkel hari ini.
          </p>
        </div>
      </div>

      <section className="stats-grid" aria-label="Ringkasan persediaan">
        <article className="stat-card">
          <span className="stat-icon blue">▤</span>
          <p>Total jenis spare part</p>
          <strong>{numberFormat.format(summary.part_count)}</strong>
          <small>Item terdaftar</small>
        </article>

        <article className="stat-card">
          <span className="stat-icon green">▥</span>
          <p>Total stok tersedia</p>
          <strong>{numberFormat.format(summary.total_stock)}</strong>
          <small>Unit seluruh spare part</small>
        </article>

        <article className="stat-card">
          <span className="stat-icon orange">!</span>
          <p>Stok menipis</p>
          <strong>{numberFormat.format(summary.low_stock_count)}</strong>
          <small>Stok 5 atau kurang</small>
        </article>

        <article className="stat-card">
          <span className="stat-icon teal">⇄</span>
          <p>Pergerakan hari ini</p>
          <strong>
            {numberFormat.format(summary.today_in + summary.today_out)}
          </strong>
          <small>
            Masuk {numberFormat.format(summary.today_in)} ·
            Keluar {numberFormat.format(summary.today_out)}
          </small>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Transaksi terbaru</h2>
            <p className="muted">
              Lima aktivitas persediaan terakhir.
            </p>
          </div>
        </div>

        {!recentTransactions.length ? (
          <p className="empty-state">
            Belum ada transaksi yang tercatat.
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Spare part</th>
                  <th>Jenis</th>
                  <th>Jumlah</th>
                  <th>Dicatat oleh</th>
                  <th>Waktu</th>
                </tr>
              </thead>

              <tbody>
                {recentTransactions.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.spare_part_name}</strong>
                      <small className="cell-sub">
                        {row.spare_part_code}
                      </small>
                    </td>

                    <td>
                      <span className={`badge ${row.type}`}>
                        {row.type === 'in'
                          ? 'Barang masuk'
                          : 'Barang keluar'}
                      </span>
                    </td>

                    <td>{numberFormat.format(row.quantity)}</td>
                    <td>{row.recorded_by}</td>
                    <td>
                      {dateFormat.format(new Date(row.created_at))}
                    </td>
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
