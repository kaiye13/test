import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IWindowsillPrice } from './models/windowsillprice.model';
import { WindowSill } from './models/windowsill.model';
import { IWindowsillFilter } from './models/windowsillfilter.model';
import { IWindowSillConfiguration } from './models/windowsillconfiguration.model';
import { IProductProperties } from './models/windowsillconfigurationproperties.model';
import { IWindowsillPictures } from './models/windowsillpictures.model';
import { IProductRequestMessage, IProductRequestMessageResponse } from './models/productrequestmessage.model';
import { environment } from '../environments/environment';
import { ConfigService } from './config-service.service';
import { Action, getActionString } from './models/actionenum.model';


@Injectable({
  providedIn: 'root'
})
export class HttpProductService {
  //private apiUrl: string = environment.apiUrl;
  private apiUrl: string = this.getApiUrl();
  private env!: string;


  constructor(private http: HttpClient, private configservice: ConfigService) {
    this.apiUrl = this.getApiUrl();
   }

  get uri() {
    return this.configservice.apiUrl;
  }
  private getApiUrl(): string {
    const currentOrigin = window.location.origin;

    if (currentOrigin.includes("microsite-tst.coeck.be") ||  currentOrigin.includes("https://jolly-sea-05c3fb603.5.azurestaticapps.net/")){
      // Use test API URL if running on test domain
      this.env = "test";
      return "https://calculatormaatwerkapi.azurewebsites.net/Windowsill/";
    }else if (currentOrigin.includes("localhost")) {
      this.env = "development";
      return "https://localhost:7224/Windowsill/";
    }
     else {
      this.env = "production";
      // Default to production API URL
      return "https://calculatormaatwerkapi-live-cyb0gyaqfxdzd6d5.westeurope-01.azurewebsites.net/Windowsill/";
    }
  }

  public checkIfStoreHasValuta(store: string): Observable<string> {
    return this.http.post(this.apiUrl + 'CheckIfStoreHasValuta/' + store, null, { responseType: 'text' })
      .pipe(map(response => response as string));
  }
  public GetWindowsillsForStore(store: string, language: string): Observable<WindowSill> {
    return this.http.post<WindowSill>(this.apiUrl +'GetWindowsillsForStore/'+ store + '/' + language ,null);
  }
  public postOrder(store:string, language: string, order: IProductRequestMessage): Observable<number> {
    return this.http.post(this.apiUrl + 'PostOrderPiece/' + store + '/' + language, order, { responseType: 'json' }).pipe(map(response => response as number));
  }
  public getOrder(store: string, language: string, order: number): Observable<IProductRequestMessage> {
    return this.http.post<IProductRequestMessage>(this.apiUrl + 'GetOrder/' + store + '/' + language + '/' + order, null);
  }
  public GetMinAndMaxPriceWindowsills(): Observable<IWindowsillPrice> {
    return this.http.post<IWindowsillPrice>(this.apiUrl + 'GetMinAndMaxPriceWindowills/hubo', null);
  }
  public GetWindowsillByIdPictures(store: string, coeckid: string): Observable<IWindowsillPictures>{
    return this.http.post<IWindowsillPictures>(this.apiUrl + 'GetWindowsillByIdPictures/'+ store + '/' + coeckid, null);
  }
  public GetFiltersForWindowsills(store: string , language: string): Observable<IWindowsillFilter[]> {
    return this.http.post<IWindowsillFilter[]>(this.apiUrl + 'GetFiltersForWindowsills/' + store + '/' + language, null);
  }
  public GetWindowsillById(store: string, language: string, coeckid: string): Observable<WindowSill> {
    return this.http.post<WindowSill>(this.apiUrl + store + '/'+ language + '/'+ coeckid , null);
  }
  public GetWindowsillConfigurator(store:string , lang: string): Observable<IWindowSillConfiguration[]> {
    return this.http.post<IWindowSillConfiguration[]>(this.apiUrl + 'GetWindowstillCongirugatorOptions/' + store +'/'+ lang, null);
  }
  public GetWindowsillConfigurationPropertiesById(store: string, language: string, coeckid: string): Observable<IProductProperties> {
    return this.http.post<IProductProperties>(this.apiUrl + 'GetWindowsillConfigurationProperties/' + store + '/' + language + '/' + coeckid , null);
  }
  public SendWindowsillOrder(store: string, language: string, order: IProductRequestMessage): Observable<IProductRequestMessageResponse> {
    var madeOrder = this.http.post<IProductRequestMessageResponse>(this.apiUrl + 'SendWindowsillOrder/' + store + '/' + language, order);
    if (this.env === "development") {
      madeOrder = madeOrder.pipe(
        map(orderResponse => {
          console.log(orderResponse);
          window.parent.postMessage(JSON.stringify(orderResponse), 'http://127.0.0.1:5500/');
          return orderResponse;
        })
      );
    } else if (this.env === "test") {
      madeOrder = madeOrder.pipe(
        map(orderResponse => {
          window.parent.postMessage(JSON.stringify(orderResponse), 'https://www.omni2-prep.hubo.be/');
          window.parent.postMessage(JSON.stringify(orderResponse), 'https://www.omni2-test.hubo.be/');
          window.parent.postMessage(JSON.stringify(orderResponse), 'https://www.omni2-acpt.hubo.be/');
          return orderResponse;

        })
        
      );
    } else if (this.env === "production") {
      madeOrder = madeOrder.pipe(
        map(orderResponse => {
          window.parent.postMessage(JSON.stringify(orderResponse), 'https://www.hubo.be');
          return orderResponse;

        })
      );
    }
    return madeOrder;
  }
}