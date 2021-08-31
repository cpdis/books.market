import { BookInfo, fetchBooks } from './api/books'
import { format as ts } from 'timeago.js'

export async function getStaticProps() {
  const data = await fetchBooks()
  return {
    props: {
      books: data.books,
      lastUpdate: data.lastUpdate,
    },
    revalidate: 300,
  }
}

interface Props {
  books: BookInfo[]
  lastUpdate: string
}

const Book = ({ book }: { book: BookInfo }) => {
  return (
    <a href={book.url} target="_blank">
      <div className="m-auto pb-4 mb-8 flex flex-col justify-center items-center gap-2 p-4 md:m-4 border border-white transform hover:scale-105 transition-all bg-black w-full md:w-96">
        <img src={book.svg} />
        <div className="text-center">
          <p className="text-lg">#{book.id}</p>
          <p>{book.price} ETH</p>
        </div>
      </div>
    </a>
  )
}

const IndexPage = ({ books, lastUpdate }: Props) => {
  return (
    <div className="py-3 md:pb-0 font-mono flex flex-col justify-center items-center gap-4 pt-10 md:w-screen">
      <h1 className="text-lg md:text-3xl">Book Club</h1>
      <div className="text-center max-w-screen-md md:leading-loose">
        <p className="md:text-xl">
          There are {books.length} bags for sale with books. The floor
          price is {books[0].price} ETH.
        </p>
        <p className="md:text-lg pt-2">
          Original by{' '}
          <a
            target="_blank"
            href="https://twitter.com/worm_emoji"
            className="underline"
          >
            worm_emoji
          </a>.
        bookclub.market by{' '}
          <a
            target="_blank"
            href="https://twitter.com/cpdis"
            className="underline"
          >
            cpdis
          </a>.
        </p>
        <p className="text-sm mv-4">Last updated {ts(lastUpdate)}</p>
      </div>
      <div className="grid md:grid-cols-2 pt-5">
        {books.map((book) => {
          return <Book book={book} key={book.id} />
        })}
      </div>
    </div>
  )
}

export default IndexPage
