//import Stripe from 'stripe'
//import { buffer } from 'micro'
import { insertOrder } from '../../services/database'

const stripe = 'sk_test_9W1R4v0cz6AtC9PVwHFzywti'

// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
const endpointSecret = 'whsec_74fc048a949ca00728782dafe8e4f60fcfd7031de7754493ddee3ecea8e990d5'

export default async (req, res) => {
  console.log(req)
  if (req.method === 'POST') {
    const requestbuffer = await buffer(req)
    const payload = requestbuffer.toString()
    const sig = req.headers['stripe-signature']

    let event

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    } catch (err) {
      console.log('ERR', err.message)
      return res.status(400).send(`Webhook error: ${err.message}`)
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log(session, '000')

      /* const bodyparsed = JSON.parse(req.body)
    const stringifyDetails = JSON.stringify(bodyparsed.details)
    bodyparsed.details = stringifyDetails
    await insertOrder(bodyparsed).then(()=> res.status(200)).catch((err)=> res.status(400).send('Webhook Error:' ${err.message}))
*/   return session
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
}
