import { ChangeDetectionStrategy, Component,Input } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button.component';
import { MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'login-prompt-modal',
  standalone: true,
  imports: [MatDialogClose, MatButtonModule, ButtonComponent, RouterModule],
  template: `
    <div class="flex flex-col items-center text-center p-6 space-y-4">
      <div class="flex flex-col items-center text-center p-6 space-y-4">
        <div class="rounded-full h-10 w-10 text-red">
          <img src="/icons/warning.svg" alt="warning-icon" />
        </div>
        <p class="text-lg font-medium text-gray-800">
         {{ mainMessage }}
        </p>
        <p class="text-sm text-gray-600">
        {{ subMessage }}
        </p>
      </div>

      <div class="flex space-x-4 self-end">
        <div mat-dialog-close>
          <app-button btnWidth="auto" type="primary-outline">Cancel</app-button>
        </div>
        <div mat-dialog-close>
          <app-button btnWidth="auto" [routerLink]="['/auth/login']">
            Go to Login
          </app-button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPromptModalComponent {
  @Input() mainMessage: string = 'You need to log in to perform this action!';
  @Input() subMessage: string = 'Please sign in to continue.';
}
