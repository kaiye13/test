import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguratorComponent } from './configurator.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { WindowSill } from '../models/windowsill.model';
import { ActivatedRoute } from '@angular/router';
import { IWindowSillConfiguration } from '../models/windowsillconfiguration.model';
import { IProductProperties } from '../models/windowsillconfigurationproperties.model';
import { IWindowsillPictures } from '../models/windowsillpictures.model';
import { beforeEach, describe, it } from 'node:test';
import 'jasmine';

describe('ConfiguratorComponent', () => {
  let component: ConfiguratorComponent;
  let fixture: ComponentFixture<ConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfiguratorComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguratorComponent);
    component = fixture.componentInstance;
    component.windowsillWithId = {} as WindowSill;
    component.windowsillConfiguration = [];
    component.productproperties = { properties: '' } as IProductProperties;
    component.windowsillPictures = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get main image', () => {
    component.windowsillPictures = [{ isMainImage: true, image: 'main.jpg' } as IWindowsillPictures];
    expect(component.getMainImage() as string).toBe('main.jpg');
  });

  it('should return null if no main image', () => {
    component.windowsillPictures = [{ isMainImage: false, image: 'notmain.jpg' } as IWindowsillPictures];
    expect(component.getMainImage() as string).toBeNull();
  });

  it('should toggle visibility of sections', () => {
    component.toggleVisibility('description');
    expect(component.isDescriptionVisible).toBeTrue();
    component.toggleVisibility('properties');
    expect(component.isPropertiesVisible).toBeTrue();
    component.toggleVisibility('application');
    expect(component.isApplicationVisible).toBeTrue();
  });

  it('should update input values on change', () => {
    const event = { target: { value: 'new value' } } as unknown as Event;
    component.onInputChange('option', event, {} as IWindowSillConfiguration);
    expect(component.InputValues['option']).toBe('new value');
  });

  it('should update input validity on change', () => {
    component.onValidityChange('option', true);
    expect(component.inputValidity['option']).toBeTrue();
    expect(component.isFilledIn).toBeTrue();
  });

  it('should clear measurement values', () => {
    component.InputValues = {
      'breedte': '100',
      'lengte': '200'
    };
    component.clearMeasurementValues();
    expect(component.InputValues['breedte']).toBe('');
    expect(component.InputValues['lengte']).toBe('');
    expect(component.isFilledIn).toBeFalse();
  });

  it('should calculate total square meter', () => {
    component.windowsillWithId.price = 100;
    component.deepWindowsillConfigs = [{ option: 'measurements', options: ['100', '200'] } as IWindowSillConfiguration];
    const price = component.calculateTotalSquareMeter();
    expect(price).toBe('0.00');
  });


    it('should navigate back to main', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      component.GoBackToMain();
      expect(router.navigate).toHaveBeenCalledWith([`${component.store}/${component.lang}`]);
    });

  it('should navigate to configured list', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.goToProductConfigerdlist();
    expect(router.navigate).toHaveBeenCalledWith([`${component.store}/${component.lang}/configuredlist`]);
  });
});
function spyOn(router: Router, methodName: string) {
  const originalMethod = (router as any)[methodName];
  const spy = jasmine.createSpy(methodName, originalMethod).and.callThrough();
  (router as any)[methodName] = spy;
  return spy;
}

function expect<T>(value: T & { calls?: { mostRecent: () => { args: any[] } } }) {
  return {
    toBeTruthy: () => {
      if (!value) {
        throw new Error('Expected value to be truthy, but it was falsy.');
      }
    },
    toBe: (expected: any) => {
      if (value !== expected) {
        throw new Error(`Expected ${value} to be ${expected}.`);
      }
    },
    toBeTrue: () => {
      if (typeof value !== 'boolean' || value !== true) {
        throw new Error(`Expected ${value} to be true.`);
      }
    },
    toBeFalse: () => {
      if (typeof value !== 'boolean' || value !== false) {
        throw new Error(`Expected ${value} to be false.`);
      }
    },
    toBeNull: () => {
      if (value !== null) {
        throw new Error(`Expected ${value} to be null.`);
      }
    },
    toHaveBeenCalledWith: (args: any[]) => {
      if (!value['calls'] || !value['calls'].mostRecent().args.includes(args)) {
        throw new Error(`Expected ${value} to have been called with ${args}.`);
      }
    }
  };
}


