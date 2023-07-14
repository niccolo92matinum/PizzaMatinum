import Navbar from '../../components/Navbar'
import { connect } from 'react-redux'
import {useEffect} from 'react'

function SuccessPage ({resetOrder,resetUserData}) {

useEffect(()=>{

  resetOrder()
  resetUserData()

},[])


  return (
        <div>
          <Navbar></Navbar>
            <p>Success</p>
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


