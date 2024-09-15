import Navbaradmin from '../../components/Navbaradmin'

import { useSession } from 'next-auth/react'
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import { createId } from '@paralleldrive/cuid2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

function InsertIngredients ({ state, addIngrendientRedux, deleteIngredeintRedux, insertIngredientsRedux }) {
  const { data: session, status } = useSession()
  const { push } = useRouter()

  const adminId = state.adminData.ID

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      push('/Admin/Login')
    }
  }, [status])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
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
        console.log('dentro2')
        const final = await response.json()

        // inserisco  gli ingredienti nello store redux

        await insertIngredientsRedux(final)

        return final
      } catch (error) {
        console.log(error, 'Not allowed get Ingredients')
      }
    }

    getAllIngredients()
  }, [session?.accessToken])

  const arrIngredients = state.ingredients

  const [ingredient, setIngredient] = useState({
    value: createId(),
    restaurantid: state.adminData.restaurantId,
    adminid: adminId
  })

  const handleIngredient = (e, key) => {
    const price = e.target.value
    setIngredient({ ...ingredient, [key]: price.trim() })
  }

  const bodyIngredient = {
    price: ingredient.price,
    label: ingredient.label,
    value: ingredient.value,
    adminid: adminId,
    restaurantid: state.adminData.restaurantId

  }

  const addIngredientByAdmin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(

        '/api/admins',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'

          },
          Authorization: session.accessToken,
          body: JSON.stringify(bodyIngredient)
        })

      await response.json()

      const newIngredients = [...state.ingredients, bodyIngredient]

      addIngrendientRedux(newIngredients)
      setIngredient({
        price: '',
        label: '',
        value: createId()
      })
    } catch (err) {
      console.log({ FAILED: err })
    }
  }

  const deleteIngredient = async (ingredientid) => {
    try {
      const response = await fetch(
 `/api/ingredients?ingredientid=${ingredientid}`,
 {
   method: 'DELETE',
   'Content-Type': 'application/json',
   Authorization: session.accessToken
 }
      )

      const final = await response.json()

      const newIngredients = state.ingredients.filter((singleIngredient) => {
        return singleIngredient.value !== ingredientid
      })

      deleteIngredeintRedux(newIngredients)

      return final
    } catch (error) {
      return { error: 'Delete not allowed' }
    }
  }

  if (status === 'loading') {
    return (
        <>
        <Navbaradmin></Navbaradmin>
        <div>
        <FontAwesomeIcon icon={faSpinner} spin style={{ color: '#000000' }} />
        </div>
        </>
    )
  } else {
    return (
        <>
        <Navbaradmin></Navbaradmin>
        <div className='main  flex justify-center pt-8 '>

        <div className='left  place-content-center  w-1/2 pl-28 pr-28 '>
          <div className="">
          <h1 className="text-bleck font-bold text-2xl pb-4 text-center">
          Crea il tuo ingrediente
          </h1>
          </div>
        
        <form onSubmit={(e) => addIngredientByAdmin(e) } className="w-full ">

<div className="md:flex md:items-center mb-6">
<div className="w-1/4">
  <label className="block text-black font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
    Name
  </label>
</div>
<div className="md:w-3/4">
  <input value={ingredient.label || ''} onChange={(e) => handleIngredient(e, 'label')} className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-due" id="inline-full-name" required type="text" />
</div>
</div>
<div className="md:flex md:items-center mb-6">
<div className="md:w-1/4">
  <label className="block text-black font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="">
    Perice
  </label>
</div>
<div className="w-1/4">
  <input value={ingredient.price || ''} onChange={(e) => handleIngredient(e, 'price')} className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-due" id="inline-password" min="1" max="300" type="number" required placeholder="price"/>
</div>

</div>
<div className="flex items-center justify-center p-6  rounded-b">

<button className=" flex cursor-pointer middle  none center rounded-lg bg-tre py-3 px-4 font-sans text-xs font-bold uppercase text-white  transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-tre focus:opacity-[0.85]  focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="submit">
                 Save
  </button>
 </div>

</form>

        </div>

        <div className='left  place-content-center  w-1/2 pl-28 pr-28 '>
        <h1 className="text-bold text-2xl font-bold pb-4">Ingredienti Inseriti</h1>
        {isClient &&
         <div>
         {arrIngredients.map((singleIngredient) => {
         
           return (
                 <div key={singleIngredient.value} className="flex flex-row bg-white w-1/2 rounded-lg px-4 mb-4">
                      <div className="w-1/3">
                         <h1 className="text-center font-light">{singleIngredient.label} </h1>
                      </div>
                     <div className="pl-14 w-1/3 ">
                         <h2 className="text-center font-light">{singleIngredient.price}€</h2>
                     </div>
                     <div className="pl-14 cursor-pointer w-1/3">
                     <FontAwesomeIcon onClick={() => deleteIngredient(singleIngredient.value) } icon={faTrash} style={{ color: '#ff8551' }} 
                     className="text-xl hover:scale-110"/>
                     </div>

                 </div>
           )
         })}
     </div> }

        </div>
        </div>
        </>
    )
  }
}

export const addIngrendientRedux = (data) => ({
  type: 'ADD_INGREDIENT',
  payload: data
})

export const deleteIngredeintRedux = (data) => ({
  type: 'DELETE_INGREDIENT',
  payload: data
})

export const insertIngredientsRedux = (data) => ({
  type: 'INSERT_ALL_INGREDIENTS',
  payload: data

})

const mapDispatchToProps = {
  addIngrendientRedux,
  deleteIngredeintRedux,
  insertIngredientsRedux
}

const mapStateToProps = (state) => ({
  state
})

export default connect(mapStateToProps, mapDispatchToProps)(InsertIngredients)
