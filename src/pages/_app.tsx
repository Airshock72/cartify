import '../styles/globals.css'
import { ApolloProvider } from '@apollo/client'
import client from '../lib/apolloClient'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar'
import { ToastContainer } from 'react-toastify'
import { useRouter } from 'next/router'

const VALID_ROUTES = ['/', '/cart']

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  const showNavbar = VALID_ROUTES.includes(router.pathname)

  return (
    <ApolloProvider client={client}>
      {showNavbar && <Navbar />}
      <Component {...pageProps} />
      <ToastContainer />
    </ApolloProvider>
  )
}

export default MyApp
