import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="container mx-auto mt-4">
        {renderPage()}
      </main>
    </Layout>
  );
};

export default App;