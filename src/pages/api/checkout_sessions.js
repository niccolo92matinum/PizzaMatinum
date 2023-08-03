import { insertOrder } from '../../services/database'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler (req, res) {
  const data = req.body
  const parsedData = JSON.parse(data)
  const orderId = parsedData.orderId

  const price = parsedData.price * 100

  if (req.method === 'POST') {
    try {
      // const insertOrderIntoDb = await insertOrder(order)
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        metadata: { orderId },
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Pagamento'
              },
              unit_amount: price
            },
            quantity: 1
          }
        ],
        payment_intent_data: { metadata: { orderID: 'orderID' } },
        mode: 'payment',
        success_url: 'http://localhost:3000/Stripe/successpage',
        cancel_url: 'http://localhost:3000/Stripe/failpage'
      })

      insertOrder(data)

      res.json(session)
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
