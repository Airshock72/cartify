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
          <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet'
            integrity='sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH'
            crossOrigin='anonymous'/>
          <link rel='icon' href='/favicon.ico'/>
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    )
  }
}

export default MyDocument
