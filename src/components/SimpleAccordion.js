import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useEffect,useState} from 'react'
import { connect } from "react-redux";

function SimpleAccordion({state}){

  const [product, setProducts] = useState([])


 
useEffect(() => {
  const getAllProducts = async () => {
    try {
        const response = await fetch(
          `/api/products?adminId=${state.adminData.ID}`,
          {method:'GET'}
          );

          
      const final = await response.json();
      console.log(final,'response')

       
    } catch (error) {
        console.log(error);
    }
};

getAllProducts() 
},[])

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion disabled>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Disabled Accordion</Typography>
        </AccordionSummary>
      </Accordion>
    
    </div>

  );
}

const mapStateToProps = (state)=>({
state
})


export default connect(mapStateToProps,null)(SimpleAccordion)