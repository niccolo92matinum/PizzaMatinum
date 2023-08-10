import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import styles from '../styles/makeorder.module.css'
import Image from 'next/image'

function AccordionOrder ({ showProductOnChoosen, state, setShow }) {
  const [isClient, setIsClient] = useState(false)

  // Ensure that the component renders the same content server-side as it does during the initial
  // client-side render to prevent a hydration mismatch. You can intentionally render different
  // content on the client with the useEffect hook.
  useEffect(() => {
    setIsClient(true)
  }, [])

  
  if (isClient) {
    return (
        <div className="m-2 space-y-2">
        { Object.values(state.productsData).map((categoryArr, i) => {
          return (
            <div key={Math.random()}
          className="group flex flex-col gap-2 rounded-lg bg-neutral-50 p-5 text-white"
          tabIndex={i}
          >
          <div className="flex cursor-pointer items-center justify-between">
          <span className='name_category_accordion'>{categoryArr[0].category}</span>
          <Image
          src="https://upload.wikimedia.org/wikipedia/commons/9/96/Chevron-icon-drop-down-menu-WHITE.png"
          width={30} height={30}
          alt="icon nav"
          className="h-2 w-3 transition-all duration-500 group-focus:-rotate-180"

          />
          </div>
          <div
          className="invisible h-auto max-h-0 items-center opacity-0 transition-all group-focus:visible group-focus:max-h-screen group-focus:opacity-100 group-focus:duration-1000"
          >
            {categoryArr.map((singleObj) => {
              return (
                    <div className={styles.accordion_main_div_makeorder} key={singleObj.id}>
                      <div className='grid grid-cols-2 gap-4 '>
                        <div className="grid grid-cols-2  gap-4">
                        <h1 className=' h1_accordion_title text-stone-700' >{singleObj.title} </h1>
                        <h2 className={styles.h2_accordion_title} >{singleObj.price} €</h2>
                        </div>
                        <div>
                        <button onClick={() => { showProductOnChoosen(singleObj); setShow(true) }} className="middle mb-8 none center rounded-lg bg-red-600 py-1 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ">Order</button>
                        </div>

                      </div>

                   {/*
                   <div>
                    <p className='bg-red-300 0'>{singleObj.description}</p>
                    </div>
                   */}

                    </div>

              )
            })

            }

          </div>
          </div>
          )
        }) }

        </div>

    )
  } else {
    return (
      <>

      <div className=" h-screen flex items-center justify-center">
        <h1 className="h1_loginpage">Loading....</h1>
      </div>

      </>
    )
  }
}




const mapStateToProps = (state) => ({
  state
})



export default connect(mapStateToProps, null)(AccordionOrder)
