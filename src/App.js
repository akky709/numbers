import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Numbers3Page from './pages/Numbers3Page';
import Numbers4Page from './pages/Numbers4Page';
import AboutPage from './pages/AboutPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/numbers3" element={<Numbers3Page />} />
          <Route path="/numbers4" element={<Numbers4Page />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;