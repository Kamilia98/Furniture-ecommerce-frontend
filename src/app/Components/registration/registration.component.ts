import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class RegistrationComponent {
  isSignUp$: Observable<boolean>;

  constructor(private router: Router) {
    this.isSignUp$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(this.router),
      map(() => {
        return this.router.url.endsWith('/signup');
      })
    );
  }
}
