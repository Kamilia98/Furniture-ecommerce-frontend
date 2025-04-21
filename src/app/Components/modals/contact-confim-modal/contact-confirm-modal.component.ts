import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { ButtonComponent } from '../../shared/button/button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'contact-confirm-modal',
  standalone: true,
  imports: [MatDialogClose, ButtonComponent, RouterModule],
  template: `
    <div class="flex flex-col items-center space-y-4 p-6 text-center">
      <div class="flex flex-col items-center space-y-4 p-6 text-center">
        <div class="h-10 w-10 rounded-full">
          <img
            [src]="data?.isSuccess ? 'icons/check.svg' : 'icons/warning.svg'"
            [alt]="data?.isSuccess ? 'successs' : 'error'"
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
