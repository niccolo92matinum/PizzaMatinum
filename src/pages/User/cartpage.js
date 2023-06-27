import Navbar from '../../components/Navbar'
import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import { createId } from '@paralleldrive/cuid2'

function CartPage ({ state, modifyQuantityOrderRedux }) {
  const orders = state.order
  const [tag, setTag] = useState('Loading')
  const [counter, setCounter] = useState(0)

  const changeQuantityOrder = (order, num) => {
    if (order.quantity > 1 || (order.quantity === 1 & num === 1) ) {
      const takeOffOrder = orders.filter((singleObj) => {
        return singleObj.orderId !== order.orderId
      })
      order.quantity = order.quantity + num
      const newState = [...takeOffOrder, order]

      modifyQuantityOrderRedux(newState)
    } else if (order.quantity === 1 & num === -1) {
      const takeOffOrder2 = orders.filter((singleObj) => {
        return singleObj.orderId !== order.orderId
      })
      modifyQuantityOrderRedux(takeOffOrder2)

    }
  }

  useEffect(() => {
    const ordersSortedByTitle = orders.sort(function (a, b) {
      const textA = a.title.toUpperCase()
      const textB = b.title.toUpperCase()
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    })

    const listOfOrders = <div>

    <ul className="list-none ">
    {ordersSortedByTitle.map((order) => {
      return (

        <div key={Math.random()} className="flex flex-row ">
        <li key={order.orderId} >
            {order.title}

        </li>
        <button onClick={() => changeQuantityOrder(order, -1)} className="middle mt-4 ml-4 none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">-</button>
               <p className="middle mt-4 ml-4 none center rounded-lg  py-3   text-xs font-bold uppercase">{order.quantity}</p>
               <button onClick={() => changeQuantityOrder(order, 1)} className="middle mt-4 ml-4 none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">+</button>
        </div>

      )
    })}
</ul>
</div>

    setTag(listOfOrders)
  }, [counter, orders])

  return (
        <>
         <Navbar></Navbar>
         <div className="grid  place-items-center ">
            <div className="h-10">
            <h1>Your products ordered</h1>
            </div>
            <div className="w-96">
                {tag}
            </div>

         </div>

        </>

  )
}

export const modifyQuantityOrderRedux = (data) => ({
  type: 'MODIFY_QUANTITY_ORDER',
  payload: data
})

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {
  modifyQuantityOrderRedux
}

export default connect(mapStateToProps, mapDispatchToProps)(CartPage)
