/**
 * Gym gallery — equipment & facility photos (static, no database).
 * Order: most important for customers first (ring → weights → cardio).
 */
const galleryFiles = [
  'WhatsApp Image 2025-07-13 at 09.57.14_afc98d64.jpg', // boxing ring — full view
  'WhatsApp Image 2025-07-13 at 09.57.14_edd057d7.jpg', // boxing ring — corner detail
  'WhatsApp Image 2025-07-13 at 09.57.14_5c8be097.jpg', // free weights & equipment
  'WhatsApp Image 2025-07-13 at 09.57.14_a59ae340.jpg', // cardio area (mezzanine)
  'WhatsApp Image 2025-07-13 at 09.57.14_3cc7860c.jpg', // cardio bikes & rowers
];

export const galleryImages = galleryFiles.map(
  (file) => `/gallery/${encodeURIComponent(file)}`
);
