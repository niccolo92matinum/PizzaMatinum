import { connect } from 'react-redux'
import { Fragment, useState, useEffect } from 'react'



function TableDashboard({state, props,setShowModal, insertSelectedOrderByAdmin }){

   const order = state

    const [isClient, setIsClient] = useState(false)
 
    useEffect(() => {
      setIsClient(true)
    }, [])

const onButtonDetails = (order) =>{
    setShowModal(true)
    insertSelectedOrderByAdmin(order)
}

    
    return(
        <>
        <div className="grid grid-cols-5 gap-4">
        <div>Name</div>
        <div>Phone</div>
        <div>Status</div>
        <div>Check</div>
        
        </div>
       
      {isClient ?<div>
            {
         props.map((order)=>{


            let button = <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800  focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">{order.status}</button>
         
            if(order.status === 'Payed'){
                button =  <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800  focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">{order.status}</button>
            }
            return (
            
       <div key={Math.random()} className="grid grid-cols-5 gap-5">
         <div>{order.clientname}</div>
         <div>{order.clientphone}</div>
         <div>
         {button}
         </div>
         <div>
         
         <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        type="button"
        onClick={() => onButtonDetails(order)}
      >
        Details
      </button>
         </div>
        
        
         </div>
            )})}
         </div>:'Waiting..'}
      
      
        
        
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