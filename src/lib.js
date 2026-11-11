export const CATS = { Stay: "#0f7a8a", Food: "#f2b632", Transport: "#6c5ce7", Activities: "#e17055", Other: "#7f8c8d" };
export const MODES = { flight: 0.15, train: 0.04, bus: 0.08, car: 0.17 }; // kg CO2 per km per person
export const CUR = { INR: ["₹", "en-IN"], USD: ["$", "en-US"], EUR: ["€", "de-DE"] };
const all = ["Anu", "Ravi", "Meena", "Karthik"];
export const seed = () => ({ trip: "Goa getaway", cur: "INR", people: all, expenses: [
  { id: 1, title: "Beach villa (3 nights)", amt: 18000, payer: "Anu", cat: "Stay", split: all },
  { id: 2, title: "Seafood dinner", amt: 3200, payer: "Ravi", cat: "Food", split: all },
  { id: 3, title: "Train tickets", amt: 4800, payer: "Meena", cat: "Transport", split: all, mode: "train", km: 800 },
  { id: 4, title: "Scooter rental", amt: 1800, payer: "Karthik", cat: "Transport", split: ["Ravi", "Karthik"], mode: "car", km: 120 },
] });
export const fmtFor = (cur) => { const [s, l] = CUR[cur] || CUR.INR; return (n) => s + Math.round(n).toLocaleString(l); };

export function balances({ people, expenses }) {
  const b = Object.fromEntries(people.map((p) => [p, 0]));
  for (const e of expenses) {
    const sh = e.split.filter((p) => p in b);
    if (!sh.length || !(e.payer in b)) continue;
    b[e.payer] += e.amt;
    sh.forEach((p) => (b[p] -= e.amt / sh.length));
  }
  return b;
}

// Greedy settlement: repeatedly match the largest debtor with the largest creditor.
export function settle(S) {
  const cr = [], db = [], out = [];
  for (const [p, v] of Object.entries(balances(S))) {
    const r = Math.round(v * 100) / 100;
    if (r > 0.5) cr.push([p, r]); else if (r < -0.5) db.push([p, -r]);
  }
  while (cr.length && db.length) {
    cr.sort((a, b) => b[1] - a[1]); db.sort((a, b) => b[1] - a[1]);
    const m = Math.min(cr[0][1], db[0][1]);
    out.push({ from: db[0][0], to: cr[0][0], amt: m });
    cr[0][1] -= m; db[0][1] -= m;
    if (cr[0][1] < 0.5) cr.shift();
    if (db[0][1] < 0.5) db.shift();
  }
  return out;
}

export const co2 = ({ expenses }) =>
  expenses.reduce((t, e) => (e.mode && e.km ? t + e.km * MODES[e.mode] * e.split.length : t), 0);