import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RxSettingsComponent } from './rx-settings.component';

describe('RxSettingsComponent', () => {
  let component: RxSettingsComponent;
  let fixture: ComponentFixture<RxSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RxSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RxSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
