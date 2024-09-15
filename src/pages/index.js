import Navbar from '../components/Navbar'
import Carousel from '../components/carousel'
import Footer from '../components/footer'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createId } from '@paralleldrive/cuid2'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


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
    if (idRe) {
      const objRest = restaurants.filter((singleObj) => {
        return singleObj.restaurantid === idRe
      })

      const idToInsert = objRest[0].restaurantid
      insertRestaurantIdRedux(idToInsert)

      router.push('User/MakeOrder')
    }
  }

  return (
    <div>
{/* sfondo  inizio  */}
      <div className="div_img_indexpage  ">
         <div className="screen1"></div>

      </div>
{/* sfondo  fine  */}
      <div>
         <Navbar></Navbar>
      </div>

      <div className="grid grid-cols-3 w-2/3 mt-20  relative mx-auto place-items-center">
      
        <div>
        <Image
          src="/img/sushi.svg"
          width={200} height={200}
          alt="icon nav"

          />
        </div>
        <div>
        <Image
          src="/img/dio.png"
          width={200} height={200}
          alt="icon nav"

          />
        </div>
        <div>
        <Image
          src="/img/spaghett.png"
          width={200} height={200}
          alt="icon nav"

          />
        </div>
     
      </div>

      <div className="" >
         <div className="grid w-2/3  mx-auto place-items-center  bg-white pb-24  rounded-lg shadow-2xl ">

            <div>
               {restaurants?.length > 0 ? <h1 className="h1_index_page">Choose your restaurant</h1> : <h1 className="h1_index_page">Loading..</h1>}
            </div>

            <div className="flex content-center w-2/3 border-2 border-gray-200 bg-white rounded-full">

              <div className="w-11/12 pl-4">
                  <select value={idRe || 0} onChange={(e) => { handlerOnSelect(e) } } className="w-full block appearance-none  py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-grey-200 focus:bg-blue-100" id="grid-state" required>
                    <option></option>
                    
                      {restaurants?.length > 0 && restaurants?.map((singleObj) => {
                        return (
                                    <option className="tag_option_index" value={singleObj.restaurantid} key={createId()} >{singleObj.restaurantname}</option>
                        )
                      })}
                  </select>
              </div>
              <div className="flex items-center justify-center w-1/12 pr-2">
                  <button className="  middle   none center  px-6 py-4 mr-4 rounded-full  font-sans text-xs font-bold uppercase bg-tre shadow-md shadow-pink-500/20 transition-all duration-500 "
                      onClick={() => onButtonMakeOrder()}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#fafafa' }} />
                  </button>
              </div>
            </div>

          </div>
          <div className=" grid   mx-auto place-items-center  mt-36 py-12 bg-white">
              <h2 className="div_h2_index">Rendi i tuoi ordini più veloci </h2>
          </div>
      </div>

      <div>
      <Carousel></Carousel>
      </div>
      <div>
       <Footer></Footer>
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
