import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { ButtonComponent } from '../../shared/button/button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'contact-confirm-modal',
  standalone: true,
  imports: [MatDialogClose, ButtonComponent, RouterModule],
  template: `
    <div class="flex flex-col items-center text-center p-6 space-y-4">
      <div class="flex flex-col items-center text-center p-6 space-y-4">
        <div class="rounded-full h-10 w-10">
          <img
            [src]="data?.isSuccess ? 'icons/check.svg' : 'icons/warning.svg'"
            [alt]="data?.isSuccess ? 'success' : 'error'"
          />
        </div>
        <p class="text-lg font-medium text-gray-800">
          {{ data?.title || (data?.isSuccess ? 'Success' : 'Oops!') }}
        </p>
        <p class="text-sm text-gray-600">{{ data?.message }}</p>
      </div>

      <div class="flex space-x-4 self-end">
        <div mat-dialog-close>
          <app-button btnWidth="auto" [routerLink]="['/shop']">
            {{ data?.buttonText || 'Continue Shopping' }}
          </app-button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactConfirmModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
