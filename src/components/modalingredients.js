import { useSession } from 'next-auth/react'
import { connect } from 'react-redux'
import { useState } from 'react'
import { createId } from '@paralleldrive/cuid2'

function ModalIngredients ({ showModal, setShowModal, witchModal, state }) {
  const { data: session } = useSession()
  console.log(state, 'state')

  const [ingredient, setIngredient] = useState({ id: createId() })

  const adminId = state.adminData.ID

  const handleIngredient = (e, key) => {

    setIngredient({ ...ingredient, [key]: e.target.value })
  }

  console.log(ingredient, 'in')
  const addIngredientByAdmin = async () => {
    try {
      const response = await fetch(

        '/api/admins',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'

          },
          Authorization: session.accessToken,
          body: JSON.stringify({ id: adminId, ingredients: [ingredient] })
        })
      await response.json()
    } catch (err) {
      console.log({ FAILED: err })
    }
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

                <form className="w-full max-w-sm">
  <div className="md:flex md:items-center mb-6">
    <div className="w-1/4">
      <label className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
        Name
      </label>
    </div>
    <div className="md:w-3/4">
      <input onChange={(e) => handleIngredient(e, 'name')} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" />
    </div>
  </div>
  <div className="md:flex md:items-center mb-6">
    <div className="md:w-1/4">
      <label className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="">
        Perice
      </label>
    </div>
    <div className="md:w-3/4">
      <input onChange={(e) => handleIngredient(e, 'price')} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-password" min="1" max="300" type="number" placeholder="price"/>
    </div>
  </div>

</form>
                </div>

                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => { addIngredientByAdmin(); setShowModal(false) } }
                  >
                    Save
                  </button>
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

const mapStateToProps = (state) => ({
  state
})

export default connect(mapStateToProps, null)(ModalIngredients)
