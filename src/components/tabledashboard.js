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
        <div className="grid grid-cols-4 gap-4 ml-4 mr-4 mb-8 border-black border-2">
        <div className="pl-2">
          <h3 className={styles.h1_dash_tabledash}>Name</h3>
        </div>
        <div className="pl-2">
          <h3 className={styles.h1_dash_tabledash}>Phone</h3>
        </div>
        <div className="pl-2">
          <h3 className={styles.h1_dash_tabledash}>Status</h3>
        </div>
        <div className="pl-2">
          <h3 className={styles.h1_dash_tabledash}>Check</h3>
        </div>
        </div>

      {isClient
        ? <div>
            {
         props.map((order) => {
           let button = <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800  focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">{order.status}</button>

           if (order.status === 'Payed') {
             button = <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800  focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">{order.status}</button>
           }
           return (

       <div key={Math.random()} className="grid grid-cols-4 gap-4 ml-4 mr-4 mb-8">
         <div className="pl-2">
          <p className={styles.p_dash_tabledash}>{order.clientname}</p>
          </div>
         <div className="pl-2">
          <p className={styles.p_dash_tabledash}>
          {order.clientphone}
          </p>
         </div>
         <div className="pl-2">
         {button}
         </div>
         <div className="pl-2">

         <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
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
