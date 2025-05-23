import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Game } from '../../App'

// slices = Pedaço do estado + suas ações + seus reducers || Fatias de funcionalidades
// aqui teremos as actions e os reducers

type CarrinhoState = {
  itens: Game[]
}

const initialState: CarrinhoState = {
  itens: []
}

const carrinhoSlice = createSlice({
  name: 'carrinho',
  initialState,
  reducers: {
    adicionar: (state, action: PayloadAction<Game>) => {
      const jogo = action.payload

      if (state.itens.find((game) => game.id === jogo.id)) {
        alert('Item já adicionado')
      } else {
        state.itens.push(jogo)
      }
    }
  }
})

export const { adicionar } = carrinhoSlice.actions
export default carrinhoSlice.reducer

/* Função que estava no App para adicionar o jogo ao carrinho
  function adicionarAoCarrinho(jogo: Game) {
    if (carrinho.find((game) => game.id === jogo.id)) {
      alert('Item já adicionado')
    } else {
      setCarrinho([...carrinho, jogo])
    }
  }
*/
