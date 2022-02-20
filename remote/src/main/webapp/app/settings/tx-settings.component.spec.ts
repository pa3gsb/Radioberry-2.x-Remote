import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxSettingsComponent } from './tx-settings.component';

describe('TxSettingsComponent', () => {
  let component: TxSettingsComponent;
  let fixture: ComponentFixture<TxSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
