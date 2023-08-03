import Navbar from '../../components/Navbar'
import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import CheckoutPage from '../../components/checkout'
import PreviewPage from '../../components/stripe'
import styles from '../../styles/cartpage.module.css'

function CartPage ({ state, modifyQuantityOrderRedux }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const price = state.order.map(singleOrder => singleOrder.price * singleOrder.quantity).reduce((acc, curr) => acc + curr, 0)
  const numOfProductOrdered = state.order.map(singleOrder => singleOrder.quantity).reduce((acc, curr) => acc + curr, 0)

  console.log(price)

  return (
        <>
         <Navbar></Navbar>

         <div className='main  pt-40 flex justify-center '>
            <div className=" flex flex-col items-center  w-1/2 pt-12">

              <CheckoutPage price={price} ></CheckoutPage>

            </div>
            <div className="rigth w-1/2 flex flex-col items-center pt-12 ">

              <div className={styles.div_cartpage_paymentmethod}>

                 <div>
                   <h2 className="block uppercase tracking-wide text-gray-700 text-xl font-bold mb-8">ORDER SUMMARY</h2>
                </div>
                <hr/>
                <div className="flex grid grid-cols-2 pt-2 pb-2">
                <div className="">
                  <p className={styles.font_cartpagesummary}>Products</p>
                </div>
                <div className="col-start-4 col-end-5">
                  <p className={styles.font_cartpagesummary_rigth}>{isClient ? numOfProductOrdered : 0}</p>
                </div>

                </div>

                <hr/>
                <div className="flex grid grid-cols-2 pt-2 pb-2 ">
                  <div>
                    <h3 className={styles.font_cartpagesummary}>Amount to Pay</h3>
                  </div>

                  <div className="col-start-4 col-end-5">
                    <h2 className={styles.font_cartpagesummary_rigth}>{isClient ? price : 0}€</h2>
                  </div>

                </div>

                <hr/>
                <div className="pt-2 pb-2">

                  <div className="pt-2">

                     <PreviewPage ></PreviewPage>
                  </div>

                </div>

              </div>
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
