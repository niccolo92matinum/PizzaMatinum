import { getAllRestaurants } from '../../services/database'

export default async function handler (request, response) {
  console.log('mimmo')
  if (request.method === 'GET') {
    try {
      console.log('dentro pippo')
      const restaurants = await getAllRestaurants()
      const final = restaurants.rows[0]
      response.status(200).json({ restaurants: [final] })
    } catch (err) {
      console.log(err, 'err')
      response.status(500).send({ message: ['Get not available'], err })
    }
  }
}
