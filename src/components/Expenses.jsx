import { useState } from "react";
import { CATS, MODES, CUR } from "../lib";

export default function Expenses({ S, setS, fmt }) {
  const [f, setF] = useState({ title: "", amt: "", payer: S.people[0], cat: "Food", mode: "", km: "" });
  const [split, setSplit] = useState(S.people);
  const [err, setErr] = useState("");
  const [filt, setFilt] = useState("All");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggle = (p) => setSplit((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  const add = () => {
    const amt = parseFloat(f.amt), km = parseFloat(f.km);
    if (!f.title.trim()) return setErr("Enter what the expense was for.");
    if (!(amt > 0)) return setErr("Enter an amount above zero.");
    if (!split.length) return setErr("Pick at least one person to split with.");
    const e = { id: Date.now(), title: f.title.trim(), amt, payer: f.payer, cat: f.cat, split };
    if (f.cat === "Transport" && f.mode && km > 0) Object.assign(e, { mode: f.mode, km });
    setS({ ...S, expenses: [...S.expenses, e] });
    setF({ ...f, title: "", amt: "", km: "" }); setErr("");
  };
  const del = (id) => setS({ ...S, expenses: S.expenses.filter((e) => e.id !== id) });
  const list = [...S.expenses].reverse().filter((e) => filt === "All" || e.cat === filt);

  return (<>
    <div className="card">
      <h2>Add an expense</h2>
      <div className="row">
        <label>What was it?<input value={f.title} onChange={set("title")} placeholder="Taxi to airport" /></label>
        <label>Amount ({CUR[S.cur][0]})<input type="number" min="0" inputMode="decimal" value={f.amt} onChange={set("amt")} /></label>
        <label>Paid by<select value={f.payer} onChange={set("payer")}>{S.people.map((p) => <option key={p}>{p}</option>)}</select></label>
        <label>Category<select value={f.cat} onChange={set("cat")}>{Object.keys(CATS).map((c) => <option key={c}>{c}</option>)}</select></label>
      </div>
      {f.cat === "Transport" && (
        <div className="row" style={{ marginTop: 10 }}>
          <label>Travel mode<select value={f.mode} onChange={set("mode")}><option value="">None</option>{Object.keys(MODES).map((m) => <option key={m}>{m}</option>)}</select></label>
          <label>Distance (km)<input type="number" min="0" value={f.km} onChange={set("km")} /></label>
        </div>
      )}
      <p className="sub" style={{ marginTop: 12 }}>Split equally between</p>
      <div className="chips">
        {S.people.map((p) => (
          <label key={p} className={"chip" + (split.includes(p) ? " on" : "")}>
            <input type="checkbox" checked={split.includes(p)} onChange={() => toggle(p)} />{p}
          </label>
        ))}
      </div>
      <p style={{ margin: "14px 0 0" }}><button className="btn" onClick={add}>Add expense</button> <span className="neg">{err}</span></p>
    </div>
    <div className="card">
      <h2>All expenses</h2>
      <select aria-label="Filter by category" value={filt} onChange={(e) => setFilt(e.target.value)} style={{ width: "auto", marginBottom: 8 }}>
        {["All", ...Object.keys(CATS)].map((c) => <option key={c}>{c}</option>)}
      </select>
      {!list.length && <p className="empty">No expenses here yet. Add one above.</p>}
      {list.map((e) => (
        <div className="ex" key={e.id}>
          <div><b>{e.title}</b><small>{e.payer} paid · {e.cat} · split {e.split.length} way{e.split.length > 1 ? "s" : ""}</small></div>
          <div><span className="amt">{fmt(e.amt)}</span> <button className="x" onClick={() => del(e.id)} aria-label={"Delete " + e.title}>✕</button></div>
        </div>
      ))}
    </div>
  </>);
}