import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  constructor(private http: HttpClient) {}

  getPokemon(name: string): Observable<any> {
    if (!name.trim()) return of(null);
    return this.http.get(this.apiUrl + name.toLowerCase()).pipe(
      catchError(() => of(null)) 
    );
  }
}
