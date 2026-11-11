import { balances, settle } from "../lib";

export default function Settle({ S, fmt }) {
  const b = balances(S), pay = settle(S);
  const copy = async () => {
    const t = S.trip + " - settle up\n" + (pay.length ? pay.map((x) => `${x.from} pays ${x.to} ${fmt(x.amt)}`).join("\n") : "Everyone is settled up.");
    try { await navigator.clipboard.writeText(t); alert("Settlement copied."); } catch { prompt("Copy this summary", t); }
  };
  return (<>
    <div className="card">
      <h2>Who owes whom</h2>
      {!pay.length && <p className="empty">Everyone is settled up.</p>}
      {pay.map((p, i) => (
        <div className="pay" key={i}><b>{p.from}</b><span className="arrow">pays</span><b>{p.to}</b><span className="amt" style={{ marginLeft: "auto" }}>{fmt(p.amt)}</span></div>
      ))}
      <p className="sub">{pay.length} payment{pay.length === 1 ? "" : "s"} settle everything.</p>
      <button className="btn ghost" onClick={copy}>Copy settlement</button>
    </div>
    <div className="card">
      <h2>Balances</h2>
      {S.people.map((p) => { const v = b[p]; return (
        <div className="bal" key={p}><span>{p}</span>
          <b className={v >= 0.5 ? "pos" : v <= -0.5 ? "neg" : ""}>{v >= 0.5 ? "gets back " + fmt(v) : v <= -0.5 ? "owes " + fmt(-v) : "settled"}</b></div>
      ); })}
    </div>
  </>);
}