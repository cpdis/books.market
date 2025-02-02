import { NextApiRequest, NextApiResponse } from 'next'
import pMap from 'p-map'
import { chunk, flatten, orderBy } from 'lodash'
import { utils as etherUtils, BigNumber } from 'ethers'
import type { OpenseaResponse, Asset } from '../../../utils/openseaTypes'
import BookIDs from '../../../data/books-ids.json'

const chunked = chunk(BookIDs, 20)
// const apiKey = process.env.OPENSEA_API_KEY

const fetchBookPage = async (ids: string[]) => {
  let url = 'https://api.opensea.io/api/v1/assets?collection=lootproject&'
  url += ids.map((id) => `token_ids=${id}`).join('&')

  const res = await fetch(url, {
    // headers: {
    //   'X-API-KEY': apiKey,
    // },
  })
  const json: OpenseaResponse = await res.json()
  return json.assets
}

export interface BookInfo {
  id: string
  price: Number
  url: string
  svg: string
}

export const fetchBooks = async () => {
  const data = await pMap(chunked, fetchBookPage, { concurrency: 2 })
  const mapped = flatten(data)
    .filter((d) => {
      return (
        d.sell_orders &&
        d.sell_orders.length > 0 &&
        d.sell_orders[0].payment_token_contract.symbol == 'ETH'
      )
    })
    .map((a: Asset): BookInfo => {
      return {
        id: a.token_id,
        price: Number(
          etherUtils.formatUnits(
            BigNumber.from(a.sell_orders[0].current_price.split('.')[0]),
          ),
        ),
        url: a.permalink + '?ref=0xfb843f8c4992efdb6b42349c35f025ca55742d33',
        svg: a.image_url,
      }
    })
  return {
    books: orderBy(mapped, ['price', 'id'], ['asc', 'asc']),
    lastUpdate: new Date().toISOString(),
  }
}

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await fetchBooks()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
