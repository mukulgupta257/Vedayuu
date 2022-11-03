import Head from 'next/head'
import Image from 'next/image'
import CardWrapper from '../Components/CardWrapper'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import itemImg from '../public/assets/images/item.jpeg';
import BrandAdvertisement from '../Components/BrandAdvertisement'
import Footer from '../Components/Footer'
import CarouselItem from '../Components/CarouselItem'
import Header from '../Components/Header'
import axios from 'axios'
import APIUrls from './api'

export default function Home() {
  const [cardList, setCardList] = useState({});
  const [bannerData, setBannerData] = useState();
  useEffect(() => {
    fetchProducts();
  }, [])
  const fetchProducts = () => {
    const urlParams =  encodeURIComponent(JSON.stringify(["outdoor", "new", "bestseller"]));
    const url = `?category=${JSON.stringify(["home"])}&subCategory=${urlParams}`
    axios.get(`${APIUrls.product}/${url}`).then((res) => {
      console.log("product list",res.data)
      setCardList(res.data.data);
      setBannerData(res.data.data.banners)
    })
  }
  return (
    <>
      <Head>
        <title>Vedayuu</title>
      </Head>
      <Header />
      {bannerData && <CarouselItem data={bannerData}/> }
      <CardWrapper title="Bestsellers" category={'bestseller'} cardList={cardList && cardList['bestseller']} />
      <CardWrapper title="New" category={'new'} cardList={cardList && cardList['new']} /> 
      <CardWrapper title="Outdoor Collection" category={'outdoor'} cardList={cardList && cardList['outdoor']} />
      <BrandAdvertisement />
      <Footer />
    </>
  )
}
