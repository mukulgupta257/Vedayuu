import React from 'react'
import BannerImg from '../public/assets/images/slider.png'
import Image from 'next/image';
import Router from 'next/router';

const renderDesktopBanner = (props) => {
  return (
    <Image src={props.data.desktopURL} width={1470} height={500} alt={props.data.title}
      onClick={() => {
        if (props.data.clickedURL)
          Router.push(props.data.clickedURL)
      }}>
    </Image>
  )
}
const renderMobileBanner = (props) => {
  return (
    <Image src={props.data.imageURL} width={1470} height={500} alt={props.data.title}
      onClick={() => {
        if (props.data.clickedURL)
          Router.push(props.data.clickedURL)
      }}>
    </Image>
  )
}
export default function Banner(props) {
  return (
    <div className='banner-wrapper'>
      {
        props && window.screen.width >= 768 ? renderDesktopBanner(props) : renderMobileBanner(props)
      }
    </div>

  )
}
