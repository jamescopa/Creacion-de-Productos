import React, { useState, useEffect } from 'react';
import { ProductData } from '../types';
import { Check, Copy, Code } from 'lucide-react';

interface CodeOutputProps {
  data: ProductData;
}

export const CodeOutput: React.FC<CodeOutputProps> = ({ data }) => {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  const generateHTML = (d: ProductData) => {
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const discount = d.originalPrice 
      ? Math.round(((parseFloat(d.originalPrice) - parseFloat(d.price)) / parseFloat(d.originalPrice)) * 100)
      : 0;
    const mainImage = d.images[0];

    // Badge Generation
    let badgeHtml = '';
    if (d.badgeType === 'hot') badgeHtml = '<span class="bg-badge hot">HOT SALE</span>';
    else if (d.badgeType === 'black_friday') badgeHtml = '<span class="bg-badge black-friday">Black Friday</span>';
    else if (d.badgeType === 'coming_soon') badgeHtml = '<span class="bg-badge coming-soon">Coming Soon</span>';
    else if (d.badgeType === 'pre_order') badgeHtml = '<span class="bg-badge pre-order">Reservarlo ahora</span>';
    else if (d.badgeType === 'sold_out') badgeHtml = '<span class="bg-badge sold-out">Agotado</span>';

    return `
<!-- START PRODUCT WIDGET [BloggerGenAI] -->
<div id="bg-widget-${uniqueId}">
<!-- Import Roboto Font -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet">
<style>
  /* Card Styles */
  #bg-widget-${uniqueId} { font-family: 'Roboto', sans-serif; }
  .bg-card { max-width: 350px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e0e0e0; margin: 20px auto; transition: transform 0.3s ease; cursor: pointer; position: relative; }
  .bg-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); border-color: #3f51b5; }
  .bg-img-wrap { position: relative; height: 250px; overflow: hidden; background: #f4f6f8; }
  .bg-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .bg-card:hover .bg-img { transform: scale(1.1); }
  
  /* Badges */
  .bg-badge { position: absolute; top: 12px; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; color: #fff; z-index: 10; text-transform: uppercase; }
  .bg-badge.hot { left: 12px; background: #ef4444; }
  .bg-badge.black-friday { left: 12px; background: #000000; }
  .bg-badge.coming-soon { left: 12px; background: #2563eb; }
  .bg-badge.pre-order { left: 12px; background: #2e7d32; }
  .bg-badge.sold-out { left: 12px; background: #6b7280; }
  
  .bg-badge.sale { right: 12px; background: #4b5563; } /* Gray Discount */
  .bg-badge.sold { background: rgba(0,0,0,0.7); color: #fff; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 8px 16px; font-size: 14px; border: 2px solid #fff; }
  
  .bg-content { padding: 15px; }
  .bg-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .bg-cat { font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; } /* Gray Category */
  .bg-title { font-size: 16px; font-weight: 700; color: #2c3e50; margin: 0 0 8px 0; line-height: 1.4; height: 44px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .bg-price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px; }
  .bg-price { font-size: 20px; font-weight: 700; color: #3f51b5; }
  .bg-old-price { font-size: 14px; text-decoration: line-through; color: #94a3b8; }
  .bg-btn-card { display: block; width: 100%; background: ${d.inStock ? '#3f51b5' : '#e2e8f0'}; color: ${d.inStock ? '#fff' : '#94a3b8'} !important; text-align: center; padding: 10px; border-radius: 4px; text-decoration: none !important; font-weight: 600; font-size: 14px; pointer-events: ${d.inStock ? 'auto' : 'none'}; transition: background 0.3s; }
  .bg-btn-card:hover { background: ${d.inStock ? '#303f9f' : '#e2e8f0'}; }

  /* Modal Styles */
  .bg-modal { display: none; position: fixed; z-index: 99999; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6); backdrop-filter: blur(5px); align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; font-family: 'Roboto', sans-serif; }
  .bg-modal.show { display: flex; opacity: 1; }
  .bg-modal-content { background-color: #fff; width: 95%; max-width: 900px; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); position: relative; overflow: hidden; display: flex; flex-direction: column; animation: bgSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  @media (min-width: 768px) { .bg-modal-content { flex-direction: row; height: auto; max-height: 90vh; } }
  @keyframes bgSlideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  
  .bg-close { position: absolute; top: 15px; right: 15px; color: #64748b; font-size: 28px; font-weight: bold; cursor: pointer; z-index: 20; line-height: 1; width: 30px; height: 30px; text-align: center; background: rgba(255,255,255,0.8); border-radius: 50%; }
  .bg-close:hover { color: #000; background: #fff; }

  .bg-col-img { width: 100%; background: #f4f6f8; padding: 30px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
  @media (min-width: 768px) { .bg-col-img { width: 50%; } }
  .bg-modal-img-wrap { width: 100%; height: 300px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; }
  .bg-modal-img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .bg-thumbs { display: flex; gap: 10px; overflow-x: auto; width: 100%; padding-bottom: 5px; }
  .bg-thumb { width: 60px; height: 60px; border: 2px solid #e2e8f0; border-radius: 4px; cursor: pointer; object-fit: cover; opacity: 0.7; transition: all 0.2s; flex-shrink: 0; }
  .bg-thumb:hover, .bg-thumb.active { border-color: #3f51b5; opacity: 1; transform: scale(1.05); }
  
  .bg-col-info { width: 100%; padding: 30px; overflow-y: auto; max-height: 60vh; display: flex; flex-direction: column; }
  @media (min-width: 768px) { .bg-col-info { width: 50%; max-height: none; } }
  
  .bg-m-title { font-size: 24px; font-weight: 700; color: #2c3e50; margin: 0 0 10px 0; line-height: 1.2; }
  .bg-m-price { font-size: 30px; font-weight: 700; color: #3f51b5; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .bg-m-tag { background: #f3f4f6; color: #374151; font-size: 12px; padding: 4px 8px; border-radius: 4px; font-weight: 700; vertical-align: middle; }
  .bg-lbl { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; display: block; }
  
  /* Colors */
  .bg-colors { display: flex; gap: 10px; margin-bottom: 25px; }
  .bg-color-opt { width: 32px; height: 32px; border-radius: 50%; cursor: pointer; border: 2px solid #fff; box-shadow: 0 0 0 1px #e2e8f0; transition: transform 0.2s; }
  .bg-color-opt:hover { transform: scale(1.1); }
  .bg-color-opt.active { box-shadow: 0 0 0 2px #3f51b5; transform: scale(1.1); }

  /* Qty */
  .bg-qty-wrap { display: flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 4px; width: max-content; margin-bottom: 25px; }
  .bg-qty-btn { background: none; border: none; padding: 10px 15px; cursor: pointer; font-size: 18px; color: #64748b; }
  .bg-qty-btn:hover { background: #f1f5f9; color: #0f172a; }
  .bg-qty-val { font-weight: 600; width: 30px; text-align: center; }

  .bg-m-btn { display: block; width: 100%; background: ${d.inStock ? '#3f51b5' : '#e2e8f0'}; color: ${d.inStock ? '#fff' : '#94a3b8'}; text-align: center; padding: 15px; border-radius: 8px; font-weight: 700; font-size: 16px; cursor: ${d.inStock ? 'pointer' : 'not-allowed'}; border: none; transition: background 0.2s; text-decoration: none; box-shadow: ${d.inStock ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'}; }
  .bg-m-btn:hover { background: ${d.inStock ? '#303f9f' : '#e2e8f0'}; }
  .bg-m-desc { margin-top: 25px; font-size: 14px; line-height: 1.6; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 20px; }

  /* Order Form */
  .bg-form-view { display: none; flex-direction: column; height: 100%; }
  .bg-form-title { font-size: 22px; font-weight: 700; color: #2c3e50; margin-bottom: 4px; }
  .bg-form-sub { font-size: 14px; color: #64748b; margin-bottom: 20px; }
  .bg-inp-group { margin-bottom: 16px; }
  .bg-inp-lbl { display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px; }
  .bg-inp { width: 100%; padding: 12px; border-radius: 4px; border: 1px solid #cbd5e1; font-size: 14px; outline: none; transition: border-color 0.2s; background: #fff; }
  .bg-inp:focus { border-color: #3f51b5; ring: 2px solid #e0e7ff; }
  .bg-inp.readonly { background: #f1f5f9; color: #64748b; cursor: default; }
  .bg-btn-back { background: none; border: none; padding: 0; color: #64748b; cursor: pointer; font-size: 14px; font-weight: 600; margin-bottom: 20px; display: flex; align-items: center; }
  .bg-btn-wa { background: #2e7d32; color: #fff; width: 100%; padding: 15px; border-radius: 8px; font-weight: 700; font-size: 16px; border: none; cursor: pointer; margin-top: auto; box-shadow: 0 4px 6px -1px rgba(46,125,50,0.3); transition: background 0.3s; }
  .bg-btn-wa:hover { background: #1b5e20; }
</style>

<!-- Card Trigger -->
<div class="bg-card" onclick="openModal_${uniqueId}()">
  <div class="bg-img-wrap">
    <img src="${mainImage}" alt="${d.title}" class="bg-img" />
    ${badgeHtml}
    ${discount > 0 && d.inStock ? `<span class="bg-badge sale">-${discount}%</span>` : ''}
    ${!d.inStock ? '<span class="bg-badge sold">SOLD OUT</span>' : ''}
  </div>
  <div class="bg-content">
    <div class="bg-meta">
      <span class="bg-cat">${d.category}</span>
      ${d.showStars ? `<span style="color:#facc15">${'★'.repeat(d.rating)}</span>` : ''}
    </div>
    <h3 class="bg-title">${d.title}</h3>
    <div class="bg-price-row">
      <span class="bg-price">$${d.price}</span>
      ${d.originalPrice ? `<span class="bg-old-price">$${d.originalPrice}</span>` : ''}
    </div>
    <button class="bg-btn-card">${d.inStock ? 'View Details' : 'Out of Stock'}</button>
  </div>
</div>

<!-- Modal -->
<div id="modal-${uniqueId}" class="bg-modal" onclick="if(event.target === this) closeModal_${uniqueId}()">
  <div class="bg-modal-content">
    <span class="bg-close" onclick="closeModal_${uniqueId}()">&times;</span>
    
    <div class="bg-col-img">
      <div class="bg-modal-img-wrap">
         <img id="main-img-${uniqueId}" src="${mainImage}" class="bg-modal-img" alt="${d.title}" />
      </div>
      ${d.images.length > 1 ? `
      <div class="bg-thumbs">
        ${d.images.map((img, i) => `
           <img src="${img}" class="bg-thumb ${i === 0 ? 'active' : ''}" onclick="changeImg_${uniqueId}(this, '${img}')" />
        `).join('')}
      </div>
      ` : ''}
    </div>
    
    <div class="bg-col-info">
      <!-- Product Details View -->
      <div id="view-details-${uniqueId}">
        <h2 class="bg-m-title">${d.title}</h2>
        <div class="bg-m-price">
          $${d.price}
          ${d.originalPrice ? `<span class="bg-old-price" style="font-size:18px">$${d.originalPrice}</span>` : ''}
          ${discount > 0 ? `<span class="bg-m-tag">SAVE ${discount}%</span>` : ''}
        </div>

        ${d.colors.length > 0 ? `
        <span class="bg-lbl">Color : <span id="col-name-${uniqueId}">${d.colors[0]}</span></span>
        <div class="bg-colors">
          ${d.colors.map((c, i) => `
            <div class="bg-color-opt ${i === 0 ? 'active' : ''}" 
                 style="background-color: ${c}" 
                 onclick="selectColor_${uniqueId}(this, '${c}')"></div>
          `).join('')}
        </div>
        ` : ''}

        ${d.inStock ? `
        <span class="bg-lbl">Quantity</span>
        <div class="bg-qty-wrap">
          <button class="bg-qty-btn" onclick="updateQty_${uniqueId}(-1)">-</button>
          <span id="qty-${uniqueId}" class="bg-qty-val">1</span>
          <button class="bg-qty-btn" onclick="updateQty_${uniqueId}(1)">+</button>
        </div>
        ` : ''}

        <button onclick="goToForm_${uniqueId}()" class="bg-m-btn">
          ${d.inStock ? (d.buttonText || 'Buy Now') : 'Sold Out'}
        </button>

        <div class="bg-m-desc">
          <span class="bg-lbl" style="margin-bottom:5px">Description</span>
          ${d.description}
        </div>
      </div>

      <!-- Order Form View -->
      <div id="view-form-${uniqueId}" class="bg-form-view">
         <button class="bg-btn-back" onclick="backToDetails_${uniqueId}()">← Back to product</button>
         <h3 class="bg-form-title">Completa tu Pedido</h3>
         <p class="bg-form-sub">Envía tu pedido directamente por WhatsApp.</p>
         
         <div class="bg-inp-group">
           <label class="bg-inp-lbl">Nombre Completo</label>
           <input id="inp-name-${uniqueId}" class="bg-inp" placeholder="Tu nombre" />
         </div>
         
         <div class="bg-inp-group">
           <label class="bg-inp-lbl">País</label>
           <input class="bg-inp readonly" value="Ecuador" readonly />
         </div>

         <div class="bg-inp-group">
           <label class="bg-inp-lbl">Ciudad</label>
           <input id="inp-city-${uniqueId}" class="bg-inp" placeholder="Ej: Quito, Guayaquil" />
         </div>

         <div class="bg-inp-group">
           <label class="bg-inp-lbl">Dirección / Calles</label>
           <input id="inp-address-${uniqueId}" class="bg-inp" placeholder="Ej: Av. Amazonas y NNUU" />
         </div>

         <div class="bg-inp-group">
           <label class="bg-inp-lbl">Forma de Pago</label>
           <select id="inp-payment-${uniqueId}" class="bg-inp">
             <option value="Pago contra entrega">Pago contra entrega</option>
             <option value="Transferencia bancaria">Transferencia bancaria</option>
             <option value="Retiro en tienda">Retiro en tienda</option>
           </select>
         </div>
         
         <button class="bg-btn-wa" onclick="submitOrder_${uniqueId}()">Pedir por WhatsApp</button>
      </div>

    </div>
  </div>
</div>

<script>
  (function() {
    // State for this specific widget instance
    var state = {
      price: "${d.price}",
      phone: "${d.whatsAppNumber}",
      title: "${d.title}",
      link: "${d.buyLink}",
      color: "${d.colors[0] || ''}",
      qty: 1
    };

    window.openModal_${uniqueId} = function() { document.getElementById('modal-'+'${uniqueId}').classList.add('show'); };
    window.closeModal_${uniqueId} = function() { 
      document.getElementById('modal-'+'${uniqueId}').classList.remove('show'); 
      backToDetails_${uniqueId}(); 
    };
    
    window.changeImg_${uniqueId} = function(el, src) {
      document.getElementById('main-img-${uniqueId}').src = src;
      var thumbs = document.querySelectorAll('#modal-${uniqueId} .bg-thumb');
      thumbs.forEach(t => t.classList.remove('active'));
      el.classList.add('active');
    };

    window.selectColor_${uniqueId} = function(el, color) {
      var opts = document.querySelectorAll('#modal-${uniqueId} .bg-color-opt');
      opts.forEach(o => o.classList.remove('active'));
      el.classList.add('active');
      state.color = color;
      var nameEl = document.getElementById('col-name-${uniqueId}');
      if(nameEl) nameEl.innerText = color;
    };

    window.updateQty_${uniqueId} = function(change) {
      var qEl = document.getElementById('qty-${uniqueId}');
      var current = parseInt(qEl.innerText);
      var newVal = current + change;
      if(newVal < 1) newVal = 1;
      qEl.innerText = newVal;
      state.qty = newVal;
    };

    window.goToForm_${uniqueId} = function() {
      if(!state.phone) {
         window.open(state.link, '_blank');
         return;
      }
      document.getElementById('view-details-${uniqueId}').style.display = 'none';
      document.getElementById('view-form-${uniqueId}').style.display = 'flex';
    };

    window.backToDetails_${uniqueId} = function() {
      document.getElementById('view-form-${uniqueId}').style.display = 'none';
      document.getElementById('view-details-${uniqueId}').style.display = 'block';
    };

    window.submitOrder_${uniqueId} = function() {
       var name = document.getElementById('inp-name-${uniqueId}').value;
       var city = document.getElementById('inp-city-${uniqueId}').value;
       var addr = document.getElementById('inp-address-${uniqueId}').value;
       var payment = document.getElementById('inp-payment-${uniqueId}').value;

       if(!name || !city) { alert('Por favor completa tu nombre y ciudad.'); return; }

       var text = "Hola, deseo pedir este producto: " + state.title + "\\n" +
                  "Precio: $" + state.price + "\\n" +
                  "Color: " + state.color + "\\n" +
                  "Cantidad: " + state.qty + "\\n\\n" +
                  "*Datos de envío:*\\n" +
                  "Nombre: " + name + "\\n" +
                  "País: Ecuador\\n" +
                  "Ciudad: " + city + "\\n" +
                  "Dirección: " + addr + "\\n" +
                  "Método de Pago: " + payment;
       
       window.open("https://wa.me/" + state.phone + "?text=" + encodeURIComponent(text), '_blank');
    };

  })();
</script>
</div>
<!-- END PRODUCT WIDGET -->
    `.trim();
  };

  useEffect(() => {
    setCode(generateHTML(data));
  }, [data]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 rounded-xl overflow-hidden shadow-lg border border-slate-700 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Code size={18} className="text-indigo-400" />
          <span className="font-mono text-sm font-bold">HTML Output</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded bg-[#3f51b5] hover:bg-[#303f9f] text-white transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>
      <div className="p-4 overflow-auto flex-1 font-mono text-xs leading-relaxed">
        <pre className="whitespace-pre-wrap break-all text-slate-300">
          {code}
        </pre>
      </div>
      <div className="bg-slate-800/50 p-3 text-center text-xs text-slate-500 border-t border-slate-700">
        Paste into Blogger (HTML View). Includes Form & WhatsApp Logic.
      </div>
    </div>
  );
};