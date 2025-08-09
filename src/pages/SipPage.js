import {React, useState, useEffect} from "react";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Sidebar";
import TimePeriod from "../components/TimePeriod";
import IndexDataRibbon from "../components/IndexDataRibbon";
import StocksInfo from "../components/StocksInfo";
import SearchBar from "../components/SearchBar";

export default function SipPage() {
    

    return (
        <div className="d-flex min-vh-100">
            <Sidebar />
            <div className="flex-grow-1 bg-white p-4">
                <TimePeriod />
                <IndexDataRibbon />
                SIP PAGE!
            </div>
        </div>
    )
}  