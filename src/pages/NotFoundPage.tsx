import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";

export default function NotFoundPage() {
  return (
    <Card className="space-y-3 text-center">
      <h1 className="text-2xl font-bold">Halaman tidak ditemukan</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Alamat yang kamu buka tidak tersedia.
      </p>
      <Link
        to="/"
        className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
      >
        Kembali ke beranda
      </Link>
    </Card>
  );
}
