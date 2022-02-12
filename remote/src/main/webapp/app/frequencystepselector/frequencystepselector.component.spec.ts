import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencystepselectorComponent } from './frequencystepselector.component';

describe('FrequencystepselectorComponent', () => {
  let component: FrequencystepselectorComponent;
  let fixture: ComponentFixture<FrequencystepselectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrequencystepselectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequencystepselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
