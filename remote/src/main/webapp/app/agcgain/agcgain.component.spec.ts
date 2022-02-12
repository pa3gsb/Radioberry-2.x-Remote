import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgcgainComponent } from './agcgain.component';

describe('AgcgainComponent', () => {
  let component: AgcgainComponent;
  let fixture: ComponentFixture<AgcgainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgcgainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgcgainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
