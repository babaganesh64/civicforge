'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BadgeCheck, Building2, ChevronRight, Factory, Landmark, MapPinned, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

interface PublicStats { totalChallenges: number; }

const stakeholders = [
  { title: 'Citizens', description: 'Raise issues, attach evidence, and follow every update.', icon: UsersRound, className: 'from-emerald-400/20 to-emerald-50 text-emerald-700', iconClass: 'bg-emerald-500' },
  { title: 'Government', description: 'Verify, prioritize, route, and monitor real outcomes.', icon: Landmark, className: 'from-blue-400/20 to-blue-50 text-blue-700', iconClass: 'bg-blue-600' },
  { title: 'Universities', description: 'Turn field challenges into student-led innovation projects.', icon: Building2, className: 'from-violet-400/20 to-violet-50 text-violet-700', iconClass: 'bg-violet-600' },
  { title: 'Industries', description: 'Contribute expertise, technology, and implementation capacity.', icon: Factory, className: 'from-orange-400/20 to-orange-50 text-orange-700', iconClass: 'bg-orange-500' },
];

export default function LandingPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['publicStats'],
    queryFn: async () => (await apiClient.get<{ data: PublicStats }>('/api/v1/public/stats')).data,
  });

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="CivicForge home">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-700 to-cyan-500 text-lg font-black text-white shadow-lg shadow-blue-500/20">CF</div>
          <div><p className="font-bold tracking-tight">CivicForge</p><p className="text-xs text-slate-500">Jharkhand civic innovation network</p></div>
        </Link>
        <div className="flex items-center gap-3"><Button variant="ghost" asChild className="hidden sm:inline-flex"><Link href="/login">Sign in</Link></Button><Button asChild><Link href="/register">Join CivicForge <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-14 pt-5 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:pb-20 lg:pt-10">
        <div className="relative isolate overflow-hidden rounded-3xl bg-slate-950 px-7 py-12 text-white shadow-2xl shadow-blue-950/20 sm:px-12 lg:py-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,.65),transparent_29%),radial-gradient(circle_at_80%_5%,rgba(99,102,241,.55),transparent_33%),linear-gradient(145deg,#072b55_0%,#071a33_57%,#101b3d_100%)]" />
          <div className="absolute -bottom-24 right-0 -z-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100"><Sparkles className="h-3.5 w-3.5" /> SIH 2026 · Government of Jharkhand</div>
          <h1 className="max-w-3xl text-4xl font-black leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">Your voice. <span className="text-cyan-300">Coordinated action.</span> Measurable change.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">CivicForge connects citizens, government, universities, and industry to transform local problems into accountable, high-impact solutions.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button size="lg" asChild className="bg-white text-blue-800 hover:bg-blue-50"><Link href="/register">Raise a civic challenge <ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button size="lg" variant="outline" asChild className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"><Link href="/login">Open your workspace</Link></Button></div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-sm text-blue-100"><span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-cyan-300" /> Verified workflow</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-300" /> Human-led decisions</span></div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
          <div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-blue-700">One civic ecosystem</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Who powers CivicForge?</h2></div><MapPinned className="h-9 w-9 text-blue-600" /></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">{stakeholders.map(({ title, description, icon: Icon, className, iconClass }) => <div key={title} className={`rounded-2xl border border-slate-100 bg-gradient-to-br p-4 ${className}`}><div className={`grid h-9 w-9 place-items-center rounded-lg text-white shadow-sm ${iconClass}`}><Icon className="h-5 w-5" /></div><h3 className="mt-4 font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{description}</p></div>)}</div>
          <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3 text-sm text-white"><span>Real problems</span><ChevronRight className="h-4 w-4 text-cyan-300" /><span>Real projects</span><ChevronRight className="h-4 w-4 text-cyan-300" /><span>Real impact</span></div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 sm:grid-cols-3 lg:px-8"><div><p className="text-sm font-semibold text-blue-700">The CivicForge workflow</p><h2 className="mt-2 text-2xl font-bold tracking-tight">From complaint to community outcome.</h2></div><div className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">01</span><div><h3 className="font-semibold">Report & verify</h3><p className="mt-1 text-sm text-slate-600">Evidence-backed submissions reach the right government review queue.</p></div></div><div className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-700">02</span><div><h3 className="font-semibold">Route & build</h3><p className="mt-1 text-sm text-slate-600">Verified challenges connect to capable academic and industry partners.</p></div></div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8"><div className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 px-7 py-9 text-white sm:px-10"><div className="flex flex-col justify-between gap-7 md:flex-row md:items-center"><div><p className="text-sm font-semibold text-blue-200">Live platform signal</p><p className="mt-2 text-4xl font-black tabular-nums">{isLoading ? '—' : (stats?.totalChallenges ?? 0).toLocaleString()}</p><p className="mt-1 text-sm text-blue-100">civic challenges registered on CivicForge</p></div><div className="max-w-xl border-l border-white/20 pl-0 md:pl-7"><p className="text-lg font-semibold">A practical bridge between public need and institutional capability.</p><p className="mt-2 text-sm leading-6 text-blue-100">Designed for transparent review, responsible collaboration, and visible impact across Jharkhand.</p></div></div></div></section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">CivicForge · Team Codex · Smart India Hackathon 2026</footer>
    </main>
  );
}
