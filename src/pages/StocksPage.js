import {React, useState, useEffect} from "react";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Sidebar";
import TimePeriod from "../components/TimePeriod";
import IndexDataRibbon from "../components/IndexDataRibbon";
import StocksInfo from "../components/StocksInfo";

export default function StocksPage() {
    return (
        <div className="d-flex min-vh-100">
            <Sidebar />
            <div className="flex-grow-1 bg-white p-4">
                <TimePeriod />
                <IndexDataRibbon />
                <StocksInfo />
            </div>
        </div>
    )
}  