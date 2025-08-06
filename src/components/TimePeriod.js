import React, { useState, useEffect } from "react";

function getPeriodFromTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
  const period = Math.floor(totalSeconds / 20) + 1;
  return period;
}

export default function TimePeriod() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTime]);

  return (
    <div className="d-flex justify-content-end text-end mb-2">
      <small className="text-muted">
        <span>Period: {getPeriodFromTime()}</span>
        <span className="mx-2">|</span>
        <span>Time: {currentTime.toLocaleTimeString()}</span>
      </small>
    </div>
  );
}