import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import styles from '../styles/dashboard.module.css'

function TableDashboard ({ state, props, setShowModal, insertSelectedOrderByAdmin }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const onButtonDetails = (order) => {
    setShowModal(true)
    insertSelectedOrderByAdmin(order)
  }

  return (
        <>
        <div className="grid grid-cols-4 gap-4 ml-4 mr-4 mb-8 border-due border-2">
        <div className="pl-2">
          <h3 className="text-bleck font-bold text-2xl pt-2 pb-2">Name</h3>
        </div>
        <div className="pl-2">
          <h3 className="text-bleck font-bold text-2xl pt-2 pb-2">Phone</h3>
        </div>
        <div className="pl-2">
          <h3 className="text-bleck font-bold text-2xl pt-2 pb-2">Status</h3>
        </div>
        <div className="pl-2">
          <h3 className="text-bleck font-bold text-2xl pt-2 pb-2">Check</h3>
        </div>
        </div>

      {isClient
        ? <div>
            {
         props.map((order) => {
           let button = <h1  className="focus:outline-none text-red-700 text-base font-bold  focus:ring-4 focus:ring-red-300  pl-4 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">{order.status}</h1>

           if (order.status === 'Delivered') {
             button = <h1  className="focus:outline-none text-green-700 text-base font-bold  focus:ring-4 focus:ring-red-300  pl-4 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">{order.status}</h1>
           }
           return (

       <div key={Math.random()} className="grid grid-cols-4 gap-4 ml-4 mr-4 mb-8">
         <div className="pl-2">
          <p className="text-black font-light">{order.clientname}</p>
          </div>
         <div className="pl-2">
          <p className="text-black font-light">
          {order.clientphone}
          </p>
         </div>
         <div className="pl-2">
         {button}
         </div>
         <div className="pl-2">

         <button
         className=" flex cursor-pointer middle  none center rounded-lg bg-tre py-3 px-4 font-sans text-xs font-bold uppercase text-white  transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-tre focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
        onClick={() => onButtonDetails(order)}
      >
        Details
      </button>
         </div>

         </div>
           )
         })}
         </div>
        : 'Waiting..'}

        </>
  )
}

export const insertSelectedOrderByAdmin = (data) => ({
  type: 'INSERT_SELECTD_ORDER_BY_ADMIN',
  payload: data
})

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {
  insertSelectedOrderByAdmin
}

export default connect(mapStateToProps, mapDispatchToProps)(TableDashboard)
