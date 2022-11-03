import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Banner from '../../Components/Banner';
import BrandAdvertisement from '../../Components/BrandAdvertisement';
import CardWrapper from '../../Components/CardWrapper';
import Footer from '../../Components/Footer';
import Header from '../../Components/Header';
import itemImg from '../../public/assets/images/item.jpeg';
import { useRouter } from 'next/router'
import axios from 'axios';
import APIUrls from '../api';


export default function Home() {
  const router = useRouter();
  const [cardList, setCardList] = useState({});
  const [bannerData, setBannerData] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (router.query.id) {
      fetchProducts();
    }
  }, [router])
  const fetchProducts = () => {
    const urlParams = encodeURIComponent(JSON.stringify(["outdoor", "new", "bestseller"]));
    let array = [];
    array.push(id)
    console.log(array)
    if (array) {
      const url = `?category=${JSON.stringify(array)}&subCategory=${urlParams}`
      axios.get(`${APIUrls.product}/${url}`).then((res) => {
        console.log("product list", res.data)
        let productData = [];
        if(res.data.data) {
          Object.entries(res.data.data).map(d => {
            if(d[0]!=='banners') {
              productData.push(...d[1])
            }
          }) 
          setCardList(productData);
        }

        setBannerData(res.data.data?res.data.data.banners[0]:null)
        if(res.data.data && res.data.data.banners) {
          res.data.data.banners.map(d => {
            if(d.isActive){
              setBannerData(d)
            }
          })  
        }
      })
    }
  }
  return (
    <>
      <Head>
        <title>{router.query.id ? router.query.id.toUpperCase() : ""} : Vedayuu</title>
      </Head>
      <Header />
      {/* <CarouselItem /> */}
      {bannerData && <Banner data={bannerData}/>}
      <CardWrapper title="" category={'all'} cardList={cardList ? cardList: []} />
      {/* <CardWrapper title="New" category={'new'} cardList={cardList && cardList['new']} />
      <CardWrapper title="Outdoor Collection" category={'outdoor'} cardList={cardList && cardList['outdoor']} /> */}
      <BrandAdvertisement />
      <Footer />
    </>
  )
}
