import { CATS, co2 } from "../lib";

export default function Insights({ S, fmt, total }) {
  const byCategory = Object.keys(CATS)
    .map((cat) => ({
      cat,
      amount: S.expenses
        .filter((expense) => expense.cat === cat)
        .reduce((sum, expense) => sum + expense.amt, 0),
    }))
    .filter(({ amount }) => amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const byPayer = S.people
    .map((person) => ({
      person,
      amount: S.expenses
        .filter((expense) => expense.payer === person)
        .reduce((sum, expense) => sum + expense.amt, 0),
    }))
    .sort((a, b) => b.amount - a.amount);

  const emissions = co2(S);

  return (
    <div className="grid">
      <div className="card">
        <h2>Spending by category</h2>
        {!byCategory.length && (
          <p className="empty">Add expenses to see your spending breakdown.</p>
        )}
        {byCategory.map(({ cat, amount }) => (
          <div key={cat} style={{ marginTop: 12 }}>
            <div className="legend">
              <span>
                <i className="dot" style={{ background: CATS[cat] }} />
                {cat}
              </span>
              <b>{fmt(amount)}</b>
            </div>
            <div
              className="bar"
              style={{
                width: `${Math.max(2, total ? (amount / total) * 100 : 0)}%`,
                background: CATS[cat],
              }}
            />
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Trip snapshot</h2>
        <p className="sub">Total spent</p>
        <div className="big">{fmt(total)}</div>
        <p className="sub" style={{ marginTop: 18 }}>Average per traveler</p>
        <div className="big">
          {fmt(S.people.length ? total / S.people.length : 0)}
        </div>
        {byPayer[0]?.amount > 0 && (
          <p className="sub" style={{ marginTop: 18 }}>
            Most paid by <b>{byPayer[0].person}</b> ({fmt(byPayer[0].amount)})
          </p>
        )}
      </div>

      <div className="card">
        <h2>Transport footprint</h2>
        <div className="big">
          {Math.round(emissions).toLocaleString()}{" "}
          <span style={{ fontSize: "1rem" }}>kg CO₂e</span>
        </div>
        <p className="sub">
          Estimated from transport expenses with a travel mode and distance entered.
        </p>
      </div>
    </div>
  );
}