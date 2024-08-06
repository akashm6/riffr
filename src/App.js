import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import NumArtistsPage from "./pages/num_artists";
import TopArtistsPage from "./pages/topartists";
import AboutPage from "./pages/about";
import ConcertInfoPage from "./pages/concertinfopage";

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<LoginPage/>} />
      <Route path = '/num_artists' element = {<NumArtistsPage/>} />
      <Route path = '/top_artists' element = {<TopArtistsPage/>} />
      <Route path = '/about' element = {<AboutPage/>} />
      <Route path = '/concerts/:artistName' element = {<ConcertInfoPage/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
