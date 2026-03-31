import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function MilkReportSettings({ onSettingsChange }) {
  const { t } = useTranslation();
  const [heading, setHeading] = useState("Milk Collection Report");
  const [showFat, setShowFat] = useState(true);
  const [showClr, setShowClr] = useState(true);
  const [showSnf, setShowSnf] = useState(true);
  const [showRate, setShowRate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/reports/settings")
      .then((res) => {
        const s = res.data;
        setHeading(s.reportHeading);
        setShowFat(s.showFat);
        setShowClr(s.showClr);
        setShowSnf(s.showSnf);
        setShowRate(s.showRate);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const saveSettings = () => {
    setLoading(true);
    axios
      .post("/api/reports/settings", {
        reportHeading: heading,
        showFat,
        showClr,
        showSnf,
        showRate,
      })
      .then(() => {
        setMessage("Settings saved");
        setLoading(false);
        if (onSettingsChange) onSettingsChange();
      })
      .catch(() => {
        setMessage("Failed to save settings");
        setLoading(false);
      });
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 20, marginBottom: 30 }}>
      <h2>Report Settings</h2>
      {loading && <p>Loading...</p>}

      <div>
        <label>
          Report Heading:{" "}
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            style={{ width: 300 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 15 }}>
        <label>
          <input
            type="checkbox"
            checked={showFat}
            onChange={() => setShowFat(!showFat)}
          />
          Show Fat
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showClr}
            onChange={() => setShowClr(!showClr)}
          />
          Show CLR
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showSnf}
            onChange={() => setShowSnf(!showSnf)}
          />
          Show SNF
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showRate}
            onChange={() => setShowRate(!showRate)}
          />
          Show Rate
        </label>
      </div>

      <button
        onClick={saveSettings}
        style={{ marginTop: 20 }}
        disabled={loading}
      >
        {t('saveSettings')}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
