import { TestBed } from '@angular/core/testing';

import { HttpProductService } from './httpproduct.service';

describe('HttpService', () => {
  let service: HttpProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
