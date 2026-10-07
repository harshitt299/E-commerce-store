import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setSending(true);
    try {
      const res = await forgotPassword(email);
      setMsg(res.message || "If this email exists, a reset link has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mx-auto w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6">
        <h1 className="text-lg font-bold tracking-tight text-stone-900">Forgot password</h1>
        <p className="mt-1 text-sm text-stone-500">Enter your account email. We will send a reset link valid for 10 minutes.</p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm" />
          </div>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {msg && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">{msg}</p>}
          <button disabled={sending} className="w-full rounded-md bg-stone-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {sending ? "Sending…" : "Send reset link"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-stone-500">
          <Link to="/login" className="underline underline-offset-4">Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
