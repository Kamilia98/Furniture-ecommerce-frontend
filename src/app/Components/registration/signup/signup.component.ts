import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';
import { AuthService } from '../../../Services/auth.service';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, RouterModule],
  templateUrl: './signup.component.html',
  animations: [
    trigger('slideUpDown', [
      state('in', style({ height: '*', opacity: 1 })),
      state('out', style({ height: '0', opacity: 0 })),
      transition('in <=> out', animate('200ms ease-in-out')),
    ]),
  ],
})
export class SignupComponent {
  errorMessage: string = '';
  signupForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    username: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern('^[a-zA-Z ]*$'),
    ]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.minLength(11),
      Validators.pattern('^[0-9]*$'),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
    agree: new FormControl(false, [Validators.requiredTrue]),
  });
  constructor(private authService: AuthService, private router: Router) {}
  onSubmit() {
    this.signupForm.controls.email.markAsTouched();
    this.signupForm.controls.username.markAsTouched();
    this.signupForm.controls.password.markAsTouched();
    this.signupForm.controls.phone.markAsTouched();
    this.signupForm.controls.agree.markAsTouched();

    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: () => {
          this.signupForm.reset();
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.errorMessage = err.error.error;
          console.log(this.errorMessage);
        },
      });
    } else {
      this.errorMessage = 'Form invalid';
      console.error('Form invalid');
    }
  }
}
