import { useSession } from 'next-auth/react'
import { connect } from 'react-redux'
import { useState } from 'react'
import { createId } from '@paralleldrive/cuid2'
import Select from 'react-select'

function ModalIngredients ({ showModal, setShowModal, witchModal, state, addIngrendientRedux, deleteIngredeintRedux }) {
  console.log(state)
  const { data: session } = useSession()
  const adminId = state.adminData.ID

  const [idIngredientSelected, setIdIngredeintSelected] = useState('')

  const arrIngredients = state.ingredients

  const [ingredient, setIngredient] = useState({
    id: createId(),
    restaurantid: state.adminData.restaurantId,
    adminid: adminId
  })

  const handleIngredient = (e, key) => {
    const value = e.target.value
    setIngredient({ ...ingredient, [key]: value.trim() })
  }

  const bodyIngredient = {
    id: ingredient.id,
    label: ingredient.label,
    value: ingredient.value,
    adminid: adminId,
    restaurantid: state.adminData.restaurantId

  }

  const addIngredientByAdmin = async () => {
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
      setIngredient({ id: createId() })
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
        return singleIngredient.id !== idIngredientSelected
      })

      deleteIngredeintRedux(newIngredients)

      return final
    } catch (error) {
      return { error: 'Delete not allowed' }
    }
  }

  const handleSelectIngredient = (e) => {
    const value = state.ingredients.filter(function (item) {
      return item.label === e.target.value
    })

    const id = value[0].id
    setIdIngredeintSelected(id)
  }

  return (
    <>

      {showModal
        ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">

              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                   {witchModal === 'add' ? 'INSERT NEW INGREDIENT' : 'DELETE INGREDIENT'}
                  </h3>
                  <button
                    className="p-1 ml-auto border-0 text-red-700  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className=" text-red-700  h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>

                <div className="relative p-6 flex-auto">

                  {witchModal === 'add'
                    ? <form className="w-full max-w-sm">

                   <div className="md:flex md:items-center mb-6">
                   <div className="w-1/4">
                     <label className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                       Name
                     </label>
                   </div>
                   <div className="md:w-3/4">
                     <input onChange={(e) => handleIngredient(e, 'label')} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" />
                   </div>
                 </div>
                 <div className="md:flex md:items-center mb-6">
                   <div className="md:w-1/4">
                     <label className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="">
                       Perice
                     </label>
                   </div>
                   <div className="md:w-3/4">
                     <input onChange={(e) => handleIngredient(e, 'value')} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-password" min="1" max="300" type="number" placeholder="price"/>
                   </div>

                 </div>

               </form>
                    : <div className="w-full">
          <label className="block uppercase tracking-wide text-sky-700 text-xs font-bold mb-2 mt-8" htmlFor="grid-state">
                   Select Ingredient
           </label>

            <select onChange={(e) => handleSelectIngredient(e) } className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" required>
            <option></option>
             { arrIngredients.map((singlIngredient) => {
               return (

                <option key={singlIngredient.id} >{singlIngredient.label}</option>
               )
             })}

            </select>
          </div>
                }

                </div>

                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                {witchModal === 'add'
                  ? <button
                 className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                 type="button"
                 onClick={() => { addIngredientByAdmin(); setShowModal(false) } }
               >
                 Save
               </button>
                  : <button
               className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
               type="button"
               onClick={() => { deleteIngredient(idIngredientSelected); setShowModal(false) }}
             >
               Remove
             </button>
                }

                </div>
              </div>
            </div>
          </div>

        </>
          )
        : null}
    </>
  )
}

export const addIngrendientRedux = (data) => ({
  type: 'ADD_INGREDIENT',
  payload: data
})

export const deleteIngredeintRedux = (data) => ({
  type: 'DELETE_INGREDIENT',
  payload: data
})

const mapDispatchToProps = {
  addIngrendientRedux,
  deleteIngredeintRedux
}

const mapStateToProps = (state) => ({
  state
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalIngredients)
