import { useEffect, useState } from 'react'
import Header from './components/Header'
import Produtos from './containers/Produtos'

import { GlobalStyle } from './styles'
import { Provider } from 'react-redux'
import { store } from './store'

export type Game = {
  id: number
  titulo: string
  plataformas: string[]
  precoAntigo: number
  preco: number
  categoria: string
  imagem: string
}

function App() {
  const [games, setGames] = useState<Game[]>([]) // estado jogos
  // const [carrinho, setCarrinho] = useState<Game[]>([]) // estado do carrinho

  // useEffect da api fake com json-server
  // useEffect(() => {
  //   fetch('http://localhost:4000/produtos')
  //     .then((res) => res.json())
  //     .then((res) => setGames(res))
  // }, [])

  /* Essa função vai para o slice do carrinho, la nos reducers
  // a função de adicionar o item ao carrinho
  function adicionarAoCarrinho(jogo: Game) {
    // condição para evitar itens duplicados
    if (carrinho.find((game) => game.id === jogo.id)) {
      alert('Item já adicionado')
    } else {
      setCarrinho([...carrinho, jogo]) // adicionando o jogo no carrinho
    }
  }
    */

  return (
    <Provider store={store}>
      <GlobalStyle />
      <div className="container">
        <Header />
        <Produtos />
      </div>
    </Provider>
  )
}

export default App
