import { env } from "@/lib/env";

export default function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tentang Aplikasi</h1>
      <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="font-medium text-slate-500 dark:text-slate-400">Nama</dt>
        <dd>{env.appName}</dd>
        <dt className="font-medium text-slate-500 dark:text-slate-400">Versi</dt>
        <dd>{env.version}</dd>
        <dt className="font-medium text-slate-500 dark:text-slate-400">Mode</dt>
        <dd>{env.mode}</dd>
      </dl>
    </div>
  );
}
