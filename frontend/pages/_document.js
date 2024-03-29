import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script src="https://docs.opencv.org/3.4.0/opencv.js" strategy="beforeInteractive"></Script>
      </body>
    </Html>
  )
}
