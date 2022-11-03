import React from 'react'
import ProductCard from './ProductCard'

export default function CardWrapper(props) {
  const renderAll = () => {
    if(props.cardList && props.cardList.length>0) {
      let array = props.cardList.map((d) => {
          return(
              <ProductCard item={d}/>
          )
      })
      return array;
    } else {
      return (
        <div className='row justify-content-center'>No data found</div>
      )
    }
  }
  const renderCategoryWise = () => {
    if(props.cardList && props.cardList.length>0) {
      let array = props.cardList.filter(data => data.subCategory==props.category).map((d) => {
        return(
            <ProductCard item={d}/>
        )
    })
    return array;
    } else {
      return(
        <div className='row justify-content-center'>No data found</div>
      )
    }
  }
  console.log(props)
  return (
    <div className='card-wrapper'>
        <h1 className='header-text'>{props.title}</h1>
        <div className='row'>
          {
            props.category=='all' ? renderAll() : renderCategoryWise()
          }
        </div>
    </div>
  )
}
