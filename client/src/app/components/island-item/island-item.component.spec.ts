import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IslandItemComponent } from './island-item.component';

describe('IslandItemComponent', () => {
  let component: IslandItemComponent;
  let fixture: ComponentFixture<IslandItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IslandItemComponent]
    });
    fixture = TestBed.createComponent(IslandItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
