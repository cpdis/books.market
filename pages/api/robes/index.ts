import { NextApiRequest, NextApiResponse } from 'next'
import pMap from 'p-map'
import { chunk, flatten, orderBy } from 'lodash'
import { utils as etherUtils, BigNumber } from 'ethers'
import type { OpenseaResponse, Asset } from '../../../utils/openseaTypes'
import RobeIDs from '../../../data/robes-ids.json'

const chunked = chunk(RobeIDs, 20)
const apiKey = process.env.OPENSEA_API_KEY

const fetchRobePage = async (ids: string[]) => {
  let url = 'https://api.opensea.io/api/v1/assets?collection=loot-rng&'
  url += ids.map((id) => `token_ids=${id}`).join('&')

  const res = await fetch(url, {
    headers: {
      'X-API-KEY': apiKey,
    },
  })
  const json: OpenseaResponse = await res.json()
  return json.assets
}

const fetchRobes = async () => {
  const data = await pMap(chunked, fetchRobePage, { concurrency: 2 })
  const mapped = flatten(data)
    .filter((d) => {
      return d.sell_orders && d.sell_orders.length > 0
    })
    .map((a: Asset) => {
      return {
        id: a.token_id,
        price: Number(
          etherUtils.formatUnits(
            BigNumber.from(a.sell_orders[0].current_price.split('.')[0]),
          ),
        ),
        url: a.permalink,
        svg: a.image_url,
      }
    })
  return orderBy(mapped, 'price', 'asc')
}

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const robes = await fetchRobes()
    res.status(200).json(robes)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
