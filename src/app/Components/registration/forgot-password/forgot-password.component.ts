import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { RouterModule } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, RouterModule],
  templateUrl: './forgot-password.component.html',
  animations: [
    trigger('slideUpDown', [
      state('in', style({ height: '*', opacity: 1 })),
      state('out', style({ height: '0', opacity: 0 })),
      transition('in <=> out', animate('200ms ease-in-out')),
    ]),
  ],
})
export class ForgotPasswordComponent {
  errorMessage = '';
  message = '';
  forgotForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });
  constructor(private authService: AuthService) {}
  forgotPassword() {
    this.forgotForm.controls.email.markAsTouched();
    if (this.forgotForm.valid) {
      this.authService
        .forgotPassword(this.forgotForm.controls.email.value!)
        .subscribe({
          next: (res) => {
            this.message = '✅ Check your email for a password reset link';
            this.forgotForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.errorMessage = 'Error: ' + err.error.message;
          },
        });
    } else {
      console.log('Form invalid');
    }
  }
}
