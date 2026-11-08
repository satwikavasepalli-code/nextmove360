
"use client";

import { useEffect, useState } from "react";

// Data received from your Supabase backend
type FinancialData = {
  profile_id: number;
  name: string;
  total_assets: number;
  total_debt: number;
  net_worth: number;
  liquid_cash: number;
  monthly_income: number;
  monthly_expenses: number;
  monthly_surplus: number;
  surplus_rate: number | null;
};

// Format numbers as dollar amounts
function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Home() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get financial information from our backend
  useEffect(() => {
    async function getFinancialData() {
      try {
        const response = await fetch("/api/summary", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load data");
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Connection error"
        );
      } finally {
        setLoading(false);
      }
    }

    getFinancialData();
  }, []);

  // The 8 metrics are now calculated from API results
  const metrics = data
    ? [
        {
          label: "Total Assets",
          value: formatMoney(data.total_assets),
        },
        {
          label: "Total Debt",
          value: formatMoney(data.total_debt),
        },
        {
          label: "Net Worth",
          value: formatMoney(data.net_worth),
        },
        {
          label: "Liquid Cash",
          value: formatMoney(data.liquid_cash),
        },
        {
          label: "Monthly Income",
          value: formatMoney(data.monthly_income),
        },
        {
          label: "Monthly Expenses",
          value: formatMoney(data.monthly_expenses),
        },
        {
          label: "Monthly Surplus",
          value: formatMoney(data.monthly_surplus),
        },
        {
          label: "Surplus Rate",
          value:
            data.surplus_rate === null
              ? "N/A"
              : `${Number(data.surplus_rate).toFixed(1)}%`,
        },
      ]
    : [];

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-900">
            NextMove 360
          </h1>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700">
            Demo Mode
          </span>
        </div>

        {/* WELCOME */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">
            Welcome back, {data?.name || "Maya"}!
          </h2>
          <p className="mt-2 text-slate-500">
            Here's your complete financial picture.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-blue-600">
            Loading financial data from Supabase...
          </p>
        )}

        {/* ERROR */}
        {error && (
          <div className="rounded-xl bg-red-50 p-5 text-red-700">
            Error: {error}
          </div>
        )}

        {/* FINANCIAL DASHBOARD */}
        {data && (
          <>
            <h2 className="mb-4 text-xl font-semibold">
              Financial Overview
            </h2>

            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-sm text-slate-500">
                    {metric.label}
                  </p>

                  <p className="mt-3 text-2xl font-bold">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            {/* HEALTH INDICATORS */}
            <h2 className="mb-4 text-xl font-semibold">
              Financial Health Indicators
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-semibold">
                  Cash Flow Health
                </h3>
                <p className="mt-3 text-2xl font-bold">
                  {formatMoney(data.monthly_surplus)}
                </p>
                <p className={
                  data.monthly_surplus > 0
                    ? "mt-2 text-green-600"
                    : "mt-2 text-red-600"
                }>
                  {data.monthly_surplus > 0
                    ? "Healthy"
                    : "Needs Attention"}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-semibold">
                  Emergency Savings Health
                </h3>
                <p className="mt-3 text-2xl font-bold">
                  1.8 months
                </p>
                <p className="mt-2 text-amber-600">
                  Needs Improvement
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Sample value
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-semibold">
                  Debt Payment Health
                </h3>
                <p className="mt-3 text-2xl font-bold">
                  10.5%
                </p>
                <p className="mt-2 text-green-600">
                  Manageable
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Sample value
                </p>
              </div>

            </div>

            {/* FINANCIAL INSIGHT */}
            <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="text-lg font-semibold text-blue-900">
                Your Financial Insight
              </h3>
              <p className="mt-2 text-slate-700">
                {data.monthly_surplus > 0
                  ? `You have ${formatMoney(data.monthly_surplus)} remaining each month. Consider directing some of this surplus toward your financial goals.`
                  : "Your monthly expenses are exceeding or matching your income. Review your spending to improve cash flow."}
              </p>
            </div>
          </>
        )}

        <p className="mt-10 text-center text-sm text-slate-400">
          NextMove 360 | Financial Health Navigator
        </p>

      </div>
    </main>
  );
}
