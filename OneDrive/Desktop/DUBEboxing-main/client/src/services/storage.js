const STORAGE_KEYS = {
  events: 'dube_events',
  gallery: 'dube_gallery',
  team: 'dube_team',
  settings: 'dube_settings',
  analytics: 'dube_analytics',
};

export const DEFAULT_SETTINGS = {
  homeVideoUrl: '',
  gymHistory:
    'Welcome to Dube Boxing Club! We are dedicated to helping you achieve your fitness and boxing goals.',
  contactInfo: {
    whatsapp: '+27 76 662 3761',
    email: 'klethiba25@gmail.com',
    address: 'Mahalefele road, johannesburg, south africa 1801',
  },
};

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const readCollection = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeCollection = (key, items) => {
  localStorage.setItem(key, JSON.stringify(items));
};

export const getSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

export const saveSettings = (settings) => {
  const merged = { ...getSettings(), ...settings };
  if (settings.contactInfo) {
    merged.contactInfo = { ...getSettings().contactInfo, ...settings.contactInfo };
  }
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(merged));
  return merged;
};

export const getCollection = (key) => readCollection(STORAGE_KEYS[key]);

export const saveCollection = (key, items) => writeCollection(STORAGE_KEYS[key], items);

export const createItem = (key, data) => {
  const items = readCollection(STORAGE_KEYS[key]);
  const item = { _id: generateId(), createdAt: new Date().toISOString(), ...data };
  items.unshift(item);
  writeCollection(STORAGE_KEYS[key], items);
  return item;
};

export const updateItem = (key, id, updates) => {
  const items = readCollection(STORAGE_KEYS[key]);
  const index = items.findIndex((item) => item._id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
  writeCollection(STORAGE_KEYS[key], items);
  return items[index];
};

export const deleteItem = (key, id) => {
  const items = readCollection(STORAGE_KEYS[key]);
  const filtered = items.filter((item) => item._id !== id);
  writeCollection(STORAGE_KEYS[key], filtered);
  return filtered.length < items.length;
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const parseFormData = async (formData) => {
  const result = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof File && value.size > 0) {
      result._imageData = await fileToDataUrl(value);
    } else if (key === 'isActive') {
      result.isActive = value === 'true' || value === true;
    } else if (key === 'order') {
      result.order = parseInt(value, 10) || 0;
    } else {
      result[key] = value;
    }
  }
  return result;
};

const getAnalyticsRecords = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.analytics);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveAnalyticsRecords = (records) => {
  localStorage.setItem(STORAGE_KEYS.analytics, JSON.stringify(records));
};

export const trackPageVisit = (page) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateKey = today.toISOString().split('T')[0];
  const records = getAnalyticsRecords();
  const existing = records.find((r) => r.page === page && r.date === dateKey);

  if (existing) {
    existing.visitCount += 1;
    existing.lastVisited = new Date().toISOString();
  } else {
    records.push({
      page,
      date: dateKey,
      visitCount: 1,
      lastVisited: new Date().toISOString(),
    });
  }

  saveAnalyticsRecords(records);
};

export const getAnalyticsSummary = (periodDays) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - periodDays);
  startDate.setHours(0, 0, 0, 0);

  const records = getAnalyticsRecords().filter((r) => new Date(r.date) >= startDate);

  const byPage = {};
  records.forEach((r) => {
    if (!byPage[r.page]) {
      byPage[r.page] = { _id: r.page, totalVisits: 0, lastVisited: r.lastVisited };
    }
    byPage[r.page].totalVisits += r.visitCount;
    if (new Date(r.lastVisited) > new Date(byPage[r.page].lastVisited)) {
      byPage[r.page].lastVisited = r.lastVisited;
    }
  });

  const analytics = Object.values(byPage).sort((a, b) => b.totalVisits - a.totalVisits);
  const totalVisits = analytics.reduce((sum, item) => sum + item.totalVisits, 0);

  return { analytics, totalVisits, period: periodDays };
};

export const getDailyAnalytics = (periodDays) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - periodDays);
  startDate.setHours(0, 0, 0, 0);

  const records = getAnalyticsRecords().filter((r) => new Date(r.date) >= startDate);
  const grouped = {};

  records.forEach((r) => {
    const key = `${r.page}|${r.date}`;
    if (!grouped[key]) {
      grouped[key] = { _id: { page: r.page, date: r.date }, visits: 0 };
    }
    grouped[key].visits += r.visitCount;
  });

  return Object.values(grouped).sort((a, b) => a._id.date.localeCompare(b._id.date));
};
