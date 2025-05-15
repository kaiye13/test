import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguredlistComponent } from './configuredlist.component';

describe('ConfiguredlistComponent', () => {
  let component: ConfiguredlistComponent;
  let fixture: ComponentFixture<ConfiguredlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfiguredlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguredlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
