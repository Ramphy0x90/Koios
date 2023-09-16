import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorTableComponent } from './author-table.component';

describe('AuthorTableComponent', () => {
  let component: AuthorTableComponent;
  let fixture: ComponentFixture<AuthorTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorTableComponent]
    });
    fixture = TestBed.createComponent(AuthorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
