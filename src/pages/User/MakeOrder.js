import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import AccordionOrder from '../../components/accordion'
import CardMakeOrder from '../../components/card'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'

function MakeOrder ({ state }) {
  const [productsChoosen, setProductsChoosen] = useState({})

  const router = useRouter()
  useEffect(() => {
    const redirectIfNoRestaurantChoosen = async () => {
      if (state.restaurantId === 0) {
        router.push('/')
      }
    }
    redirectIfNoRestaurantChoosen()
  }, [])

  const products = state.productsData

  const showProductOnChoosen = (product) => {
    setProductsChoosen(product)
  }

  return (
        <>
        <Navbar></Navbar>

        <div className='main  flex justify-center '>
            <div className="left w-1/2 pt-12">
              <AccordionOrder products={products} showProductOnChoosen={showProductOnChoosen} ></AccordionOrder>
            </div>
            <div className="rigth w-1/2">
                <CardMakeOrder productsChoosen={productsChoosen} setProductsChoosen={setProductsChoosen}></CardMakeOrder>
            </div>

        </div>

        </>
  )
}

const mapStateToProps = (state) => ({
  state
})

export default connect(mapStateToProps, null)(MakeOrder)
