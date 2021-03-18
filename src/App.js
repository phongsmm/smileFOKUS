import {Table,Container,Row,Col,Badge,Alert} from 'react-bootstrap'
import _ from 'lodash'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
var data = require('./Data/Data.json');

export default function App() {

  const [Summary,setSummary] = React.useState({Sum:{},Total:0})
  const [Customer,setCustomer] = React.useState([])
  const [Tier,setTier] = React.useState([])
  const [Error,setError] = React.useState(false)


  React.useEffect(()=>{
          axios.get('https://wegivmerchantapp.firebaseapp.com/exam/bi-member-day-2020-04-01.json').then((res)=>{

            setSummary({Sum:res.data.data.summary,Total:res.data.data.total})
            setTier(res.data.data.summarytier)
            setCustomer(_.chain(data.data.list).uniqBy('customername').value())
          }).catch(error=>{
            
            setError(true)
            setSummary({Sum:data.data.summary,Total:data.data.total})
            setTier(data.data.summarytier)
            setCustomer(_.chain(data.data.list).uniqBy('customername').value())

          })




   
  },[])


  function tier(tier){
    if(tier==="Gold"){
      return <Badge variant="warning">{tier}</Badge> 
    }
    if(tier==="Platinum"){
      return <Badge variant="info">{tier}</Badge> 
    }
    if(tier==="Silver"){
      return <Badge variant="Secondary">{tier}</Badge> 
    }
    if(tier==="White"){
      return <Badge variant="light">{tier}</Badge> 
    }
    if(tier==="Black"){
      return <Badge variant="dark">{tier}</Badge> 
    }

  }


  function MoneyFormat(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'K' : Math.sign(num)*Math.abs(num)
}




  return (
    <div>
      {Error?      <Alert variant="danger" onClose={() => setError(false)} dismissible>
        <Alert.Heading>Error!</Alert.Heading>
        <p>
            Cross-Origin Request Blocked , Using Internal Data
        </p>
      </Alert>:null}
      <Container style={{marginTop:10}}>

        <Row>
          <Col>
          <Table bordered hover size="sm">
          <thead>
      <tr style={{backgroundColor:'#fed049',color:'white'}}><th>Summary</th></tr>
  </thead>

  <tbody>

    <tr>
      <td>Total Member</td>
      <td>{Summary.Total}</td>
    </tr>
    <tr>
    <td>Total Rev . <Badge variant="success">THB</Badge> </td>
      <td>{MoneyFormat(Summary.Sum.lifetimevalue)}</td>

    </tr>

  </tbody>
</Table>
          </Col>

      {Tier.map((i)=>(
            <Col key={i.tier_name}>
            <Table bordered hover size="sm">
            <thead>
        <tr><th>{tier(i.tier_name)}</th></tr>
    </thead>
  
    <tbody>
  
      <tr>
        <td>Total Member</td>
        <td>{i.total_members}</td>
      </tr>
      <tr>
      <td>Total Rev . <Badge variant="success">THB</Badge> </td>
        <td>{MoneyFormat(i.total_amount)}</td>
  
      </tr>
  
    </tbody>
  
  </Table>
            </Col>
      ))}



        </Row>


      <Table striped bordered hover>
  <thead>
    <tr>
      <th>Name</th>
      <th>Tel</th>
      <th>Tier</th>
      <th>LTV</th>
      <th>Total Trans.</th>
      <th>Total Point</th>
      <th>Remaining Point</th>
    </tr>
  </thead>
  <tbody>
    
    
      {Customer.map((i)=>(
        <tr key={`Key:${i.customername}`}>
              <td>{i.customername}</td>
              <td>{i.customerphone}</td>
              <td>{tier(i.customertier)}</td>
              <td>{i.totalamount}</td>
              <td>{i.totaltransaction}</td>
              <td>{i.totalreward}</td>
              <td>{i.remainingpoint}</td>
              </tr>
      ))}


    
  </tbody>
</Table>
      </Container>


    </div>
  );
}


