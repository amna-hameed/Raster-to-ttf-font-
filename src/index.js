import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Use `react-dom/client`
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Correct React 18 syntax
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
