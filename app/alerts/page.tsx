"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Alert = { symbol:string; direction:"UP"|"DOWN"; percent:number; };

export default function AlertsPage() {
  const r = useRouter();
  const email = useMemo(()=>localStorage.getItem("email")||"", []);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [symbol, setSymbol] = useState("BTC");
  const [direction, setDirection] = useState<"UP"|"DOWN">("UP");
  const [percent, setPercent] = useState(1.0);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const authed = localStorage.getItem("authed") === "1";
    if (!authed) r.replace("/login");
    else refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh() {
    setMsg(null);
    try {
      const data = await api.get<{alerts:Alert[]}>("/alerts", { email });
      setAlerts(data.alerts || []);
    } catch (e:any) { setMsg(e.message); }
  }

  async function add() {
    setMsg(null);
    try {
      // use GET helper endpoint for simplicity
      await api.get("/alerts/add", { email, symbol, direction, percent });
      setMsg("Saved ✔");
      await refresh();
    } catch (e:any) { setMsg(e.message); }
  }

  async function remove(a: Alert) {
    setMsg(null);
    try {
      await api.del("/alerts", { email, symbol: a.symbol, direction: a.direction, percent: a.percent });
      await refresh();
    } catch (e:any) { setMsg(e.message); }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Alerts</h1>

      {msg && <div className="mb-4 opacity-80">{msg}</div>}

      <div className="card mb-6">
        <div className="grid sm:grid-cols-4 gap-3">
          <select className="select" value={symbol} onChange={e=>setSymbol(e.target.value)}>
            {["BTC","ETH","SOL","ADA","XRP","BNB","DOGE","AVAX","MATIC","LTC"].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <select className="select" value={direction} onChange={e=>setDirection(e.target.value as "UP"|"DOWN")}>
            <option value="UP">UP</option>
            <option value="DOWN">DOWN</option>
          </select>
          <input className="number" type="number" min={0.1} step={0.1} value={percent} onChange={e=>setPercent(parseFloat(e.target.value))} />
          <button className="btn btn-primary" onClick={add}>Save alert</button>
        </div>
      </div>

      {alerts.length ? alerts.map((a,i)=>(
        <div key={i} className="card mb-2 flex items-center justify-between">
          <div className="flex gap-4">
            <div className="font-semibold">{a.symbol}</div>
            <div>{a.direction}</div>
            <div>{a.percent.toFixed(2)}%</div>
          </div>
          <button className="btn" onClick={()=>remove(a)}>Delete</button>
        </div>
      )) : <div className="opacity-70">No alerts yet.</div>}
    </div>
  );
}
