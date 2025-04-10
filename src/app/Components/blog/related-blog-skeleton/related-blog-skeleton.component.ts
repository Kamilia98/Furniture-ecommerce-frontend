import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-related-blog-skeleton',
  imports: [NgxSkeletonLoaderModule],
  template: `
    <div
      class="flex items-center gap-4 px-4 py-2 rounded-lg border border-gray-medium "
    >
      <!-- Skeleton Loader for the Image -->
      <ngx-skeleton-loader
        count="1"
        [theme]="{
          'width.px': 120,
          'height.px': 112,
          'margin-bottom': 0
        }"
      />
      <div class="flex flex-col items-start w-full">
        <!-- Skeleton Loader for Title -->
        <ngx-skeleton-loader
          count="1"
          [theme]="{ 'width.px': 240, 'height.px': 20, 'margin-bottom': 8 }"
        />
        <!-- Skeleton Loader for Date -->
        <ngx-skeleton-loader
          count="1"
          [theme]="{ 'width.px': 200, 'height.px': 16, 'margin-bottom': 0 }"
        />
      </div>
    </div>
  `,
})
export class RelatedBlogSkeletonComponent {}
