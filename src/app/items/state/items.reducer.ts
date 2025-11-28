import { createReducer, on } from '@ngrx/store';
import { Item } from '../../items.service';
import * as ItemsActions from './items.actions';

export interface ItemsState {
  items: Item[];
  selectedItem: Item | null;
  listLoading: boolean;
  listError: string | null;
  detailsLoading: boolean;
  detailsError: string | null;
}

export const initialState: ItemsState = {
  items: [],
  selectedItem: null,
  listLoading: false,
  listError: null,
  detailsLoading: false,
  detailsError: null
};

export const itemsReducer = createReducer(
  initialState,
  on(ItemsActions.loadItems, (state) => ({
    ...state,
    listLoading: true,
    listError: null
  })),
  on(ItemsActions.loadItemsSuccess, (state, { items }) => ({
    ...state,
    items,
    listLoading: false,
    listError: null
  })),
  on(ItemsActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    listLoading: false,
    listError: error,
    items: []
  })),
  on(ItemsActions.loadItem, (state) => ({
    ...state,
    detailsLoading: true,
    detailsError: null,
    selectedItem: null
  })),
  on(ItemsActions.loadItemSuccess, (state, { item }) => ({
    ...state,
    selectedItem: item,
    detailsLoading: false,
    detailsError: null
  })),
  on(ItemsActions.loadItemFailure, (state, { error }) => ({
    ...state,
    detailsLoading: false,
    detailsError: error
  }))
);

