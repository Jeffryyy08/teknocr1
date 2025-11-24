"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setTimeout(() => setShowBanner(true), 500);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-popup">
      <div className="cookie-box">
        <h3 className="cookie-title">🍪 Uso de Cookies</h3>

        <p className="cookie-text">
          Usamos cookies para mejorar tu experiencia, analizar tráfico y operar
          herramientas como Google Analytics.  
          Más detalles en nuestra{" "}
          <a href="/cookies" className="cookie-link">
            Política de Cookies
          </a>.
        </p>

        <div className="cookie-buttons">
          <button onClick={acceptCookies} className="cookie-accept">
            Aceptar
          </button>
          <button onClick={declineCookies} className="cookie-decline">
            Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}
