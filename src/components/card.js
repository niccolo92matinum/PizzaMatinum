import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button
} from '@material-tailwind/react'
import Image from 'next/image'
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createId } from '@paralleldrive/cuid2'

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
      quantity: counter,
     
    })
    setCounter(0)
    setProductsChoosen({})
  }

 

  if (Object.keys(productsChoosen).length > 0) {
    return (
    <>
     <div className='flex justify-center '>
            <div className="left  pt-12">
            <Card className="mt-6 w-96">
        <CardHeader color="blue-gray" className="relative h-56">
         {(productsChoosen.img !== null ) &&<Image src={productsChoosen.img} alt="img-blur-shadow" layout="fill" />}
        </CardHeader>
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            <div className="main  flex justify-center">
            <div className="left w-1/2">
            <h1>{productsChoosen.title}</h1>
            </div>
            <div className="right w-3/4 flex items-stretch ">

              <button onClick={() => { setCounter((prevState) => counter > 0 ? prevState - 1 : counter) }} className="middle mt-4 ml-4 none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">-</button>
               <p className="middle mt-4 ml-4 none center rounded-lg  py-3   text-xs font-bold uppercase">{counter}</p>
               <button onClick={() => { setCounter((prevState) => prevState + 1) }} className="middle mt-4 ml-4 none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">+</button>
            </div>
            </div>

          </Typography>

          <Typography>
           {productsChoosen.description}

          </Typography>
        </CardBody>
        <CardFooter className="pt-0">

          {counter > 0 ? <Button onClick={() => { OnClickAddToCart(productsChoosen) }}>Add to Cart</Button> : ''}
        </CardFooter>
      </Card>
            </div>
            <div className="rigth   pt-12">
              <div className="grid h-screen place-items-center pl-12">

              </div>

            </div>

        </div>

      </>
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
