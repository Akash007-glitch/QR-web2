
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CartSidebar from './components/CartSidebar';
import KitchenDashboard from './components/KitchenDashboard';
import { MenuItem, CartItem, Order, ViewType, Category } from './types';
import { MENU_ITEMS, TABLES } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('Customer');
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [qrModalData, setQrModalData] = useState<{ tableId: string; customBaseUrl: string } | null>(null);

  // QR Code Connection Logic: Check URL for ?table=X
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableFromUrl = params.get('table');
    if (tableFromUrl && TABLES.includes(tableFromUrl)) {
      setActiveTable(tableFromUrl);
    }
  }, []);

  // Persistence (Simulates a Shared Database via LocalStorage)
  useEffect(() => {
    const saved = localStorage.getItem('lumiere_live_orders_v3');
    if (saved) setOrders(JSON.parse(saved));

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lumiere_live_orders_v3' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('lumiere_live_orders_v3', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (orderSuccess) {
      const timer = setTimeout(() => setOrderSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [orderSuccess]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (!existing) return prev;
      const newQty = existing.quantity + delta;
      return newQty <= 0 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, quantity: newQty } : i);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = () => {
    if (!activeTable || cart.length === 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const newOrder: Order = {
        id: `ORD-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        tableId: activeTable,
        items: [...cart],
        status: 'Pending',
        timestamp: Date.now(),
        total: subtotal * 1.08,
        userName: "Guest"
      };

      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setIsProcessing(false);
      setIsCartOpen(false);

      setView('Kitchen');
      setOrderSuccess(true);
    }, 800);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return MENU_ITEMS;
    return MENU_ITEMS.filter(i => i.category === activeCategory);
  }, [activeCategory]);

  const testQRImageUrl = useMemo(() => {
    if (!qrModalData) return null;
    const finalUrl = `${qrModalData.customBaseUrl}?table=${qrModalData.tableId}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(finalUrl)}`;
  }, [qrModalData]);

  if (!activeTable && view === 'Customer') {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-500 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-500 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-20 h-20 bg-amber-600 rounded-[2.5rem] flex items-center justify-center text-white text-3xl mb-8 shadow-2xl animate-bounce relative z-10">
          <i className="fas fa-qrcode"></i>
        </div>

        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter relative z-10">Lumière Bistro</h1>
        <p className="text-stone-400 mb-10 font-medium max-w-xs relative z-10">Select your table or generate a test QR code for your phone.</p>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm relative z-10">
          {TABLES.slice(0, 4).map(t => (
            <div key={t} className="flex flex-col space-y-2">
              <button
                onClick={() => setActiveTable(t)}
                className="py-6 bg-white/5 border border-white/10 text-white rounded-3xl text-xl font-black hover:bg-amber-600 hover:border-amber-600 transition-all active:scale-95"
              >
                Table {t}
              </button>
              <button
                onClick={() => setQrModalData({ tableId: t, customBaseUrl: window.location.origin + window.location.pathname })}
                className="text-[10px] text-stone-500 font-bold uppercase tracking-widest hover:text-amber-500 transition-colors"
              >
                Generate QR
              </button>
            </div>
          ))}
        </div>

        {qrModalData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-950/95 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-[3rem] shadow-2xl max-w-sm w-full text-center relative animate-in zoom-in-95 duration-300">
              <button
                onClick={() => setQrModalData(null)}
                className="absolute -top-3 -right-3 w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90"
              >
                <i className="fas fa-times"></i>
              </button>

              <h3 className="text-xl font-black text-stone-900 mb-2 tracking-tight">Scan Table {qrModalData.tableId}</h3>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 mb-6">
                <p className="text-[10px] text-amber-700 font-bold leading-tight">
                  <i className="fas fa-info-circle mr-1"></i>
                  If your phone says "Site can't be reached", make sure your phone and computer are on the same Wi-Fi and change "localhost" to your computer's IP address below.
                </p>
              </div>

              <div className="bg-stone-50 p-6 rounded-[2rem] border border-stone-100 mb-6">
                {testQRImageUrl ? (
                  <img src={testQRImageUrl} alt="QR Code" className="w-full h-auto mix-blend-multiply transition-opacity duration-300" />
                ) : (
                  <div className="aspect-square flex items-center justify-center text-stone-200">
                    <i className="fas fa-spinner fa-spin text-4xl"></i>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-left">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Base URL (IP or Domain)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={qrModalData.customBaseUrl}
                    onChange={(e) => setQrModalData({ ...qrModalData, customBaseUrl: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-100 px-4 py-3 rounded-xl text-xs font-mono text-stone-600 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300">
                    <i className="fas fa-pen text-[10px]"></i>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center space-x-2 text-amber-600">
                <i className="fas fa-mobile-alt animate-pulse"></i>
                <span className="text-[10px] font-black uppercase tracking-widest">Live QR Update</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setView('Kitchen')}
          className="mt-12 text-stone-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors py-2 px-6 border border-stone-800 rounded-full relative z-10"
        >
          Staff: Enter Kitchen Mode
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      <Header view={view} setView={setView} />

      {view === 'Customer' && (
        <main className="pb-32 px-4 pt-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-1 flex items-center">
                <i className="fas fa-chair mr-1"></i> Table {activeTable}
              </p>
              <h1 className="text-3xl font-black text-stone-900 tracking-tighter">Menu.</h1>
            </div>
            <button
              onClick={() => {
                setActiveTable(null);
                window.history.pushState({}, '', window.location.pathname);
              }}
              className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 active:rotate-180 transition-transform shadow-sm"
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>

          <div className="flex overflow-x-auto space-x-2 pb-6 no-scrollbar">
            {['All', 'Coffee', 'Tea', 'Brunch', 'Pastries', 'Desserts'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-5 py-2.5 rounded-2xl whitespace-nowrap text-xs font-black tracking-tight border-2 transition-all ${activeCategory === cat
                    ? 'bg-stone-900 border-stone-900 text-white shadow-lg shadow-stone-100'
                    : 'bg-white border-stone-100 text-stone-500 hover:border-stone-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white p-3 rounded-3xl flex items-center space-x-4 shadow-sm border border-stone-50 group active:scale-[0.98] transition-transform">
                <img src={item.image} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 shadow-sm" alt={item.name} />
                <div className="flex-grow min-w-0">
                  <h3 className="font-black text-stone-900 text-lg leading-tight truncate">{item.name}</h3>
                  <p className="text-stone-400 text-xs line-clamp-2 mt-1 mb-2 font-medium">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-600 text-lg">₹{item.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-10 h-10 bg-stone-900 text-white rounded-xl shadow-lg active:bg-amber-600 transition-colors"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {view === 'Kitchen' && (
        <KitchenDashboard
          orders={orders}
          onUpdateStatus={updateOrderStatus}
          orderSuccess={orderSuccess}
        />
      )}

      {view === 'Customer' && cart.length > 0 && (
        <div className="fixed bottom-6 left-6 right-6 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-stone-900 text-white py-5 rounded-[2rem] shadow-2xl flex items-center justify-between px-8 group active:scale-95 transition-transform"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center font-black">
                {cart.reduce((acc, i) => acc + i.quantity, 0)}
              </div>
              <span className="text-xl font-black tracking-tighter">Review Order</span>
            </div>
            <span className="text-xl font-black text-amber-500">
              ₹{cart.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}
            </span>
          </button>
        </div>
      )}

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onClear={clearCart}
        onCheckout={handlePlaceOrder}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default App;
