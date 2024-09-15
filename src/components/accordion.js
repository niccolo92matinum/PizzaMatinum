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

  

  useEffect(() => {
    // window.addEventListener('scroll', prova)
  }, [])

  if (isClient) {
    return (
      <div className="space-y-2 overflow-y-scroll h-5/6">
        { Object.values(productsData).map((categoryArr, i) => {
          // console.log(categoryArr,'000')
          return (
            <div key={i} >
              <div className="sticky top-0 rounded-[8px]  bg-uno">
              <h1 className="text-4xl pl-4">{categoryArr[0].category}</h1>
              </div>

               {categoryArr.map((singleProduct) => {
                 const arrLabel = singleProduct.ingredients?.map(single => single.label)
                 const stringAllLabelIngredients = arrLabel?.toString()

                 return (
                    <div key={Math.random()} onClick={() => { showProductOnChoosen(singleProduct); setShow(true) }} className={styles.div_singleproduct}>
                      <div className="p-4">
                        <h1 className="font-bold text-2xl">{singleProduct.title}</h1>
                         {stringAllLabelIngredients && <p>{stringAllLabelIngredients}</p>}
                        <p className="font-bold" >da {singleProduct.price} €</p>
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
