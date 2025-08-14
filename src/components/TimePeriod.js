import React, { useState, useEffect } from "react";

function getPeriodFromTime() {
  const now = new Date();
  now.setHours(now.getHours() - 5);
  now.setMinutes(now.getMinutes() - 30);
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const period = Math.floor(totalSeconds / 20) + 1;
  return period;
}

export default function TimePeriod() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentIST, setCurrentIST] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      now.setHours(now.getHours() - 5);
      now.setMinutes(now.getMinutes() - 30);
      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIST(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="d-flex justify-content-end text-end mb-2">
        <small className="text-muted">
          <span>

            <button
              onClick={() => setShowModal(true)}
              style={{
                backgroundColor: "#113F67",
                color: "white",
                border: "none",
                padding: "2px 6px",
                marginRight: "3px",
                cursor: "pointer",
                borderRadius: "50%",
                fontSize: "12px",
                fontWeight: "bold",
                lineHeight: "1.2",
              }}
              title="What is a period?"
            >
              i
            </button>

            Period: {getPeriodFromTime()}

          </span>
          {/* <span className="mx-2">|</span>
          <span>StockTime: {currentTime.toLocaleTimeString()}</span> */}
          <span className="mx-2">|</span>
          <span>IST: {currentIST.toLocaleTimeString()}</span>
        </small>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5>What is a Period?</h5>
            <p>
              A <b>Period</b> is an artificial time segment of exactly{" "}
              <b>20 seconds</b>. As there are <b>86400 seconds</b> in a real life day, that calculates to <b>4320 periods</b> in one full
              real life day. A period is hence analogous to a real life trading day.
            </p>
            {/* <p> The feed
              simulates trading periods to analyze trends similar to real
              trading days.
            </p>
            <p>
              The dataset is derived from NYSE market data, converted to 1-second
              intervals. A full 24-hour cycle is made from 4 segments (two
              forward, two reverse) to avoid repetitive looping.
            </p> */}
            <div className="text-end">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
