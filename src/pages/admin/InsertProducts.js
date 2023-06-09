import { useState } from 'react'
import Navbar from '../../components/Navbar'
import SimpleAccordion from '../../components/SimpleAccordion'
import { useSession } from 'next-auth/react'
import { connect } from 'react-redux'
import { createId } from '@paralleldrive/cuid2'
import Select from 'react-select'

function InsertProducts ({ state, modifyProductRedux, insertProductRedux }) {
  const { data: session } = useSession()

  const [product, setProduct] = useState({
    adminId: state.adminData.ID,
    restaurantId: state.adminData.restaurantId,
    id: createId(),
    img: '',
    category: 'Dish',
    ingredients: ''
  })

  const [singleProductSelected, setSingleProductSelected] = useState({})
  const [modify, setModify] = useState(false)

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
    objtoPush.ingredients = JSON.stringify(objtoPush.ingredients)

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
    newProduct.ingredients = JSON.stringify(newProduct.ingredients)
    const prevState = state.productsData

    const arrVuoto = []
    const newState = {}

    if (deleteObj.length === 0 && (productSelected.category !== newProduct.category)) {
      Object.keys(prevState).map((categoryKey) => {
        if (categoryKey !== productSelected.category) {
          arrVuoto.push(categoryKey)
        }
      })
      arrVuoto.map((category) => {
        if (category === newProduct.category) {
          const mergeNewProductWithArray = [...prevState[category], newProduct]
          newState[category] = mergeNewProductWithArray
        } else {
          newState[category] = prevState[category]
        }
      })

      if (!arrVuoto.includes(newProduct.category)) {
        newState[newProduct.category] = [newProduct]
      }
    } else if (productSelected.category !== newProduct.category) {
      const arrVuoto2 = []

      Object.keys(prevState).map((categoryKey) => {
        arrVuoto2.push[categoryKey]
        if (categoryKey === productSelected.category) {
          newState[categoryKey] = deleteObj
        }
        if (categoryKey === newProduct.category) {
          const mergeNewProductWithArray2 = [...prevState[categoryKey], newProduct]
          newState[categoryKey] = mergeNewProductWithArray2
        }
        if (categoryKey !== productSelected.category && categoryKey !== newProduct.category) {
          newState[categoryKey] = prevState[categoryKey]
        }
        if (!arrVuoto2.includes(newProduct.category)) {
          newState[newProduct.category] = [newProduct]
        }
      })
    } else {
     
      Object.keys(prevState).map((categoryKey) => {
        if (newProduct.category === categoryKey) {
          const mergeNewProductWithArray3 = [...deleteObj, newProduct]

          newState[categoryKey] = mergeNewProductWithArray3
        } else {
          newState[categoryKey] = prevState[categoryKey]
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

  const options = [
    { value: 'mozzarella', label: 'Mozzarella' },
    { value: 'pomodoro', label: 'Pomodoro' },
    { value: 'basilico', label: 'Basilico' },
    { value: 'funghi', label: 'Funghi' },
    { value: 'peperoni', label: 'Peperoni' },
    { value: 'salame', label: 'Salame' },
    { value: 'carciofi', label: 'Carciofi' }
  ]
  let hiddenMultiSelect = false
  if (product.category === 'Wine' || product.category === 'Drink') {
    hiddenMultiSelect = true
  }

  if (session) {
    return (
   <>
    <Navbar></Navbar>
    <div className='main  flex justify-center '>
     {/* comntainer sinistra */}
     <div className='left w-1/2 '>
      <form id='Form-Insert-Product' onSubmit={(e) => { insertProductApi(e); modifyProductApi(e); clearStateProduct() }} className="">
       <div className='pb-4'> <h1>Insert Product here</h1></div>

       <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
         <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                Title
         </label>
         <input value={product.title || ''} onChange={(e) => setProduct({ ...product, ...{ title: e.target.value } })} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="title" type="text" placeholder="Title" required/>

         <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                Description
         </label>
         <textarea value={product.description || ''} onChange={(e) => setProduct({ ...product, ...{ description: e.target.value } })} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Insert Description" required/>
        </div>

       </div>

       <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                Category
        </label>
        <div className="relative">
         <select value={product.category || ''} onChange={(e) => setProduct({ ...product, ...{ category: e.target.value } })} className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" required>
          <option>Dish</option>
          <option>Pizza</option>
          <option>Drink</option>
          <option>Cold plate</option>
          <option>Wine</option>

         </select>

         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
         </div>
        </div>
       </div>
         <div className="pt-3 pb-3" hidden={hiddenMultiSelect}>
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
              Ingredient
        </label>
          <Select

           onChange={(e) => setProduct({ ...product, ...{ ingredients: e } })}
           options={options}
           closeMenuOnSelect={false}
           value={product.ingredients}
           isMulti
           />
         </div>

       <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                Price
        </label>
        <input value={product.price || ''} onChange={(e) => setProduct({ ...product, ...{ price: e.target.value } })} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="number" min='1' placeholder="Insert Price" required/>
       </div>
       <div className='pt-4'>
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
               {modify ? 'Change Image' : 'Insert Image'}
        </label>
        <input onChange={(e) => { convertImgSetToProduct(e.target.files[0]) }} accept="image/jpeg, image/png" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="file" />
       </div>
       <div>

        <button
         form='Form-Insert-Product'
         style={modify ? { display: 'none' } : {} }
         type='submit'
         className="middle mt-4 ml-4 none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
         data-ripple-light="true"
        >
                Insert
        </button>
        <button
         form='Form-Insert-Product'
         style={!modify ? { display: 'none' } : {} }

         type='submit'
         className="middle mt-4 ml-4 none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
         data-ripple-light="true"
        >
                Modify Product
        </button>
       </div>
      </form>
     </div>

     {/* comntainer destra */}
     <div className='rigth w-1/2  '>
      <h1>Check all your Products</h1>

   <SimpleAccordion setProduct={setProduct} setModify={setModify} modify={modify} setSingleProductSelected={setSingleProductSelected} ></SimpleAccordion>

     </div>
    </div>
   </>

    )
  } else {
    return (
   <div>
    <h1>ALLOWED ONLY FOR ADMIN</h1>

   </div>
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

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {
  insertProductRedux,
  modifyProductRedux
}

export default connect(mapStateToProps, mapDispatchToProps)(InsertProducts)
