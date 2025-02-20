import '../styles/globals.css'
import { ApolloProvider } from '@apollo/client'
import client from '../lib/apolloClient'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar'
import { ToastContainer } from 'react-toastify'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Component {...pageProps} />
      <ToastContainer />
    </ApolloProvider>
  )
}

export default MyApp
