import React, { useState, useMemo } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { shopProducts, shopCategories } from '../data/shopProducts';
import { contactInfo } from '../data/contactInfo';
import { getShopPurchaseUrl } from '../utils/whatsapp';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedSizes, setSelectedSizes] = useState({});

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return shopProducts;
    return shopProducts.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const setSize = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const needsSize = (product) =>
    Array.isArray(product.sizes) && product.sizes.length > 0;

  const canPurchase = (product) => {
    if (!needsSize(product)) return true;
    return Boolean(selectedSizes[product.id]);
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ paddingBottom: 'max(5.5rem, calc(5.5rem + env(safe-area-inset-bottom)))' }}
    >
      {/* Header — compact on mobile */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-10 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Club Shop
          </h1>
          <div className="w-16 sm:w-24 h-1 bg-primary-600 mx-auto mt-3" />
          <p className="mt-3 text-sm sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            Official Dube Boxing Club apparel and gear. Tap Buy on WhatsApp to order —
            we&apos;ll confirm size and availability with you.
          </p>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            Orders via WhatsApp: {contactInfo.whatsapp}
          </p>
        </div>
      </div>

      {/* Category filter — horizontal scroll on mobile */}
      <div className="sticky top-16 z-40 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200">
        <div
          className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto overscroll-x-contain scrollbar-hide"
          role="tablist"
          aria-label="Product categories"
        >
          {shopCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`gallery-tap-target flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                activeCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 active:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid — 1 col mobile, scales up on larger screens */}
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>No items in this category yet. Check back soon!</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const purchaseReady = canPurchase(product);
              const purchaseUrl = getShopPurchaseUrl(product, {
                size: selectedSizes[product.id],
              });

              return (
                <li
                  key={product.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col border border-gray-100"
                >
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/logo.jpg';
                      }}
                    />
                    <span className="absolute top-3 right-3 bg-primary-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
                      {product.price}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col flex-1 gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 leading-snug">
                        {product.name}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {needsSize(product) && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Select size
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setSize(product.id, size)}
                              className={`gallery-tap-target min-w-[44px] min-h-[44px] px-3 rounded-lg text-sm font-medium border transition-colors ${
                                selectedSizes[product.id] === size
                                  ? 'bg-primary-600 text-white border-primary-600'
                                  : 'bg-gray-50 text-gray-800 border-gray-200 active:bg-gray-100'
                              }`}
                              aria-pressed={selectedSizes[product.id] === size}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <a
                      href={purchaseReady ? purchaseUrl : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-disabled={!purchaseReady}
                      onClick={(e) => {
                        if (!purchaseReady) e.preventDefault();
                      }}
                      className={`gallery-tap-target mt-auto flex items-center justify-center gap-2 w-full min-h-[48px] py-3.5 rounded-xl text-base font-semibold transition-colors ${
                        purchaseReady
                          ? 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-md'
                          : 'bg-gray-200 text-gray-500 pointer-events-none cursor-not-allowed'
                      }`}
                    >
                      <FaWhatsapp size={22} aria-hidden />
                      {purchaseReady ? 'Buy on WhatsApp' : 'Select a size'}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-8 text-center text-xs sm:text-sm text-gray-500 px-2 leading-relaxed">
          Prices are indicative. Final price and stock confirmed on WhatsApp when you order.
        </p>
      </div>
    </div>
  );
};

export default Shop;
