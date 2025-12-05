
import React, { useState } from 'react';
import { Wand2, Layout, Github, Plus, X, Palette, Image as ImageIcon } from 'lucide-react';
import { InputField, TextAreaField, Button } from './components/UIComponents';
import { ProductPreview } from './components/ProductPreview';
import { CodeOutput } from './components/CodeOutput';
import { ProductData, GeneratorStatus, BadgeType } from './types';
import { generateProductContent } from './services/geminiService';

const DEFAULT_IMAGE = "https://picsum.photos/400/400";

const INITIAL_DATA: ProductData = {
  title: "Ambiental Solar Light",
  category: "Home & Garden",
  price: "11.25",
  originalPrice: "15.00",
  description: "Illuminate your space with Ambiental Solar. Experience the magic of clean and sustainable energy for your outdoors. Create warm and cozy environments without energy costs.",
  images: [DEFAULT_IMAGE],
  buyLink: "#",
  buttonText: "Comprar Ahora",
  whatsAppNumber: "1234567890",
  rating: 5,
  badgeType: 'hot',
  showStars: true,
  colors: ['#3b82f6', '#ef4444', '#64748b'],
  inStock: true,
};

function App() {
  const [product, setProduct] = useState<ProductData>(INITIAL_DATA);
  const [aiStatus, setAiStatus] = useState<GeneratorStatus>(GeneratorStatus.IDLE);
  const [aiKeywords, setAiKeywords] = useState('');
  const [newColor, setNewColor] = useState('#000000');
  const [newImage, setNewImage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAiGenerate = async () => {
    if (!product.title || !product.category) {
      alert("Please enter a Product Name and Category first.");
      return;
    }

    setAiStatus(GeneratorStatus.LOADING);
    try {
      const result = await generateProductContent(product.title, product.category, aiKeywords);
      setProduct(prev => ({
        ...prev,
        description: result.description,
      }));
      setAiStatus(GeneratorStatus.SUCCESS);
    } catch (error) {
      setAiStatus(GeneratorStatus.ERROR);
      alert("Failed to generate content. Please check your API Key or try again.");
    } finally {
      setTimeout(() => setAiStatus(GeneratorStatus.IDLE), 2000);
    }
  };

  const addColor = () => {
    if (!product.colors.includes(newColor)) {
      setProduct(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }));
    }
  };

  const removeColor = (colorToRemove: string) => {
    setProduct(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== colorToRemove)
    }));
  };

  const addImage = () => {
    if (newImage && !product.images.includes(newImage)) {
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
      setNewImage('');
    }
  };

  const removeImage = (imgToRemove: string) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter(i => i !== imgToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Layout className="text-white h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              BloggerGen AI
            </h1>
          </div>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-800">
            <Github size={24} />
          </a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Create Stunning Product Cards for <span className="text-orange-500">Blogger</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Fill in the details, customize variants, and get a professional "Quick View" modal ready for your shop.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Editor */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">1</span>
                <h3 className="text-lg font-bold text-slate-800">Product Details</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <InputField 
                  label="Product Name" 
                  name="title" 
                  value={product.title} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Wireless Earbuds"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <InputField 
                    label="Category" 
                    name="category" 
                    value={product.category} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Audio"
                  />
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Rating (1-5)</label>
                    <select 
                      name="rating" 
                      value={product.rating} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField 
                    label="Price ($)" 
                    name="price" 
                    type="number"
                    value={product.price} 
                    onChange={handleInputChange} 
                  />
                  <InputField 
                    label="Original Price ($)" 
                    name="originalPrice" 
                    type="number"
                    value={product.originalPrice} 
                    onChange={handleInputChange} 
                  />
                </div>

                {/* Images */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                   <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <ImageIcon size={16} className="text-indigo-600" />
                        Product Images
                      </label>
                   </div>
                   
                   <div className="flex gap-2 mb-3">
                      <input 
                        type="text" 
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="Paste Image URL..."
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                      <button 
                        onClick={addImage}
                        type="button"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                      >
                        Add
                      </button>
                   </div>
                   
                   <div className="space-y-2">
                     {product.images.map((img, idx) => (
                       <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                         <img src={img} alt="" className="w-10 h-10 rounded object-cover bg-slate-100" />
                         <span className="text-xs font-mono text-slate-500 truncate flex-1">{img}</span>
                         <button 
                            onClick={() => removeImage(img)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500"
                         >
                           <X size={16} />
                         </button>
                       </div>
                     ))}
                     {product.images.length === 0 && (
                       <div className="text-center py-4 text-slate-400 text-sm italic bg-white rounded border border-dashed border-slate-300">
                         No images added
                       </div>
                     )}
                   </div>
                </div>

                {/* Stock & Variants */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                   <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Palette size={16} className="text-indigo-600" />
                        Variants & Stock
                      </label>
                       <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-slate-600">Available?</label>
                        <input 
                          type="checkbox" 
                          name="inStock" 
                          checked={product.inStock} 
                          onChange={handleInputChange}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                      </div>
                   </div>
                   
                   <div className="flex gap-2 mb-3">
                      <input 
                        type="color" 
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        className="h-10 w-12 p-1 rounded border border-slate-300 cursor-pointer"
                      />
                      <button 
                        onClick={addColor}
                        type="button"
                        className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Color
                      </button>
                   </div>
                   
                   <div className="flex flex-wrap gap-2">
                     {product.colors.map((color, idx) => (
                       <div key={idx} className="flex items-center gap-1 bg-white pl-2 pr-1 py-1 rounded-full border border-slate-200 shadow-sm">
                         <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                         <span className="text-xs font-mono text-slate-500 uppercase">{color}</span>
                         <button 
                            onClick={() => removeColor(color)}
                            className="p-0.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 ml-1"
                         >
                           <X size={14} />
                         </button>
                       </div>
                     ))}
                     {product.colors.length === 0 && (
                       <span className="text-xs text-slate-400 italic">No color variants added</span>
                     )}
                   </div>
                </div>

                {/* AI Section */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Wand2 size={16} className="text-purple-600" />
                      AI Description Generator
                    </label>
                    {aiStatus === GeneratorStatus.SUCCESS && <span className="text-xs text-green-600 font-medium">Generated!</span>}
                  </div>
                  <InputField 
                    label="Keywords / Features (Optional)" 
                    value={aiKeywords} 
                    onChange={(e) => setAiKeywords(e.target.value)} 
                    placeholder="e.g. long battery, bass boost"
                    className="mb-2 bg-white"
                  />
                  <Button 
                    variant="magic" 
                    onClick={handleAiGenerate} 
                    isLoading={aiStatus === GeneratorStatus.LOADING}
                    className="w-full text-sm"
                    type="button"
                  >
                    Generate with Gemini
                  </Button>
                </div>

                <TextAreaField 
                  label="Description" 
                  name="description" 
                  value={product.description} 
                  onChange={handleInputChange} 
                  placeholder="Product description..."
                  rows={4}
                />

                <div className="border-t border-slate-100 pt-4 mt-2">
                   <div className="flex items-center gap-2 mb-4 pb-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs">2</span>
                    <h3 className="text-md font-bold text-slate-800">Call to Action</h3>
                  </div>
                  
                  <InputField 
                    label="WhatsApp Number (Optional)" 
                    name="whatsAppNumber" 
                    value={product.whatsAppNumber} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 1555123456"
                  />
                  
                  {!product.whatsAppNumber && (
                    <InputField 
                      label="Buy Link" 
                      name="buyLink" 
                      value={product.buyLink} 
                      onChange={handleInputChange} 
                      placeholder="https://..."
                    />
                  )}

                  <InputField 
                    label="Button Text" 
                    name="buttonText" 
                    value={product.buttonText} 
                    onChange={handleInputChange} 
                  />

                   <div className="flex items-center gap-4 mt-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Badge Label</label>
                      <select
                        name="badgeType"
                        value={product.badgeType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="none">None</option>
                        <option value="hot">HOT SALE (Red)</option>
                        <option value="black_friday">Black Friday (Black)</option>
                        <option value="coming_soon">Coming Soon (Blue)</option>
                        <option value="pre_order">Reservarlo Ahora (Green)</option>
                        <option value="sold_out">Agotado (Gray)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input 
                        type="checkbox" 
                        id="showStars" 
                        name="showStars" 
                        checked={product.showStars} 
                        onChange={handleInputChange}
                        className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      />
                      <label htmlFor="showStars" className="text-sm font-medium text-slate-700">Show Stars</label>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Preview & Code */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Preview */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Live Interactive Preview</h3>
                 <span className="text-xs text-slate-400">Click card to test modal</span>
              </div>
              <div className="bg-slate-200/50 p-8 rounded-2xl border border-slate-200 flex items-center justify-center min-h-[400px] relative">
                <ProductPreview data={product} />
              </div>
            </div>

            {/* Code Output */}
            <div className="space-y-2 h-96">
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Blogger HTML Code</h3>
               <CodeOutput data={product} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
