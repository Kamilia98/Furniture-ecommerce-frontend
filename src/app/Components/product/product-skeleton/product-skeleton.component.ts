import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-product-skeleton',
  standalone: true,
  imports: [NgxSkeletonLoaderModule],
  template: `
    <div class="w-full h-full">
      <div
        class="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6 lg:gap-12 justify-center mx-auto"
      >
        <!-- Image Section Skeleton -->
        <div class="flex-1 lg:w-3/5">
          <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <!-- Vertical Thumbnails Skeleton -->
            <div class="hidden lg:flex flex-col gap-3 lg:gap-4">
              <ngx-skeleton-loader
                *ngFor="let _ of [1, 2, 3, 4]"
                [theme]="{
                  'width.px': 80,
                  'height.px': 80,
                  'border-radius': '8px'
                }"
              />
            </div>

            <!-- Main Image Skeleton -->
            <div class="w-full relative">
              <ngx-skeleton-loader
                [theme]="{
                  width: '100%',
                  'height.px': 600,
                  'border-radius': '8px'
                }"
              />
            </div>

            <!-- Mobile Thumbnails Skeleton -->
            <div
              class="lg:hidden flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            >
              <ngx-skeleton-loader
                *ngFor="let _ of [1, 2, 3, 4]"
                class="shrink-0"
                [theme]="{
                  'width.px': 80,
                  'height.px': 80,
                  'border-radius': '8px'
                }"
              />
            </div>
          </div>
        </div>

        <!-- Details Section Skeleton -->
        <div class="flex-1 lg:w-2/5 max-w-xl space-y-3 lg:space-y-6">
          <!-- Product Title -->
          <ngx-skeleton-loader
            [theme]="{
              'width.%': 70,
              'height.px': 40,
              'margin-bottom': '8px'
            }"
          />

          <!-- Subtitle -->
          <ngx-skeleton-loader
            [theme]="{
              'width.%': 90,
              'height.px': 24,
              'margin-bottom': '16px'
            }"
          />

          <!-- Brand -->
          <ngx-skeleton-loader
            [theme]="{
              'width.%': 40,
              'height.px': 24,
              'margin-bottom': '24px'
            }"
          />

          <!-- Price Section -->
          <div class="space-y-2">
            <ngx-skeleton-loader
              [theme]="{
                'width.%': 30,
                'height.px': 28
              }"
            />
            <ngx-skeleton-loader
              [theme]="{
                'width.%': 40,
                'height.px': 20
              }"
            />
          </div>

          <!-- Stock Status -->
          <ngx-skeleton-loader
            [theme]="{
              'width.%': 20,
              'height.px': 20,
              'margin-bottom': '32px'
            }"
          />

          <!-- Color Selection Skeleton -->
          <div class="space-y-2">
            <ngx-skeleton-loader
              [theme]="{
                'width.%': 15,
                'height.px': 20
              }"
            />
            <div class="flex gap-3">
              <ngx-skeleton-loader
                *ngFor="let _ of [1, 2, 3, 4]"
                [theme]="{
                  'width.px': 32,
                  'height.px': 32,
                  'border-radius': '50%'
                }"
              />
            </div>
          </div>

          <!-- Buttons Section Skeleton -->
          <div class="flex flex-col w-full gap-3 lg:gap-4 items-start mt-6">
            <div
              class="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full sm:w-auto items-center"
            >
              <!-- Quantity Selector -->
              <ngx-skeleton-loader
                [theme]="{
                  'width.px': 150,
                  'height.px': 48,
                  'border-radius': '8px'
                }"
              />

              <!-- Action Buttons -->
              <ngx-skeleton-loader
                [theme]="{
                  'width.px': 190,
                  'height.px': 48,
                  'border-radius': '8px'
                }"
              />
              <ngx-skeleton-loader
                [theme]="{
                  'width.px': 140,
                  'height.px': 48,
                  'border-radius': '8px'
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      ngx-skeleton-loader {
        --background-color: #f3f4f6;
        --animation-color: #e5e7eb;
      }
    `,
  ],
})
export class ProductSkeletonComponent {}
