// src/components/Snowflakes.tsx
import React from "react"

const FLAKES = new Array(18).fill(0)

export function Snowflakes() {
  return (
    <div className="snow-container">
      {FLAKES.map((_, i) => (
        <div key={i} className="snowflake">
          {/* ❄️ Copo de nieve en SVG (simple pero bonito) */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <g
              fill="none"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="2.2" />
              <line x1="12" y1="1.5" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22.5" />

              <line x1="4.2" y1="4.2" x2="7.2" y2="7.2" />
              <line x1="16.8" y1="16.8" x2="19.8" y2="19.8" />

              <line x1="1.5" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22.5" y2="12" />

              <line x1="4.2" y1="19.8" x2="7.2" y2="16.8" />
              <line x1="16.8" y1="7.2" x2="19.8" y2="4.2" />
            </g>
          </svg>
        </div>
      ))}
    </div>
  )
}
