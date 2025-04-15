import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Category } from '../Models/category.model';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = `${environment.apiUrl}/categories`;
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<{ data: { categories: any[] } }>(this.apiUrl).pipe(
      tap((response) => {
        const categories = response.data.categories.map((category) => ({
          ...category,
          id: category._id,
        }));
        this.categoriesSubject.next(categories);
      }),
      catchError((error) => {
        console.error('Error fetching categories:', error);
        return of([]);
      }),
      map((response) => {
        if ('data' in response && response.data.categories) {
          return response.data.categories.map((category) => ({
            ...category,
            id: category._id,
          }));
        }
        return [];
      })
    );
  }
}
