import Navbar from '../../components/Navbar'
import PreviewPage from '../../components/stripe'
import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
)

function CheckoutPage ({ state, storeUserDetailsRedux }) {
  const [userDetails, setUserDetails] = useState({})

  const dateToSendAsBodyCheckOut = {
    ...userDetails,
    ...{
      orderid: state.order[0]?.orderId,
      idrestaurant: state.order[0]?.idrestaurant,
      ordertime: new Date(),
      details: state.order
    }
  }
  // ${order.orderid},${order.orderTime},${order.name},${order.surname},${order.email}${order.phone},${order.phone2},${order.details},${order.extimatedwait},${order.idrestaurant

  useEffect(() => {

  }, [state])

  const goToStriePage = async (e) => {
    e.preventDefault()

    const stripe = await stripePromise

    // Call your backend to create the Checkout Session
    const response = await fetch('/api/checkout_sessions', {
      method: 'POST',
      body: JSON.stringify(dateToSendAsBodyCheckOut)
    })

    const session = await response.json()

    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: session.id

    })

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }

    storeUserDetailsRedux(userDetails)
  }

  const onChangeInput = (e, key) => {
    setUserDetails({ ...userDetails, ...{ [key]: e.target.value } })
  }

  return (
    <>
    <Navbar></Navbar>
    <form
    action="/api/checkout_sessions" method="POST"
     id="myform"
     onSubmit={(e) => goToStriePage(e)}
    className="w-full max-w-lg">
  <div className="flex flex-wrap -mx-3 mb-6">
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
        First Name
      </label>
      <input onChange={(e) => { onChangeInput(e, 'name') } } className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Name"/>

    </div>
    <div className="w-full md:w-1/2 px-3">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
        Last Name
      </label>
      <input onChange={(e) => { onChangeInput(e, 'surname') } } className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Surname"/>
    </div>
  </div>
  <div className="flex flex-wrap -mx-3 mb-6">
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
        Email
      </label>
      <input onChange={(e) => { onChangeInput(e, 'email') } } className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Email"
       type="email"
       name="firstName"
       required
       id="email"/>

    </div>
    <div className="w-full md:w-1/2 px-3">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
        Phone Number
      </label>
      <input
      onChange={(e) => { onChangeInput(e, 'phone') } }
       className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Phone"
       pattern="[0-9]{10}"
       required
       type="tel"
      id="phone"
      name="phone"/>
    </div>
    <div className="w-full md:w-1/2 px-3">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
        Second Phone Number
      </label>
      <input onChange={(e) => { onChangeInput(e, 'phone2') } } className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Phone"
       pattern="[0-9]{10}"
       required
       type="tel"
      id="phone2"
      name="phone2"/>
    </div>
  </div>
</form>

   <PreviewPage></PreviewPage>

    </>
  )
}

export const storeUserDetailsRedux = (data) => ({
  type: 'STORE_USER_DETAILS',
  payload: data
})

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {
  storeUserDetailsRedux
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPage)
