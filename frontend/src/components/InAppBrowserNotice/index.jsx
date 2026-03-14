import { useState, useEffect } from "react";
import { ExternalLink, X } from "lucide-react";
import { isInAppBrowser } from "../../utils/browserDetection";
import "./style.css";

export default function InAppBrowserNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show only if in-app browser and not manually closed in this session
    const isClosed = sessionStorage.getItem("atelie_inapp_notice_closed");
    if (isInAppBrowser() && !isClosed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("atelie_inapp_notice_closed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="in-app-notice">
      <div className="container notice-content">
        <div className="notice-text">
          <ExternalLink size={18} className="notice-icon" />
          <p>
            Para uma melhor experiência (e login rápido), toque nos <strong>três pontos (⋮ ou ⋯)</strong> e selecione <strong>"Abrir no navegador"</strong>.
          </p>
        </div>
        <button className="notice-close" onClick={handleClose} aria-label="Fechar aviso">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
