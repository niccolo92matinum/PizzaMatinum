import Stripe from 'stripe'
import { buffer } from 'micro'
import {insertOrder} from '../../services/database'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler (req, res) {
let data = req.body
let parsedData = JSON.parse(data)
const orderId = parsedData.orderId

  if (req.method === 'POST') {

    insertOrder(data)


    try {
      // const insertOrderIntoDb = await insertOrder(order)
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        metadata:{orderId},
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Pagamento'
              },
              unit_amount: 100
            },
            quantity: 1
          }
        ],
        payment_intent_data: { metadata: { orderID: 'orderID' } },
        mode: 'payment',
        success_url: 'http://localhost:3000/Stripe/successpage',
        cancel_url: 'http://localhost:3000/Stripe/failpage'
      })
      
      res.json(session)
      
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message })
    }

    /* (async () => {
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret)
      if (error) {
        // Handle error here
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Handle successful payment here
      }
    })() */
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}


