import { birdCard } from '../../types/common';

// eslint-disable-next-line no-shadow
export enum sortingType {
  ASC = 'ASC',
  DESC = 'DESC',
}

interface cardsState {
  isLoading: boolean;
  isError: boolean;
  cards: birdCard[];
  search: string;
  sortType: sortingType.ASC | sortingType.DESC;
}

// eslint-disable-next-line no-shadow
export enum cardsActionType {
  FETCH_CARDS = 'fetchCards',
  FETCH_CARDS_SUCCESS = 'fetchCardsSuccess',
  FETCH_CARDS_ERROR = 'fetchCardsError',
  UPDATE_SEARCH = 'updateSearch',
  CHANGE_SORT_TYPE = 'changeSort',
}

interface fetchCardsAction {
  type: cardsActionType.FETCH_CARDS;
}

interface fetchCardsSuccessAction {
  type: cardsActionType.FETCH_CARDS_SUCCESS;
  payload: birdCard[];
}

interface fetchCardsErrorAction {
  type: cardsActionType.FETCH_CARDS_ERROR;
  payload: boolean;
}

interface updateSearchAction {
  type: cardsActionType.UPDATE_SEARCH;
  payload: string;
}

interface changeSortTypeAction {
  type: cardsActionType.CHANGE_SORT_TYPE;
  payload: sortingType.ASC | sortingType.DESC;
}

type cardsAction =
  | fetchCardsAction
  | fetchCardsSuccessAction
  | fetchCardsErrorAction
  | updateSearchAction
  | changeSortTypeAction;

export type { cardsAction, cardsState };