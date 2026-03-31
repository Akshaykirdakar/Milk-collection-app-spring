import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { SaveAs } from "@mui/icons-material";

export default function MilkReportSettings({ onSettingsChange }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [heading, setHeading] = useState("Milk Collection Report");
  const [showFat, setShowFat] = useState(true);
  const [showClr, setShowClr] = useState(true);
  const [showSnf, setShowSnf] = useState(true);
  const [showRate, setShowRate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

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
        setMessageType("success");
        setLoading(false);
        if (onSettingsChange) onSettingsChange();
      })
      .catch(() => {
        setMessage("Failed to save settings");
        setMessageType("error");
        setLoading(false);
      });
  };

  return (
    <Paper
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        p: 3,
        mb: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: theme.palette.text.primary,
          fontWeight: "bold",
        }}
      >
        Report Settings
      </Typography>

      {loading && <CircularProgress />}

      <Stack spacing={2}>
        <TextField
          label="Report Heading"
          fullWidth
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          disabled={loading}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: theme.palette.text.primary,
              "& fieldset": {
                borderColor: theme.palette.divider,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={showFat}
                onChange={() => setShowFat(!showFat)}
                disabled={loading}
                sx={{
                  color: theme.palette.text.primary,
                }}
              />
            }
            label={
              <Typography sx={{ color: theme.palette.text.primary }}>
                Show Fat
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showClr}
                onChange={() => setShowClr(!showClr)}
                disabled={loading}
                sx={{
                  color: theme.palette.text.primary,
                }}
              />
            }
            label={
              <Typography sx={{ color: theme.palette.text.primary }}>
                Show CLR
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showSnf}
                onChange={() => setShowSnf(!showSnf)}
                disabled={loading}
                sx={{
                  color: theme.palette.text.primary,
                }}
              />
            }
            label={
              <Typography sx={{ color: theme.palette.text.primary }}>
                Show SNF
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showRate}
                onChange={() => setShowRate(!showRate)}
                disabled={loading}
                sx={{
                  color: theme.palette.text.primary,
                }}
              />
            }
            label={
              <Typography sx={{ color: theme.palette.text.primary }}>
                Show Rate
              </Typography>
            }
          />
        </Box>

        <Button
          variant="contained"
          onClick={saveSettings}
          disabled={loading}
          startIcon={<SaveAs />}
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? "#2563eb" : "#1d9bf0",
            "&:hover": {
              backgroundColor: theme.palette.mode === "dark" ? "#1d4ed8" : "#1b87cc",
            },
          }}
        >
          {t("saveSettings")}
        </Button>

        {message && (
          <Alert severity={messageType} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}
