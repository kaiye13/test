import { Component, Input, OnInit } from '@angular/core';
import { HttpProductService } from '../httpproduct.service';
import { WindowSill } from '../models/windowsill.model';
import * as _ from 'lodash';
import { IWindowsillFilter } from '../models/windowsillfilter.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  @Input() public windowsills: WindowSill | undefined;
  @Input() public windowsillWithId: WindowSill | undefined;
  @Input() public valuta: string = '';
  public filters!: IWindowsillFilter[];
  public filteredProducts: WindowSill[] = [];
  public isSessionAvailable: boolean = false;
  public isFilterModalOpen: boolean = false;
  public isLoading: boolean = true;
  public sortOption: string = 'relevance';
  public isDropdownOpen: boolean = false;
  public windowsillWithIdLoading: boolean = true;
  public lang: string = '';
  public store: string = '';
  public totalResults: number = 0;
  public currentPage: number = 1;
  public productsPerPage: number = 9;
  public totalPages: number[] = [];
  public isMobile!: boolean;
  deepfilters!: IWindowsillFilter[];
  public showLoadingMessage: boolean = false;
  public showWorkOnGoingMessage: boolean = false;

  constructor(
    private service: HttpProductService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const path = this.router.url.split('?')[0];
    const segments = path.split('/');

    this.store = segments[1];
    this.lang = segments[2];
    this.translate.use(this.lang).subscribe(() => {});
    this.isMobile = window.innerWidth <= 968;

    // Set a timeout to show the loading message after 5 seconds
    setTimeout(() => {
      if (this.isLoading) {
        this.showLoadingMessage = true;
        setTimeout(() => {
          if (this.isLoading) {
            this.showWorkOnGoingMessage = true;
          }
        }, 5000);
      }
    }, 5000);
  
    this.service.GetWindowsillsForStore(this.store, this.lang).subscribe(windowsills => {
      this.windowsills = windowsills;
      this.filteredProducts = Array.isArray(this.windowsills) ? _.cloneDeep(this.windowsills) : [];
      this.checkIfLoadingComplete();
    });
  
    this.service.checkIfStoreHasValuta(this.store).subscribe(valuta => { this.valuta = valuta; });
    this.service.GetFiltersForWindowsills(this.store, this.lang).subscribe(filters => {
      this.filters = filters;
      if (!sessionStorage.getItem(`filters[${this.lang}]`)) {
        sessionStorage.setItem(`filters[${this.lang}]`, JSON.stringify(this.filters));
      }
      const filtersFromSession = sessionStorage.getItem(`filters[${this.lang}]`);
      this.deepfilters = filtersFromSession ? JSON.parse(filtersFromSession) : [];
      this.totalResults = this.filteredProducts.length;
      this.checkIfLoadingComplete();
    });
    this.calculateTotalPages();
    console.log(this.valuta);
    this.isSessionAvailable = !!sessionStorage.getItem('order');
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  openFilterModal(): void {
    if (!this.isLoading) {
      this.isFilterModalOpen = true;
    }
  }

  closeFilterModal(): void {
    this.isFilterModalOpen = false;
  }

  checkIfLoadingComplete(): void {
    if (this.windowsills && this.filteredProducts && this.filters) {
      this.isLoading = false;
      this.showLoadingMessage = false; // Reset the loading message flag
      this.calculateTotalPages();
    }
  }

  filterProductsWindowsill(filterGroups: IWindowsillFilter[]): void {
    this.filteredProducts = Array.isArray(this.windowsills) ? _.cloneDeep(this.windowsills) : [];
    sessionStorage.setItem('filterGroups', JSON.stringify(filterGroups));
    filterGroups.forEach(group => {
      if (group.value && Array.isArray(group.value)) {
        switch (group.name) {
          case 'MinMaxPrices':
            this.filteredProducts = this.filteredProducts.filter(
                product => Array.isArray(group.value) && product.price >= group.value[0] && product.price <= group.value[1]
              );
            break;
          case 'MinMaxWidths':
            this.filteredProducts = this.filteredProducts.filter(
              product => Array.isArray(group.value) && product.minWidth <= group.value[0] && product.minWidth <= group.value[1] && product.maxWidth >= group.value[1] && product.maxWidth >= group.value[0]
            );
            break;
          case 'MinMaxLengths':
            this.filteredProducts = this.filteredProducts.filter(
              product => Array.isArray(group.value) && product.minLength <= group.value[0] && product.minLength <= group.value[1] && product.maxLength >= group.value[1] && product.maxLength >= group.value[0]
            );
            break;
          case 'Colors':
            this.filteredProducts = this.filteredProducts.filter(product =>
              Array.isArray(group.value) && group.value.includes(product.color)
            );
            break;
          case 'Type':
            this.filteredProducts = this.filteredProducts.filter(product =>
              Array.isArray(group.value) && group.value.includes(product.type)
            );
            break;
          case 'IsFourSidesOnlay':
            this.filteredProducts = this.filteredProducts.filter(product =>
              Array.isArray(group.value) && group.value.map(v => v.toLowerCase()).includes(product.isFourSidesOnlay.toString())
            );
            break;
        }
      }
    });
    this.totalResults = this.filteredProducts.length;
    this.calculateTotalPages();
  }

  navigateToConfiguredList(): void {
    if (this.isSessionAvailable) {
      this.router.navigate([`${this.store}/${this.lang}/configuredlist`]);
    }
  }
  calculateTotalPages(): void {
    const pageCount = Math.ceil(this.totalResults / this.productsPerPage);
    this.totalPages = Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  sortProducts(): void {
    if (this.sortOption === 'priceLowToHigh') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'priceHighToLow') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    } else if (this.sortOption === 'relevance') {
      this.filteredProducts.sort((a, b) => Number(a.referenceCoeck) - Number(b.referenceCoeck));
    }
  }

  getSortOptionLabel(): string {
    switch (this.sortOption) {
      case 'priceLowToHigh':
        return 'Price Low-High';
      case 'priceHighToLow':
        return 'Price High-Low';
      default:
        return 'Relevance';
    }
  }

  setSortOption(option: string): void {
    this.sortOption = option;
    this.sortProducts();
    this.isDropdownOpen = false;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.goToPage(this.currentPage);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages.length) {
      this.currentPage++;
      this.goToPage(this.currentPage);
    }
  }

  goToProductConfiguration(product: WindowSill): void {
    this.service.GetWindowsillById(this.store, this.lang, product.referenceCoeck).subscribe(windowsillWithId => {
      this.windowsillWithId = windowsillWithId;
      this.windowsillWithIdLoading = false;
      if (!this.windowsillWithIdLoading) {
        sessionStorage.setItem('windowsillWithId', JSON.stringify(this.windowsillWithId));
        this.router.navigate([`/${this.store}/${this.lang}`, 'configurator', this.windowsillWithId?.referenceCoeck]);
      }
    });
    sessionStorage.removeItem('filterGroups');
  }
}