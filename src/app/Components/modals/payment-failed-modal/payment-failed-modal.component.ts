import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button.component';
import { MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-payment-failed-modal',
  standalone: true,
  imports: [MatDialogClose, MatButtonModule, ButtonComponent],
  template: `
    <div class="flex flex-col items-center text-center p-6 space-y-4">
      <div class="flex flex-col items-center text-center p-6 space-y-4">
        <div class="rounded-full h-10 w-10 text-red">
          <img src="/icons/warning.svg" alt="warning-icon" />
        </div>
        <p class="text-lg font-medium text-gray-800">Payment Declined</p>
        <p class="text-sm text-gray-600">
          {{ errorMessage }}
        </p>
      </div>

     <div class="flex justify-center"> <div mat-dialog-close>
          <app-button btnWidth="auto" type="primary-outline">Okay</app-button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentFailedModalComponent {
  @Input() errorMessage: string =
    'Your payment was declined. Please try again or use another payment method.';
}
