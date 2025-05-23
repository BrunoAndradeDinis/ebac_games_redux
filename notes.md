
# 1. Store

É o estado da aplicação completa, irá receber o RootReducer.
- O RootReducer ele é um conjunto de reducers

Ele é o "cérebro" do Redux, onde todo o estado da aplicação é armazenado.

Funciona como um "loja de dados", é onde todos os dados da sua aplicação ficam guardados, como um grande objeto JavaScript.

```js
  {
    user: { name: 'João', loggedIn: true },
    cart: [ { id: 1, name: 'Camiseta', price: 49.9 } ],
    theme: 'dark'
  }
```

Configurando a store:

```ts
// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer
  }
});
```


#  2. Actions

São objetos que definem um tipo (action.type) e algumas vezes, dados adicionais que descrevem uma mudança específica no estado da aplicação.

A action é um objeto que descreve o que você quer fazer.

```ts
{ type: 'user/login', payload: { name: 'João' } }
```

- `type:` o nome da ação
- `payload`: os dados que você quer enviar


# 3. Reducers
Um reducer é uma função pura que diz como o estado deve mudar com base na action recebida.

Ela é uma função que irá receber o estado inicial e a action e a partir dela irá atualizar o estado.

São funções que recebem o estado atual e uma action, e retornam um novo estado com base na action recebida. Eles determinam como o estado deve mudar em resposta a cada ação.

```ts
function userReducer(state = { name: '', loggedIn: false }, action) {
  switch (action.type) {
    case 'user/login':
      return { ...state, name: action.payload.name, loggedIn: true };
    case 'user/logout':
      return { name: '', loggedIn: false };
    default:
      return state;
  }
}
```

# 4. Dispatch
A maneira como solicitamos que o Redux execute uma ação.

Quando você "dispatch" uma ação, o Redux processa todos os reducers para criar um novo estado.

É assim que você **envia uma action** para o Redux:
```js
  dispatch({ type: 'user/login', payload: { name: 'João' } });
```

O Redux recebe a action, passa ela para os reducers, e os reducers atualizam a store.


## Seletores

São funções utilizadas para extrair dados da store.

nesta aula usamos no código abaixo:

```ts
  import { useSelector } from 'react-redux' //impoortando ele

  import * as S from './styles'

  import cesta from '../../assets/cesta.png'
  import { paraReal } from '../Produto'

  import { RootReducer } from '../../store'

  const Header = () => {
    const itens = useSelector((state: RootReducer) => state.carrinho.itens) // utilizando o seletor e pegando os itens

    const valorTotal = itens.reduce((acc, item) => {
      acc += item.preco
      return acc
    }, 0)

    return (
      <S.Header>
        <h1>EBAC Games</h1>
        <div>
          <img src={cesta} />
          <span>
            {itens.length} itens, valor total: {paraReal(valorTotal)} {// aplicando os itens no código}
          </span>
        </div>
      </S.Header>
    )
  }

  export default Header
```

Foi necessário criar uma tipagem para o state dentro do seletor o RootReducer, o mesmo ficou na pasta store no arquivo principal.
```ts
  export type RootReducer = ReturnType<typeof store.getState> // inferência de tipo, quando a gente pega o retorno do typeof e utiliza na tipagem.
```

## Atualizando estado

Utilizando o dispatch para atualizar a action.

Passos importantes:
- Importar o useDispatch do react-redux
- Importar a action criada
- Criar a const dispatch recebendo o useDispatch()
- Utilizar o dispatch passando a action para atualizar o state
```ts
import { useDispatch } from 'react-redux' // importação do use dispatch

import { adicionar } from '../../store/reducers/carrinho' // import da action

import { Game } from '../../App'
import * as S from './styles'

type Props = {
  game: Game
}

export const paraReal = (valor: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    valor
  )

const Produto = ({ game }: Props) => {
  const dispatch = useDispatch() // criação do dispatch recebendo o useDispatch()

  return (
    <S.Produto>
      <S.Capa>
        <S.Tag>{game.categoria}</S.Tag>
        <img src={game.imagem} alt={game.titulo} />
      </S.Capa>
      <S.Titulo>{game.titulo}</S.Titulo>
      <S.Plataformas>
        {game.plataformas.map((plat) => (
          <li key={plat}>{plat}</li>
        ))}
      </S.Plataformas>
      <S.Prices>
        {game.precoAntigo && <small>{paraReal(game.precoAntigo)}</small>}
        <strong>{paraReal(game.preco)}</strong>
      </S.Prices>
      <S.BtnComprar onClick={() => dispatch(adicionar(game))/*Aqui estamos usando o dispatch passando a action para atualizar o estado */} type="button">
        Adicionar ao carrinho
      </S.BtnComprar>
    </S.Produto>
  )
}

export default Produto
```

