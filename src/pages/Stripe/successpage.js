import { connect } from 'react-redux'
import { useEffect } from 'react'
import Navbar from '../../components/Navbar'

function SuccessPage ({ state, resetOrder, resetUserData }) {
  
  useEffect(() => {
    resetOrder()
    resetUserData()
  }, [])
  
  return (
    <div>
    <Navbar></Navbar>
    <div className=" h-screen flex items-center justify-center">
    <h1 className="h1_loginpage"> Success </h1>
    </div>
    </div>
    )
  }
  
  export const resetOrder = (data) => ({
    type: 'RESET_ORDER'
  })
  
  export const resetUserData = (data) => ({
    type: 'RESET_USERDATA'
  })
  
  const mapStateToProps = (state) => ({
    state
  })
  
  const mapDispatchToProps = {
    resetOrder,
    resetUserData
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(SuccessPage)
  