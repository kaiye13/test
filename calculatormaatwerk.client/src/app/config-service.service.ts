import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public apiUrl: string = '';

  constructor(private http: HttpClient) {}

  loadConfig() {
    return this.http.get('/assets/config.json').toPromise().then((config: any) => {
      this.apiUrl = config.apiUrl;
    });
  }
}