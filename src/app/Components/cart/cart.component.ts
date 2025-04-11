import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartTotalsComponent } from './cart-components/cart-totals/cart-totals.component';
import { FeatureBannerComponent } from '../shared/feature-banner/feature-banner.component';
import { HeaderBannerComponent } from '../shared/header-banner/header-banner.component';
import { CartService } from '../../Services/cart.service';
import { Observable, map, take, switchMap, of } from 'rxjs';
import { StepperComponent } from '../shared/stepper/stepper.component';
import { productCart } from '../../Models/productCart.model';
import { Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CartTotalsComponent,
    HeaderBannerComponent,
    FeatureBannerComponent,
    CurrencyPipe,
    StepperComponent,
  ],
})
export class CartComponent implements OnInit {
  cart$!: Observable<productCart[]>;
  cartLength$!: Observable<number>;

  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: ProductService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
    this.cartLength$ = this.cart$.pipe(map((cart) => cart.length));
  }

  removeItem(itemId: string) {
    this.cartService.removeProduct(itemId);
  }

  increaseQuantity(item: productCart) {
    this.productService
      .getProduct(item.id)
      .pipe(
        take(1),
        switchMap((productDetails) => {
          if (productDetails && productDetails.colors) {
            const totalAvailableStock = productDetails.colors.reduce(
              (sum, color) => sum + color.quantity,
              0
            );
            if (item.quantity < totalAvailableStock) {
              this.cartService.increaseQuantity(item.id);
            } else {
              this.toast.danger(
                `you have reached to available quantity for ${item.name}`
              );
              // console.log(`Maximum quantity available for ${item.name}`);
            }
          }
          return of(null);
        })
      )
      .subscribe();
  }

  decreaseQuantity(id: string) {
    this.cartService.decreaseQuantity(id);
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
