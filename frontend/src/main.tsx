import React from "react";
import ReactDOM from "react-dom/client";

import "./validation/yupLocale";
import "./validation/yupMethods";

import App from "./app/App";
import { Provider } from "./components/ui/Provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
);
