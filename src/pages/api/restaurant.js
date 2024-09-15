import { getAllRestaurants } from '../../services/database'

export default async function handler (request, response) {
  if (request.method === 'GET') {
    try {
      const restaurants = await getAllRestaurants()
      const final = restaurants.rows[0]
      response.status(200).json({ restaurants: [final] })
    } catch (err) {
      console.log(err,'ciao')
      response.status(500).send({ message: ['Get not available'], err })
    }
  }
}
