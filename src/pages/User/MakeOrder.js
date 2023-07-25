import { useEffect, useState } from 'react'
import styles from '../../styles/makeorder.module.css'
import Navbar from '../../components/Navbar'
import AccordionOrder from '../../components/accordion'
import CardMakeOrder from '../../components/card'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'

function MakeOrder ({ state, insertProductsOnStore }) {
  const [productsChoosen, setProductsChoosen] = useState({})
  const [show, setShow] = useState(false)

  const router = useRouter()
  useEffect(() => {
    const redirectIfNoRestaurantChoosen = async () => {
      if (state.restaurantId === 0) {
        router.push('/')
      }
    }
    redirectIfNoRestaurantChoosen()
  }, [])

  const showProductOnChoosen = (product) => {
    setProductsChoosen(product)
  }

  return (
        <>
        <Navbar></Navbar>

        <div className='main flex justify-center pt-36 ' >

            <div className="place-content-center  w-1/2  pt-8">
              <div className={styles.container_accordion_makeorder}>
              <AccordionOrder showProductOnChoosen={showProductOnChoosen} setShow={setShow} ></AccordionOrder>
              </div>

            </div>
            <div className="rigth w-1/2 pt-8">
                <CardMakeOrder productsChoosen={productsChoosen} setProductsChoosen={setProductsChoosen} setShow={setShow} show={show}></CardMakeOrder>
            </div>

        </div>

        </>
  )
}

function filterProductsByCategory (obj, prop) {
  return obj.reduce(function (acc, item) {
    const key = item[prop]

    if (!acc[key]) {
      acc[key] = []
    }

    acc[key].push(item)

    return acc
  }, {})
}

export const insertProductsOnStore = (data) => ({
  type: 'STORE_PRODUCTS',
  payload: data
})

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {
  insertProductsOnStore
}

export default connect(mapStateToProps, mapDispatchToProps)(MakeOrder)
