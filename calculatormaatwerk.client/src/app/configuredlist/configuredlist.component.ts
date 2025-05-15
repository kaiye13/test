import { Component, Input, HostListener, OnInit } from '@angular/core';
import { IWindowSillConfigurationListItem } from '../models/windowsillconfigurationlistitem.model';
import { Router } from '@angular/router'; // Import the Router module
import { TranslateService } from '@ngx-translate/core';
import { IProduct } from '../models/product.model';
import { HttpProductService } from '../httpproduct.service';
import { IProductRequestMessage } from '../models/productrequestmessage.model';
import * as CryptoJS from 'crypto-js';
import { forEach } from 'lodash';

@Component({
  selector: 'app-configuredlist',
  templateUrl: './configuredlist.component.html',
  styleUrl: './configuredlist.component.css'
})
export class ConfiguredlistComponent implements OnInit {
  @Input() products: IProduct[] = [];
  @Input() order!: IProductRequestMessage;
  @Input() valuta: string = '';
  lang: string = '';
  store: string = '';
  isMobile: boolean = false;
  amountOfProducts: number = 0;
  nicknameUsed: boolean = false;
  isSummaryVisible: boolean = false;
  public isLoading: boolean = true;
  public showLoadingMessage: boolean = false;
  isBtwUsed: boolean = false;
  constructor(private router: Router, private service: HttpProductService,  private translate: TranslateService) {} 

  ngOnInit(): void {
const path = this.router.url.split('?')[0];
const segments = path.split('/');

this.store = segments[1];
this.lang = segments[2];
    this.checkIfMobile();
    this.isLoading = true;
    this.service.checkIfStoreHasValuta(this.store).subscribe(valuta => { this.valuta = valuta; });
    const orderInStorage = Number(sessionStorage.getItem('order'));
    if (orderInStorage) {
      this.service.getOrder(this.store, this.lang, orderInStorage).subscribe(order => {
        this.order = order;
        this.products = order.products;
        this.checkIfLoadingComplete();
        this.calculateAmountOfProducts();
        this.checkIfBtw();
      });
    }
    setTimeout(() => {
      if (this.isLoading) {
        this.showLoadingMessage = true;
      }
    }, 50000);

  this.translate.use(this.lang).subscribe(() => {
  });

  setTimeout(() => {
    if (this.isLoading) {
      this.showLoadingMessage = true;
    }
  }, 50000);
  this.checkIfLoadingComplete();
  }

  calculateAmountOfProducts(): void {
    let amount= 0;
    forEach(this.order.products, product => {
     amount += product.quantity;
    });
  this.amountOfProducts = amount;
  }

  checkForNickname(product : IProduct): string {
   let nickname = product.materials.find(material => material.code === 'Nickname');
   if(nickname) {
    this.nicknameUsed = true;
     return nickname.value;
   }
   this.nicknameUsed = false;
   return product.title;
  }

  checkIfBtw(): void {
    this.isBtwUsed = this.order.products.some(product => product.materials.some(material => material.code ===  'BTW'));
  }

  checkIfLoadingComplete(): void {
    if (this.order && this.products ) {
      this.isLoading = false;
      this.showLoadingMessage = false;
      // this.calculateAmountOfProducts(); // Reset the loading message flag
    }
  }

    increaseQuantity(index: number) {
      this.order.products[index].quantity++;
      this.order.products[index].price = this.order.products[index].unitPrice * this.order.products[index].quantity;
      this.products = this.order.products;
      this.updateOrderInStorage();
    }
  
    private updateOrderInStorage(): void {
      this.service.postOrder(this.store, this.lang, this.order).subscribe(id => {
        if (id === null) {
          sessionStorage.removeItem('order');
          sessionStorage.removeItem('products');
          this.addNewProduct();
        } else {
          sessionStorage.setItem('order', JSON.stringify(id));
        }
      });
      this.calculateAmountOfProducts();
    }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkIfMobile();
  }


  checkout(): void {
    this.service.SendWindowsillOrder(this.store, this.lang, this.order).subscribe(() => {
    });
    sessionStorage.removeItem('products');
    sessionStorage.removeItem('order');
    this.router.navigate([`${this.store}/${this.lang}`]);
  }
  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768; // Set breakpoint for mobile devices
  }

  toggleCartSummary(): void {
    this.isSummaryVisible = !this.isSummaryVisible;
  }

  // Decrease product quantity
  decreaseQuantity(index: number) {
    if(this.order.products[index].quantity > 1) {
      this.order.products[index].quantity--;
      this.order.products[index].price = this.order.products[index].unitPrice * this.order.products[index].quantity;
      this.updateOrderInStorage();    }
  }

  // Remove product from list
  removeProduct(index: number) {
    this.order.products.splice(index, 1);
    this.updateOrderInStorage() 
   }

  // go back to the route
  addNewProduct() {
    this.router.navigate([`${this.store}/${this.lang}`]);
  }

  getSubtotal() {
    return Math.round(this.products.reduce((acc, product) => acc + (product.unitPrice * product.quantity), 0) * 100) / 100;
  }

  getVat() {
    return Math.round(this.getSubtotal() * 0.21 * 100) / 100;
  }

  getTotal() {
    if (this.isBtwUsed) {
      return this.getSubtotal() + this.getVat();
    }
    return this.getSubtotal();
  }
}
