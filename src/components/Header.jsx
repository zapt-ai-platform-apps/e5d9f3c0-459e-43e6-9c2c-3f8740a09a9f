import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Esame KB
        </Link>
        
        {!isHomePage && (
          <Link to="/" className="btn-outline text-sm">
            Torna alla Home
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;