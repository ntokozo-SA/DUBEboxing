import { contactInfo, defaultWhatsAppMessage } from '../data/contactInfo';

/** Digits only, with country code — for wa.me links */
export const whatsappDigits = (phone = contactInfo.whatsapp) =>
  phone.replace(/\D/g, '');

export const getWhatsAppUrl = (
  message = defaultWhatsAppMessage,
  phone = contactInfo.whatsapp
) => `https://wa.me/${whatsappDigits(phone)}?text=${encodeURIComponent(message)}`;

export const openWhatsApp = (
  message = defaultWhatsAppMessage,
  phone = contactInfo.whatsapp
) => {
  window.open(getWhatsAppUrl(message, phone), '_blank', 'noopener,noreferrer');
};

export const getShopPurchaseMessage = (product, { size } = {}) => {
  let message = `Hi! I'd like to purchase: ${product.name}`;
  if (product.price) message += ` (${product.price})`;
  if (size) message += `\nSize: ${size}`;
  message +=
    '\n\nPlease let me know availability and payment details. Thank you!';
  return message;
};

export const getShopPurchaseUrl = (product, options) =>
  getWhatsAppUrl(getShopPurchaseMessage(product, options));
