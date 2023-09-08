import Navbar from '../../components/Navbar'
import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import CheckoutPage from '../../components/checkout'
import PreviewPage from '../../components/stripe'
import styles from '../../styles/cartpage.module.css'
import Image from 'next/image'

function CartPage ({ state, modifyQuantityOrderRedux }) {
  const [isClient, setIsClient] = useState(false)
  console.log(state)
  useEffect(() => {
    setIsClient(true)
  }, [])

  const price = state.order.reduce((acc, curr) => acc + curr.price, 0)

  const orders = state.order
  return (
  <>
  {isClient
    ? <div>
   <Navbar></Navbar>

   <div className='main  pt-20 flex justify-center '>
      <div className=" flex flex-col items-center  w-1/2 pt-12">

        <CheckoutPage price={price} ></CheckoutPage>

      </div>
      <div className="rigth w-1/2 flex flex-col items-center pt-12 ">

        <div className="w-3/4 bg-white rounded-lg shadow-2xl py-8 px-8">

           <div>
             <h2 className="block uppercase tracking-wide text-black text-2xl font-bold mb-8">Riepilogo Ordine</h2>
          </div>
          <hr/>

            {orders.map((singleOrder) => {
              return (
                <div className="flex grid grid-cols-2 pt-2 pb-2">
         
                <div className="flex grid-cols-2">
                  <div className="flex  grid place-items-center rounded-full w-8 h-8 bg-due">
                  <p className="font-light text-base">{singleOrder.quantity}</p>
                  </div>
                  <div>
                  <p className="font-light text-base pl-4">{singleOrder.title}</p>
                  </div>
                  

                </div>
                <div className="flex justify-end ">
                  <p className="font-light text-base mr-2">{singleOrder.price}  €</p>
                  </div>
               

         </div>
              )
            })}

          <hr/>
          <div className="flex grid grid-cols-2 pt-2 pb-2 ">
            <div>
              <h3 className="font-bold text-base text-black">Amount to Pay</h3>
            </div>

            <div className="col-start-4 col-end-5">
              <h2 className="font-bold text-base text-black-700">{isClient ? price : 0} €</h2>
            </div>

          </div>

          <hr/>
          <div className="pt-2 pb-2">

            <div className="pt-2">

               <PreviewPage ></PreviewPage>
            </div>

          </div>

        </div>
        <div className=" w-full  flex flex-col items-center pt-14">
  <Image
    src="/img/paymentImg2.svg"
    width={300} height={300}
    alt="icon nav"

    />
  </div>
      </div>

  </div>

  </div>
    : null}
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
