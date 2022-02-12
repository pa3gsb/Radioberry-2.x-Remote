import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgcselectorComponent } from './agcselector.component';

describe('AgcselectorComponent', () => {
  let component: AgcselectorComponent;
  let fixture: ComponentFixture<AgcselectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgcselectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgcselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
