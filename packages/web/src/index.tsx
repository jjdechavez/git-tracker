/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { StorageProvider } from "./providers/storage";

const root = document.getElementById("root");

render(
  () => (
    <StorageProvider>
      <App />
    </StorageProvider>
  ),
  root!
);
