import { connect } from 'react-redux'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { createId } from '@paralleldrive/cuid2'
import Image from 'next/image'

const stripePromise = loadStripe(
  process.env.stripe_public_key
)

function CheckoutPage ({ state, storeUserDetailsRedux, price }) {
  const [userDetails, setUserDetails] = useState({})

  // ${order.orderid},${order.orderTime},${order.name},${order.surname},${order.email}${order.phone},${order.phone2},${order.details},${order.extimatedwait},${order.idrestaurant

  const goToStriePage = async (e) => {
    e.preventDefault()

    const order = { ordertime: new Date(), userDetails, details: state.order, orderId: createId(), restaurantid: state.restaurantId, price }

    storeUserDetailsRedux(userDetails)
    const stripe = await stripePromise

    const final = JSON.stringify(order)
    // Call your backend to create the Checkout Session
    const response = await fetch('/api/checkout_sessions', {
      method: 'POST',
      body: final
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
  }

  const onChangeInput = (e, key) => {
    setUserDetails({ ...userDetails, ...{ [key]: e.target.value } })
  }

  return (
    <>
     <div className="pb-14">
        <Image
          src="/img/paymentImg.svg"
          width={250} height={250}
          alt="icon nav"

          />
        </div>

    <form
    action="/api/checkout_sessions" method="POST"
     id="myform"
     onSubmit={(e) => goToStriePage(e)}
    className="w-full margin_auto pl-16 pr-16">
  <div className="flex flex-wrap -mx-3 mb-6">
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-black-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
        First Name
      </label>
      <input onChange={(e) => { onChangeInput(e, 'name') } } className="appearance-none block w-full  text-black-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white shadow-2xl" id="grid-first-name" type="text" placeholder="Name"/>

    </div>
    <div className="w-full md:w-1/2 px-3">
      <label className="block uppercase tracking-wide text-black-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
        Last Name
      </label>
      <input onChange={(e) => { onChangeInput(e, 'surname') } } className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 shadow-2xl"
      type="text" name="lastName" placeholder="Surname"/>
    </div>
  </div>
  <div className="flex flex-wrap -mx-3 mb-6">
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-black-700 text-xs font-bold mb-2" htmlFor="email">
        Email
      </label>
      <input onChange={(e) => { onChangeInput(e, 'email') } } className="appearance-none block w-full  text-black-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white shadow-2xl"placeholder="Email"
       type="email"
       name="firstName"
       required
       id="email"/>

    </div>
    <div className="w-full md:w-1/2 px-3">
      <label className="block uppercase tracking-wide text-black-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
        Phone Number
      </label>
      <input
      onChange={(e) => { onChangeInput(e, 'phone') } }
       className="appearance-none block w-full  text-black-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 shadow-2xl" id="grid-last-name" placeholder="Phone"
       required
       type="tel"
        id="phone"
       pattern="[0-9]{10}"
      name="phone"/>
    </div>
    <div className="w-full md:w-1/2 px-3">
      <label className="block uppercase tracking-wide text-black-700 text-xs font-bold  mt-6 mb-2" htmlFor="grid-last-name">
        Second Phone Number
      </label>
      <input onChange={(e) => { onChangeInput(e, 'phone2') } } className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 shadow-2xl" id="grid-last-name" type="text" placeholder="Phone"
      type="tel" id="phone" pattern="[0-9]{10}"
      />
    </div>
    <div className="w-full md:w-1/2 px-3">

    </div>
  </div>
</form>

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
