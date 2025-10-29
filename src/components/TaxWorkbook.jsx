import { useMemo } from 'react';

const headers = [
  { key: 'date', label: 'Date' },
  { key: 'client', label: 'Client' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expense' },
  { key: 'rate', label: 'Tax %' },
  { key: 'taxOwed', label: 'Tax Owed' },
  { key: 'notes', label: 'Notes' },
];

function formatCurrency(n) {
  const v = Number(n) || 0;
  return v.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

function TaxWorkbook({ rows, onUpdateRow, onDeleteRow }) {
  const computed = useMemo(() => {
    return rows.map((r) => {
      const income = Number(r.income) || 0;
      const expense = Number(r.expense) || 0;
      const rate = (Number(r.rate) || 0) / 100;
      const taxable = Math.max(income - expense, 0);
      const taxOwed = taxable * rate;
      return { ...r, taxOwed };
    });
  }, [rows]);

  const handleChange = (id, key, value) => {
    if (key === 'income' || key === 'expense' || key === 'rate') {
      // Normalize numeric input
      const normalized = value.replace(/,/g, '');
      onUpdateRow(id, { [key]: normalized });
    } else {
      onUpdateRow(id, { [key]: value });
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              {headers.map((h) => (
                <th key={h.key} className="px-3 py-3 font-medium">{h.label}</th>
              ))}
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {computed.length === 0 && (
              <tr>
                <td colSpan={headers.length + 1} className="px-3 py-8 text-center text-slate-400">
                  No rows yet. Click "Add Row" to begin.
                </td>
              </tr>
            )}
            {computed.map((row) => (
              <tr key={row.id} className="border-t border-white/10 hover:bg-white/5">
                {/* Date */}
                <td className="px-3 py-2">
                  <input
                    type="date"
                    value={row.date || ''}
                    onChange={(e) => handleChange(row.id, 'date', e.target.value)}
                    className="w-full rounded-md bg-slate-900/60 px-2 py-1.5 text-slate-100 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-emerald-400"
                  />
                </td>
                {/* Client */}
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={row.client || ''}
                    onChange={(e) => handleChange(row.id, 'client', e.target.value)}
                    placeholder="Client name"
                    className="w-full rounded-md bg-slate-900/60 px-2 py-1.5 text-slate-100 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-emerald-400"
                  />
                </td>
                {/* Income */}
                <td className="px-3 py-2">
                  <input
                    inputMode="decimal"
                    type="text"
                    value={row.income ?? ''}
                    onChange={(e) => handleChange(row.id, 'income', e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-md bg-slate-900/60 px-2 py-1.5 text-right text-slate-100 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-emerald-400"
                  />
                </td>
                {/* Expense */}
                <td className="px-3 py-2">
                  <input
                    inputMode="decimal"
                    type="text"
                    value={row.expense ?? ''}
                    onChange={(e) => handleChange(row.id, 'expense', e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-md bg-slate-900/60 px-2 py-1.5 text-right text-slate-100 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-emerald-400"
                  />
                </td>
                {/* Rate */}
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <input
                      inputMode="decimal"
                      type="text"
                      value={row.rate ?? ''}
                      onChange={(e) => handleChange(row.id, 'rate', e.target.value)}
                      placeholder="0"
                      className="w-full rounded-md bg-slate-900/60 px-2 py-1.5 text-right text-slate-100 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-emerald-400"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                </td>
                {/* Tax Owed (computed) */}
                <td className="px-3 py-2 text-right font-medium text-emerald-300">
                  {formatCurrency(row.taxOwed)}
                </td>
                {/* Notes */}
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={row.notes || ''}
                    onChange={(e) => handleChange(row.id, 'notes', e.target.value)}
                    placeholder="Notes"
                    className="w-full rounded-md bg-slate-900/60 px-2 py-1.5 text-slate-100 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-emerald-400"
                  />
                </td>
                {/* Actions */}
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => onDeleteRow(row.id)}
                    className="rounded-md bg-rose-500/90 px-2 py-1 text-xs font-medium text-white hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaxWorkbook;
