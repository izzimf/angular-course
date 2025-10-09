import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent {
  pokemons: any[] = []; // сюда сохраним имена покемонов

  constructor(private http: HttpClient) {}

  loadPokemons() {
    this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=10')
      .subscribe(response => {
        this.pokemons = response.results; // в results приходят покемоны
      });
  }
}
