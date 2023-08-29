import { connect } from 'react-redux'

import { useState, useEffect } from 'react'
import styles from '../styles/makeorder.module.css'
import Image from 'next/image'

function AccordionOrder ({ showProductOnChoosen, setShow, productsData }) {
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
        { Object.values(productsData).map((categoryArr, i) => {
          // console.log(categoryArr,'000')
          return (
            <div key={i} >
              <div className="">
              <h1 className="text-3xl">{categoryArr[0].category}</h1>
              </div>

               {categoryArr.map((singleProduct) => {
                 const arrLabel = singleProduct.ingredients?.map(single => single.label)
                 const stringAllLabelIngredients = arrLabel?.toString()

                 return (
                    <div key={Math.random()} onClick={() => { showProductOnChoosen(singleProduct); setShow(true) }} className={styles.div_singleproduct}>
                      <div>
                        <h1 className="text-2xl">{singleProduct.title}</h1>
                         {stringAllLabelIngredients && <p>{stringAllLabelIngredients}</p>}
                        <p>da {singleProduct.price} €</p>
                      </div>
                      <div className="mr-5">
                      { singleProduct.img && <Image className="w-20 h-20  m-auto rounded-bl-3xl rounded-br-3xl rounded-tl-3xl rounded-tr-3xl  " width={30} height={30} src={singleProduct.img} alt="Neil image"/>}

                      </div>

                    </div>

                 )
               })}
            </div>

          )
        })}
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

export default connect(null, null)(AccordionOrder)
