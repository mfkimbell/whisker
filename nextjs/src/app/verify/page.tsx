// app/verify/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { analytics } from '@/lib/segment';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const hasAutoSent = useRef(false);
  const router = useRouter();

  // Pull phone & userId from Redux
  const phone = useSelector((s: RootState) => s.auth.phone);
  const userId = useSelector((s: RootState) => s.auth.userId);

  // Auto‐send once
  useEffect(() => {
    if (!phone || hasAutoSent.current) return;
    hasAutoSent.current = true;
    sendCode();
  }, [phone]);

  async function sendCode() {
    if (!phone) return;
    setSending(true);
    try {
      const res = await fetch('/api/verify/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) throw new Error(await res.text());
      setCanResend(false);
      setTimeout(() => setCanResend(true), 30_000);
    } catch (err) {
      console.error('Error sending code:', err);
      alert('Could not send code, please wait and try again.');
    } finally {
      setSending(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) return;

    const res = await fetch('/api/verify/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });

    if (res.ok) {
      // Mark phoneVerified in Segment
      if (userId) {
        analytics.identify(userId, { phoneVerified: true });
        analytics.track('Phone Verified');
      }
      router.push('/');
    } else {
      const { error } = await res.json();
      alert(error || 'Invalid code, try again.');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Verify Your Phone</h1>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Enter the 6-digit code we sent to:
          </label>
          <p className="mb-2 text-gray-700">{phone || '—'}</p>
          <input
            type="text"
            maxLength={6}
            pattern="\d{6}"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-amber-700 text-white py-2 rounded hover:bg-amber-800 transition"
        >
          Verify
        </button>
      </form>

      <button
        onClick={sendCode}
        disabled={sending || !canResend}
        className="mt-4 text-sm text-indigo-600 hover:underline"
      >
        {sending ? 'Sending…' : canResend ? 'Resend Code' : 'Resend in 30s'}
      </button>
    </div>
  );
}
