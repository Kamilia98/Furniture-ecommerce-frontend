import { Component } from '@angular/core';
import { FeatureBannerComponent } from '../../shared/feature-banner/feature-banner.component';
import { HeaderBannerComponent } from '../../shared/header-banner/header-banner.component';

@Component({
  selector: 'app-payment-options',
  imports: [FeatureBannerComponent, HeaderBannerComponent],
  templateUrl: './payment-options.component.html',
})
export class PaymentOptionsComponent {}
