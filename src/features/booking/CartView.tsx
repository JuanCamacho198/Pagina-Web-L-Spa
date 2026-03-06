import React, { useState, useEffect } from 'react'; 
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/firebaseConfig'; 
import { collection, getDocs } from 'firebase/firestore';
import { ShoppingBag, Trash2, ArrowRight, CreditCard, ChevronLeft, Loader2, Clock } from 'lucide-react';

interface CartItem {
  id: string;
  Nombre: string;
  Precio: string | number;
  imageFileName?: string;
  Duracion?: number;
  quantity?: number;
}

export default function CartView() {
  const { removeItem, clearCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const navigate = useNavigate();

  const groupedItems = cartItems.reduce((acc: Record<string, CartItem & { quantity: number }>, item) => {
    const key = item.Nombre;
    if (!acc[key]) {
      acc[key] = { ...item, quantity: 1 };
    } else {
      acc[key].quantity += 1;
    }
    return acc;
  }, {});

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      if (auth.currentUser) {
        const userCartRef = collection(db, 'Usuarios', auth.currentUser.uid, 'Carrito');
        try {
          const snapshot = await getDocs(userCartRef);
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem));
          setCartItems(items);
        } catch (error) {
          console.error('Error fetching cart items:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const total = cartItems.reduce((sum, item) => sum + parseFloat(String(item.Precio || 0)), 0);
  const itemCount = cartItems.length;

  const handleRemoveItem = async (item: CartItem) => {
    setRemoving(item.id);
    try {
      await removeItem(item.id);
      setCartItems(prev => prev.filter(cartItem => cartItem.id !== item.id));
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
        setCartItems([]);
        localStorage.removeItem('cartItems');
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tu Carrito</h1>
            <p className="text-gray-500 mt-1">
              Tienes <span className="font-bold text-primary">{itemCount}</span> {itemCount === 1 ? 'servicio seleccionado' : 'servicios seleccionados'}
            </p>
          </div>
          <button 
            onClick={() => navigate('/services')}
            className="inline-flex items-center text-primary font-semibold hover:underline group"
          >
            <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Continuar explorando
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={48} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              ¡Descubre nuestros increíbles servicios y añade algunos a tu día de spa!
            </p>
            <button 
              className="btn btn-primary px-8 py-4 text-lg shadow-xl shadow-primary/20"
              onClick={() => navigate('/services')}
            >
              Explorar Servicios
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Lista de Items */}
            <div className="lg:col-span-2 space-y-4">
              {Object.values(groupedItems).map(item => (
                <div key={item.id + item.Nombre} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow group">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    {item.imageFileName ? (
                      <img src={`/assets/${item.imageFileName}`} alt={item.Nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 leading-tight">{item.Nombre}</h3>
                      <button
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                        onClick={() => handleRemoveItem(item)}
                        disabled={removing === item.id}
                        title="Eliminar del carrito"
                      >
                        {removing === item.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      {item.Duracion && (
                        <span className="flex items-center gap-1 font-medium bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                          <Clock size={14} className="text-primary" /> {item.Duracion} min
                        </span>
                      )}
                      <span className="font-bold text-primary">
                        ${parseFloat(String(item.Precio || 0)).toLocaleString('es-CO')}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cantidad:</span>
                        <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">{item.quantity}</span>
                      </div>
                      {item.quantity > 1 && (
                        <span className="text-xs font-medium text-gray-400">
                          Subtotal: ${(parseFloat(String(item.Precio || 0)) * item.quantity).toLocaleString('es-CO')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center gap-2 group"
                onClick={handleClearCart}
              >
                <Trash2 size={18} className="group-hover:shake" />
                Vaciar todo el carrito
              </button>
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Servicios ({itemCount})</span>
                    <span>${total.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Descuento</span>
                    <span className="text-green-500">$0</span>
                  </div>
                  <div className="h-px bg-gray-100 my-4"></div>
                  <div className="flex justify-between items-center bg-primary/5 p-4 rounded-2xl">
                    <span className="text-gray-900 font-bold">Total</span>
                    <span className="text-2xl font-black text-primary">${total.toLocaleString('es-CO')}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button 
                    className="w-full btn btn-primary py-4 text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/20 mb-3" 
                    onClick={handleCheckout}
                  >
                    <CreditCard size={20} />
                    Pagar Ahora
                    <ArrowRight size={18} className="ml-1" />
                  </button>
                  <p className="text-[10px] text-center text-gray-400 px-4">
                    Al proceder al pago aceptas nuestras políticas de reserva y cancelación.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
