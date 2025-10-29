import { useRef } from 'react';

function toCSV(rows) {
  const headers = ['date', 'client', 'income', 'expense', 'rate', 'notes'];
  const escape = (v) => {
    if (v == null) return '';
    const s = String(v);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(headers.map((h) => escape(r[h])).join(','));
  }
  return lines.join('\n');
}

function parseCSV(text) {
  // Simple CSV parser for common cases; expects header line.
  const lines = text.replace(/\r/g, '').split('\n').filter(Boolean);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const required = ['date', 'client', 'income', 'expense', 'rate', 'notes'];
  const mapIndex = {};
  for (const key of required) {
    const idx = headers.indexOf(key);
    mapIndex[key] = idx;
  }
  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const row = [];
    let cur = '';
    let inQuotes = false;
    const push = () => row.push(cur);
    for (let j = 0; j < lines[i].length; j++) {
      const ch = lines[i][j];
      if (ch === '"') {
        if (inQuotes && lines[i][j + 1] === '"') {
          cur += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        push();
        cur = '';
      } else {
        cur += ch;
      }
    }
    push();

    const get = (key) => {
      const idx = mapIndex[key];
      if (idx == null || idx === -1) return '';
      return (row[idx] || '').trim();
    };

    const income = get('income').replace(/,/g, '');
    const expense = get('expense').replace(/,/g, '');
    const rate = get('rate').replace(/%/g, '').replace(/,/g, '');

    out.push({
      id: crypto.randomUUID(),
      date: get('date'),
      client: get('client'),
      income: income,
      expense: expense,
      rate: rate,
      notes: get('notes'),
    });
  }
  return out;
}

function ImportExport({ rows, onImport }) {
  const fileRef = useRef(null);

  const handleExport = () => {
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tax_workbook.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpen = () => fileRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCSV(text);
    if (parsed.length === 0) {
      alert('No rows parsed from CSV. Ensure headers: date, client, income, expense, rate, notes');
      return;
    }
    onImport(parsed);
    e.target.value = '';
  };

  return (
    <div className="flex gap-2">
      <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
      <button onClick={handleOpen} className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600">
        Import CSV
      </button>
      <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600">
        Export CSV
      </button>
    </div>
  );
}

export default ImportExport;
