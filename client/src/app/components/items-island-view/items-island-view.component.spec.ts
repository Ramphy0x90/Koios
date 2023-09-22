import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsIslandViewComponent } from './items-island-view.component';

describe('ItemsIslandViewComponent', () => {
  let component: ItemsIslandViewComponent;
  let fixture: ComponentFixture<ItemsIslandViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsIslandViewComponent]
    });
    fixture = TestBed.createComponent(ItemsIslandViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
