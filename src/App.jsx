import { useEffect, useMemo, useState } from 'react';
import Hero3D from './components/Hero3D';
import TaxWorkbook from './components/TaxWorkbook';
import TaxSummary from './components/TaxSummary';
import ImportExport from './components/ImportExport';

const STORAGE_KEY = 'tax_consultant_workbook_v1';

function App() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setRows(parsed);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch (_) {}
  }, [rows]);

  const totals = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let totalTaxable = 0;
    let totalTaxOwed = 0;

    for (const r of rows) {
      const income = Number(r.income) || 0;
      const expense = Number(r.expense) || 0;
      const rate = (Number(r.rate) || 0) / 100;
      const taxable = Math.max(income - expense, 0);
      const taxOwed = taxable * rate;
      totalIncome += income;
      totalExpense += expense;
      totalTaxable += taxable;
      totalTaxOwed += taxOwed;
    }

    const effectiveRate = totalTaxable > 0 ? (totalTaxOwed / totalTaxable) * 100 : 0;
    return { totalIncome, totalExpense, totalTaxable, totalTaxOwed, effectiveRate };
  }, [rows]);

  const addEmptyRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        date: '',
        client: '',
        income: '',
        expense: '',
        rate: '30',
        notes: '',
      },
    ]);
  };

  const updateRow = (id, patch) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const deleteRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const clearAll = () => {
    if (confirm('Clear all rows? This cannot be undone.')) setRows([]);
  };

  const replaceRows = (nextRows) => setRows(nextRows);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Hero3D />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Tax Workbook</h2>
              <div className="flex gap-2">
                <ImportExport rows={rows} onImport={replaceRows} />
                <button onClick={addEmptyRow} className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                  + Add Row
                </button>
                <button onClick={clearAll} className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600">
                  Clear
                </button>
              </div>
            </div>
            <TaxWorkbook rows={rows} onUpdateRow={updateRow} onDeleteRow={deleteRow} />
          </div>

          <div className="w-full lg:w-80">
            <TaxSummary totals={totals} />
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Disclaimer: This tool is for estimation and record-keeping assistance only and does not constitute tax or legal advice.
        </p>
      </main>
    </div>
  );
}

export default App;
