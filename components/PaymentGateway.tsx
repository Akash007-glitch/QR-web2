
import React, { useState } from 'react';

interface PaymentGatewayProps {
  total: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ total, onConfirm, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirm();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-lg">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-stone-800">Secure Payment</h2>
          <button onClick={onCancel} className="text-stone-400 hover:text-stone-800">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="bg-stone-50 rounded-2xl p-6 mb-8 border border-stone-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-stone-500 font-medium">Order Total</span>
            <span className="text-2xl font-black text-amber-600">${total.toFixed(2)}</span>
          </div>
          <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">LUMIÈRE BISTRO #4029</div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <button className="flex items-center justify-center space-x-2 py-4 bg-black text-white rounded-xl font-bold hover:bg-stone-800 transition-all">
               <i className="fab fa-apple text-xl"></i>
               <span>Apple Pay</span>
             </button>
             <button className="flex items-center justify-center space-x-2 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
               <i className="fab fa-google text-xl"></i>
               <span>G Pay</span>
             </button>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-stone-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase font-bold text-stone-300 bg-white px-2">or card</div>
          </div>

          <div className="space-y-3">
            <input type="text" placeholder="Card Number" className="w-full p-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all font-mono" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="MM/YY" className="p-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all font-mono" />
              <input type="text" placeholder="CVC" className="p-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all font-mono" />
            </div>
          </div>
        </div>

        <button 
          onClick={handlePay}
          disabled={isProcessing}
          className={`w-full mt-8 py-5 rounded-2xl font-black text-lg shadow-xl transition-all ${
            isProcessing ? 'bg-stone-200 text-stone-400' : 'bg-amber-600 text-white hover:bg-amber-700 hover:scale-[1.02] shadow-amber-200'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-3">
              <i className="fas fa-circle-notch fa-spin"></i>
              <span>Processing...</span>
            </div>
          ) : (
            `Pay $${total.toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentGateway;
