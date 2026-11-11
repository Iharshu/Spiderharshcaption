import { CaptionProject } from '../types';

const DB_NAME = 'SpiderHarshCaptionDB';
const DB_VERSION = 1;
const PROJECTS_STORE = 'projects';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(PROJECTS_STORE)) {
        const store = db.createObjectStore(PROJECTS_STORE, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveProject(project: CaptionProject): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PROJECTS_STORE, 'readwrite');
      const store = tx.objectStore(PROJECTS_STORE);
      // Strip File object reference if present before saving to IDB to avoid clone issues
      const storableProject = {
        ...project,
        updatedAt: Date.now(),
        video: project.video
          ? {
              name: project.video.name,
              url: project.video.url.startsWith('blob:') ? '' : project.video.url,
              duration: project.video.duration,
              width: project.video.width,
              height: project.video.height,
              size: project.video.size,
              type: project.video.type
            }
          : null
      };

      const request = store.put(storableProject);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, falling back to localStorage', err);
    try {
      localStorage.setItem(`spider_proj_${project.id}`, JSON.stringify(project));
    } catch (e) {
      console.error(e);
    }
  }
}

export async function getProject(id: string): Promise<CaptionProject | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PROJECTS_STORE, 'readonly');
      const store = tx.objectStore(PROJECTS_STORE);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    const fallback = localStorage.getItem(`spider_proj_${id}`);
    return fallback ? JSON.parse(fallback) : null;
  }
}

export async function listProjects(): Promise<CaptionProject[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PROJECTS_STORE, 'readonly');
      const store = tx.objectStore(PROJECTS_STORE);
      const request = store.getAll();
      request.onsuccess = () => {
        const results: CaptionProject[] = request.result || [];
        // Sort descending by updatedAt
        results.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed listing from IndexedDB, reading localStorage', err);
    const projects: CaptionProject[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('spider_proj_')) {
        try {
          projects.push(JSON.parse(localStorage.getItem(key)!));
        } catch (e) {}
      }
    }
    return projects;
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PROJECTS_STORE, 'readwrite');
      const store = tx.objectStore(PROJECTS_STORE);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    localStorage.removeItem(`spider_proj_${id}`);
  }
}

// Favorite templates management
const FAVORITES_KEY = 'spider_favorite_templates';
export function getFavoriteTemplates(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : ['reels-001', 'neon-002', 'podcast-001'];
  } catch {
    return [];
  }
}

export function toggleFavoriteTemplate(templateId: string): string[] {
  const current = getFavoriteTemplates();
  const next = current.includes(templateId)
    ? current.filter(id => id !== templateId)
    : [...current, templateId];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next;
}

// Recently used templates
const RECENT_TEMPLATES_KEY = 'spider_recent_templates';
export function getRecentlyUsedTemplates(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : ['reels-001', 'podcast-001', 'neon-001', 'karaoke-001'];
  } catch {
    return [];
  }
}

export function addRecentlyUsedTemplate(templateId: string): void {
  const current = getRecentlyUsedTemplates().filter(id => id !== templateId);
  const updated = [templateId, ...current].slice(0, 12);
  localStorage.setItem(RECENT_TEMPLATES_KEY, JSON.stringify(updated));
}
