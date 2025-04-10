import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-pagination',
  imports: [ButtonComponent, CommonModule],
  template: `
    <div class="flex justify-center gap-2 py-5">
      <!-- Previous Button -->
      @if(currentPage>1){
      <app-button
        type="secondary-fill"
        btnWidth="60px"
        (click)="goToPage(currentPage - 1)"
      >
        <
      </app-button>
      }

      <!-- Page Numbers -->
      @if(pagesCount!=1 && currentPage!=1){
      <app-button
        type="secondary-fill"
        btnWidth="60px"
        (click)="goToPage(currentPage - 1)"
      >
        {{ currentPage - 1 }}
      </app-button>
      }

      <app-button
        type="primary-fill"
        btnWidth="60px"
        (click)="goToPage(currentPage)"
      >
        {{ currentPage }}
      </app-button>

      @if(pagesCount!=1&&pagesCount!=currentPage){
      <app-button
        type="secondary-fill"
        btnWidth="60px"
        (click)="goToPage(currentPage + 1)"
      >
        {{ currentPage + 1 }}
      </app-button>
      }

      <!-- Next Button -->
      @if(currentPage < pagesCount){
      <app-button
        type="secondary-fill"
        btnWidth="60px"
        (click)="goToPage(currentPage + 1)"
      >
        >
      </app-button>
      }
    </div>
  `,
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() pagesCount: number = 1;
  @Input() container!: ElementRef;
  @Output() currentPageChange = new EventEmitter<number>();

  goToPage(page: number): void {
    if (page >= 1 && page <= this.pagesCount) {
      this.currentPageChange.emit(page);
      if (this.container?.nativeElement) {
        const offset = 100;
        window.scrollTo({
          top:
            this.container.nativeElement.getBoundingClientRect().top +
            window.scrollY -
            offset,
          behavior: 'smooth',
        });
      }
    }
  }
}
