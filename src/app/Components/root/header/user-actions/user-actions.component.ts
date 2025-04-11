import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FavoriteService } from '../../../../Services/favorite.service';
import { CartService } from '../../../../Services/cart.service';
import { AuthService } from '../../../../Services/auth.service';
import { UserService } from '../../../../Services/user.service';
import { user } from '../../../../Models/user.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-actions',
  templateUrl: './user-actions.component.html',
  imports: [CommonModule, RouterModule],
})
export class UserActionsComponent implements OnInit {
  @Output() openFavorites = new EventEmitter<void>();
  @Output() openCart = new EventEmitter<void>();

  user$!: Observable<user | null>;
  cartLength$!: Observable<number>;
  favoritesLength$!: Observable<number>;
  isLoggedIn = false;

  constructor(
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user$ = this.userService.user$;

    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    if (this.isLoggedIn) {
      this.userService.getUser().subscribe();
      this.favoritesLength$ = this.favoriteService.favorites$.pipe(
        map((favorites) => favorites.length)
      );
    }

    this.cartLength$ = this.cartService.cart$.pipe(map((cart) => cart.length));
  }

  showFavModal() {
    this.openFavorites.emit();
  }

  showCartModal() {
    this.openCart.emit();
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '/images/user.png';
  }
}
