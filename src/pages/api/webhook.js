import { buffer } from 'micro'
import { changeOrderStatus } from '../../services/database'

const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27'
})
const webhookSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET

export const config = {
  api: {
    bodyParser: false
  }
}

const handler = async (req, res) => {
  
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']
    let stripeEvent

    try {
      stripeEvent = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object

      changeOrderStatus(session.metadata.orderId)

      res.json({ received: true })
    } else {
      res.setHeader('Allow', 'POST')
      res.status(405).end('Method Not Allowed')
    }
  }
}

export default handler
