export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TimetableDB', 2);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('reports')) {
        db.createObjectStore('reports', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('reports_meta')) {
        const metaStore = db.createObjectStore('reports_meta', { keyPath: 'id' });
        metaStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains('reports_content')) {
        db.createObjectStore('reports_content', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveReport = async (report) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['reports_meta', 'reports_content'], 'readwrite');
    tx.objectStore('reports_meta').put({ id: report.id, title: report.title, createdAt: report.createdAt });
    tx.objectStore('reports_content').put({ id: report.id, content: report.content });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getReportsMeta = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('reports_meta', 'readonly');
    const store = tx.objectStore('reports_meta');
    const index = store.index('createdAt');
    const request = index.openCursor(null, 'prev');
    const results = [];
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

export const getReportContent = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('reports_content', 'readonly');
    const store = tx.objectStore('reports_content');
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result?.content);
    request.onerror = () => reject(request.error);
  });
};

export const deleteReport = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['reports_meta', 'reports_content'], 'readwrite');
    tx.objectStore('reports_meta').delete(id);
    tx.objectStore('reports_content').delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};
