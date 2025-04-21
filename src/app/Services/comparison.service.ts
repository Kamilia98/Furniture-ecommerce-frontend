import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ProductService } from './product.service';
import { ProductDetails } from '../Models/product-details.model';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root',
})
export class ComparisonService {
  private comparisonKey = 'comparisonProducts';

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private toast: NgToastService
  ) {}

  // In ComparisonService
  addToComparison(productId: string, name: string): void {
    let comparison = JSON.parse(
      localStorage.getItem(this.comparisonKey) || '[]'
    );

    // Remove existing entry if it exists
    comparison = comparison.filter((id: string) => id !== productId);

    // Add to the end of array if not full
    if (comparison.length < 4) {
      comparison.push(productId);
      this.toast.success(`${name} Added to comparison`);
    } else {
      // If full, remove oldest and add new (FIFO)
      comparison = [comparison[1], productId];
    }

    localStorage.setItem(this.comparisonKey, JSON.stringify(comparison));
  }

  getComparisonProducts(): Observable<ProductDetails[]> {
    const comparisonIds = JSON.parse(
      localStorage.getItem(this.comparisonKey) || '[]'
    );

    // If there are no products in the comparison, return an empty array
    if (comparisonIds.length === 0) return of([]);

    // Fetch product details for all the IDs in the comparison list
    return forkJoin(
      comparisonIds.map((id: string) =>
        this.productService.getProduct(id).pipe(
          catchError((error) => {
            console.error(`Error fetching product with ID: ${id}`, error);
            return of(null); // Return null if there's an error for this particular product
          })
        )
      )
    ).pipe(
      map((products) =>
        (products as (ProductDetails | null)[]).filter(
          (product): product is ProductDetails => product !== null
        )
      ),
      catchError((error) => {
        console.error('Error fetching comparison products:', error);
        return of([]); // Return an empty array if there's an error
      })
    );
  }

  // Remove a product from the comparison (by ID)
  removeFromComparison(productId: string, name: string): void {
    let comparison = JSON.parse(
      localStorage.getItem(this.comparisonKey) || '[]'
    );

    // Remove the product ID from the comparison list
    comparison = comparison.filter((id: string) => id !== productId);

    // Update LocalStorage with the new list
    localStorage.setItem(this.comparisonKey, JSON.stringify(comparison));
    this.toast.success(`${name} removed from comparison`);
  }

  // Clear the entire comparison list from LocalStorage
  clearComparison(): void {
    localStorage.removeItem(this.comparisonKey);
  }

  // Check if the comparison is full (2 products)
  isComparisonFull(): boolean {
    const comparison = JSON.parse(
      localStorage.getItem(this.comparisonKey) || '[]'
    );
    return comparison.length === 4;
  }
}
