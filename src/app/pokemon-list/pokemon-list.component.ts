import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Subject, debounceTime, switchMap } from 'rxjs';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent {
  searchTerm = '';
  pokemon: any = null;
  error: string | null = null;
  isLoading = false;

  private searchSubject = new Subject<string>();

  constructor(private pokemonService: PokemonService) {
    this.searchSubject.pipe(
      debounceTime(500),
      switchMap(term => {
        this.isLoading = true;
        return this.pokemonService.getPokemon(term);
      })
    ).subscribe(result => {
      this.isLoading = false;
      if (result) {
        this.pokemon = result;
        this.error = null;
      } else {
        this.pokemon = null;
        this.error = 'No results found';
      }
    });
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }
}
