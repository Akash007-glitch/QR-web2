
import React from 'react';
import { Order } from '../types';

interface KitchenDashboardProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: Order['status']) => void;
  orderSuccess?: boolean;
}

const KitchenDashboard: React.FC<KitchenDashboardProps> = ({ orders, onUpdateStatus, orderSuccess }) => {
  const activeOrders = orders.filter(o => o.status !== 'Delivered')
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Success Message Banner */}
      {orderSuccess && (
        <div className="mb-6 animate-in slide-in-from-top duration-500">
          <div className="bg-green-500 text-white p-4 rounded-2xl flex items-center justify-center space-x-3 shadow-lg shadow-green-100">
            <i className="fas fa-check-circle text-xl"></i>
            <span className="font-black tracking-tight text-lg">Order successfully placed!</span>
          </div>
        </div>
      )}

      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-black text-stone-900 tracking-tighter">Active Orders</h1>
        <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">{activeOrders.length} tickets in queue</p>
      </div>

      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-300">
            <i className="fas fa-concierge-bell text-3xl"></i>
          </div>
          <p className="text-stone-400 font-bold">Waiting for new orders...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeOrders.map(order => (
            <div 
              key={order.id} 
              className={`bg-white rounded-[2rem] shadow-sm overflow-hidden flex flex-col border-2 transition-all duration-300 ${
                order.status === 'Pending' ? 'border-amber-400' : 
                order.status === 'Preparing' ? 'border-blue-500' : 'border-green-500'
              }`}
            >
              <div className={`p-5 flex justify-between items-center ${
                order.status === 'Pending' ? 'bg-amber-50' : 
                order.status === 'Preparing' ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                <div className="flex items-center space-x-3">
                   <div className="bg-white w-12 h-12 rounded-2xl flex flex-col items-center justify-center shadow-sm border border-stone-100">
                      <span className="text-[8px] font-black uppercase text-stone-400 leading-none">Table</span>
                      <span className="text-xl font-black text-stone-900 leading-none">{order.tableId}</span>
                   </div>
                   <div>
                     <p className="text-xs font-black text-stone-900">{order.id}</p>
                     <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
                       {Math.floor((Date.now() - order.timestamp) / 60000)}m ago
                     </p>
                   </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                  order.status === 'Pending' ? 'bg-amber-200 text-amber-700' :
                  order.status === 'Preparing' ? 'bg-blue-200 text-blue-700' : 'bg-green-200 text-green-700'
                }`}>
                  {order.status}
                </div>
              </div>
              
              <div className="p-5 flex-grow space-y-3">
                {order.items.map((item, idx) => (
                  <div key={`${order.id}-${item.id}-${idx}`} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-stone-100 rounded text-[10px] font-black text-stone-800">
                        {item.quantity}
                      </span>
                      <span className="font-bold text-stone-800 text-sm">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 pb-5">
                {order.status === 'Pending' && (
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'Preparing')}
                    className="w-full py-3 bg-amber-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md active:scale-95 transition-transform"
                  >
                    Start Preparation
                  </button>
                )}
                {order.status === 'Preparing' && (
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'Ready')}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md active:scale-95 transition-transform"
                  >
                    Set as Ready
                  </button>
                )}
                {order.status === 'Ready' && (
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'Delivered')}
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md active:scale-95 transition-transform"
                  >
                    Mark Served
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KitchenDashboard;