## Conheça o Redux toolkit Query

Sobre esse carinha aí:
- É uma **solução para busca, cache, sincronização e atualização de dados remotos** (geralmente de APIs REST ou GraphQL), integrada ao Redux Toolkit.

Ele resolve grande parte dos problemas que geralmente exigem useEffect + useState + axios/fetch + controle manual de loading, erro, etc.

### Configurações iniciais


Exemplo de uma API de produtos:
- Crie uma pasta chamada "services"
- Crie um arquivo api.ts

```ts
  import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react' // importações necessárias para o createApi e FetchBaseQuery
  import { Game } from '../App'

  const api = createApi({
    reducerPath: 'apiProdutos', // nome do slice
    baseQuery: fetchBaseQuery({//função de chamada da api
      baseUrl: 'http://localhost:4000' // url base da api
    }),
    endpoints: (builder) => ({ // builder é o construtor de endpoints
      getJogos: builder.query<Game[], void>({ // tipo de retorno, e o void de segundo argumento em caso de parametros na requisição, como não temos vai de void
        query: () => 'produtos' // endpoint da api
      })
  })

  export const { useGetJogosQuery } = api // o hook para utilizar a query, o reduxtoolkit que cria esse hook automaticamente

  export default api // exportando a api
```

### Adicionar o reducer e middleware no store || Sem ele nada rodará

É o middleware que permite que os endpoints do createApi interajam com a store e executem o ciclo de vida das requisições.

Sem ele, o createApi é só uma definição vazia.

```ts
// store/index.ts

import { configureStore } from '@reduxjs/toolkit'
import carrinhoReducer from './reducers/carrinho'

import api from '../services/api' // importando a api configurada

export type RootReducer = ReturnType<typeof store.getState>

export const store = configureStore({
  reducer: {
    carrinho: carrinhoReducer,
    [api.reducerPath]: api.reducer // utlizando o reducer da api, pegando o reducerPath e atribuindo o seu valor
  },
  middleware: (getDefaultMiddleware) => // utlizando o middleware que faz todo o trabalho por baixo dos panos, por isso que ele é uma função
    getDefaultMiddleware().concat(api.middleware) // como ele retorna um array a gente vai concatena-lo com o middleware da api
})

```

Quando você dispara uma query, por exemplo, internamente o middleware:
- Intercepta essa ação.
- Executa o fetch (ou a estratégia configurada).
- Gerencia estados como isLoading, error.
- Salva a resposta no cache da store Redux.
- Garante que, se outro componente pedir os mesmos dados, ele não vai refazer a request — usa o cache.
- Faz refetch automático se o cache expirar (se configurado).

### Usar no componente


```ts
import { Game } from '../App'
import Produto from '../components/Produto'
import { useGetJogosQuery } from '../services/api' // importando a braba, no caso o hook (gancho pra usa-lo)

import * as S from './styles'

const Produtos = () =>
  {
    const { data: jogos, isLoading } = useGetJogosQuery() // desestruturando e pegando as informações necessárias, no caso o isLoading será usado somente para o carregamento visual

    if (isLoading) return <h2>Carregando...</h2>

    return (
      <>
        <S.Produtos>
          {jogos?.map((game) => ( // aqui ja está consumindo o data, alterado o nome para jogos.
            <Produto key={game.id} game={game} />
          ))}
        </S.Produtos>
      </>
    )
  }

export default Produtos
```

## Considerações adicionais
Com o RTK-Query:
- Não precisa mais usar useEffect + fetch manual.
- Não precisa criar estados para loading ou error.
- O hook `useGetJogosQuery()` cuida de tudo:
  - Fetch de dados
  - Cache
  - Refetch automático se necessário
  - Estado de loading e erro

### E se quiser POST, PUT, DELETE?
Também funciona! Usando builder.mutation

Exemplo de POST:
```ts
  addProduto: builder.mutation({
    query: (novoProduto) => ({
      url: 'ebac_games',
      method: 'POST',
      body: novoProduto
    })
  })
```
E usa no componente assim:
```ts
const [addProduto, { isLoading }] = useAddProdutoMutation()
```
