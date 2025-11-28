import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ItemsService } from '../../items.service';
import * as ItemsActions from './items.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class ItemsEffects {
  private actions$ = inject(Actions);
  private itemsService = inject(ItemsService);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.loadItems),
      switchMap(({ query }) =>
        this.itemsService.getItems(query).pipe(
          map((items) => ItemsActions.loadItemsSuccess({ items })),
          catchError((error) =>
            of(
              ItemsActions.loadItemsFailure({
                error: this.getErrorMessage(error, 'Failed to load items.')
              })
            )
          )
        )
      )
    )
  );

  loadItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.loadItem),
      switchMap(({ id }) =>
        this.itemsService.getItemById(id).pipe(
          map((item) => ItemsActions.loadItemSuccess({ item })),
          catchError((error) =>
            of(
              ItemsActions.loadItemFailure({
                error: this.getErrorMessage(
                  error,
                  'Failed to load item details.'
                )
              })
            )
          )
        )
      )
    )
  );

  private getErrorMessage(error: any, fallback: string): string {
    if (error?.status === 404) {
      return 'NOT_FOUND';
    }
    return error?.message || fallback;
  }
}

