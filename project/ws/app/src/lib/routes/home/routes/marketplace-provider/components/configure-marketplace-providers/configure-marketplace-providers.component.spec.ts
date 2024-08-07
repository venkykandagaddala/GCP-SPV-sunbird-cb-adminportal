import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureMarketplaceProvidersComponent } from './configure-marketplace-providers.component';

describe('ConfigureMarketplaceProvidersComponent', () => {
  let component: ConfigureMarketplaceProvidersComponent;
  let fixture: ComponentFixture<ConfigureMarketplaceProvidersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureMarketplaceProvidersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureMarketplaceProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
