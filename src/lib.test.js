import { describe, it, expect } from "vitest";
import { settle, balances, co2 } from "./lib";
const P = ["A", "B", "C"];
describe("settle", () => {
  it("clears all balances with minimal payments", () => {
    const S = { people: P, expenses: [{ amt: 300, payer: "A", split: P }] };
    const pay = settle(S);
    expect(pay).toHaveLength(2);
    expect(pay.every((p) => p.to === "A" && Math.round(p.amt) === 100)).toBe(true);
  });
  it("returns nothing when everyone is even", () => {
    expect(settle({ people: P, expenses: [] })).toEqual([]);
  });
  it("balances sum to zero", () => {
    const b = balances({ people: P, expenses: [{ amt: 100, payer: "B", split: ["A", "B"] }] });
    expect(Object.values(b).reduce((a, c) => a + c, 0)).toBeCloseTo(0);
  });
  it("estimates CO2 per traveler", () => {
    expect(co2({ expenses: [{ mode: "train", km: 100, split: ["A", "B"] }] })).toBeCloseTo(8);
  });
});