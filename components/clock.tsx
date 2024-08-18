"use client";

import { useState, useEffect } from "react";
import { useUI } from "@/context/UIContext";

const Clock = () => {
  const [time, setTime] = useState("");
  const { showClock, setShowClock, clockFormat } = useUI();

  useEffect(() => {
    const uiPreferences = JSON.parse(
      localStorage.getItem("uiPreferences") || "{}"
    );

    if (uiPreferences.isClockHidden === true) {
      setShowClock(false);
    } else {
      setShowClock(true);
    }

    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");

      let formattedTime = "";

      if (clockFormat === "12") {
        hours = hours % 12 || 12;
      }

      formattedTime = `${hours.toString().padStart(2, "0")}:${minutes}`;

      setTime(formattedTime);
    };

    updateTime();
    const timerId = setInterval(updateTime, 60000);

    return () => clearInterval(timerId);
  }, [clockFormat]);

  if (!showClock) return null;

  return <div className="fixed text-6xl font-semibold">{time}</div>;
};

export default Clock;
