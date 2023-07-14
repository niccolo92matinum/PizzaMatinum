import { getAllOrdersByRestaurantId } from '../../services/database'
import {changeOrderStatus} from '../../services/database'

export default async function handler (request, response) {
    if (request.method === 'GET') {
      try {
           const orders = await getAllOrdersByRestaurantId(request.query.idrestaurant)
           const final = orders.rows
         
        response.status(200).json({orders:final })
      } catch (err) {
        response.status(500).send({ message: ['Get not available'], err })
      }
    } else if (request.method === 'POST') {

        try {
            const orderStatus = request.body
         
           
            await changeOrderStatus(orderStatus)
      
            response.status(200).json('Status Changed')
          } catch (err) {
            response.status(500).json('Action FAILED')
          }
    }
  }
  