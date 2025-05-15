import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IWindowsillFilter } from '../../../models/windowsillfilter.model';
import _ from 'lodash';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() filter!: IWindowsillFilter;
  @Output() onfilterchange = new EventEmitter<IWindowsillFilter>();

  slidervalue!: [number, number];
  initialSliderMin!: number | undefined;
  initialSliderMax!: number | undefined;
  deepFilter!: IWindowsillFilter;
  deepfilters!: IWindowsillFilter[];
  isLoading = true;
  lang = '';
  store = '';
  step = 0.1;
  checkboxStates: { [key: string]: boolean } = {};
  isDropdownOpen = true;

  constructor(private router: Router, private translate: TranslateService) {}

  ngOnInit(): void {
    const path = this.router.url.split('?')[0];
    const segments = path.split('/');

    this.store = segments[1];
    this.lang = segments[2];
    const storedFilter = sessionStorage.getItem(`filters[${this.lang}]`);
    this.deepfilters = storedFilter ? JSON.parse(storedFilter) : [];
    this.deepFilter = this.deepfilters.find(f => f.name === this.filter.name) || this.filter;

    this.translate.use(this.lang).subscribe(() => {});

    if (this.filter.type === 'range' && Array.isArray(this.deepFilter.value)) {
      const minValue = Math.floor(Number(this.deepFilter.value[0]));
      const maxValue = Math.ceil(Number(this.deepFilter.value[1]));

      this.slidervalue = [minValue, maxValue];
      this.initialSliderMin = minValue;
      this.initialSliderMax = maxValue;
    }

    if (this.filter.type === 'checkbox') {
      this.initializeCheckboxStates();
    }
    this.checkSessionFilterGroups();
    this.checkStepSize();
    this.checkIfLoadingComplete();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  checkSessionFilterGroups(): void {
    const storedFilterGroups = sessionStorage.getItem('filterGroups');
    if (storedFilterGroups) {
      const filterGroups = JSON.parse(storedFilterGroups);
      const filterGroup = filterGroups.find((group: any) => group.name === this.filter.name);
      if (filterGroup) {
        if (this.filter.type === 'checkbox' && Array.isArray(filterGroup.value)) {
          filterGroup.value.forEach((item: any) => {
            this.checkboxStates[item] = true;
          });
        } else if (this.filter.type === 'range' && Array.isArray(filterGroup.value)) {
          const minValue = Math.floor(Number(filterGroup.value[0]));
          const maxValue = Math.ceil(Number(filterGroup.value[1]));
          this.slidervalue = [minValue, maxValue];
        }
      }
    }
  }

  checkStepSize(): void {
    if (this.initialSliderMin !== undefined && this.initialSliderMin > 100) {
      this.step = 1;
    }
  }

  changedValueSlider(event: any, object: any): void {
    if (this.filter.value) {
      Object.entries(object).forEach(([key, value]: [string, any]) => {
        if (key === '0') {
          object[key] = this.slidervalue[0];
        }
        if (key === '1') {
          object[key] = this.slidervalue[1];
        }
      });
      this.filter.value = object;
      this.onfilterchange.emit(this.filter);
    }
  }

  checkIfLoadingComplete(): void {
    if (this.deepFilter && this.filter) {
      this.isLoading = false;
    }
  }

  getValuesWithKeys(object: any): { key: string, value: string }[] {
    return Object.entries(object).map(([key, value]: [string, any]) => ({ key, value: value.toString() }));
  }

  GetValues(object: any): string[] {
    const result: string[] = [];
    Object.entries(object).forEach(([key, value]: [string, any]) => {
      result.push(value.toString());
    });
    return result;
  }

  initializeCheckboxStates(): void {
    if (Array.isArray(this.deepFilter.value)) {
      this.deepFilter.value.forEach((item: any) => {
        this.checkboxStates[item] = false;
      });
    }
  }

  onCheckboxChange(event: Event, key: string): void {
    const inputElement = event.target as HTMLInputElement;
    this.checkboxStates[key] = inputElement.checked;

    const checked = Object.entries(this.checkboxStates)
      .filter(([key, value]) => value)
      .map(([key, value]) => key);

    const selectedFilter: IWindowsillFilter = {
      ...this.filter,
      value: checked
    };

    this.onfilterchange.emit(selectedFilter);
  }

  getCheckboxState(key: string): boolean {
    return this.checkboxStates[key] ?? false;
  }
}