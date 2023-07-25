import Navbar from '../components/Navbar'

import { useEffect, useState } from 'react'
import { createId } from '@paralleldrive/cuid2'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'



function Home ({ state, insertRestaurantIdRedux }) {
  const [restaurants, setRestaurants] = useState([])
  const [idRe, setIdRe] = useState(0)
  const router = useRouter()


  // _______API_________start
  useEffect(() => {
    const getAllRestaurantsApi = async () => {
      try {
        const response = await fetch(
          '/api/restaurant',
          {
            method: 'GET',
            'Content-Type': 'application/json'
          }
        )

        const final = await response.json()

        setRestaurants(final.restaurants)

        return final
      } catch (error) {
        return { error: 'get List of restaurants failed' }
      }
    }
    getAllRestaurantsApi()
  }, [])
  // _____API_________end

  const handlerOnSelect = (e) => {
    setIdRe(Number(e.target.value))
  }

  const onButtonMakeOrder = () => {
    const objRest = restaurants.filter((singleObj) => {
      return singleObj.restaurantid === idRe
    })

    const idToInsert = objRest[0].restaurantid
    insertRestaurantIdRedux(idToInsert)

    router.push('User/MakeOrder')
  }

 
  return (
    <div className="div_background">
      <img src="/img/sky.jpg" className="img_index" alt="Flowbite Logo"/>

     
     <Navbar></Navbar>

     <div className="grid  place-items-center  pt-56" >
      <div>
     <h1 className="h1_index_page">Choose your restaurant</h1>
      </div>

     <select value={idRe || 0} onChange={(e) => { handlerOnSelect(e) } } className="block appearance-none w-1/2 bg-blue-50 border-4 border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-200 focus:bg-blue-100" id="grid-state" required>
      <option></option>
      {restaurants.map((singleObj) => {
        return (
         <option value={singleObj.restaurantid} key={createId()} >{singleObj.restaurantname}</option>
        )
      })}

         </select>
         <button onClick={() => onButtonMakeOrder()} className="  middle mt-20   none center rounded-lg bg-red-600 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ">Make order</button>
     </div>
     </div>
    

  )
}

export const insertRestaurantIdRedux = (data) => ({
  type: 'STORE_RESTAURANT_ID',
  payload: data
})

const mapDispatchToProps = {
  insertRestaurantIdRedux
}

const mapStateToProps = (state) => ({
  state
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
