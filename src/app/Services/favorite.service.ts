import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, map, first, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { NgToastService } from 'ng-angular-popup';
import { productFavorite } from '../Models/productFavorite.model';
import { ModalService } from './modal.service';
import { LoginPromptModalComponent } from '../Components/modals/login-prompt-modal/login-prompt-modal.component';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private apiUrl = `${environment.apiUrl}/users`;
  private favoritesSubject = new BehaviorSubject<productFavorite[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toast: NgToastService,
    private modalService: ModalService
  ) {
    this.authService.isLoggedIn$.subscribe((status) => {
      if (status) this.loadFavorites();
    });
  }

  /*** AUTHORIZATION HEADER ***/

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /*** FAVORITES FETCHING ***/
  private loadFavorites(): void {
    this.getFavorites().subscribe();
  }

  getFavorites(): Observable<productFavorite[]> {
    return this.http
      .get<{ data: { favourites: any[] } }>(`${this.apiUrl}/favourites`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => this.mapFavorites(response.data.favourites)),
        tap((favorites) => this.favoritesSubject.next(favorites)),
        catchError((error) => this.handleFavoriteError(error, []))
      );
  }

  /*** TOGGLE FAVORITE (ADD/REMOVE) ***/
  toggleFavourite(productId: string): Observable<productFavorite[]> {
    let productName = this.getStoredProductName(productId); // Store name before removing

    return this.authService.isLoggedIn$.pipe(
      first(),
      switchMap((isLoggedIn) => {
        if (!isLoggedIn) {
          this.modalService.show(LoginPromptModalComponent);
          console.error('User is not logged in. Prompting for login.');
          console.log(productId);
          return of(this.favoritesSubject.getValue());
        }

        return this.http
          .post<{ data: { favourites: any[] } }>(
            `${this.apiUrl}/toggle-favourites`,
            { productId },
            { headers: this.getAuthHeaders() }
          )
          .pipe(
            map((response) => this.mapFavorites(response.data.favourites)),
            tap((favorites) => {
              this.favoritesSubject.next(favorites);

              // Fetch name after adding
              if (!productName) {
                productName = this.getFetchedProductName(productId, favorites);
              }

              this.showFavoriteToast(productId, productName);
            }),
            catchError((error) =>
              this.handleFavoriteError(error, this.favoritesSubject.getValue())
            )
          );
      })
    );
  }

  isInFavorites(productId: string): boolean {
    return this.favoritesSubject.getValue().some((p) => p.id === productId);
  }

  /*** FAVORITE NAME HANDLINGE ***/
  private getStoredProductName(productId: string): string | null {
    const product = this.favoritesSubject
      .getValue()
      .find((p) => p.id === productId);
    return product ? product.name : null;
  }

  private getFetchedProductName(
    productId: string,
    favorites: productFavorite[]
  ): string {
    const product = favorites.find((p) => p.id === productId);
    return product ? product.name : 'Product';
  }

  /*** API RESPONSE MAPPING  ***/
  private mapFavorites(apiFavorites: any[]): productFavorite[] {
    return apiFavorites.map((p) => ({
      id: p._id,
      name: p.productName,
      image: p.productImage,
      subTitle: p.productSubtitle,
    }));
  }

  /*** ERROR HANDLING ***/
  private handleFavoriteError(
    error: any,
    fallbackValue: productFavorite[]
  ): Observable<productFavorite[]> {
    console.error('Error updating favorites:', error);
    this.toast.danger('Failed to update favorites. Please try again.');
    return of(fallbackValue);
  }

  /*** UI TOAST MESSAGES ***/
  private showFavoriteToast(productId: string, productName: string): void {
    const isFavoriteNow = this.isInFavorites(productId);
    const action = isFavoriteNow ? 'added to' : 'removed from';
    this.toast.success(`${productName} has been ${action} your favorites.`);
  }
}
