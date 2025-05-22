import React from "react";
import { useNavigate } from "react-router-dom";
import "./BackButton.css";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <div className="back-button" onClick={() => navigate(-1)}>
      <i className="fa-solid fa-arrow-left"></i>
    </div>
  );
}
