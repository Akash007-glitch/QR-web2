
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Customer' | 'Kitchen'>('Customer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: `${name.toLowerCase()}@example.com`,
      role: role
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
            <i className="fas fa-mug-hot"></i>
          </div>
          <h1 className="text-2xl font-bold text-stone-800">Welcome to Lumière</h1>
          <p className="text-stone-500">Please identify yourself to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Your Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Who are you today?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('Customer')}
                className={`py-3 rounded-xl font-bold text-sm transition-all border ${
                  role === 'Customer' 
                  ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-100' 
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <i className="fas fa-user-circle mr-2"></i>
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('Kitchen')}
                className={`py-3 rounded-xl font-bold text-sm transition-all border ${
                  role === 'Kitchen' 
                  ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-100' 
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <i className="fas fa-hat-chef mr-2"></i>
                Kitchen Staff
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors shadow-lg"
          >
            Start Experience
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
