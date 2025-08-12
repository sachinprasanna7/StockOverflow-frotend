import React, { useState, useEffect } from "react";

function getPeriodFromTime() {
  const now = new Date();
   now.setHours(now.getHours() - 5);
  now.setMinutes(now.getMinutes() - 30);
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
  const period = Math.floor(totalSeconds / 20) + 1;
  return period;
}

export default function TimePeriod() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentIST, setCurrentIST] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      // set current time, subtracted by 5 hours and 30 minutes
      const now = new Date();
      now.setHours(now.getHours() - 5);
      now.setMinutes(now.getMinutes() - 30);
      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      // set current IST time
      const now = new Date();
      setCurrentIST(now);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="d-flex justify-content-end text-end mb-2">
      <small className="text-muted">
        <span>Period: {getPeriodFromTime()}</span>
        <span className="mx-2">|</span>
        <span>StockTime: {currentTime.toLocaleTimeString()}</span>
        <span className="mx-2">|</span>
        <span>IST: {currentIST.toLocaleTimeString()}</span>
      </small>
    </div>
  );
}