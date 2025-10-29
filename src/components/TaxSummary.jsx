function formatCurrency(n) {
  return (Number(n) || 0).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

function Stat({ label, value, accent = false }) {
  return (
    <div className={`rounded-lg border border-white/10 ${accent ? 'bg-emerald-500/10' : 'bg-white/5'} p-4`}>
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${accent ? 'text-emerald-300' : 'text-slate-100'}`}>{value}</div>
    </div>
  );
}

function TaxSummary({ totals }) {
  return (
    <aside className="sticky top-6 space-y-3">
      <h3 className="text-lg font-semibold tracking-tight">Summary</h3>
      <Stat label="Total Income" value={formatCurrency(totals.totalIncome)} />
      <Stat label="Total Expenses" value={formatCurrency(totals.totalExpense)} />
      <Stat label="Taxable Amount" value={formatCurrency(totals.totalTaxable)} />
      <Stat label="Estimated Tax Owed" value={formatCurrency(totals.totalTaxOwed)} accent />
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="text-xs uppercase tracking-wide text-slate-400">Effective Tax Rate</div>
        <div className="mt-1 text-lg font-semibold text-slate-100">{(totals.effectiveRate || 0).toFixed(2)}%</div>
      </div>
      <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
        Tip: Adjust Tax % per row to reflect different jurisdictions or client-specific rates.
      </div>
    </aside>
  );
}

export default TaxSummary;
