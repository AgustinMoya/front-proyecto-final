import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import * as serviceWorker from "./serviceWorker";

import App from "./components/App";
import Firebase, { FirebaseContext } from "./components/Firebase";
import PlatformProvider from "./components/Platform/context";

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <PlatformProvider>
      <App />
    </PlatformProvider>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
