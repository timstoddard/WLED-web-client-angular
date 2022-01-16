import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  /**
   * Takes a key parameter and a value parameter. The key allows you to retrieve the value later using lookups. The value is stored as a JSON string. This method does not return anything.
   * @param key 
   * @param data 
   */
  set(key: string, data: string | number | boolean | Object): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Takes a key parameter for looking up data in storage. If this lookup fails it will return a null value.
   * @param key 
   */
  get<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    return value !== null ? JSON.parse(value) : value;
  }

  /**
   * Takes a key parameter for looking up data in storage.
   * @param key 
   */
  remove(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * Takes no parameters. Clears all data in local storage.
   */
  clear() {
    localStorage.clear();
  }
}
