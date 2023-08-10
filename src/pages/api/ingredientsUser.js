import { getAllIngredientsByRestaurantId } from '../../services/database'

export default async function handler (request, response) {
  if (request.method === 'GET') {
    try {
      console.log(request.query.restaurantid, 'pino')
      const ingredients = await getAllIngredientsByRestaurantId(request.query.restaurantid)
      const final = ingredients.rows

      response.status(200).json(final)
    } catch (err) {
      response.status(500).send({ message: ['Get not available'], err })
    }
  }
}
