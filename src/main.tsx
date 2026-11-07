import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import ErrorBoundary from "@/components/feedback/ErrorBoundary";
import { env } from "@/lib/env";
import { installGlobalErrorHandlers, logger } from "@/lib/logger";
import { requestPersistentStorage } from "@/lib/storage";
import { initTheme } from "@/lib/theme";
import "@/index.css";

initTheme();
installGlobalErrorHandlers();
document.title = env.appName;

void requestPersistentStorage().then((ok) => {
  logger.info(ok ? "Penyimpanan persisten aktif" : "Penyimpanan persisten belum aktif");
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
