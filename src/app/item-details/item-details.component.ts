import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ItemsService, Item } from '../items.service';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.css'
})
export class ItemDetailsComponent implements OnInit {
  item: Item | null = null;
  isLoading = false;
  error: string | null = null;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemsService: ItemsService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadItem(id);
      } else {
        this.notFound = true;
      }
    });
  }

  private loadItem(id: string) {
    this.isLoading = true;
    this.error = null;
    this.notFound = false;

    this.itemsService.getItemById(id).subscribe({
      next: (item) => {
        this.item = item;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.notFound = true;
        } else {
          this.error = 'Failed to load item details. Please try again later.';
        }
        console.error('Error loading item:', err);
      }
    });
  }

  goBack() {
    this.router.navigateByUrl('/items');
  }
}

