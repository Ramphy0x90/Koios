import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInfoCardComponent } from './admin-info-card.component';

describe('AdminInfoCardComponent', () => {
  let component: AdminInfoCardComponent;
  let fixture: ComponentFixture<AdminInfoCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminInfoCardComponent]
    });
    fixture = TestBed.createComponent(AdminInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
