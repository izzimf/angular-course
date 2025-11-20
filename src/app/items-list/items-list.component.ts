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
    // Load items immediately on component init
    this.route.queryParams.subscribe(params => {
      const query = params['q'] || '';
      this.searchQuery = query;
      this.loadItems(query);
    });

    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(query => {
      this.updateQueryParam(query);
    });
    
    // Ensure items load even if no query params
    if (!this.route.snapshot.queryParams['q']) {
      this.loadItems('');
    }
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
    console.log('=== LOADING ITEMS ===');
    console.log('Query:', query || '(empty)');
    console.log('Current items:', this.items.length);

    this.itemsService.getItems(query, 0, 20).subscribe({
      next: (response) => {
        console.log('=== ITEMS RESPONSE ===');
        console.log('Full response:', response);
        console.log('Response has products:', !!response?.products);
        console.log('Number of products:', response?.products?.length || 0);
        console.log('First product:', response?.products?.[0]);
        
        // Ensure we have a valid response
        if (response && response.products) {
          this.items = response.products;
          console.log('Items assigned successfully:', this.items.length);
        } else {
          console.warn('Invalid response structure:', response);
          this.items = [];
        }
        
        this.isLoading = false;
        console.log('Final items count:', this.items.length);
        
        // Only set error if we have a search query and no results
        if (this.items.length === 0 && query && query.trim()) {
          this.error = 'No items found matching your search.';
        }
      },
      error: (err) => {
        console.error('=== ERROR LOADING ITEMS ===');
        console.error('Error object:', err);
        console.error('Error status:', err?.status);
        console.error('Error message:', err?.message);
        this.error = 'Failed to load items. Please try again later.';
        this.isLoading = false;
        this.items = [];
      }
    });
  }
}

