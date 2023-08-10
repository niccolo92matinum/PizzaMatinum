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
        <h1>Create Ingredient</h1>
        <form onSubmit={(e) => addIngredientByAdmin(e) } className="w-full max-w-sm">

<div className="md:flex md:items-center mb-6">
<div className="w-1/4">
  <label className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
    Name
  </label>
</div>
<div className="md:w-3/4">
  <input value={ingredient.label || ''} onChange={(e) => handleIngredient(e, 'label')} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" required type="text" />
</div>
</div>
<div className="md:flex md:items-center mb-6">
<div className="md:w-1/4">
  <label className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="">
    Perice
  </label>
</div>
<div className="md:w-3/4">
  <input value={ingredient.price || ''} onChange={(e) => handleIngredient(e, 'price')} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-password" min="1" max="300" type="number" required placeholder="price"/>
</div>

</div>
<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">

<button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="submit">
                 Save
  </button>
 </div>

</form>

        </div>

        <div className='left  place-content-center  w-1/2 pl-28 pr-28 '>
        <h1>Check all your Ingredients</h1>
        {isClient &&
         <div>
         {arrIngredients.map((singleIngredient) => {
           return (
                 <div key={singleIngredient.id} className="flex flex-row">
                      <div>
                         <h1>{singleIngredient.label} </h1>
                      </div>
                     <div className="pl-14">
                         <h2>{singleIngredient.price}€</h2>
                     </div>
                     <div className="pl-14 cursor-pointer">
                     <FontAwesomeIcon onClick={() => deleteIngredient(singleIngredient.value) } icon={faTrash} style={{ color: '#ff0000' }} />
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
