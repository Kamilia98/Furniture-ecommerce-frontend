import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-product-skeleton',
  standalone: true,
  imports: [NgxSkeletonLoaderModule],
  template: `
    <div class="h-full w-full">
      <div
        class="mx-auto flex w-full max-w-6xl flex-col justify-center gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-12 lg:px-8"
      >
        <!-- Image Section Skeleton -->
        <div class="flex-1 lg:w-3/5">
          <div class="flex flex-col gap-4 lg:flex-row lg:gap-6">
            <!-- Vertical Thumbnails Skeleton -->
            <div class="hidden flex-col gap-3 lg:flex lg:gap-4">
              <ngx-skeleton-loader
                *ngFor="let _ of [1, 2, 3, 4]"
                [theme]="{
                  'width.px': 80,
                  'height.px': 80,
                  'border-radius': '8px',
                }"
              />
            </div>

            <!-- Main Image Skeleton -->
            <div class="relative w-full">
              <ngx-skeleton-loader
                [theme]="{
                  width: '100%',
                  'height.px': 600,
                  'border-radius': '8px',
                }"
              />
            </div>

            <!-- Mobile Thumbnails Skeleton -->
            <div
              class="scrollbar-hide flex gap-4 overflow-x-auto pb-2 lg:hidden"
            >
              <ngx-skeleton-loader
                *ngFor="let _ of [1, 2, 3, 4]"
                class="shrink-0"
                [theme]="{
                  'width.px': 80,
                  'height.px': 80,
                  'border-radius': '8px',
                }"
              />
            </div>
          </div>
        </div>

        <!-- Details Section Skeleton -->
        <div class="max-w-xl flex-1 space-y-3 lg:w-2/5 lg:space-y-6">
          <!-- Product Title -->
          <ngx-skeleton-loader
            [theme]="{
              'width.%': 70,
              'height.px': 40,
              'margin-bottom': '8px',
            }"
          />

          <!-- Subtitle -->
          <ngx-skeleton-loader
            [theme]="{
              'width.%': 90,
              'height.px': 24,
              'margin-bottom': '16px',
            }"
          />

          <!-- Brand -->
          <ngx-skeleton-loader
            [theme]="{
              'width.%': 40,
              'height.px': 24,
              'margin-bottom': '24px',
            }"
          />

          <!-- Price Section -->
          <div class="space-y-2">
            <ngx-skeleton-loader
              [theme]="{
                'width.%': 30,
                'height.px': 28,
              }"
            />
            <ngx-skeleton-loader
              [theme]="{
                'width.%': 40,
                'height.px': 20,
              }"
            />
          </div>

          <!-- Stock Status -->
          <ngx-skeleton-loader
            [theme]="{
              'width.%': 20,
              'height.px': 20,
              'margin-bottom': '32px',
            }"
          />

          <!-- Color Selection Skeleton -->
          <div class="space-y-2">
            <ngx-skeleton-loader
              [theme]="{
                'width.%': 15,
                'height.px': 20,
              }"
            />
            <div class="flex gap-3">
              <ngx-skeleton-loader
                *ngFor="let _ of [1, 2, 3, 4]"
                [theme]="{
                  'width.px': 32,
                  'height.px': 32,
                  'border-radius': '50%',
                }"
              />
            </div>
          </div>

          <!-- Buttons Section Skeleton -->
          <div class="mt-6 flex w-full flex-col items-start gap-3 lg:gap-4">
            <div
              class="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row lg:gap-4"
            >
              <!-- Quantity Selector -->
              <ngx-skeleton-loader
                [theme]="{
                  'width.px': 150,
                  'height.px': 48,
                  'border-radius': '8px',
                }"
              />

              <!-- Action Buttons -->
              <ngx-skeleton-loader
                [theme]="{
                  'width.px': 190,
                  'height.px': 48,
                  'border-radius': '8px',
                }"
              />
              <ngx-skeleton-loader
                [theme]="{
                  'width.px': 140,
                  'height.px': 48,
                  'border-radius': '8px',
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
