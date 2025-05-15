import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IWindowsillFilter } from '../../models/windowsillfilter.model';
import { Router } from '@angular/router';
import _ from 'lodash';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.css'],
})
export class ProductFiltersComponent implements OnInit {
  @Input() windowfilters!: IWindowsillFilter[];
  @Output() filterChanged = new EventEmitter<IWindowsillFilter[]>();
  public isSessionAvailable = false;
  public deepFilter!: IWindowsillFilter[];
  public lang = '';
  public store = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const path = this.router.url.split('?')[0];
    const segments = path.split('/');

    this.store = segments[1];
    this.lang = segments[2];
    const filters = JSON.parse(sessionStorage.getItem(`filters[${this.lang}]`) || '{}');
    this.deepFilter = filters[this.lang] || _.cloneDeep(this.windowfilters);
    this.initializeFilters();
  }

  private initializeFilters(): void {
    this.windowfilters.forEach(filter => {
      filter.value = [];
    });
  }

  filterChangedWindow(event: IWindowsillFilter, name: string): void {
    const index = this.windowfilters.findIndex(f => f.name === event.name);
    this.windowfilters[index] = event;

    // Emit only the filters that have values
    const usedFilters = this.windowfilters.filter(f => Array.isArray(f.value) && f.value.length > 0);
    this.filterChanged.emit(usedFilters);
  }


}