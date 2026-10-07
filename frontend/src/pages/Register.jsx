import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const inputCls = "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mx-auto w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6">
        <h1 className="text-lg font-bold tracking-tight text-stone-900">Create account</h1>
        <p className="mt-1 text-sm text-stone-500">One account for cart, orders and faster checkout.</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">Full name</label>
            <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} required className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">Email</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">Password</label>
            <input name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength={6} className={inputCls} />
          </div>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button disabled={submitting} className="w-full rounded-md bg-stone-900 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50">
            {submitting ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-stone-500">
          Already have an account? <Link to="/login" className="font-medium text-stone-900 underline underline-offset-4">Login</Link>
        </p>
      </div>
    </div>
  );
}
