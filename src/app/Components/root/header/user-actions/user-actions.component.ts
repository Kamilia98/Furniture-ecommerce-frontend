import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { FavoriteService } from '../../../../Services/favorite.service';
import { CartService } from '../../../../Services/cart.service';
import { AuthService } from '../../../../Services/auth.service';
import { UserService } from '../../../../Services/user.service';
import { User } from '../../../../Models/user.model';
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

  user$!: Observable<User | null>;
  cartLength!: number;
  favoritesLength!: number;
  isLoggedIn$!: Observable<boolean>;

  constructor(
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.user$ = this.userService.user$;
    this.authService.isLoggedIn$
      .pipe(
        filter((status) => status === true),
        take(1),
        switchMap(() =>
          combineLatest([
            this.userService.getUser(),
            this.favoriteService.favorites$,
          ]),
        ),
      )
      .subscribe(([user, favorites]) => {
        this.favoritesLength = favorites.length;
      });

    this.cartService.cart$.subscribe((cart) => {
      this.cartLength = cart.length;
    });
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
