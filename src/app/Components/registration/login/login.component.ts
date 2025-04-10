import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';
import { AuthService } from '../../../Services/auth.service';
import { jwtDecode } from 'jwt-decode';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent, RouterModule, ButtonComponent],
  templateUrl: './login.component.html',
  animations: [
    trigger('slideUpDown', [
      state('in', style({ height: '*', opacity: 1 })),
      state('out', style({ height: '0', opacity: 0 })),
      transition('in <=> out', animate('200ms ease-in-out')),
    ]),
  ],
})
export class LoginComponent {
  errorMessage: string = '';
  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
    rememberme: new FormControl(false),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Handle Google login token from query params
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.authService.handleGoogleLogin(token, false);
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      const { email, password, rememberme } = this.loginForm.value;

      this.authService.login({ email, password }, rememberme!).subscribe({
        next: (res) => {
          this.loginForm.reset();
        },
        error: (err) => {
          this.errorMessage =
            err.error?.error || 'Login failed. Please try again.';
        },
      });
    } else {
      console.error('Form invalid');
    }
  }

  onGoogleSignIn() {
    this.authService.googleSignIn();
  }
}
