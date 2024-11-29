import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import BrokerList from "./components/BrokerList";
import StocksList from "./components/StocksList";
import TradingComponent from "./components/TradingComponent";

function App() {
  return (
      <Router>
          <div>
              <header>
                  <h1>Биржа акций</h1>
                  <nav className="nav-buttons">
                      <Link to="/brokers">Брокеры</Link>
                      <Link to="/stocks">Список акций</Link>
                      <Link to="/trades">Торги</Link>
                  </nav>
              </header>

              <div className="main-content">
                  <Routes>
                      <Route path="/" element={<Navigate to="/brokers" replace />}/>
                      <Route path="/brokers" element={<BrokerList />}/>
                      <Route path="/stocks" element={<StocksList />}/>
                      <Route path="/trades" element={<TradingComponent />}/>
                  </Routes>
              </div>
          </div>
      </Router>
  );
}

export default App;
