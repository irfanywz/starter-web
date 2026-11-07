import { HashRouter, Route, Routes } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import WorkspacePage from "@/pages/WorkspacePage";
import SettingsPage from "@/pages/SettingsPage";
import AboutPage from "@/pages/AboutPage";
import NotFoundPage from "@/pages/NotFoundPage";

/**
 * HashRouter dipakai supaya routing tetap jalan saat build dibuka
 * langsung dari file:// atau disajikan di subfolder mana pun.
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<WorkspacePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
