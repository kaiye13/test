import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  applyTenantTheme(store: string): void {
    const body = document.body;

    // Remove any previous tenant classes
    body.classList.remove('hubo-theme', 'coeck-theme');

    // Apply the class based on the tenant
    if (store === 'hubo') {
      body.classList.add('hubo-theme');
    } else if (store === 'coeck') {
      body.classList.add('coeck-theme');
    } else if (store === 'gamma') {
      body.classList.add('gamma-theme');
    } else if (store === 'brico') {
      body.classList.add('brico-theme');
    }
  }
}