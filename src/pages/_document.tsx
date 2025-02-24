import Document, { Html, Main, Head, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          {/* eslint-disable-next-line @next/next/no-title-in-document-head */}
          <title>My Shopping App</title>
          <link
            href='https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css'
            rel='stylesheet'
          />
          <link rel='icon' href='/shopping-cart/favicon.ico' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
