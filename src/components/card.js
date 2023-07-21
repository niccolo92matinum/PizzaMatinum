import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button
} from '@material-tailwind/react'

import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import styles from '../styles/makeorder.module.css'

function CardMakeOrder ({ state, productsChoosen, setProductsChoosen, insertOrderRedux, mergeAllOrderWithSameId }) {
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
  console.log(productsChoosen,'???')
  if (Object.keys(productsChoosen).length > 0) {
   
    return (

    <div className="max-w-2xl mx-auto">

<div className=" rounded-lg  dark:bg-gray-800 dark:border-gray-700" className={styles.card_makeorder}>

{(productsChoosen.img !== null) && <img className=" p-8" src={productsChoosen.img} className={styles.image_card_makeorder} alt="product image" />}

    <div className="px-5 pb-5">
      <div className="grid grid-cols-1  gap-4">
        <div className="place-content-center">
        <h2>{productsChoosen.title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center">
          <button type="button"
        className="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline" onClick={() => { setCounter((prevState) => counter > 0 ? prevState - 1 : counter) }}>-</button>
        </div>
        <div className="flex items-center justify-center">
        <p className="">{counter}</p>
        </div>
        <div className="flex flex-col items-center">
        <button type="button"
        className="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
        onClick={() => { setCounter((prevState) => prevState + 1) }}>+</button>
        </div>

      </div>

               <div>
                <p> {productsChoosen.description}</p>
               </div>

          <div>
          {counter > 0 ? <button onClick={() => { OnClickAddToCart(productsChoosen) }}>Add to Cart</button> : ''}
          </div>

    </div>
</div>
</div>

    )
  } else {
    return (
      <>
      <button onClick={() => onClickCheckYourOrder()} className="middle mt-4 ml-4 none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Check your orders</button>
      <h1>choos a product to add</h1>
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
