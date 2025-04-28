// app/signup/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { analytics } from '@/lib/segment';
import { useDispatch } from 'react-redux';
import { setUser } from '@/lib/slices/authSlice';
import type { AppDispatch } from '@/lib/store';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = await analytics.user();
    const anonymousId = user.anonymousId();

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone, anonymousId }),
    });
    if (!res.ok) {
      alert('Signup failed, please try again.');
      return;
    }
    const { userId } = await res.json();

    // merge anonymous history into identified profile
    analytics.identify(userId, {
      email,
      phone,
      phoneVerified: false,
      smsOptIn: false,
    });
    analytics.track('Signed Up', { method: 'email+phone' });

    const myPhone = '+12053128982';

    dispatch(setUser({ userId, phone: myPhone, name }));
    localStorage.setItem('userId', userId);
    localStorage.setItem('phone', phone);
    localStorage.setItem('name', name);

    router.push('/verify');
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Sign up for Whisker</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone (E.164)</label>
          <input
            type="tel"
            required
            placeholder="+14155552671"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-amber-700 text-white py-2 rounded hover:bg-amber-800 transition"
        >
          Create Account & Verify
        </button>
      </form>
    </div>
  );
}
