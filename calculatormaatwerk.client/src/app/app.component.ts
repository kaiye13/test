import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private env!: string;
  constructor(private router: Router, private themeService: ThemeService,) { }
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const store = this.getStoreFromRoute();
        this.themeService.applyTenantTheme(store);
        this.getApiUrl();
        this.sendResizeMessage();
      }
    });
    setTimeout(() => this.sendResizeMessage(), 500);

  }
  private getApiUrl() {
    const currentOrigin = window.location.origin;

    if (currentOrigin.includes("microsite-tst.coeck.be") ||  currentOrigin.includes("https://jolly-sea-05c3fb603.5.azurestaticapps.net/")){
      this.env = "test";
    }else if (currentOrigin.includes("localhost")) {
      this.env = "development";
    }
     else {
      this.env = "production";
    }
  }

  sendResizeMessage() {
    setTimeout(() => {
      const newHeight = document.documentElement.scrollHeight;
      const message = {
        action: 'RESIZE',
        height: newHeight
      };
      if (this.env === "development") {

            window.parent.postMessage(JSON.stringify(message), 'http://127.0.0.1:5500/');
      } else if (this.env === "test") {
            window.parent.postMessage(JSON.stringify(message), 'https://www.omni2-prep.hubo.be/');
            window.parent.postMessage(JSON.stringify(message), 'https://www.omni2-test.hubo.be/');
            window.parent.postMessage(JSON.stringify(message), 'https://www.omni2-acpt.hubo.be/');

      } else if (this.env === "production") {
            window.parent.postMessage(JSON.stringify(message), 'https://www.hubo.be');
      }
    }, 300); 
  }

  getStoreFromRoute(): string {
    const urlSegments = this.router.url.split('/');
    return urlSegments[1]; 
  }}
