import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          © {new Date().getFullYear()} Esame KB
        </div>
        
        <div className="text-sm">
          <a 
            href="https://www.zapt.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Made on ZAPT
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;