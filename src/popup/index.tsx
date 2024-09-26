import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App/App";
import AuthProvider from "../context/AuthProvider";
import SettingsProvider from "../context/SettingsContext";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <AuthProvider>
            <SettingsProvider>
                <App />
            </SettingsProvider>
        </AuthProvider>
    </React.StrictMode>
);
