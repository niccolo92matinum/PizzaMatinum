import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'

import styles from '../styles/makeorder.module.css'

function CardMakeOrder ({ state, productsChoosen, setProductsChoosen, insertOrderRedux, mergeAllOrderWithSameId, setShow, show, modifyQuantityOrderRedux }) {
  const [counter, setCounter] = useState(0)
  console.log(state)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const router = useRouter()

  const rootFunction = (path) => {
    router.push(path)
  }

  const orders = state.order

  const onClickCheckYourOrder = (product) => {
    // creo il nuovo prodotto da inserire nello state
    const newOrder = {
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      img: product.img,
      id: product.id,
      ingredients: product.ingredients,
      quantity: counter

    }

    const sortIngredient = (arr) => {
      const ingSort = arr.sort(function (a, b) {
        const textA = a.label.toUpperCase()
        const textB = b.label.toUpperCase()
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
      return ingSort
    }

    let newArray = [...orders]
    let stopMap = true

    const checkIfIdIsPresent = newArray.map((obj) => {
      return obj.id === newOrder.id
    })

  

    const idIsPresent = checkIfIdIsPresent.includes(true)






    const sortedIngredientNewOrder = sortIngredient(newOrder.ingredients)

    if (orders.length === 0) {
      console.log('dentro')
      newArray = [newOrder]
      insertOrderRedux(newArray)
    } else {
      const checkIfOrdersAreEqual = orders.map((singleOrder, i) => {
        console.log(orders.length, 'ppp')

        const sortedIngredientSingleOrder = sortIngredient(singleOrder.ingredients)
        if (singleOrder.id === newOrder.id && JSON.stringify(sortedIngredientSingleOrder) === JSON.stringify(sortedIngredientNewOrder)) {
          const newQuantity = singleOrder.quantity + newOrder.quantity
          console.log('dentro2')

          newArray[i].quantity = newQuantity
          insertOrderRedux(newArray)
          stopMap = false
        } else if ((singleOrder.id === newOrder.id && JSON.stringify(sortedIngredientSingleOrder) !== JSON.stringify(sortedIngredientNewOrder)) && stopMap) {
          console.log('dentro3')
          const final = [...newArray, newOrder]
          insertOrderRedux(final)
        } else if (singleOrder.id !== newOrder.id && !idIsPresent) {
          const final = [newOrder, ...newArray]
          insertOrderRedux(final)
          console.log('dentro4')
        }

        return singleOrder
      })
      console.log(checkIfOrdersAreEqual)
    }

    // console.log(mergeNewOrder, 'new', checkSameIdOrder)
  }

  useEffect(() => {
    setCounter(0)
  }, [productsChoosen])

  /* const ordersSortedByTitle = orders.sort(function (a, b) {
    const textA = a.title.toUpperCase()
    const textB = b.title.toUpperCase()
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
  }) */

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

  if (show) {
    return (

    <div className="max-w-2xl mx-auto ">

<div className={styles.card_makeorder}>
  <div className="">
  <button onClick={() => { setShow(false) }} type="button" className=" float-right mr-4 mt-4 bg-white rounded-md  inline-flex items-center justify-center text-red-700 hover:text-white hover:bg-red-700 ">
              <span className="sr-only">Close menu</span>

              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
  </div>

{(productsChoosen.img !== null) && <Image className=" p-8" src={productsChoosen.img} className={styles.image_card_makeorder} width={600} height={600} alt="product image" />}

    <div className="px-5 pb-5">
      <div className="grid grid-cols-1  gap-4">
        <div className="flex items-center justify-center grid grid-cols-3  gap-4 ">
          <div>

          </div>
          <div>
          <h2 className={styles.h2_card_title}>{productsChoosen.title} </h2>
          </div>
        <div>

        </div>

        </div>
      </div>

      <div className="flex flex-col items-center ">

      <div className="w-full mr-4">
              <label className="block uppercase tracking-wide text-sky-700 text-xs font-bold mb-2" htmlFor="grid-state">
                 Ingredient
           </label>
             <Select

             onChange={(e) => setProductsChoosen({ ...productsChoosen, ...{ ingredients: e } })}
              options={state.ingredients }
              closeMenuOnSelect={false}
              value={productsChoosen.ingredients}
              isMulti
              />
        </div>

      </div>

      <div className="grid grid-cols-3 gap-4 mt-8  ">

        <div className="flex flex-col items-center ml-28">
          <button type="button"
        className=" border-sky-100 border-2 middle  none center rounded-lg bg-white py-3 px-4 font-sans text-xs font-bold uppercase text-sky-600  shadow-md shadow-sky-600/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-sky-600/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" onClick={() => { setCounter((prevState) => counter > 0 ? prevState - 1 : counter) }}>-</button>
        </div>
        <div className="flex items-center justify-center">
        <p className="">{counter}</p>
        </div>
        <div className="flex flex-col items-center mr-28">
        <button type="button"
        className=" border-sky-100 border-2 middle  none center rounded-lg bg-white py-3 px-4 font-sans text-xs font-bold uppercase text-sky-600  shadow-md shadow-sky-600/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-sky-600/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        onClick={() => { setCounter((prevState) => prevState + 1) }}>+</button>
        </div>

      </div>

          <div className="flex flex-col items-center mt-12">
          {counter > 0 ? <button className="middle  none center rounded-lg bg-red-600 py-3 px-4 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" onClick={() => { onClickCheckYourOrder(productsChoosen); setShow(false) }}>Add to Cart</button> : ''}
          </div>

    </div>
</div>
</div>

    )
  } else {
    return (
      <>

      <div className="mr-20">
              <div className=" flex flex-col items-center m-auto" >
            <h1 className={styles.h1_cartpage}>MAKE YOUR ORDER</h1>

            </div>
            <div className={styles.div_cartpage_leftside}>
                {isClient
                  ? <div className={styles.div_cartpage_leftside_nested}>

<ul className="list-none ">
{state.order.map((order) => {
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
            {(isClient && state.order.length > 0)
              ? <div className="flex flex-col items-center">
            <button onClick={() => rootFunction('/User/cartpage')}className=" middle mt-12   none center rounded-lg bg-red-600 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ">CART</button>

            </div>
              : <div className="flex flex-col items-center pt-8">
             <FontAwesomeIcon className={styles.arrow_card} icon={faArrowLeft} beatFade />
             </div>}

            </div>
      </>
    )
  }
}

export const insertOrderRedux = (data) => ({
  type: 'INSERT_SINGLE_ORDER',
  payload: data
})

export const mergeAllOrderWithSameId = (data) => ({
  type: 'MERGE_ALL_ORDER_WITH_SAME_ID',
  payload: data
})

export const modifyQuantityOrderRedux = (data) => ({
  type: 'MODIFY_QUANTITY_ORDER',
  payload: data
})

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {
  insertOrderRedux,
  mergeAllOrderWithSameId,
  modifyQuantityOrderRedux
}

export default connect(mapStateToProps, mapDispatchToProps)(CardMakeOrder)
