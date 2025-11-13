import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ItemsService, Item } from '../items.service';
import { ItemCardComponent } from '../item-card/item-card.component';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ItemCardComponent],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.css'
})
export class ItemsListComponent implements OnInit {
  items: Item[] = [];
  isLoading = false;
  error: string | null = null;
  searchQuery = '';
  private searchSubject = new Subject<string>();

  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const query = params['q'] || '';
      this.searchQuery = query;
      this.loadItems(query);
    });

    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(query => {
      this.updateQueryParam(query);
    });
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  private updateQueryParam(query: string) {
    const queryParams = query ? { q: query } : { q: null };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  private loadItems(query: string = '') {
    this.isLoading = true;
    this.error = null;

    this.itemsService.getItems(query, 0, 20).subscribe({
      next: (response) => {
        this.items = response.products;
        this.isLoading = false;
        if (this.items.length === 0 && query) {
          this.error = 'No items found matching your search.';
        }
      },
      error: (err) => {
        this.error = 'Failed to load items. Please try again later.';
        this.isLoading = false;
        console.error('Error loading items:', err);
      }
    });
  }
}

