import { getAllOrdersByRestaurantId, changeOrderStatus2, deleteOrderByAdmin } from '../../services/database'

export default async function handler (request, response) {
  if (request.method === 'GET') {
    try {
      const orders = await getAllOrdersByRestaurantId(request.query.idrestaurant)
      const final = orders.rows

      response.status(200).json({ orders: final })
    } catch (err) {
      response.status(500).send({ message: ['Get not available'], err })
    }
  } else if (request.method === 'POST') {
    try {
      const orderId = request.body
      console.log(orderId, 'cazzo')

      await changeOrderStatus2(orderId)

      response.status(200).json('Status Changed')
    } catch (err) {
      response.status(500).json('Action FAILED')
    }
  } else if (request.method === 'DELETE') {
    try {
      const orderId = request.query.orderid

      await deleteOrderByAdmin(orderId)

      response.status(200).json('Order Deleted')
    } catch (err) {
      response.status(500).json('Action FAILED')
    }
  }
}
