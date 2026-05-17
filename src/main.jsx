import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Storage polyfill — usa localStorage en la PWA
if (!window.storage) {
  window.storage = {
    get: (key) => {
      try {
        const value = localStorage.getItem(key);
        return Promise.resolve(value ? { key, value } : null);
      } catch {
        return Promise.resolve(null);
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, value);
        return Promise.resolve({ key, value });
      } catch {
        return Promise.resolve(null);
      }
    },
    delete: (key) => {
      try {
        localStorage.removeItem(key);
        return Promise.resolve({ key, deleted: true });
      } catch {
        return Promise.resolve(null);
      }
    },
    list: (prefix) => {
      try {
        const keys = Object.keys(localStorage).filter(k => !prefix || k.startsWith(prefix));
        return Promise.resolve({ keys });
      } catch {
        return Promise.resolve({ keys: [] });
      }
    }
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
