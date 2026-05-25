/** Default site content when localStorage is empty (e.g. first visit on Vercel). */
export const SEED_GALLERY = [
  {
    _id: 'seed-gallery-1',
    title: 'Boxing Training',
    description: 'Members training in the ring',
    category: 'classes',
    isActive: true,
    imageUrl: '/gallery/gym-1.jpg',
  },
  {
    _id: 'seed-gallery-2',
    title: 'Gym Floor',
    description: 'Our training space',
    category: 'gym',
    isActive: true,
    imageUrl: '/gallery/gym-2.jpg',
  },
  {
    _id: 'seed-gallery-3',
    title: 'Equipment',
    description: 'Quality training equipment',
    category: 'equipment',
    isActive: true,
    imageUrl: '/gallery/gym-3.jpg',
  },
  {
    _id: 'seed-gallery-4',
    title: 'Facilities',
    description: 'Club facilities',
    category: 'facilities',
    isActive: true,
    imageUrl: '/gallery/gym-4.jpg',
  },
  {
    _id: 'seed-gallery-5',
    title: 'Team Training',
    description: 'Group session',
    category: 'classes',
    isActive: true,
    imageUrl: '/gallery/gym-5.jpg',
  },
];

export const SEED_VERSION = '1';
