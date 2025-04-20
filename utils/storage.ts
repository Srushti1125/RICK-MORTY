class StorageAdapter {
  set(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }

  getString(key: string): string | undefined {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const value = window.localStorage.getItem(key);
        return value || undefined;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }
    }
    return undefined;
  }

  delete(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
  }

  clearAll(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.clear();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  }
}

const storage = new StorageAdapter();
export default storage;
