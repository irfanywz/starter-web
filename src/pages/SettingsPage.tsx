import { useEffect, useState } from "react";
import { IconDownload, IconTrash } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { env } from "@/lib/env";
import { downloadText } from "@/lib/download";
import { clearLogs, formatLogs, getLogs } from "@/lib/logger";
import { isStoragePersisted, requestPersistentStorage } from "@/lib/storage";
import { useThemeStore, type ThemeMode } from "@/stores/useThemeStore";
import { toast } from "@/stores/useToastStore";

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "Ikuti sistem" },
  { value: "light", label: "Terang" },
  { value: "dark", label: "Gelap" },
];

export default function SettingsPage() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [logCount, setLogCount] = useState(0);

  useEffect(() => {
    void isStoragePersisted().then(setPersisted);
    void getLogs().then((logs) => setLogCount(logs.length));
  }, []);

  const handleRequestPersist = async () => {
    const ok = await requestPersistentStorage();
    setPersisted(ok);
    if (ok) toast.success("Penyimpanan persisten aktif");
    else toast.warning("Browser belum mengizinkan penyimpanan persisten");
  };

  const handleDownloadLogs = async () => {
    const logs = await getLogs();
    if (logs.length === 0) {
      toast.info("Belum ada log");
      return;
    }
    const date = new Date().toISOString().slice(0, 10);
    downloadText(
      `${env.appName.toLowerCase().replace(/\s+/g, "-")}-log-${date}.txt`,
      formatLogs(logs),
    );
  };

  const handleClearLogs = async () => {
    await clearLogs();
    setLogCount(0);
    toast.info("Log dihapus");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pengaturan</h1>

      <Card className="space-y-3">
        <h2 className="font-semibold">Tampilan</h2>
        <label className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-600 dark:text-slate-400">Tema</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as ThemeMode)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900"
          >
            {themeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold">Penyimpanan</h2>
        {persisted === null && <p className="text-sm text-slate-500">Memeriksa...</p>}
        {persisted === true && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            Aktif. Browser tidak akan menghapus data secara otomatis.
          </p>
        )}
        {persisted === false && (
          <div className="space-y-3">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Belum aktif. Browser bisa menghapus data saat penyimpanan hampir penuh.
            </p>
            <Button onClick={() => void handleRequestPersist()}>Minta izin penyimpanan</Button>
          </div>
        )}
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold">Log aplikasi</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{logCount} entri tersimpan.</p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<IconDownload size={16} />}
            onClick={() => void handleDownloadLogs()}
          >
            Unduh log
          </Button>
          <Button
            variant="danger"
            icon={<IconTrash size={16} />}
            onClick={() => void handleClearLogs()}
          >
            Hapus log
          </Button>
        </div>
      </Card>

      <Card className="space-y-1 text-sm">
        <h2 className="mb-2 font-semibold">Tentang</h2>
        <p>
          {env.appName} versi {env.version}
        </p>
      </Card>
    </div>
  );
}
