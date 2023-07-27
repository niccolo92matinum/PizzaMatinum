import Navbar from '../../components/Navbar'
import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import CheckoutPage from '../../components/checkout'
import PreviewPage from '../../components/stripe'
import styles from '../../styles/cartpage.module.css'

function CartPage ({ state, modifyQuantityOrderRedux }) {
  const orders = state.order

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // una volta fatto l'ordine viene dato all'utente la possibilità di cambiare le quantità dei prodotti ordinati
  // andando ad apportare le modifiche nello stato redux
  const changeQuantityOrder = (order, num) => {
    // prendo tutti i prodotti selezionati  meno quello che sto modificando
    const ordersWithoutModifiedSingleOrder = orders.filter(singleOrder => singleOrder.id !== order.id)
    // se la quantita del prodotto selezionato è maggiore di 1 o è uguale a uno e si va a fare un piu 1 sul prodotto
    if (order.quantity > 1 || (order.quantity === 1 && num === 1)) {
    // prendo il prodotto selezionato

      // +1 o -1 sulla quantity
      order.quantity = order.quantity + num
      // aggiorno lo store con  tutti i prodotti selezionati  meno quello che sto modificando + il prodotto modificato
      const newState = [...ordersWithoutModifiedSingleOrder, order]

      modifyQuantityOrderRedux(newState)
      // se la quantity del prodotto è 1 e vado clicco sul -1 elimino il prodotto dallo store
    } else if (order.quantity === 1 && num === -1) {
      const takeOffOrder2 = orders.filter((singleObj) => {
        return singleObj.id !== order.id
      })
      modifyQuantityOrderRedux(takeOffOrder2)
    }
  }

  const ordersSortedByTitle = orders.sort(function (a, b) {
    const textA = a.title.toUpperCase()
    const textB = b.title.toUpperCase()
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
  })

  return (
        <>
         <Navbar></Navbar>

         <div className='main  pt-40 flex justify-center '>
            <div className=" place-content-center  w-1/2 pt-12">
              <div className=" m-auto" >
            <h1 className={styles.h1_cartpage}>YOUR CART</h1>
            </div>
            <div className={styles.div_cartpage_leftside}>
                {isClient
                  ? <div className={styles.div_cartpage_leftside_nested}>

<ul className="list-none ">
{ordersSortedByTitle.map((order) => {
  return (
<div key={Math.random()}>
    <li key={order.orderId} className="pb-3 pt-4 sm:pb-4">
    <div className="flex items-center">
       <div className="flex-shrink-0 w-1/5 h-20">

          { order.img && <Image className="w-20 h-20  m-auto rounded-full" width={30} height={30} src={order.img} alt="Neil image"/>}

       </div>
       <div className="ml-4 mr-4 w-2/5 ">
          <p className={styles.p_title_product_cartpage}>
          {order.title}
          </p>

       </div>
       <div className="ml-4 mr-4 ">
       <button onClick={() => changeQuantityOrder(order, -1)} className="button_cartpage_left middle none center rounded-lg bg-red-600 py-1 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ">REMOVE</button>
       </div>
       <div className="w-8 inline-flex  items-center justify-center text-base font-semibold text-gray-900 dark:text-white">
        <p >{order.quantity}</p>

       </div>
       <div className="ml-4 mr-4 ">
       <button onClick={() => changeQuantityOrder(order, 1)} className="button_cartpage_left middle none center rounded-lg bg-red-600 py-1 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ">ADD</button>
       </div>
    </div>
 </li>
 <hr className="bg-sky-700 h-0.5"/>
</div>
  )
})}
</ul>

</div>
                  : 'Waiting'}
            </div>
            </div>
            <div className="rigth w-1/2 pt-12">
              <CheckoutPage></CheckoutPage>
              <PreviewPage></PreviewPage>
            { /* <button onClick={() => goToCheckoutPage()} className="middle mt-4 ml-4 none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Procedi all'ordine</button> */}

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
