import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-banner',
  imports: [RouterModule, CommonModule],
  templateUrl: './header-banner.component.html',
})
export class HeaderBannerComponent {
  @Input() bannerTitle = '';
  @Input() bannerPath: { title: string; path: string }[] = [];
}
