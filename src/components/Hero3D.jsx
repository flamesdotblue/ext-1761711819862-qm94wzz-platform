import Spline from '@splinetool/react-spline';

function Hero3D() {
  return (
    <section className="relative h-[520px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Excel-like Tax Workbook for Consultants
          </h1>
          <p className="mt-3 text-slate-300 sm:text-lg">
            A modern, glass-morphic dashboard to track client revenue, expenses, and tax liabilities with CSV import/export.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero3D;
