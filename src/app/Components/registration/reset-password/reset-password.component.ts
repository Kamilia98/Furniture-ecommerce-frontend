import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { InputComponent } from '../../shared/input/input.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, RouterModule],
  templateUrl: './reset-password.component.html',
  animations: [
    trigger('slideUpDown', [
      state('in', style({ height: '*', opacity: 1 })),
      state('out', style({ height: '0', opacity: 0 })),
      transition('in <=> out', animate('200ms ease-in-out')),
    ]),
  ],
})
export class ResetPasswordComponent {
  token = '';
  errorMessage = '';
  message = '';

  resetForm = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    { validators: this.passwordMatchValidator() }
  );

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.token = this.route.snapshot.queryParams['token'];
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  resetPassword() {
    this.resetForm.markAllAsTouched(); // Ensure errors are shown after form interaction

    if (this.resetForm.valid) {
      this.authService
        .resetPassword(
          this.resetForm.controls['password'].value ?? '',
          this.token
        )
        .subscribe({
          next: () => {
            this.message = 'Password reset successfully';
            this.resetForm.reset();
            this.router.navigate(['/auth/login']);
          },
          error: (err) => {
            this.errorMessage = 'Error: ' + err.error.message;
          },
        });
    } else {
      console.log('Form invalid');
    }
  }
}
