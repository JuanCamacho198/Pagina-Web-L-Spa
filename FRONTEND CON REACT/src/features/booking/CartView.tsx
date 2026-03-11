// src/features/booking/CartView.tsx
import React, { useState, useEffect } from 'react'; 
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, CreditCard, ChevronLeft, Loader2, Clock } from 'lucide-react';

export default function CartView() {
  const { removeItem, clearCart, cartItems: contextCartItems, loadCartFromDb } = useCart();
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initCart = async () => {
      setLoading(true);
      await loadCartFromDb();
      setLoading(false);
    };
    initCart();
  }, []);

  const total = contextCartItems.reduce((sum, item) => sum + (item.servicePrice || 0), 0);
  const itemCount = contextCartItems.length;

  const handleRemoveItem = async (itemId: string) => {
    setRemoving(itemId);
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setRemoving(null);
    }
  };

  const handleClearCart = async () => {
    const confirmClear = window.confirm("¿Estás seguro de que deseas vaciar el carrito?");
    if (confirmClear) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const handleCheckout = () => {
    if (contextCartItems.length > 0) {
      navigate('/checkout');
    } else {
      alert("Tu carrito está vacío.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Cargando tu experiencia de bienestar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/services')}
            className="flex items-center text-gray-500 hover:text-primary transition-colors group"
          >
            <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Volver a servicios</span>
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-serif text-gray-900 mb-2">Tu Carrito</h1>
            <div className="h-1 w-12 bg-primary/30 mx-auto rounded-full"></div>
          </div>
          <div className="w-24"></div> {/* Spacer for symmetry */}
        </div>

        {contextCartItems.length === 0 ? (
          <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-primary/40" />
            </div>
            <h2 className="text-2xl font-serif text-gray-800 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Parece que aún no has seleccionado ningún servicio. Descubre nuestras experiencias de relajación y comienza tu viaje de bienestar.</p>
            <button
              onClick={() => navigate('/services')}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-medium transition-all shadow-md hover:shadow-lg flex items-center mx-auto"
            >
              Explorar Servicios
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-4 mb-2">
                <span className="text-sm font-medium text-gray-500">{itemCount} {itemCount === 1 ? 'servicio' : 'servicios'} en total</span>
                <button 
                  onClick={handleClearCart}
                  className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center transition-colors"
                >
                  <Trash2 size={14} className="mr-1" />
                  Vaciar carrito
                </button>
              </div>

              {contextCartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-4xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md transition-shadow"
                >
                  <div className="w-24 h-24 rounded-4xll bg-gray-100 overflow-hidden shrink-0">
                    <img 
                      src={item.imageUrl || '/src/assets/banners/bannerSpa.avif'} 
                      alt={item.serviceName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/banners/bannerSpa.avif';
                      }}
                    />
                  </div>
                  
                  <div className="grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-serif text-gray-900 group-hover:text-primary transition-colors">{item.serviceName}</h3>
                        <div className="flex items-center text-gray-400 text-xs mt-1">
                          <Clock size={12} className="mr-1" />
                          <span>Sesión individual</span>
                        </div>
                      </div>
                      <span className="text-lg font-medium text-primary">${item.servicePrice.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1">
                        <span className="text-sm font-medium text-gray-600">Cantidad: 1</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removing === item.id}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        title="Eliminar del carrito"
                      >
                        {removing === item.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-4xl p-6 shadow-sm border border-gray-100 sticky top-28">
                <h2 className="text-xl font-serif text-gray-900 mb-6">Resumen de reserva</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Impuestos (Incl.)</span>
                    <span>$0</span>
                  </div>
                  <div className="h-px bg-gray-100 w-full my-4"></div>
                  <div className="flex justify-between items-end">
                    <span className="text-gray-900 font-medium">Total a pagar</span>
                    <span className="text-3xl font-serif text-primary">${total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-4xll font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center group"
                  >
                    Proceder al pago
                    <CreditCard size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate('/services')}
                    className="w-full bg-white border border-gray-200 text-gray-600 py-3 rounded-4xll font-medium hover:bg-gray-50 transition-all flex items-center justify-center"
                  >
                    Seguir explorando
                  </button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 opacity-40 grayscale">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
                </div>
                
                <p className="mt-6 text-[10px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                  Pago 100% seguro garantizado para tu tranquilidad
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
