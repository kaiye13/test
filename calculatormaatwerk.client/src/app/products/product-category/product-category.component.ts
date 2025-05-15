import { Component, OnInit } from '@angular/core';

interface Category {
  name: string;
  img: string;
}

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css'
})
export class ProductCategoryComponent implements OnInit {
  categories: Category[] = [
    // {name: 'marmer', img: 'https://calculatorstoragetst.blob.core.windows.net/vensterbanken-test/180366.jpg'},
    // {name: 'keramiek', img: 'https://calculatorstoragetst.blob.core.windows.net/vensterbanken-test/173830.jpg'},
    // {name: 'hardsteen', img: 'https://calculatorstoragetst.blob.core.windows.net/vensterbanken-test/174696.jpg'},
  ];

  constructor() { }

  ngOnInit(): void { }
}
