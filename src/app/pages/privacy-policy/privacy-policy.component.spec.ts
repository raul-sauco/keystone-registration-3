import { ComponentFixture } from '@angular/core/testing';
import { MockBuilder, MockRender } from 'ng-mocks';
import { PrivacyPolicyComponent } from './privacy-policy.component';

describe('PrivacyPolicyComponent', () => {
  let component: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;

  beforeEach(() => {
    return MockBuilder(PrivacyPolicyComponent);
  });

  it('should create', () => {
    fixture = MockRender(PrivacyPolicyComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
