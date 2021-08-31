import 'tailwindcss/tailwind.css'
import Head from 'next/head'
function Books({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>
        {`
          body {
            background: #000000e0;
            color: white;
            overflow-x: hidden;
          }
        `}
      </style>
      <Head>
        <title>books.market</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@cpdis" />
        <meta property="og:url" content="https://bookclub.market" />
        <meta property="og:title" content="bookclub.market" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta
          property="og:description"
          content="See the floor price of Books from the Loot project."
        />
        <meta property="og:image" content="https://bookclub.market/og.png" />
        <script src="https://cdn.usefathom.com/script.js" data-site="VWXLQOOP" defer></script>
      </Head>
    </>
  )
}

export default Books
