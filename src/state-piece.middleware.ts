import { Middleware, Selector } from '@tygr/core';

export const statePieceMiddleware: Middleware = store => next => action => {

  for (let key in Object.keys(action)) {
    if (action[key] instanceof Function) {
      action[key] = action[key](store.getState());
    }
  }
  return next(action);
}

export type StatePiece<T> = Selector<T> | T;
