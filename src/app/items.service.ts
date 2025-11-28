import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  weight: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ItemsResponse {
  products: Item[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getItems(query?: string): Observable<Item[]> {
    const limit = 20;
    const skip = 0;
    // If no query, use the regular products endpoint
    if (!query || !query.trim()) {
      const params = new HttpParams()
        .set('skip', skip.toString())
        .set('limit', limit.toString());
      
      console.log('Fetching items from:', this.apiUrl, 'with params:', params.toString());
      
      return this.http.get<ItemsResponse>(this.apiUrl, { params }).pipe(
        map((response) => response.products ?? []),
        catchError((error) => {
          console.error('Error fetching items from API:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          return of([]);
        })
      );
    }
    
    // If query exists, use the search endpoint
    const params = new HttpParams()
      .set('q', query.trim())
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    console.log('Searching items with query:', query, 'from:', `${this.apiUrl}/search`);
    
    return this.http.get<ItemsResponse>(`${this.apiUrl}/search`, { params }).pipe(
      map((response) => response.products ?? []),
      catchError((error) => {
        console.error('Error searching items:', error);
        return of([]);
      })
    );
  }

  getItemById(id: string | number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching item:', error);
        throw error;
      })
    );
  }
}



