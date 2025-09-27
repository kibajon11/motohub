export default function Footer() {
  return (
    <footer className="mt-10">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-900/60 p-5 text-sm text-white/70">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MotoHub. All rights reserved.</p>
          <p className="text-white/60">Pattaya • Thailand</p>
        </div>
      </div>
    </footer>
  );
}
