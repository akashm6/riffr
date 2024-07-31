import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import TrackerPage from "./pages/tracker";

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<LoginPage/>} />
      <Route path = '/tracker' element = {<TrackerPage/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App