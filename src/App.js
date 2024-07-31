import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import NumArtistsPage from "./pages/num_artists";

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<LoginPage/>} />
      <Route path = '/num_artists' element = {<NumArtistsPage/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
