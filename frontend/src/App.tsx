import React from "react";
import Home from "./components/Home";
import About from "./components/About";
import TopDonor from "./components/TopDonor";
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

// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Home from "./components/Home";
// import About from "./components/About";
// import TopDonor from "./components/TopDonor";

// function App() {
//   return (
//       <Routes>
//       <Route path="/" element={<Home />} />
//         <Route path="about" element={<About />} />
//         <Route path="topdonors" element={<TopDonor />} />
//       </Routes>
//   );
// }

// export default App;
