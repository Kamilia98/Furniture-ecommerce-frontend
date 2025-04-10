import { ChangeDetectorRef, Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgToastModule } from 'ng-angular-popup';
import { ToasterPosition } from 'ng-angular-popup';
import { map, Observable } from 'rxjs';
import { user } from '../../Models/user.model';
import { productCart } from '../../Models/productCart.model';
import { FavoriteService } from '../../Services/favorite.service';
import { CartService } from '../../Services/cart.service';
import { AuthService } from '../../Services/auth.service';
import { UserService } from '../../Services/user.service';
import { productFavorite } from '../../Models/productFavorite.model';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    NgToastModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './root.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate(
          '0.5s cubic-bezier(.4,0,.2,1)',
          style({ transform: 'translateX(0%)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '0.5s cubic-bezier(.4,0,.2,1)',
          style({ transform: 'translateX(100%)' })
        ),
      ]),
    ]),
  ],
})
export class RootComponent {
  ToasterPosition = ToasterPosition;
  user$!: Observable<user | null>;
  cartProductsTotalPrice!: Observable<number>;
  cartLength$!: Observable<number>;
  cart$!: Observable<productCart[]>;
  favorites$!: Observable<productFavorite[]>;
  favoritesLength$!: Observable<number>;
  favModalShow = false;
  cartModalShow = false;
  isLoggedIn = false;

  constructor(
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toast: NgToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user$ = this.userService.user$;
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    if (this.isLoggedIn) {
      this.userService.getUser().subscribe();
      this.favorites$ = this.favoriteService.favorites$;
      this.favoritesLength$ = this.favoriteService.favorites$.pipe(
        map((favorites) => favorites.length)
      );
    }

    this.cart$ = this.cartService.cart$;
    this.cartLength$ = this.cartService.cart$.pipe(map((cart) => cart.length));
    this.cartProductsTotalPrice = this.cartService.cartSubtotal$;
  }

  deleteFavorite(id: string): void {
    this.favoriteService.toggleFavourite(id).subscribe({
      next: () => {
        this.cdr.markForCheck();
      },
    });
  }

  deleteCartProduct(id: string): void {
    this.cartService.removeProduct(id);
    this.cdr.markForCheck();
  }

  toggleFavModal(open: boolean): void {
    this.favModalShow = open;
    this.toggleBodyScroll(open);
  }

  toggleCartModal(open: boolean): void {
    this.cartModalShow = open;
    this.toggleBodyScroll(open);
  }

  handleCheckoutClick(): void {
    this.cart$
      .subscribe((cartItems) => {
        this.toggleCartModal(false);
        if (cartItems.length === 0) {
          this.toast.danger('cart is empty!, please add items to checkout');
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/checkout']);
        }
      })
      .unsubscribe();
  }

  private toggleBodyScroll(isOpen: boolean): void {
    document.body.style.overflowY = isOpen ? 'hidden' : 'auto';
    document.body.style.width = isOpen ? '100%' : '';
  }
}
