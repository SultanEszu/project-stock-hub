import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(username, password);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand"><span>S</span><div><strong>Stock Hub</strong><small>Warehouse System</small></div></div>
        <h1>Selamat datang kembali</h1>
        <p className="login-intro">Masuk untuk memantau dan mengelola persediaan gudang.</p>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">Username</label>
          <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="primary-button login-button" type="submit" disabled={submitting}>
            {submitting ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
