import { SHOP_WHATSAPP } from '../data/shopProducts';

export function shopWhatsAppDigits() {
  return SHOP_WHATSAPP.replace(/\D/g, '');
}

/**
 * Opens WhatsApp with a pre-filled order message for a shop item.
 */
export function openShopWhatsApp({ productName, priceLabel, sizes }) {
  const sizeHint =
    sizes && sizes.length > 0
      ? ` Preferred size: (please specify: ${sizes.join(', ')}).`
      : '';

  const message = [
    'Hi Dube Boxing Club!',
    '',
    `I would like to order: ${productName}`,
    priceLabel ? `(${priceLabel})` : '',
    sizeHint,
    '',
    'Please confirm availability, price, and collection or delivery options.',
    'Thank you!',
  ]
    .filter(Boolean)
    .join('\n');

  const url = `https://wa.me/${shopWhatsAppDigits()}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function openShopWhatsAppGeneral() {
  const message = [
    'Hi Dube Boxing Club!',
    '',
    'I would like to browse or order gym merchandise from your shop.',
    'Please help me with sizes, stock, and pricing.',
    'Thank you!',
  ].join('\n');

  const url = `https://wa.me/${shopWhatsAppDigits()}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
