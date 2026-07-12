import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './index.css'
import LandingPage from './LandingPage.jsx'
import HomePage from "./HomePage.jsx";
import CommunityPage from "./CommunityPage.jsx"
import TrackPage from "./TrackPage.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/track" element = {<TrackPage />}/>
              <Route path="/community" element = {<CommunityPage />}/>
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
