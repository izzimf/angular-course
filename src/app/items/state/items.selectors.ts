import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemsState } from './items.reducer';

export const selectItemsState = createFeatureSelector<ItemsState>('items');

export const selectItemsList = createSelector(
  selectItemsState,
  (state) => state.items
);

export const selectItemsLoading = createSelector(
  selectItemsState,
  (state) => state.listLoading
);

export const selectItemsError = createSelector(
  selectItemsState,
  (state) => state.listError
);

export const selectSelectedItem = createSelector(
  selectItemsState,
  (state) => state.selectedItem
);

export const selectItemLoading = createSelector(
  selectItemsState,
  (state) => state.detailsLoading
);

export const selectItemError = createSelector(
  selectItemsState,
  (state) => state.detailsError
);

