import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    if (pw.length < 6) { setError("Password must be at least 6 characters"); return; }
    setSending(true);
    try {
      await resetPassword(token, pw);
      setMsg("Password reset successfully. Redirecting to login…");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Link expired or invalid");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mx-auto w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6">
        <h1 className="text-lg font-bold tracking-tight text-stone-900">Set new password</h1>
        <p className="mt-1 text-sm text-stone-500">Choose a new password for your account.</p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">New password</label>
            <input type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Min. 6 characters" className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm" />
          </div>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {msg && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">{msg}</p>}
          <button disabled={sending} className="w-full rounded-md bg-stone-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {sending ? "Saving…" : "Reset password"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-stone-500">
          <Link to="/login" className="underline underline-offset-4">Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
