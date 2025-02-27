"use client";

import { useState, useEffect } from "react";
import { useUI } from "@/context/UIContext";

const Clock = () => {
  const { showClock, setShowClock, clockFormat } = useUI();

  // Compute initial time immediately
  const getFormattedTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    if (clockFormat === "12") {
      hours = hours % 12 || 12;
    }
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const [time, setTime] = useState(getFormattedTime());

  useEffect(() => {
    const uiPreferences = JSON.parse(
      localStorage.getItem("uiPreferences") || "{}"
    );
    // Set clock visibility based on stored preferences
    setShowClock(uiPreferences.isClockHidden !== true);

    const updateTime = () => {
      setTime(getFormattedTime());
    };

    updateTime();
    const timerId = setInterval(updateTime, 60000);
    return () => clearInterval(timerId);
  }, [clockFormat, setShowClock]);

  if (!showClock) return null;

  return <div className="fixed text-6xl font-semibold">{time}</div>;
};

export default Clock;
