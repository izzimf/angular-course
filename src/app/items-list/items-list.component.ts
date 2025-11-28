import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Item } from '../items.service';
import { ItemCardComponent } from '../item-card/item-card.component';
import { Subject, Subscription, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { loadItems } from '../items/state/items.actions';
import {
  selectItemsList,
  selectItemsLoading,
  selectItemsError
} from '../items/state/items.selectors';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ItemCardComponent],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.css'
})
export class ItemsListComponent implements OnInit, OnDestroy {
  items$: Observable<Item[]>;
  listLoading$: Observable<boolean>;
  listError$: Observable<string | null>;
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.items$ = this.store.select(selectItemsList);
    this.listLoading$ = this.store.select(selectItemsLoading);
    this.listError$ = this.store.select(selectItemsError);
  }

  ngOnInit() {
    const paramsSub = this.route.queryParams.subscribe((params) => {
      const query = params['q'] || '';
      this.searchQuery = query;
      this.dispatchLoad(query);
    });
    this.subscriptions.add(paramsSub);

    const searchSub = this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        this.updateQueryParam(query);
      });
    this.subscriptions.add(searchSub);

    if (!this.route.snapshot.queryParams['q']) {
      this.dispatchLoad('');
    }
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateQueryParam(query: string) {
    const queryParams = query ? { q: query } : { q: null };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  private dispatchLoad(query: string = '') {
    this.store.dispatch(loadItems({ query }));
  }
}


