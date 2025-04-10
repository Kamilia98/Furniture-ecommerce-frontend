import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CartService } from '../Services/cart.service';
import { map } from 'rxjs/operators';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cartService = inject(CartService);

  return cartService.getCart().pipe(
    map((cartItems) => {
      if (cartItems && cartItems.length > 0) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
