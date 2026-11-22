
import { useState } from 'react';
import { getUsers } from '../services/storage.js';

export default function LoginPage({ onLogin }) {
  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const users = getUsers();

    const user = users.find(
      (item) =>
        item.username === values.username.trim() &&
        item.password === values.password
    );

    if (!user) {
      setError('Username atau password tidak sesuai.');
      setLoading(false);
      return;
    }

    onLogin({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role
    });

    setLoading(false);
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="brand-mark" aria-hidden="true">AM</div>

        <p className="eyebrow">BENGKEL ABADI MOTOR</p>
        <h1>Masuk ke sistem</h1>
        <p className="muted">
          Kelola persediaan spare part dengan lebih mudah.
        </p>

        <form onSubmit={submit} className="form-stack">
          <label>
            Username
            <input
              autoComplete="username"
              value={values.username}
              maxLength="50"
              required
              onChange={(event) =>
                setValues({ ...values, username: event.target.value })
              }
            />
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={values.password}
              required
              onChange={(event) =>
                setValues({ ...values, password: event.target.value })
              }
            />
          </label>

          {error && (
            <p className="alert error" role="alert">{error}</p>
          )}

          <button
            className="button primary full-width"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>

        <p className="login-footnote">
          Akses hanya untuk Admin dan Pemilik.
        </p>
      </section>
    </main>
  );
}
