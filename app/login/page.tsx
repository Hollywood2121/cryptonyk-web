"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const r = useRouter();

  const send = async () => {
    setMsg(null);
    try {
      const res = await api.post<{success:boolean; message?:string}>("/send-otp", { email });
      if (res.success) { setSent(true); setMsg("OTP sent. Check your inbox (and Spam)."); }
      else setMsg(res.message || "Failed to send OTP.");
    } catch (e:any) { setMsg(e.message); }
  };

  const verify = async () => {
    setMsg(null);
    try {
      const res = await api.post<{authenticated:boolean; message?:string}>("/verify-otp", { email, otp });
      if (res.authenticated) {
        localStorage.setItem("authed", "1");
        localStorage.setItem("email", email.toLowerCase().trim());
        r.replace("/dashboard");
      } else setMsg(res.message || "Invalid OTP.");
    } catch (e:any) { setMsg(e.message); }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2">Sign in</h1>
      <p className="opacity-75 mb-4">Enter your email to receive a one-time passcode.</p>

      <input className="input mb-2" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
      <button className="btn btn-primary w-full mb-4" onClick={send}>Send OTP</button>

      {sent && (
        <>
          <input className="input mb-2" placeholder="6-digit OTP" value={otp} onChange={e=>setOtp(e.target.value)} maxLength={6} />
          <button className="btn w-full" onClick={verify}>Verify OTP</button>
        </>
      )}

      {msg && <div className="mt-3 opacity-80">{msg}</div>}
    </div>
  );
}
