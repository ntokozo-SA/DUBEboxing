import React, { useMemo, useState } from 'react';
import { FaWhatsapp, FaShoppingBag } from 'react-icons/fa';
import {
  SHOP_CATEGORIES,
  SHOP_PRODUCTS,
  SHOP_WHATSAPP,
} from '../data/shopProducts';
import { openShopWhatsApp, openShopWhatsAppGeneral } from '../utils/whatsappShop';
import { publicAsset, resolveImageUrl } from '../utils/imageUrl';

const PLACEHOLDER_IMAGE = publicAsset('/logo.jpg');

const Shop = () => {
  const [category, setCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    if (category === 'all') return SHOP_PRODUCTS;
    return SHOP_PRODUCTS.filter((item) => item.category === category);
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50 pb-28 md:pb-12">
      {/* Hero — compact on mobile */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-6 sm:px-6 sm:pt-10 lg:px-8">
          <div className="flex items-start gap-3 sm:items-center">
            <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FaShoppingBag className="text-primary-600 text-lg sm:text-xl" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Club Shop
              </h1>
              <p className="mt-1 text-sm sm:text-lg text-gray-600 leading-snug">
                Official Dube Boxing Club apparel and gear. Tap Buy on WhatsApp to order.
              </p>
            </div>
          </div>
          <div className="w-16 h-1 bg-primary-600 mt-4" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category pills — horizontal scroll on mobile */}
        <div
          className="-mx-4 px-4 sm:mx-0 sm:px-0 mt-5 flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Product categories"
        >
          {SHOP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={category === cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex-shrink-0 snap-start px-4 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 min-h-[44px] ${
                category === cat.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 active:bg-primary-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* How to order — visible first on small screens */}
        <div className="mt-5 p-4 bg-green-50 border border-green-100 rounded-xl sm:mt-6">
          <p className="text-sm text-green-900 leading-relaxed">
            <span className="font-semibold">How to order:</span> Choose an item, tap{' '}
            <span className="font-semibold">Buy on WhatsApp</span>, and we will confirm size,
            stock, and payment with you on{' '}
            <span className="whitespace-nowrap font-medium">{SHOP_WHATSAPP}</span>.
          </p>
        </div>

        {/* Product grid — 1 col mobile, scales up on larger screens */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">No items in this category right now.</p>
          </div>
        ) : (
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 lg:mt-8">
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
              >
                <div className="relative aspect-[4/5] sm:aspect-square bg-gray-100">
                  <img
                    src={resolveImageUrl(product.imageUrl)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      if (e.target.src !== PLACEHOLDER_IMAGE) {
                        e.target.src = PLACEHOLDER_IMAGE;
                        e.target.className =
                          'w-full h-full object-contain p-8 bg-white';
                      }
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-bold px-2.5 py-1 rounded-full capitalize">
                    {product.category.replace('-', ' ')}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-4">
                  <h2 className="text-lg font-bold text-gray-900 leading-snug">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-primary-600 font-semibold text-base">
                    {product.priceLabel}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">
                    {product.description}
                  </p>
                  {product.sizes && (
                    <p className="mt-2 text-xs text-gray-500">
                      Sizes: {product.sizes.join(' · ')}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      openShopWhatsApp({
                        productName: product.name,
                        priceLabel: product.priceLabel,
                        sizes: product.sizes,
                      })
                    }
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold rounded-xl py-3.5 min-h-[48px] text-base transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                  >
                    <FaWhatsapp size={20} aria-hidden="true" />
                    Buy on WhatsApp
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sticky mobile CTA — easy thumb reach */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={openShopWhatsAppGeneral}
          className="w-full flex items-center justify-center gap-2 bg-green-500 active:bg-green-700 text-white font-semibold rounded-xl py-3.5 min-h-[48px] text-base"
        >
          <FaWhatsapp size={20} aria-hidden="true" />
          Order via WhatsApp
        </button>
        <p className="text-center text-xs text-gray-500 mt-1.5">{SHOP_WHATSAPP}</p>
      </div>
    </div>
  );
};

export default Shop;
