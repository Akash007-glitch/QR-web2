
import React from 'react';
import { ViewType } from '../types';

interface HeaderProps {
  view: ViewType;
  setView: (v: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ view, setView }) => {
  return (
    <header className="bg-white border-b border-stone-100 sticky top-0 z-50 px-4 h-14 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white shadow-md">
          <i className="fas fa-mug-hot text-sm"></i>
        </div>
        <span className="text-lg font-black text-stone-800 tracking-tighter uppercase">Lumière</span>
      </div>

      <nav className="flex items-center bg-stone-100 p-1 rounded-full">
        <button 
          onClick={() => setView('Customer')}
          className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${view === 'Customer' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}
        >
          Menu
        </button>
        <button 
          onClick={() => setView('Kitchen')}
          className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${view === 'Kitchen' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}
        >
          Kitchen
        </button>
      </nav>
    </header>
  );
};

export default Header;
