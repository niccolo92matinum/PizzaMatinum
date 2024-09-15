import { useState, useEffect } from 'react'
import Navbaradmin from '../../components/Navbaradmin'
import SimpleAccordion from '../../components/SimpleAccordion'

import { connect } from 'react-redux'
import { createId } from '@paralleldrive/cuid2'
import Select from 'react-select'
import styles from '../../styles/insertproduct.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

function InsertProducts ({ state, modifyProductRedux, insertProductRedux, setIdEmailToStore, insertIngredientsRedux }) {
  const { data: session, status } = useSession()
  const { push } = useRouter()
  //  nel caso in cui l'admin è gia nella pagina Insert product e fa il login avrà i dati della sessione nello store redux
  useEffect(() => {
    if (status === 'authenticated') {
      setIdEmailToStore(
        {
          email: session.user.email,
          ID: session.admin.rows[0].id,
          restaurantId: session.restaurantId
        })
    } else if (status === 'unauthenticated') {
      push('/Admin/Login')
    }
  }, [status])

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [product, setProduct] = useState({
    adminId: state.adminData.ID,
    restaurantId: state.adminData.restaurantId,
    id: createId(),
    img: null,
    category: 'Dish',
    ingredients: []
  })

  const [singleProductSelected, setSingleProductSelected] = useState({})
  const [modify, setModify] = useState(false)

  // const [witchModal, setWitchModal] = useState('')

  // const [showModal, setShowModal] = useState(false)
  // <Modalmodify setShowModal={setShowModal} showModal={showModal}></Modalmodify>

  const convertImgSetToProduct = (file) => {
    if (file) {
      const filereader = new FileReader()
      filereader.readAsDataURL(file)
      filereader.onload = function (evt) {
        const base64 = evt.target.result

        setProduct({ ...product, ...{ img: base64 } })
      }
    }
  }

  // ___________________________________________________________________
  // funzione che inserisce il prodotto nello store redux prima del rendering
  // cosi da poter aggiornare l'accordion senza chiamre l'endpoint ogni volta
  const insertInstantlyObjInStore = (store, objtoPush) => {
    // const getOnlyIdsIngredients = objtoPush.ingredients.map(ingredient => ingredient.value)
    // objtoPush.ingredients = JSON.stringify(getOnlyIdsIngredients)

    const allCategoryStore = Object.keys(store.productsData)

    const categorySingleObj = objtoPush.category

    if (Object.keys(store.productsData).length === 0) {
      const newStore = { [objtoPush.category]: [objtoPush] }

      return newStore
    } else if (allCategoryStore.includes(objtoPush.category)) {
      // arr = arr della category ES pizza + la nuova pizza
      const arr = [...store.productsData[categorySingleObj], objtoPush]
      // ho creato una nuoa variabile perchè non è possibile mutare lo state
      const newStore2 = { ...store.productsData, ...{ [categorySingleObj]: arr } }

      return newStore2
    } else if (!allCategoryStore.includes(objtoPush.category)) {
      const newStore3 = { ...store.productsData, ...{ [categorySingleObj]: [objtoPush] } }

      return newStore3
    }

    return {}
  }

  // ____________________________________________________________

  // _______START____API__FUNCTIONS__________________

  const insertProductApi = async (e) => {
    if (!modify) {
      e.preventDefault()

      try {
        const response = await fetch(

          '/api/products',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'

            },
            Authorization: session.accessToken,
            body: JSON.stringify(product)
          })
        await response.json()

        const final = insertInstantlyObjInStore(state, product)
        // inserisco  i prodotti nello store redux
        insertProductRedux(final)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const clearStateProduct = () => {
    setProduct({
      adminId: state.adminData.ID,
      id: createId(),
      category: 'Dish',
      ingredients: [],
      restaurantId: state.adminData.restaurantId

    })
  }

  const repalacementProductModified = (newProduct, productSelected) => {
    const deleteObj = state.productsData[productSelected.category].filter((singleObj) => {
      return singleObj.id !== productSelected.id
    })
    // const getOnlyValueIngredients = newProduct.ingredients.map(ingredient => ingredient.value)

    // newProduct.ingredients = JSON.stringify(getOnlyValueIngredients)
    const prevState = state.productsData

    const arrVuoto = []
    const newState = {}

    if (deleteObj.length === 0 && (productSelected.category !== newProduct.category)) {
      Object.keys(prevState).map((categoryKey) => {
        if (categoryKey !== productSelected.category) {
          arrVuoto.push(categoryKey)
          return arrVuoto
        }
        return arrVuoto
      })
      arrVuoto.map((category) => {
        if (category === newProduct.category) {
          const mergeNewProductWithArray = [...prevState[category], newProduct]
          newState[category] = mergeNewProductWithArray
          return newState
        } else {
          newState[category] = prevState[category]
          return newState
        }
      })

      if (!arrVuoto.includes(newProduct.category)) {
        newState[newProduct.category] = [newProduct]
        return newState
      }
      return newState
    } else if (productSelected.category !== newProduct.category) {
      const arrVuoto2 = []

      Object.keys(prevState).map((categoryKey) => {
        if (categoryKey === productSelected.category) {
          newState[categoryKey] = deleteObj
          return newState
        }
        if (categoryKey === newProduct.category) {
          const mergeNewProductWithArray2 = [...prevState[categoryKey], newProduct]
          newState[categoryKey] = mergeNewProductWithArray2
          return newState
        }
        if (categoryKey !== productSelected.category && categoryKey !== newProduct.category) {
          newState[categoryKey] = prevState[categoryKey]
          return newState
        }
        if (!arrVuoto2.includes(newProduct.category)) {
          newState[newProduct.category] = [newProduct]
          return newState
        }
        return newState
      })
    } else {
      Object.keys(prevState).map((categoryKey) => {
        if (newProduct.category === categoryKey) {
          const mergeNewProductWithArray3 = [...deleteObj, newProduct]

          newState[categoryKey] = mergeNewProductWithArray3
          return newState
        } else {
          newState[categoryKey] = prevState[categoryKey]
          return newState
        }
      })

      /* if (arrVuoto2.includes(newProduct.category)) {
        newState[newProduct.category] = [newProduct]
      } */
    }

    return newState
  }

  const modifyProductApi = async (e) => {
    if (modify) {
      e.preventDefault()

      try {
        const response = await fetch(

          '/api/products',
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'

            },
            Authorization: session.accessToken,
            body: JSON.stringify(product)
          })
        await response.json()
        const arrModified = await repalacementProductModified(product, singleProductSelected)
        setModify(false)
        modifyProductRedux(arrModified)
      } catch (err) {
        console.log({ FAILED: err })
      }
    }
  }
  // _______END____API__FUNCTION__________________

  let hiddenMultiSelect = false
  if (product.category === 'Wine' || product.category === 'Drink') {
    hiddenMultiSelect = true
  }

  // ________ code modal ingredient _____

  const arrIngredient = state.ingredients

  useEffect(() => {
    console.log('dentro')
    if (status === 'authenticated') {
      const getAllIngredients = async () => {
        try {
          const response = await fetch(
     `/api/ingredients?adminid=${state.adminData.ID}`,
     {
       method: 'GET',
       'Content-Type': 'application/json',
       Authorization: session.accessToken
     }
          )

          const final = await response.json()

          // inserisco  gli ingredienti nello store redux

          await insertIngredientsRedux(final)

          return final
        } catch (error) {
          return { error: 'Not allowed get Ingredients' }
        }
      }

      getAllIngredients()
    }
  }, [state.adminData.ID])

  const router = useRouter()

  const rootFunction = (path) => {
    router.push(path)
  }

  // ________ end code modal ingredient ______

  if (isClient && status !== 'unauthenticated') {
    return (
      <>
       <Navbaradmin></Navbaradmin>

       <div className='main  flex justify-center pt-8 '>
        {/* comntainer sinistra */}
        <div className='left  place-content-center  w-1/2 pl-28 pr-28 '>

         <form className="w-full" id='Form-Insert-Product' onSubmit={(e) => { insertProductApi(e); modifyProductApi(e); clearStateProduct() }}>
         <div className='flex flex-wrap place-content-center pb-4 '>
          <h1 className="text-black text-4xl font bold pb-8">Dettagli del prodotto</h1>
          </div>

          <div className="">
          <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2 " htmlFor="grid-first-name">
                   Title
            </label>
            <input value={product.title || ''} onChange={(e) => setProduct({ ...product, ...{ title: e.target.value } })} className="appearance-none block w-full bg-white text-gray-700 border border-grey-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="title" type="text" placeholder="Title" required/>
          </div>

          <div>
          <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2 mt-8" htmlFor="grid-last-name">
                   Description
            </label>
            <textarea value={product.description || ''} onChange={(e) => setProduct({ ...product, ...{ description: e.target.value } })} className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Insert Description" required/>
          </div>

          <div className="w-2/6">
          <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2 mt-8" htmlFor="grid-state">
                   Category
           </label>

            <select value={product.category || ''} onChange={(e) => setProduct({ ...product, ...{ category: e.target.value } })} className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" required>
             <option>Dish</option>
             <option>Pizza</option>
             <option>Drink</option>
             <option>Cold plate</option>
             <option>Wine</option>

            </select>
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>

          </div>
            <div className=" flex flex-row pt-3 pb-3 mt-4 " hidden={hiddenMultiSelect}>
              <div className="w-full mr-4">
              <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-state">
                 Ingredient
           </label>
             <Select

              onChange={(e) => setProduct({ ...product, ...{ ingredients: e } })}
              options={arrIngredient }
              closeMenuOnSelect={false}
              value={product.ingredients}
              isMulti
              />
              </div>
              <div className="cursor-pointer mt-4">

                <FontAwesomeIcon onClick={() => { rootFunction('/Admin/InsertIngredients') }} icon={faPlus} beat style={{ color: '#ff8551' }} />
               {/* <FontAwesomeIcon className="mt-4" onClick={() => { setWitchModal('remove'); setShowModal(true) }} icon={faMinus} beat style={{ color: '#ff0000' }} /> */}

                 </div>

            </div>

            <div className="w-2/6 mt-4">
            <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-city">
                   Price
           </label>
           <input value={product.price || ''} onChange={(e) => setProduct({ ...product, ...{ price: e.target.value } })} className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="number" min='1' placeholder="Insert Price" required/>
            </div>

            <div className='pt-4  w-3/6 mt-4'>
           <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-city">
                  {modify ? 'Change Image' : 'Insert Image'}
           </label>
           <input onChange={(e) => { convertImgSetToProduct(e.target.files[0]) }} accept="image/jpeg, image/png" className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="file" />
          </div>

          <div className="flex flex-col items-center mt-8">

   <button
    form='Form-Insert-Product'
    style={modify ? { display: 'none' } : {} }
    type='submit'
    className=" flex cursor-pointer middle  none center rounded-lg bg-tre py-3 px-4 font-sans text-xs font-bold uppercase text-white  transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-tre focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
    data-ripple-light="true"
   >
           Insert
   </button>
   <button
    form='Form-Insert-Product'
    style={!modify ? { display: 'none' } : {} }

    type='submit'
    className=" flex cursor-pointer middle  none center rounded-lg bg-tre py-3 px-4 font-sans text-xs font-bold uppercase text-white  transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-tre focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
   >
           Modify Product
   </button>
   </div>

           </form>

         </div>
        {/* comntainer destra */}
        <div className='rigth w-1/2 pr-4   '>
         <div className="flex flex-wrap place-content-center pb-4">
         <h1 className="text-black text-4xl font bold pb-8" >Prodotti inseriti</h1>
         </div>

      <SimpleAccordion setProduct={setProduct} setModify={setModify} modify={modify} setSingleProductSelected={setSingleProductSelected} ></SimpleAccordion>

        </div>
       </div>
      </>

    )
  } else {
    return (
      <>
  <Navbaradmin></Navbaradmin>
  <div className=" h-screen flex items-center justify-center">
  <h1 className="h1_loginpage">You are not logged in </h1>

            </div>

  </>
    )
  }
}

export const insertProductRedux = (data) => ({
  type: 'STORE_SINGLE_PRODUCT',
  payload: data
})

export const modifyProductRedux = (data) => ({
  type: 'MODIFY_SINGLE_PRODUCT',
  payload: data
})

export const setIdEmailToStore = (data) => ({
  type: 'STORE_ID_EMAIL',
  payload: data
})

export const insertIngredientsRedux = (data) => ({
  type: 'INSERT_ALL_INGREDIENTS',
  payload: data

})

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {
  insertProductRedux,
  modifyProductRedux,
  setIdEmailToStore,
  insertIngredientsRedux
}

export default connect(mapStateToProps, mapDispatchToProps)(InsertProducts)

/*  <div>
<ModalIngredients showModal={showModal} setShowModal={setShowModal} witchModal={witchModal} ></ModalIngredients>
</div> */
