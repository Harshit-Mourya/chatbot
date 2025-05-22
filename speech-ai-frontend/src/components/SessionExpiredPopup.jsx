import React from "react";
import "./SessionExpiredPopup.css";

export default function SessionExpiredPopup({ onLogin, onContinue }) {
  return (
    <div className="session-expired-overlay">
      <div className="session-expired-popup">
        <p style={{ fontWeight: "bold" }}>
          <i className="fa-solid fa-triangle-exclamation"></i>&nbsp;Session
          expired!
        </p>
        <p>
          Please&nbsp;
          <span
            className="clickable"
            onClick={onLogin}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter") onLogin();
            }}
          >
            log in
          </span>{" "}
          again or
        </p>
        <p>
          <span
            className="clickable"
            onClick={onContinue}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter") onContinue();
            }}
          >
            continue
          </span>{" "}
          without login.
        </p>
      </div>
    </div>
  );
}
