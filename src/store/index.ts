import { configureStore } from '@reduxjs/toolkit'
import carrinhoReducer from './reducers/carrinho'

import api from '../services/api'

export type RootReducer = ReturnType<typeof store.getState> // inferência de tipo, quando a gente pega o retorno do typeof e utiliza na tipagem.

export const store = configureStore({
  reducer: {
    carrinho: carrinhoReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware)
})
