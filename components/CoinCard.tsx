export function CoinCard({
  symbol, price, change, prediction, confidence
}: { symbol: string; price: number; change: number; prediction: string; confidence: number; }) {
  const up = change >= 0;
  return (
    <div className="card">
      <div className="text-sm opacity-75">#{symbol}</div>
      <div className="text-xl font-semibold mt-1">${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
      <div className={up ? "text-emerald-400" : "text-rose-400"}>
        {change >= 0 ? "+" : ""}{change.toFixed(2)}% · {prediction} · {confidence.toFixed(1)}%
      </div>
    </div>
  );
}
