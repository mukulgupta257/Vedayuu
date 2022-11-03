import React, { useState } from 'react'
import sliderImg from '../public/assets/images/slider.png';
import Image from 'next/image';
import Carousel from 'react-bootstrap/Carousel'
import Router from 'next/router';

export default function CarouselItem(props) {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    return (
        <div className='carousel-wrapper'>
            <Carousel activeIndex={index} onSelect={handleSelect}>
                {
                    props && props.data.length > 0 ? (
                        props.data.filter(d => d.isActive == true).map((value) => {
                            return (
                                <Carousel.Item onClick={() => {
                                    console.log(value)
                                    if(value.clickedURL)
                                    Router.push(value.clickedURL)
                                }}>
                                    <Image
                                        className="d-block w-100"
                                        src={window.screen.width >= 768 ? value.desktopURL : value.imageURL}
                                        width={1470}
                                        height={500}
                                        alt={value.title}
                                    />
                                </Carousel.Item>
                            )
                        })
                    ) : null
                }
            </Carousel>
            <span className='floating-arrow-left'>
                <svg xmlns="http://www.w3.org/2000/svg" width="12.621" height="22.243" viewBox="0 0 12.621 22.243">
                    <path id="Icon_feather-chevron-left" data-name="Icon feather-chevron-left" d="M22.5,27l-9-9,9-9" transform="translate(-12 -6.879)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
                </svg>
            </span>
            <span className='floating-arrow-right'>
                <svg xmlns="http://www.w3.org/2000/svg" width="12.621" height="22.243" viewBox="0 0 12.621 22.243">
                    <path id="Icon_feather-chevron-left" data-name="Icon feather-chevron-left" d="M13.5,27l9-9-9-9" transform="translate(-11.379 -6.879)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
                </svg>
            </span>
        </div>
    )
}
