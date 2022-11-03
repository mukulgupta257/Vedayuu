import Head from 'next/head'
import Image from 'next/image'
import CardWrapper from '../Components/CardWrapper'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import itemImg from '../public/assets/images/item.jpeg';
import BrandAdvertisement from '../Components/BrandAdvertisement'
import Footer from '../Components/Footer'
import CarouselItem from '../Components/CarouselItem'
import Header from '../Components/Header'
import ContactDetails from '../Components/ContactDetails'

export default function Contact() {
  const [cardList, setCardList] = useState([
    {
      src: itemImg,
      title: 'SKY Home Bar Cabinet',
      content: 'INR 4599/-'
    },
    {
      src: itemImg,
      title: 'SKY Home Bar Cabinet',
      content: 'INR 4599/-'
    },
    {
      src: itemImg,
      title: 'SKY Home Bar Cabinet',
      content: 'INR 4599/-'
    },
    {
      src: itemImg,
      title: 'SKY Home Bar Cabinet',
      content: 'INR 4599/-'
    },
  ]);
  return (
    <>
    <Head>
      <title>
        Your Information
      </title>
    </Head>
      <Header />
      <ContactDetails/> 
      <Footer />
    </>
  )
}
