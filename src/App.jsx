import { useState } from "react";
import useLocalStorage from "./useLocalStorage";
import { seed, fmtFor, CUR } from "./lib";
import Expenses from "./components/Expenses";
import Settle from "./components/Settle";
import Insights from "./components/Insights";

const TABS = [["expenses", "Expenses"], ["settle", "Settle up"], ["insights", "Insights"]];

export default function App() {
  const [S, setS] = useLocalStorage("tripsplit-v1", seed);
  const [tab, setTab] = useState("expenses");
  const fmt = fmtFor(S.cur);
  const total = S.expenses.reduce((s, e) => s + e.amt, 0);

  const rename = () => { const n = prompt("Trip name", S.trip)?.trim(); if (n) setS({ ...S, trip: n }); };
  const editPeople = () => {
    const raw = prompt("Travelers, separated by commas", S.people.join(", "));
    if (!raw) return;
    const people = [...new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))];
    if (people.length < 2) return alert("Add at least two travelers.");
    setS({ ...S, people, expenses: S.expenses.map((e) => ({ ...e, split: e.split.filter((p) => people.includes(p)) })) });
  };

  return (
    <div className="wrap">
      <header>
        <div><h1>{S.trip}</h1><p className="sub">Travel together. Split smarter. {S.people.length} travelers.</p></div>
        <div className="total"><span>Trip total</span><b>{fmt(total)}</b><span>{fmt(total / S.people.length)} per person</span></div>
      </header>
      <nav role="tablist">
        {TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>)}
      </nav>
      {tab === "expenses" && <Expenses key={S.people.join()} S={S} setS={setS} fmt={fmt} />}
      {tab === "settle" && <Settle S={S} fmt={fmt} />}
      {tab === "insights" && <Insights S={S} fmt={fmt} total={total} />}
      <div className="foot">
        <button className="btn ghost" onClick={rename}>Rename trip</button>
        <button className="btn ghost" onClick={editPeople}>Edit travelers</button>
        <select aria-label="Currency" value={S.cur} onChange={(e) => setS({ ...S, cur: e.target.value })} style={{ width: "auto" }}>
          {Object.keys(CUR).map((c) => <option key={c}>{c}</option>)}
        </select>
        <button className="btn ghost" onClick={() => setS(seed())}>Reset demo data</button>
      </div>
    </div>
  );
}