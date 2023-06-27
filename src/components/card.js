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
import { createId } from '@paralleldrive/cuid2'

function CardMakeOrder ({ state, productsChoosen, insertOrderRedux }) {
  const [counter, setCounter] = useState(0)

  const [order, setOrder] = useState({})

  const router = useRouter()

  const onClickCheckYourOrder = () => {
    router.push('cartpage')
  }

  useEffect(() => {
    setCounter(0)
  }, [productsChoosen])

  const OnClickAddToCart = (product) => {
    product.quantity = counter
    product.orderId = createId()



    insertOrderRedux(product)
    setCounter(0)
  }

  if (Object.keys(productsChoosen).length > 0) {
    return (
    <>
     <div className='flex justify-center '>
            <div className="left  pt-12">
            <Card className="mt-6 w-96">
        <CardHeader color="blue-gray" className="relative h-56">
          <img src={productsChoosen.img} alt="img-blur-shadow" layout="fill" />
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
              <button onClick={() => onClickCheckYourOrder()} className="middle mt-4 ml-4 none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Check your orders</button>
              </div>

            </div>

        </div>

      </>
    )
  } else {
    return (
      <h1>choos a product to add</h1>
    )
  }
}

export const insertOrderRedux = (data) => ({
  type: 'INSERT_SINGLE_ORDER',
  payload: data
})
const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {
  insertOrderRedux
}

export default connect(mapStateToProps, mapDispatchToProps)(CardMakeOrder)
