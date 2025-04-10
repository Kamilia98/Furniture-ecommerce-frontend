import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CheckoutService } from '../Services/checkout.service';

export const orderGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const checkoutService = inject(CheckoutService);

  if (checkoutService.hasCompletedCheckout()) {
    return true;
  } else {
    router.navigate(['/cart']);
    return false;
  }
};
