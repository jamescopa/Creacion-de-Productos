import React, { useState, useEffect } from 'react';
import { ProductData } from '../types';
import { ShoppingCart, Star, X, Minus, Plus, Eye, ArrowLeft } from 'lucide-react';

interface ProductPreviewProps {
  data: ProductData;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(data.colors[0] || '');
  const [selectedImage, setSelectedImage] = useState(data.images[0] || '');
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    paymentMethod: 'Pago contra entrega'
  });

  useEffect(() => {
    setSelectedColor(data.colors[0] || '');
    setSelectedImage(data.images[0] || '');
    setShowOrderForm(false);
  }, [data, showModal]);

  const discountPercentage = data.originalPrice 
    ? Math.round(((parseFloat(data.originalPrice) - parseFloat(data.price)) / parseFloat(data.originalPrice)) * 100)
    : 0;

  const handleBuy = () => {
    if (!data.inStock) return;
    
    if (data.whatsAppNumber) {
      setShowOrderForm(true);
    } else {
      window.open(data.buyLink, '_blank');
    }
  };

  const sendToWhatsApp = () => {
    const message = `Hola, deseo pedir este producto: ${data.title}
Precio: $${data.price}
Color: ${selectedColor}
Cantidad: ${qty}

*Datos de envío:*
Nombre: ${formData.name}
País: Ecuador
Ciudad: ${formData.city}
Dirección: ${formData.address}
Método de Pago: ${formData.paymentMethod}`;

    window.open(`https://wa.me/${data.whatsAppNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderBadge = () => {
    switch(data.badgeType) {
      case 'hot': return <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10">HOT SALE</div>;
      case 'black_friday': return <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10">Black Friday</div>;
      case 'coming_soon': return <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10">Coming Soon</div>;
      case 'pre_order': return <div className="absolute top-3 left-3 bg-[#2e7d32] text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10">Reservarlo ahora</div>;
      case 'sold_out': return <div className="absolute top-3 left-3 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10">Agotado</div>;
      default: return null;
    }
  };

  const mainImage = selectedImage || data.images[0];

  return (
    <>
      {/* CARD VIEW (Trigger) */}
      <div 
        onClick={() => setShowModal(true)}
        className="bg-white rounded-xl shadow-xl overflow-hidden max-w-sm mx-auto border border-slate-100 cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-2xl relative font-roboto"
      >
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full z-10 text-slate-700 opacity-0 hover:opacity-100 transition-opacity">
           <Eye size={16} />
        </div>

        <div className="relative h-64 overflow-hidden bg-slate-100 group">
          {mainImage ? (
            <img 
              src={mainImage} 
              alt={data.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <span>No Image Preview</span>
            </div>
          )}
          
          {renderBadge()}
          
          {!data.inStock && (
             <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                <span className="border-2 border-white text-white px-4 py-1 font-bold uppercase tracking-widest">Sold Out</span>
             </div>
          )}
          
          {data.inStock && discountPercentage > 0 && (
            <div className="absolute top-3 right-3 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10">
              -{discountPercentage}%
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {data.category || 'Category'}
            </span>
            {data.showStars && (
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < data.rating ? "currentColor" : "none"} 
                    stroke="currentColor"
                    className={i < data.rating ? "" : "text-slate-300"}
                  />
                ))}
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-[#2c3e50] mb-2 line-clamp-2 leading-snug">
            {data.title || 'Product Name'}
          </h3>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold text-[#3f51b5]">
              ${data.price || '0.00'}
            </span>
            {data.originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                ${data.originalPrice}
              </span>
            )}
          </div>

          <button 
            className={`w-full font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${
                data.inStock 
                ? "bg-[#3f51b5] hover:bg-[#303f9f] text-white" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart size={18} />
            {data.inStock ? (data.buttonText || 'Buy Now') : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* MODAL VIEW (Detailed) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-roboto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative animate-slide-up">
            
            <button 
              onClick={(e) => { e.stopPropagation(); setShowModal(false); }}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Left: Image Gallery */}
            <div className="w-full md:w-1/2 bg-slate-50 p-6 flex flex-col items-center justify-center relative">
               <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white shadow-sm mb-4">
                  <img 
                    src={mainImage} 
                    alt={data.title} 
                    className="w-full h-full object-contain" 
                  />
                   {!data.inStock && (
                     <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-slate-800 px-6 py-2 border-4 border-slate-800 font-black text-2xl transform -rotate-12 opacity-70">SOLD OUT</span>
                     </div>
                   )}
               </div>
               {/* Thumbnails */}
               {data.images.length > 1 && (
                 <div className="flex gap-2 overflow-x-auto w-full px-1 py-2 scrollbar-hide">
                   {data.images.map((img, idx) => (
                     <button 
                       key={idx} 
                       onClick={() => setSelectedImage(img)}
                       className={`w-16 h-16 flex-shrink-0 rounded-md border-2 overflow-hidden ${selectedImage === img ? 'border-[#3f51b5] ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-400'}`}
                     >
                       <img src={img} className="w-full h-full object-cover" alt="" />
                     </button>
                   ))}
                 </div>
               )}
            </div>

            {/* Right: Details OR Order Form */}
            <div className="w-full md:w-1/2 p-8 flex flex-col relative">
              
              {!showOrderForm ? (
                // VIEW: Product Details
                <>
                  <div className="mb-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#2c3e50] mb-2">{data.title}</h2>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-baseline gap-3">
                         {data.originalPrice && (
                            <span className="text-lg text-slate-400 line-through decoration-slate-400">
                              ${data.originalPrice}
                            </span>
                          )}
                        <span className="text-3xl font-bold text-[#3f51b5]">
                          ${data.price}
                        </span>
                      </div>
                      {discountPercentage > 0 && (
                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold uppercase">
                           Save {discountPercentage}%
                         </span>
                      )}
                    </div>

                    <div className="space-y-6">
                       {/* Colors */}
                       {data.colors.length > 0 && (
                         <div>
                           <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                             Color: <span className="text-[#2c3e50] ml-1">{selectedColor || data.colors[0]}</span>
                           </span>
                           <div className="flex gap-3">
                             {data.colors.map((c) => (
                               <button
                                 key={c}
                                 onClick={() => setSelectedColor(c)}
                                 className={`w-8 h-8 rounded-full shadow-sm border-2 transition-all ${selectedColor === c ? 'border-[#3f51b5] scale-110 ring-2 ring-indigo-100' : 'border-white'}`}
                                 style={{ backgroundColor: c }}
                               />
                             ))}
                           </div>
                         </div>
                       )}

                       {/* Quantity */}
                       {data.inStock && (
                         <div>
                           <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                             Quantity
                           </span>
                           <div className="flex items-center border border-slate-200 rounded-lg w-max">
                             <button 
                                onClick={() => setQty(Math.max(1, qty - 1))}
                                className="p-3 hover:bg-slate-50 text-slate-500"
                              >
                               <Minus size={16} />
                             </button>
                             <span className="w-12 text-center font-semibold text-slate-700">{qty}</span>
                             <button 
                                onClick={() => setQty(qty + 1)}
                                className="p-3 hover:bg-slate-50 text-slate-500"
                              >
                               <Plus size={16} />
                             </button>
                           </div>
                         </div>
                       )}
                       
                       <div className="pt-4 border-t border-slate-100">
                          <button 
                            onClick={handleBuy}
                            disabled={!data.inStock}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 ${
                              data.inStock
                              ? "bg-[#3f51b5] text-white hover:bg-[#303f9f]"
                              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                            }`}
                          >
                            {data.inStock ? (
                              <>
                                <ShoppingCart />
                                {data.buttonText || 'Buy Now'}
                              </>
                            ) : 'Sold Out'}
                          </button>
                       </div>
                       
                       <div className="text-sm text-slate-500">
                         <span className="block font-bold text-[#2c3e50] mb-1">Description</span>
                         <p className="leading-relaxed">{data.description}</p>
                       </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-4 text-sm text-slate-400">
                    <span>SKU: {Date.now().toString().slice(-8)}</span>
                    <span>•</span>
                    <span>Category: {data.category}</span>
                  </div>
                </>
              ) : (
                // VIEW: Order Form
                <div className="animate-fade-in h-full flex flex-col">
                   <button 
                    onClick={() => setShowOrderForm(false)} 
                    className="flex items-center text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
                   >
                     <ArrowLeft size={16} className="mr-1" /> Back to product
                   </button>

                   <h3 className="text-2xl font-bold text-[#2c3e50] mb-1">Completa tu Pedido</h3>
                   <p className="text-slate-500 text-sm mb-6">Envía tu pedido directamente por WhatsApp.</p>

                   <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          placeholder="Tu nombre"
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#3f51b5] outline-none"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1">País</label>
                           <input 
                             type="text" 
                             value="Ecuador" 
                             readOnly
                             className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-100 text-slate-600"
                           />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Ciudad</label>
                          <input 
                            type="text" 
                            name="city"
                            value={formData.city}
                            onChange={handleFormChange}
                            placeholder="Tu ciudad"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#3f51b5] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Dirección / Calles</label>
                        <input 
                          type="text" 
                          name="address"
                          value={formData.address}
                          onChange={handleFormChange}
                          placeholder="Ej: Av. Amazonas y NNUU"
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#3f51b5] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Forma de Pago</label>
                        <select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#3f51b5] outline-none bg-white"
                        >
                          <option value="Pago contra entrega">Pago contra entrega</option>
                          <option value="Transferencia bancaria">Transferencia bancaria</option>
                          <option value="Retiro en tienda">Retiro en tienda</option>
                        </select>
                      </div>
                   </div>

                   <button 
                     onClick={sendToWhatsApp}
                     className="w-full py-4 bg-[#2e7d32] hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 mt-auto"
                   >
                     <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.669-.699c.937.519 2.002.794 3.095.794h.002c3.181 0 5.768-2.586 5.768-5.766 0-1.541-.599-2.99-1.687-4.078C15.329 6.771 13.881 6.172 12.031 6.172zm0 9.928c-.933 0-1.846-.256-2.649-.738l-.189-.113-1.582.415.423-1.54-.124-.197c-.543-.864-.83-1.854-.829-2.884.001-2.599 2.116-4.715 4.716-4.715 1.259 0 2.442.491 3.332 1.382 1.336 1.335 3.506 0 4.841-1.296 1.296-1.889 3.55-3.101 3.55z" fill="white"/></svg>
                     Pedir por WhatsApp
                   </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </>
  );
};