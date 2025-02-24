import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { CartItem } from '@/types'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || 'https://take-home-be.onrender.com/api'
})

const authLink = setContext((_, { headers }) => {
  const token = process.env.GRAPHQL_AUTH_TOKEN || localStorage.getItem('visitorToken')
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const cache = new InMemoryCache({
  typePolicies: {
    Cart: {
      fields: {
        items: {
          merge: (_, incoming: CartItem[]) => incoming
        }
      }
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache
})

export default client
