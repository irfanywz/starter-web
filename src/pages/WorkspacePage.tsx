import { useEffect } from "react";
import { IconFile, IconFolder, IconFolderOpen, IconRefresh, IconTrash } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";

export default function WorkspacePage() {
  const status = useWorkspaceStore((s) => s.status);
  const handle = useWorkspaceStore((s) => s.handle);
  const entries = useWorkspaceStore((s) => s.entries);
  const { init, chooseFolder, grantAccess, refresh, forget } = useWorkspaceStore();

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Workspace</h1>

      {status === "unsupported" && (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Browser ini belum mendukung akses folder. Gunakan Google Chrome atau Microsoft Edge.
          </p>
        </Card>
      )}

      {status === "empty" && (
        <Card className="space-y-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Belum ada folder yang dipilih.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => void chooseFolder()} icon={<IconFolderOpen size={16} />}>
              Pilih folder
            </Button>
          </div>
        </Card>
      )}

      {status === "needs-permission" && (
        <Card className="space-y-4">
          <p className="text-sm">
            Folder terakhir: <strong>{handle?.name}</strong>
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Browser meminta izin ulang setelah aplikasi dibuka kembali.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => void grantAccess()}>Berikan akses</Button>
            <Button variant="secondary" onClick={() => void forget()}>
              Lupakan folder
            </Button>
          </div>
        </Card>
      )}

      {status === "ready" && (
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">{handle?.name}</p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                icon={<IconRefresh size={16} />}
                onClick={() => void refresh()}
              >
                Muat ulang
              </Button>
              <Button
                variant="secondary"
                icon={<IconFolderOpen size={16} />}
                onClick={() => void chooseFolder()}
              >
                Ganti folder
              </Button>
              <Button variant="danger" icon={<IconTrash size={16} />} onClick={() => void forget()}>
                Lupakan
              </Button>
            </div>
          </div>

          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {entries.length === 0 && (
              <li className="py-2 text-sm text-slate-400 dark:text-slate-500">Folder kosong.</li>
            )}
            {entries.map((entry) => (
              <li key={entry.name} className="flex items-center gap-3 py-2 text-sm">
                {entry.kind === "directory" ? (
                  <IconFolder size={18} className="text-amber-500" />
                ) : (
                  <IconFile size={18} className="text-slate-400" />
                )}
                {entry.name}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
