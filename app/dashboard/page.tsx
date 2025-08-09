"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { CoinCard } from "@/components/CoinCard";

type Coin = { symbol:string; price:number; change:number; prediction:string; confidence:number; };
type PredictRes = { coins: Coin[]; window: string; stale: boolean; backend_error?: string | null; };

export default function Dashboard() {
  const r = useRouter();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [windowSel, setWindowSel] = useState("24h");
  const [loading, setLoading] = useState(false);
  const email = useMemo(()=>localStorage.getItem("email")||"", []);

  useEffect(() => {
    const authed = localStorage.getItem("authed") === "1";
    if (!authed) r.replace("/login");
  }, [r]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<PredictRes>("/predict", { email, window: windowSel });
      setCoins(data.coins || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [windowSel]); // first load + when window changes
  useEffect(() => {
    const id = setInterval(load, 45000); // 45s to play nice with rate limits
    return () => clearInterval(id);
  }, [windowSel]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <select className="select" value={windowSel} onChange={e=>setWindowSel(e.target.value)}>
          <option value="15m">15m</option>
          <option value="1h">1h</option>
          <option value="12h">12h</option>
          <option value="24h">24h</option>
        </select>
        <button className="btn" onClick={load} disabled={loading}>{loading? "Refreshing..." : "Refresh"}</button>
        <div className="ml-auto flex gap-2">
          <button className="btn" onClick={()=>{ localStorage.setItem("authed","0"); localStorage.removeItem("email"); r.replace("/login"); }}>Log out</button>
        </div>
      </div>

      <div className="grid-cards">
        {coins.map(c => (
          <CoinCard key={c.symbol} {...c} />
        ))}
      </div>
    </div>
  );
}
