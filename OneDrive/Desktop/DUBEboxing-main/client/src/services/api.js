import {
  createItem,
  updateItem,
  deleteItem,
  getCollection,
  getSettings,
  saveSettings,
  parseFormData,
  trackPageVisit,
  getAnalyticsSummary,
  getDailyAnalytics,
} from './storage';

const ok = (data) => Promise.resolve({ data });

const activeOnly = (items) =>
  items.filter((item) => item.isActive !== false);

// Events API
export const eventsAPI = {
  getAll: () => ok(activeOnly(getCollection('events'))),
  getAllAdmin: () => ok(getCollection('events')),
  create: async (formData) => {
    const parsed = await parseFormData(formData);
    const event = createItem('events', {
      title: parsed.title,
      description: parsed.description || '',
      date: parsed.date,
      isActive: parsed.isActive !== false,
      posterImage: parsed._imageData || parsed.imageUrl || '',
    });
    return ok(event);
  },
  update: async (id, formData) => {
    const parsed = await parseFormData(formData);
    const existing = getCollection('events').find((e) => e._id === id);
    const updates = {
      title: parsed.title,
      description: parsed.description ?? existing?.description,
      date: parsed.date,
      isActive: parsed.isActive !== undefined ? parsed.isActive : existing?.isActive,
    };
    if (parsed._imageData) updates.posterImage = parsed._imageData;
    else if (parsed.imageUrl) updates.posterImage = parsed.imageUrl;
    const event = updateItem('events', id, updates);
    return ok(event);
  },
  delete: (id) => {
    deleteItem('events', id);
    return ok({ message: 'Event deleted' });
  },
};

// Gallery API
export const galleryAPI = {
  getAll: () => ok(activeOnly(getCollection('gallery'))),
  getAllAdmin: () => ok(getCollection('gallery')),
  create: async (formData) => {
    const parsed = await parseFormData(formData);
    const item = createItem('gallery', {
      title: parsed.title,
      description: parsed.description || '',
      category: parsed.category || 'gym',
      isActive: parsed.isActive !== false,
      imageUrl: parsed._imageData || parsed.imageUrl || '',
    });
    return ok(item);
  },
  update: async (id, formData) => {
    const parsed = await parseFormData(formData);
    const existing = getCollection('gallery').find((g) => g._id === id);
    const updates = {
      title: parsed.title,
      description: parsed.description ?? existing?.description,
      category: parsed.category || existing?.category,
      isActive: parsed.isActive !== undefined ? parsed.isActive : existing?.isActive,
    };
    if (parsed._imageData) updates.imageUrl = parsed._imageData;
    else if (parsed.imageUrl) updates.imageUrl = parsed.imageUrl;
    const item = updateItem('gallery', id, updates);
    return ok(item);
  },
  delete: (id) => {
    deleteItem('gallery', id);
    return ok({ message: 'Gallery item deleted' });
  },
};

// Team API
export const teamAPI = {
  getAll: () =>
    ok(
      activeOnly(getCollection('team')).sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      )
    ),
  getAllAdmin: () => ok(getCollection('team')),
  create: async (formData) => {
    const parsed = await parseFormData(formData);
    const member = createItem('team', {
      name: parsed.name,
      position: parsed.position,
      description: parsed.description || parsed.bio || '',
      order: parsed.order || 0,
      isActive: parsed.isActive !== false,
      imageUrl: parsed._imageData || parsed.imageUrl || '',
    });
    return ok(member);
  },
  update: async (id, formData) => {
    const parsed = await parseFormData(formData);
    const existing = getCollection('team').find((m) => m._id === id);
    const updates = {
      name: parsed.name,
      position: parsed.position,
      description: parsed.description ?? parsed.bio ?? existing?.description,
      order: parsed.order !== undefined ? parsed.order : existing?.order,
      isActive: parsed.isActive !== undefined ? parsed.isActive : existing?.isActive,
    };
    if (parsed._imageData) updates.imageUrl = parsed._imageData;
    else if (parsed.imageUrl) updates.imageUrl = parsed.imageUrl;
    const member = updateItem('team', id, updates);
    return ok(member);
  },
  delete: (id) => {
    deleteItem('team', id);
    return ok({ message: 'Team member deleted' });
  },
};

// Contact API (stored in settings)
export const contactAPI = {
  get: () => ok(getSettings().contactInfo),
  update: (data) => {
    const settings = saveSettings({ contactInfo: data });
    return ok(settings.contactInfo);
  },
};

// Settings API
export const settingsAPI = {
  get: () => ok(getSettings()),
  getAdmin: () => ok(getSettings()),
  update: (data) => {
    const settings = saveSettings(data);
    return ok({ message: 'Settings updated', settings });
  },
};

// Analytics API
export const analyticsAPI = {
  track: (page) => {
    trackPageVisit(page);
    return ok({ message: 'Visit tracked successfully' });
  },
  get: (period) => ok(getAnalyticsSummary(period)),
  getDaily: (days) => ok(getDailyAnalytics(days)),
};

export default { eventsAPI, galleryAPI, teamAPI, contactAPI, settingsAPI, analyticsAPI };
