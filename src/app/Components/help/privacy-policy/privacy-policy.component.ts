import { Component } from '@angular/core';
import { HeaderBannerComponent } from '../../shared/header-banner/header-banner.component';
import { FeatureBannerComponent } from '../../shared/feature-banner/feature-banner.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  imports: [HeaderBannerComponent, FeatureBannerComponent, ButtonComponent],
  templateUrl: './privacy-policy.component.html',
})
export class PrivacyPolicyComponent {
  constructor(private location: Location) {}
  goBack() {
    this.location.back();
  }
}
