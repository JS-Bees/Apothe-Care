import React from "react";
import Home from "./components/Home";
import About from "./components/About";
import TopDonor from "./components/TopDonor";

function App() {
  return (
    <div className="App">
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
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/about" element={<About />} />
//           <Route path="/topdonors" element={<TopDonor />} />
//           <Route path="/" element={<Home />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
