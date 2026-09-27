import React, { Component } from 'react'
import styles from "./AppSelect.module.css";
import axios from 'axios';
export default class App extends Component {
  constructor(){
    super();

    this.state={
      list:[
        {
          id:"Italy",name:"Italy",
          list:[
            {
              id:"Tuscany",name:"Tuscany",
              list:[
                {id:"Florence",name:"Florence"},
                {id:"Pisa",name:"Pisa"}
              ]
            }
          ]
        },
        {
          id:2,name:"x",
          list:[
            {
              id:21,name:"Rome",
              list:[
                {id:"Florence",name:"Florence"},
                {id:"Pisa",name:"Pisa"}
              ]
            }
          ]
        }
      ],
      ctiylist:[],    //city ​​collection
      arealist:[],
      p:null,
      p1:null,
      p2:null
    }
  }
  geocodeAddress = (address) => {
    axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`)
        .then(response => {
          if (response.data && response.data.length) {
            const firstResult = response.data[0];
            window.location.href ="/app/form?lat="+firstResult.lat+"&lng="+firstResult.lon;
          }
        })
        .catch(error => {
          console.error('Error geocoding address:', error);
        });
  };

  changeProvince=(id)=>{
    if(id){
      this.setState({
        ctiylist:this.state.list.filter(item=>item.id===id)[0]["list"],
        arealist:[],
        p:id
      })
    }
  }
  changeArea=(id)=>{
    if(id){
      this.setState({
        arealist:this.state.ctiylist.filter(item=>item.id===id)[0]["list"],
        p1:id
      })
    }
  }
  changeX=(id)=>{
    if(id){
      this.setState({
        p2:id
      })
    }
  }
  search = () =>{
    this.geocodeAddress(this.state.p+this.state.p1+this.state.p2)
  }
  render() {
    return (
        <div className={styles.bor}>
          <select  className={styles.sel} onChange={(e)=>{
            this.changeProvince(e.target.value)
          }}>
            <option value="">Choose country</option>
            {this.state.list.map(item=>{
              return<option key={item.id} value={item.id}>{item.name}</option>
            })}
          </select>
          <select   className={styles.sel} onChange={(e)=>{
            this.changeArea(e.target.value)
          }}>
            <option value="">Choose city</option>
            {this.state.ctiylist.map(item =>{
              return <option key={item.id} value={item.id}>{item.name}</option>
            })}
          </select>

          <select   className={styles.sel} onChange={(e)=>{
            this.changeX(e.target.value)
          }}>
            <option value="">Choose district</option>
            {this.state.arealist.map(item=>{
              return <option key={item.id} value={item.id}>{item.name}</option>
            })}
          </select>
          <button className={styles.seachBtn} onClick={(e)=>{
            this.search()
          }}>Search</button>
        </div>
    )
  }
}

