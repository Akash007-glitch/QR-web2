
import React from 'react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onClear: () => void;
  onCheckout: () => void;
  isProcessing: boolean;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onClear,
  onCheckout,
  isProcessing
}) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal * 1.08;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-white rounded-t-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mt-4 mb-2"></div>
        
        <div className="px-6 py-4 flex items-center justify-between border-b border-stone-50">
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">Your Tray</h2>
          <div className="flex items-center space-x-2">
            {items.length > 0 && (
              <button 
                onClick={onClear}
                className="px-3 py-2 text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-xl transition-colors"
              >
                Clear All
              </button>
            )}
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto px-6 py-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="text-stone-200"><i className="fas fa-shopping-basket text-6xl"></i></div>
              <p className="text-stone-400 font-bold">Your tray is empty</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-stone-800 text-lg leading-tight">{item.name}</h4>
                    <p className="text-amber-600 font-bold text-sm">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center bg-stone-100 rounded-xl p-1">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-stone-600 shadow-sm active:scale-90"
                    >
                      <i className="fas fa-minus text-xs"></i>
                    </button>
                    <span className="w-8 text-center font-black text-stone-800">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-stone-600 shadow-sm active:scale-90"
                    >
                      <i className="fas fa-plus text-xs"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-stone-50 space-y-4 rounded-t-3xl border-t border-stone-100">
            <div className="flex justify-between items-center text-lg font-black text-stone-800">
              <span>Total with Tax</span>
              <span className="text-2xl text-amber-600">${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={onCheckout}
              disabled={isProcessing}
              className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center space-x-3 shadow-xl transition-all ${
                isProcessing ? 'bg-stone-300' : 'bg-stone-900 text-white active:scale-95'
              }`}
            >
              {isProcessing ? <i className="fas fa-spinner fa-spin"></i> : <span>Place Order</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
