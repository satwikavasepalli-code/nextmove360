
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import WhatIfSimulator from "./WhatIfSimulator";

type Page = "dashboard" | "health" | "simulator";

type FinancialData = {
  name: string;
  total_assets: number;
  total_debt: number;
  net_worth: number;
  liquid_cash: number;
  monthly_income: number;
  monthly_expenses: number;
  monthly_surplus: number;
  surplus_rate: number | null;
  health: {
    monthly_surplus: number;
    emergency_months: number | null;
    debt_payment_percentage: number | null;
  };
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const navigation = [
  { label: "Dashboard", href: "/", page: "dashboard", icon: "◈" },
  { label: "Financial Health", href: "/health", page: "health", icon: "♡" },
  { label: "What-If Lab", href: "/simulator", page: "simulator", icon: "↗" },
];

export default function Workspace({ page }: { page: Page }) {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/summary", {
          cache: "no-store",
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Unable to load data");
        }

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connection error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const titles = {
    dashboard: "Dashboard Overview",
    health: "Financial Health",
    simulator: "What-If Lab",
  };

  const metrics = data
    ? [
        { label: "Total Assets", value: money(data.total_assets), icon: "◈" },
        { label: "Total Debt", value: money(data.total_debt), icon: "◉" },
        { label: "Net Worth", value: money(data.net_worth), icon: "◆" },
        { label: "Liquid Cash", value: money(data.liquid_cash), icon: "$" },
        { label: "Monthly Income", value: money(data.monthly_income), icon: "↗" },
        { label: "Monthly Expenses", value: money(data.monthly_expenses), icon: "↘" },
        { label: "Monthly Surplus", value: money(data.monthly_surplus), icon: "+" },
        {
          label: "Surplus Rate",
          value: data.surplus_rate == null
            ? "N/A"
            : `${Number(data.surplus_rate).toFixed(1)}%`,
          icon: "%",
        },
      ]
    : [];

  const cashFlow = Number(data?.health?.monthly_surplus ?? data?.monthly_surplus ?? 0);
  const emergency = data?.health?.emergency_months == null
    ? null : Number(data.health.emergency_months);
  const debt = data?.health?.debt_payment_percentage == null
    ? null : Number(data.health.debt_payment_percentage);

  const healthCards = [
    {
      title: "Cash Flow Health",
      value: `${money(cashFlow)}/month`,
      status: cashFlow > 0 ? "Healthy" : cashFlow === 0 ? "Breaking Even" : "Needs Attention",
      good: cashFlow > 0,
      description: "Money left after monthly expenses.",
    },
    {
      title: "Emergency Savings",
      value: emergency == null ? "N/A" : `${emergency.toFixed(1)} months`,
      status: emergency == null ? "Unavailable" : emergency >= 3
        ? "Healthy" : emergency >= 1 ? "Needs Improvement" : "At Risk",
      good: emergency !== null && emergency >= 3,
      description: "Months of essential expenses your savings can cover.",
    },
    {
      title: "Debt Payment Health",
      value: debt == null ? "N/A" : `${debt.toFixed(1)}%`,
      status: debt == null ? "Unavailable" : debt <= 15
        ? "Manageable" : debt <= 30 ? "Watch Closely" : "High Debt Load",
      good: debt !== null && debt <= 15,
      description: "Share of take-home income used for debt payments.",
    },
  ];

  const spendingRate = data && Number(data.monthly_income) > 0
    ? Number(data.monthly_expenses) / Number(data.monthly_income) * 100
    : 0;

  const chartPercent = Math.min(100, Math.max(0, spendingRate));

  return (
    <div className="min-h-screen bg-[#F3F5FA] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">

        {/* SIDEBAR */}
        <aside className="bg-[#10172A] px-6 py-7 text-white lg:min-h-screen lg:w-64 lg:shrink-0">
          <div className="mb-9 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500 text-xl font-bold">
              N
            </div>
            <div>
              <p className="text-lg font-bold">NextMove 360</p>
              <p className="text-xs tracking-widest text-violet-300">
                FINANCIAL NAVIGATOR
              </p>
            </div>
          </div>

          <p className="mb-4 text-xs font-semibold tracking-widest text-slate-400">
            WORKSPACE
          </p>

          <nav className="flex flex-wrap gap-2 lg:flex-col">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={page === item.page ? "page" : undefined}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  page === item.page
                    ? "bg-violet-500 text-white shadow-lg"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-12 hidden rounded-2xl border border-white/10 bg-white/5 p-5 lg:block">
            <p className="font-semibold">Your next move starts here.</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Financial clarity powered by your demo data.
            </p>
          </div>
        </aside>

        {/* MAIN PAGE */}
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-9">

          <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                NextMove 360
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                {titles[page]}
              </h1>
            </div>
            <span className="rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-semibold text-violet-700">
              ● Demo Mode
            </span>
          </header>

          {loading && (
            <div className="rounded-2xl bg-white p-8 text-slate-500">
              Loading your financial data...
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
              Error: {error}
            </div>
          )}

          {/* PAGE 1: DASHBOARD */}
          {data && page === "dashboard" && (
            <>
              <section
                className="mb-8 rounded-3xl p-8 text-white shadow-xl"
                style={{
                  background: "linear-gradient(120deg, #10172A, #3730A3, #7C3AED)",
                }}
              >
                <p className="text-sm text-violet-200">
                  Welcome back, {data.name}
                </p>
                <h2 className="mt-3 text-4xl font-bold">
                  Own your next move.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-6 text-violet-100">
                  See your complete financial picture and make
                  confident decisions about your future.
                </p>
                <Link
                  href="/simulator"
                  className="mt-6 inline-block rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-900"
                >
                  Explore Your Future ↗
                </Link>
              </section>

              <h2 className="mb-5 text-xl font-bold">
                Your Financial Overview
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl font-bold text-violet-700">
                      {metric.icon}
                    </div>
                    <p className="text-sm text-slate-500">{metric.label}</p>
                    <p className="mt-2 text-2xl font-bold">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid gap-5 xl:grid-cols-2">
                <section className="rounded-2xl bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold">Monthly Cash Flow</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Percentage of monthly income spent
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-8">
                    <div
                      className="flex h-40 w-40 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(#8B5CF6 ${chartPercent}%, #E2E8F0 0)`,
                      }}
                    >
                      <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                        <p className="text-3xl font-bold">{spendingRate.toFixed(0)}%</p>
                        <p className="text-xs text-slate-400">Spent</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm">
                        <span className="text-slate-500">Income:</span>
                        <br />
                        <strong>{money(Number(data.monthly_income))}</strong>
                      </p>
                      <p className="text-sm">
                        <span className="text-slate-500">Expenses:</span>
                        <br />
                        <strong>{money(Number(data.monthly_expenses))}</strong>
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold">Your Financial Insight</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {emergency !== null && emergency < 3
                      ? `Your emergency savings cover ${emergency.toFixed(1)} months of essential expenses. Consider strengthening your savings cushion.`
                      : cashFlow > 0
                      ? `You have ${money(cashFlow)} remaining monthly. Consider directing some of your surplus toward your goals.`
                      : "Consider reviewing your monthly expenses to improve your financial position."}
                  </p>
                  <Link
                    href="/health"
                    className="mt-6 inline-block text-sm font-bold text-violet-700"
                  >
                    View Financial Health →
                  </Link>
                </section>
              </div>
            </>
          )}

          {/* PAGE 2: FINANCIAL HEALTH */}
          {data && page === "health" && (
            <>
              <div className="mb-7 rounded-2xl bg-indigo-50 p-6">
                <h2 className="text-xl font-bold text-indigo-900">
                  Understand Your Financial Wellness
                </h2>
                <p className="mt-2 text-sm text-indigo-700">
                  Three indicators calculated directly from your Supabase financial data.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {healthCards.map((card) => (
                  <section
                    key={card.title}
                    className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-slate-500">
                      {card.title}
                    </p>
                    <p className="mt-5 text-3xl font-bold">{card.value}</p>
                    <span
                      className={`mt-4 inline-block rounded-full px-3 py-2 text-xs font-bold ${
                        card.good
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {card.status}
                    </span>
                    <p className="mt-5 text-sm leading-6 text-slate-500">
                      {card.description}
                    </p>
                  </section>
                ))}
              </div>

              <div className="mt-7 rounded-2xl bg-white p-7 shadow-sm">
                <h3 className="text-xl font-bold">
                  Your Next Financial Move
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {emergency !== null && emergency < 3
                    ? "Consider building your emergency savings before taking on large optional expenses. Test changes in the What-If Lab."
                    : cashFlow > 0
                    ? "Your cash flow has a positive surplus. Explore how different saving and spending decisions could affect your future balance."
                    : "Review your expenses and explore ways to improve monthly cash flow."}
                </p>
                <Link
                  href="/simulator"
                  className="mt-5 inline-block rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white"
                >
                  Open What-If Lab →
                </Link>
              </div>
            </>
          )}

          {/* PAGE 3: WHAT-IF SIMULATOR */}
          {data && page === "simulator" && (
            <>
              <div className="rounded-2xl bg-indigo-50 p-6">
                <h2 className="text-xl font-bold text-indigo-900">
                  Explore Your Financial Future
                </h2>
                <p className="mt-2 text-sm text-indigo-700">
                  Adjust spending decisions and watch your projected
                  cash balance change over 90 days.
                </p>
              </div>

              <WhatIfSimulator
                liquidCash={Number(data.liquid_cash)}
                monthlySurplus={Number(data.monthly_surplus)}
              />
            </>
          )}

          <footer className="mt-12 text-center text-xs text-slate-400">
            NextMove 360 · Illustrative financial data and demo thresholds
          </footer>
        </main>
      </div>
    </div>
  );
}
