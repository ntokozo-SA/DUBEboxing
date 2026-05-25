import { contactInfo } from '../data/contactInfo';

/** Search query for maps (defaults to street address). */
export const getMapQuery = () => contactInfo.mapQuery || contactInfo.address;

export const getMapEmbedUrl = () =>
  `https://www.google.com/maps?q=${encodeURIComponent(getMapQuery())}&output=embed`;

export const getMapDirectionsUrl = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getMapQuery())}`;
