import { useState } from 'react';
import { api, jsonBody, saveToken } from '../services/api.js';

export default function LoginPage({ onLogin }) {
  const [values, setValues] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api('/auth/login', { method: 'POST', body: jsonBody(values) });
      saveToken(result.token);
      onLogin(result.user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="brand-mark" aria-hidden="true">AM</div>
        <p className="eyebrow">BENGKEL ABADI MOTOR</p>
        <h1>Masuk ke sistem</h1>
        <p className="muted">Kelola persediaan spare part dengan lebih mudah.</p>
        <form onSubmit={submit} className="form-stack">
          <label>
            Username
            <input autoComplete="username" value={values.username} maxLength="50" required
              onChange={(event) => setValues({ ...values, username: event.target.value })} />
          </label>
          <label>
            Password
            <input type="password" autoComplete="current-password" value={values.password} required
              onChange={(event) => setValues({ ...values, password: event.target.value })} />
          </label>
          {error && <p className="alert error" role="alert">{error}</p>}
          <button className="button primary full-width" type="submit" disabled={loading}>
            {loading ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
        <p className="login-footnote">Akses hanya untuk Admin dan Pemilik.</p>
      </section>
    </main>
  );
}
