import React from 'react';
import {Routes, Route} from "react-router-dom"
import BizWatchVote from './pages/bizwatchVote';
import BizwatchResult from './pages/bizwatchResult';


function App() {
  return (
    <div>
    <Routes>
      <Route path="/" element={<BizWatchVote/>} />
      <Route path="/result" element={<BizwatchResult/>} />
    </Routes>
    </div>
  );
}

export default App;
