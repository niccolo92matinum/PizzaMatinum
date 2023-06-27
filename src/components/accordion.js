import { connect } from 'react-redux'

import { Fragment, useState, useEffect } from 'react'
import {
  Accordion,
  AccordionHeader,
  AccordionBody
} from '@material-tailwind/react'

function AccordionOrder ({ products, showProductOnChoosen, state }) {
  const [open, setOpen] = useState(1)
  const [tag, setTag] = useState('waiting')

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value)
  }
// il componente viene renderizzato prima delle props  perciò bisogna usare lo use effect
  useEffect(() => {
    const accordionVariable = <Fragment>
    {
       Object.values(products).map((categoryArr, i) => {
         return (

            <Accordion key={Math.random()} open={open === ((i + 1)) }>
            <AccordionHeader key={i} onClick={() => handleOpen(i + 1)}>
             {categoryArr[0].category}
              </AccordionHeader>
              {categoryArr.map((singleObj) => {
                return (

          <AccordionBody key={Math.random()}>

            <h1>{singleObj.title} </h1>
          <button onClick={() => { showProductOnChoosen(singleObj) }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Select Product</button>
          <p>{singleObj.description}</p>

          </AccordionBody>

                )
              })}

          </Accordion>

         )
       })
    }

  </Fragment>
    setTag(accordionVariable)
  }, [open])

  return (
  <>
  {tag}
  </>
  )
}

const mapStateToProps = (state) => ({
  state
})

export default connect(mapStateToProps, null)(AccordionOrder)
