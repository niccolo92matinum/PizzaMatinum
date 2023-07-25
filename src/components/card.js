import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import styles from '../styles/makeorder.module.css'

function CardMakeOrder ({ state, productsChoosen, setProductsChoosen, insertOrderRedux, mergeAllOrderWithSameId, setShow, show }) {
  const [counter, setCounter] = useState(0)

  const router = useRouter()

  const orders = state.order

  const onClickCheckYourOrder = () => {
    const arrVuot = []
    // controllo se ci sono elementi con lo stesso id , se ci sono vado a sommare le quantità di ogni singolo elemento
    orders.map((sing) => {
      // pusho il primo ordine nell' arrVuoto
      if (arrVuot.length === 0) {
        arrVuot.push(sing)
      } else {
        // dal secondo ordine in poi controllo se l'ultimo ordine inserito nell'arrayVuot abbia lo stesso id di quello che
        // sto per inserire
        const arrObjectsWihSameId = arrVuot.filter(x => x.id === sing.id)
        if (arrObjectsWihSameId.length > 0) {
          // se la condizione appena detta è vera prendo il quantity dell'ultimo obj
          const getAllQuantity = arrObjectsWihSameId.map(x => x.quantity).slice(-1)[0]
          // e lo sommo all'odine che sto ciclando(sing)
          const totalSum = getAllQuantity + sing.quantity
          // merge dell'odine che sto ciclando con il value quantity nuovo
          const objWithNewQuantity = { ...sing, ...{ quantity: totalSum } }
          // pusho nell'arrayVuot
          arrVuot.push(objWithNewQuantity)
        } else {
          // 'ultimo ordine inserito nell'arrayVuot non ha lo stesso id di quello ciclato
          // inserisco quello ciclato senza modifiche
          arrVuot.push(sing)
        }
      }
      return arrVuot
    })

    function group (arr, key) {
      return [...arr.reduce((acc, o) =>
        acc.set(o[key], (acc.get(o[key]) || []).concat(o))
      , new Map()).values()]
    }
    // raccolgo tutti gli ordini in array diversi in base all'id
    const groupById = group(arrVuot, 'id')
    // prendo per ogni array l'elemento con la quantity maggiore
    const final = groupById.map((x) => {
      return x.reduce((prev, current) => (prev.quantity > current.quantity) ? prev : current)
    })

    // vado a inserire gli ordini nello store Redux
    mergeAllOrderWithSameId(final)

    router.push('cartpage')
  }

  useEffect(() => {
    setCounter(0)
  }, [productsChoosen])

  const OnClickAddToCart = (product) => {
    insertOrderRedux({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      img: product.img,
      id: product.id,
      ingredients: product.ingredients,
      quantity: counter

    })
    setCounter(0)
    setProductsChoosen({})
  }

  if (show) {
    const arr = JSON.parse(productsChoosen.ingredients)
    const arrVuoto = []

    const final = arr.map((singlNumber) => {
      options.filter((option) => {
        if (singlNumber === option.value) {
          arrVuoto.push(option.label)
        }
      })
    })

    return (

    <div className="max-w-2xl mx-auto">

<div className=" rounded-lg  dark:bg-gray-800 dark:border-gray-700 " className={styles.card_makeorder}>
  <div className="">
  <button onClick={() => { setShow(false) }} type="button" className=" float-right mr-4 mt-4 bg-white rounded-md  inline-flex items-center justify-center text-red-700 hover:text-white hover:bg-red-700 ">
              <span className="sr-only">Close menu</span>

              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
  </div>

{(productsChoosen.img !== null) && <img className=" p-8" src={productsChoosen.img} className={styles.image_card_makeorder} alt="product image" />}

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

      <div className="flex flex-col items-cente ">

        <p className={styles.p_card_makeorder} >{arrVuoto.toString()}</p>
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
          {counter > 0 ? <button className="middle  none center rounded-lg bg-red-600 py-3 px-4 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" onClick={() => { OnClickAddToCart(productsChoosen); setShow(false) }}>Add to Cart</button> : ''}
          </div>

    </div>
</div>
</div>

    )
  } else {
    return (
      <>
      <div className="max-w-2xl mx-auto">
      <div className={styles.div_text_card1} >

        <h1 className={styles.text_when_hidden_card_makeorder}>KEEP TO ORDER</h1>

        </div>
        <div className={styles.div_text_card2}>
        <h1 className={styles.text_when_hidden_card_makeorder} >OR</h1>
        </div>
        <div className={styles.div_text_card3}>
          <div className="grid grid-cols-2 gap-4 ">
            <div className="flex flex-col items-center">
            <h1 className={styles.text_when_hidden_card_makeorder}>GO TO </h1>
            </div>
            <div className="flex flex-col items-center">
       <button onClick={() => onClickCheckYourOrder()} className="  middle   none center rounded-lg bg-red-600 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none " >CART PAGE</button>
       </div>

          </div>

      </div>

      <div className="mt-4 mb-4 ">

      </div>
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
const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {
  insertOrderRedux,
  mergeAllOrderWithSameId
}

export default connect(mapStateToProps, mapDispatchToProps)(CardMakeOrder)

const options = [
  { value: 1, label: 'Mozzarella' },
  { value: 2, label: 'Pomodoro' },
  { value: 3, label: 'Basilico' },
  { value: 4, label: 'Funghi' },
  { value: 5, label: 'Peperoni' },
  { value: 6, label: 'Salame' },
  { value: 7, label: 'Carciofi' }
]
