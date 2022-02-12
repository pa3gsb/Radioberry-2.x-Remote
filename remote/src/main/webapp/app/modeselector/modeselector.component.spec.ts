import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeselectorComponent } from './modeselector.component';

describe('ModeselectorComponent', () => {
  let component: ModeselectorComponent;
  let fixture: ComponentFixture<ModeselectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeselectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
