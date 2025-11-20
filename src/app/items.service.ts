import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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

export interface ItemsResponse {
  products: Item[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getItems(query?: string, page: number = 0, limit: number = 20): Observable<ItemsResponse> {
    // If no query, use the regular products endpoint
    if (!query || !query.trim()) {
      const params = new HttpParams()
        .set('skip', (page * limit).toString())
        .set('limit', limit.toString());
      
      console.log('Fetching items from:', this.apiUrl, 'with params:', params.toString());
      
      return this.http.get<ItemsResponse>(this.apiUrl, { params }).pipe(
        catchError((error) => {
          console.error('Error fetching items from API:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          return of({ products: [], total: 0, skip: 0, limit: 0 } as ItemsResponse);
        })
      );
    }
    
    // If query exists, use the search endpoint
    const params = new HttpParams()
      .set('q', query.trim())
      .set('skip', (page * limit).toString())
      .set('limit', limit.toString());

    console.log('Searching items with query:', query, 'from:', `${this.apiUrl}/search`);
    
    return this.http.get<ItemsResponse>(`${this.apiUrl}/search`, { params }).pipe(
      catchError((error) => {
        console.error('Error searching items:', error);
        return of({ products: [], total: 0, skip: 0, limit: 0 } as ItemsResponse);
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



