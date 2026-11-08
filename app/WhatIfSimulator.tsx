
"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  liquidCash: number;
  monthlySurplus: number;
};

function money(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function WhatIfSimulator({
  liquidCash,
  monthlySurplus,
}: Props) {
  const [extraSavings, setExtraSavings] = useState(0);
  const [purchase, setPurchase] = useState(0);

  const baseline = liquidCash + monthlySurplus * 3;

  const projected =
    baseline + extraSavings * 3 - purchase;

  const difference = projected - baseline;

  // Create graph points using financial data
  const graphData = [0, 1, 2, 3].map((month) => ({
    period: month === 0 ? "Today" : `${month * 30} Days`,

    current: liquidCash + monthlySurplus * month,

    scenario:
      liquidCash +
      (monthlySurplus + extraSavings) * month -
      (month === 0 ? 0 : purchase),
  }));

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-bold text-blue-900">
        What-If Financial Simulator
      </h2>

      <p className="mt-2 text-slate-500">
        Explore how your financial decisions could
        affect your future.
      </p>

      {/* SAVINGS SLIDER */}
      <div className="mt-8">
        <div className="flex justify-between gap-3">
          <label htmlFor="savings" className="font-medium">
            Reduce Monthly Spending
          </label>
          <span className="font-bold text-green-600">
            {money(extraSavings)}
          </span>
        </div>

        <input
          id="savings"
          type="range"
          min="0"
          max="500"
          step="50"
          value={extraSavings}
          onChange={(e) =>
            setExtraSavings(Number(e.target.value))
          }
          className="mt-4 w-full accent-blue-600"
        />
      </div>

      {/* PURCHASE SLIDER */}
      <div className="mt-8">
        <div className="flex justify-between gap-3">
          <label htmlFor="purchase" className="font-medium">
            One-Time Purchase
          </label>
          <span className="font-bold text-red-600">
            {money(purchase)}
          </span>
        </div>

        <input
          id="purchase"
          type="range"
          min="0"
          max="2000"
          step="100"
          value={purchase}
          onChange={(e) =>
            setPurchase(Number(e.target.value))
          }
          className="mt-4 w-full accent-blue-600"
        />
      </div>

      {/* INTERACTIVE GRAPH */}
      <div className="mt-10 rounded-2xl bg-slate-50 p-5">
        <h3 className="text-xl font-bold text-slate-800">
          Your Financial Future
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Estimated cash balance over 90 days
        </p>

        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={graphData}
              margin={{
                top: 10,
                right: 15,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="period"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tick={{ fontSize: 12 }}
                width={65}
                tickFormatter={(value) =>
                  `$${Number(value).toLocaleString()}`
                }
              />

              <Tooltip
                formatter={(value) =>
                  money(Number(value))
                }
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="current"
                name="Current Plan"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
              />

              <Line
                type="monotone"
                dataKey="scenario"
                name="What-If Scenario"
                stroke="#9333ea"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RESULT CARDS */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-blue-50 p-5">
          <p className="text-sm text-slate-500">
            Current Plan
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-900">
            {money(baseline)}
          </p>
        </div>

        <div className="rounded-xl bg-purple-50 p-5">
          <p className="text-sm text-slate-500">
            What-If Projection
          </p>
          <p className="mt-2 text-3xl font-bold text-purple-800">
            {money(projected)}
          </p>
        </div>
      </div>

      {/* INSIGHT */}
      <div className="mt-6 rounded-xl bg-slate-100 p-5">
        <h3 className="font-semibold">
          Your Scenario Insight
        </h3>

        <p className="mt-2 text-slate-700">
          {difference >= 0
            ? `Your scenario could leave you with ${money(difference)} more cash after 90 days.`
            : `Your scenario could leave you with ${money(Math.abs(difference))} less cash after 90 days.`}
        </p>
      </div>

      <button
        onClick={() => {
          setExtraSavings(0);
          setPurchase(0);
        }}
        className="mt-6 rounded-lg bg-blue-900 px-6 py-3 font-medium text-white hover:bg-blue-800"
      >
        Reset Scenario
      </button>

      <p className="mt-4 text-xs text-slate-500">
        Projections assume constant monthly cash flow,
        recurring spending reductions, and a one-time
        purchase in the first month. Demo estimates only.
      </p>
    </section>
  );
}
