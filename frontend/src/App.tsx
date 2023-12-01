import React from "react";
import Home from "./components/Home";
import ResponsiveAppBar from "./components/NavigationBar";

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />
      <Home />
    </div>
  );
}

export default App;
