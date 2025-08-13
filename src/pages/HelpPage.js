import React from "react";
import Sidebar from "../components/Sidebar";
import TimePeriod from "../components/TimePeriod";
import IndexDataRibbon from "../components/IndexDataRibbon";
import ChatBot from "../components/ChatBot";

export default function HelpPage() {

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 bg-white p-4">
              <TimePeriod />
              <ChatBot />
      </div>
    </div>

  );
}
