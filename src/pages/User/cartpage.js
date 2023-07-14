import Navbar from '../../components/Navbar'
import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

function CartPage ({ state, modifyQuantityOrderRedux }) {
  const orders = state.order
 
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  // una volta fatto l'ordine viene dato all'utente la possibilità di cambiare le quantità dei prodotti ordinati
  // andando ad apportare le modifiche nello stato redux
  const changeQuantityOrder = (order, num) => {
    //prendo tutti i prodotti selezionati  meno quello che sto modificando
const ordersWithoutModifiedSingleOrder = orders.filter( singleOrder =>singleOrder.id !==  order.id )
  //se la quantita del prodotto selezionato è maggiore di 1 o è uguale a uno e si va a fare un piu 1 sul prodotto
    if (order.quantity > 1 || (order.quantity === 1 && num === 1)) {
    //prendo il prodotto selezionato
      const takeOffOrder = orders.filter((singleObj) => {
        return singleObj.orderId !== order.orderId
      })
      //+1 o -1 sulla quantity
      order.quantity = order.quantity + num
     // aggiorno lo store con  tutti i prodotti selezionati  meno quello che sto modificando + il prodotto modificato
      const newState = [...ordersWithoutModifiedSingleOrder, order]

      modifyQuantityOrderRedux(newState)
      //se la quantity del prodotto è 1 e vado clicco sul -1 elimino il prodotto dallo store
    } else if (order.quantity === 1 && num === -1) {

      const takeOffOrder2 = orders.filter((singleObj) => {
        return singleObj.orderId !== order.orderId
      })
      modifyQuantityOrderRedux(takeOffOrder2)
    }
  }

  const ordersSortedByTitle = orders.sort(function (a, b) {
    const textA = a.title.toUpperCase()
    const textB = b.title.toUpperCase()
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
  })







  const router = useRouter()
  const goToCheckoutPage = () => {
    router.push('/User/checkoutpage')
  }

  return (
        <>
         <Navbar></Navbar>

         <div className='main  flex justify-center '>
            <div className=" grid  place-items-center left w-1/2 pt-12">
              <div className="h-10">
            <h1>Your products ordered</h1>
            </div>
            <div className="w-96">
                {isClient ? <div>

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
</div> : 'Waiting'}
            </div>
            </div>
            <div className="rigth w-1/2">
            <button onClick={() => goToCheckoutPage()} className="middle mt-4 ml-4 none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Procedi all'ordine</button>
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
