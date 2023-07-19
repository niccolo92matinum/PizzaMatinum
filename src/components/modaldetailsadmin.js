import { connect } from 'react-redux'
import { useSession } from 'next-auth/react'

function Modal({state, setShowModal,showModal,changeStatusOrderRedux, changeStatusOrdersArrayRedux}){
    const { data: session } = useSession()
    const order = state.orderSelectedByAdmin

    const modifyAdminDataAndOrderSelected = () =>{
        const arrayWithoutObjSelected = state.orderAdmin.filter( singleObj => singleObj.orderid !==  order.orderid)
        const objWithNewStatus = {...order, status:'Delivered'}
        const newState = [...arrayWithoutObjSelected ,objWithNewStatus ]
        changeStatusOrdersArrayRedux(newState) 
        changeStatusOrderRedux()
    
    }

    const deleteOrderAdminDataAndOrderSelected = () =>{
        const newState = state.orderAdmin.filter( singleObj => singleObj.orderid !==  order.orderid)
        changeStatusOrdersArrayRedux(newState) 
        changeStatusOrderRedux()
    }



    

   let  parsedDetails = []
    if(Object.keys(order).length > 0){
         parsedDetails = JSON.parse(state.orderSelectedByAdmin.orderdetails)
      
    }
   
     let statusToSend 

     if(order.status === 'Payed'){
        statusToSend = 'Delivered'
     }else{
        statusToSend = 'Payed'
     }



    const changeStatusApi = async () => {
      
          try {
            const response = await fetch(
    
              '/api/orders',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                Authorization: session.accessToken,
                body:JSON.stringify(order.orderid)
              })
            await response.json()
            modifyAdminDataAndOrderSelected() 
        
          } catch (error) {
            console.log(error)
          }
        
      }



      const deleteOrderApi = async () => {
      
        try {
          const response = await fetch(
  
            `/api/orders?orderid=${order.orderid}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },
              Authorization: session.accessToken,
            })
          await response.json()
      
          deleteOrderAdminDataAndOrderSelected()
        } catch (error) {
          console.log(error)
        }
      
    }


   
    


    return(
    <>
      {showModal ?  (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t grid grid-cols-3 gap-4">
                  <h3 className="text-3xl font-semibold">
                    {order.clientname}
                  </h3>
                  <p>Phone:{order.clientphone}</p>

                  <button
                    className=" text-red-500  p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    X
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                    <ul>
                        {parsedDetails.map((singleProduct)=>{

                                return(
                                    <div key={singleProduct.id} className="grid grid-cols-2 gap-4">
                                    <div>{singleProduct.title}</div>
                                    <div>{singleProduct.quantity}</div>
                                   
                                    </div>
                                  
                                )
                        }) }
                      
                    </ul>
                 
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() =>{ setShowModal(false);deleteOrderApi()}}
                  >
                    DELETE
                  </button>
                  {order.status === 'Delivered'?null: <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() =>{ setShowModal(false); console.log('click');changeStatusApi()}}
                  >
                    Change status
                  </button>}
                 
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}


export const changeStatusOrderRedux = (data) => ({
    type: 'CHANGE_STATUS_ORDER',
 
  })

  export const changeStatusOrdersArrayRedux = (data) => ({
    type:  'CHANGE_STATUS_ORDERS_ARRAY',
    payload: data
  })



const mapStateToProps = (state) => ({
    state
})

const mapDispatchToProps = {
    changeStatusOrderRedux,
    changeStatusOrdersArrayRedux
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)