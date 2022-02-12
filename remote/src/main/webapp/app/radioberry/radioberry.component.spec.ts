import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioberryComponent } from './radioberry.component';

describe('RadioberryComponent', () => {
  let component: RadioberryComponent;
  let fixture: ComponentFixture<RadioberryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioberryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioberryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
