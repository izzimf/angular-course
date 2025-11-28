import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Item } from '../items.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectSelectedItem,
  selectItemLoading,
  selectItemError
} from '../items/state/items.selectors';
import { loadItem } from '../items/state/items.actions';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.css'
})
export class ItemDetailsComponent implements OnInit, OnDestroy {
  item$: Observable<Item | null>;
  detailsLoading$: Observable<boolean>;
  detailsError$: Observable<string | null>;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.item$ = this.store.select(selectSelectedItem);
    this.detailsLoading$ = this.store.select(selectItemLoading);
    this.detailsError$ = this.store.select(selectItemError);
  }

  ngOnInit() {
    const sub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.store.dispatch(loadItem({ id }));
      }
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  goBack() {
    this.router.navigateByUrl('/items');
  }
}

