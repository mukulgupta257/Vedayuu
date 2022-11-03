import { useRouter } from 'next/router';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCartFlag } from '../utils/Actions';

export default function Drawer() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user)
    const redirectTo = (path) => {
        router.push(path);
    }
    return (
        <div className='drawer'>
            <ul>
                <li onClick={() => redirectTo('/')}>
                    <svg width="30" height="30" viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g id="🔍-System-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="ic_fluent_home_28_regular" fill="#212121" fill-rule="nonzero">
                                <path d="M12.5919,3.49635 C13.4146,2.83625 14.5854,2.83625 15.4081,3.49635 L23.1581,9.71468 C23.6903,10.1417 24,10.7872 24,11.4696 L24,22.75 C24,23.9926 22.9926,25 21.75,25 L18.75,25 C17.5074,25 16.5,23.9926 16.5,22.75 L16.5,16.75 C16.5,16.3358 16.1642,16 15.75,16 L12.25,16 C11.8358,16 11.5,16.3358 11.5,16.75 L11.5,22.75 C11.5,23.9926 10.4926,25 9.25,25 L6.25,25 C5.00736,25 4,23.9926 4,22.75 L4,11.4696 C4,10.7872 4.30967,10.1417 4.84191,9.71468 L12.5919,3.49635 Z M14.4694,4.6663 C14.1951,4.44627 13.8049,4.44627 13.5306,4.6663 L5.78064,10.8846 C5.60322,11.027 5.5,11.2421 5.5,11.4696 L5.5,22.75 C5.5,23.1642 5.83579,23.5 6.25,23.5 L9.25,23.5 C9.66421,23.5 10,23.1642 10,22.75 L10,16.75 C10,15.5074 11.0074,14.5 12.25,14.5 L15.75,14.5 C16.9926,14.5 18,15.5074 18,16.75 L18,22.75 C18,23.1642 18.3358,23.5 18.75,23.5 L21.75,23.5 C22.1642,23.5 22.5,23.1642 22.5,22.75 L22.5,11.4696 C22.5,11.2421 22.3968,11.027 22.2194,10.8846 L14.4694,4.6663 Z" id="🎨-Color" stroke-width="2.5"></path>
                            </g>
                        </g>
                    </svg>
                </li>
                <li onClick={() => redirectTo('/order')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 13.333 14.667">
                        <g id="Icon_feather-shopping-bag" data-name="Icon feather-shopping-bag" transform="translate(-1.333 -0.667)">
                            <path id="Path_21" data-name="Path 21" d="M4,1.333,2,4v9.333a1.333,1.333,0,0,0,1.333,1.333h9.333A1.333,1.333,0,0,0,14,13.333V4L12,1.333Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" />
                            <path id="Path_22" data-name="Path 22" d="M2,4H14" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" />
                            <path id="Path_23" data-name="Path 23" d="M10.667,6.667a2.667,2.667,0,1,1-5.333,0" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" />
                        </g>
                    </svg>
                </li>
                <li onClick={() => {
                    // redirectTo('/contact')
                    dispatch(setCartFlag({ flag: true }))
                    document.getElementsByClassName('header-wrapper')[0].scrollIntoView()
                }}>
                    <span style={{position: 'relative'}}>
                    <svg id="Icon_feather-shopping-cart" data-name="Icon feather-shopping-cart" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 36 33">
                        <path id="Path_3" data-name="Path 3" d="M15,31.5A1.5,1.5,0,1,1,13.5,30,1.5,1.5,0,0,1,15,31.5Z" transform="translate(0 -1.5)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" />
                        <path id="Path_4" data-name="Path 4" d="M31.5,31.5A1.5,1.5,0,1,1,30,30,1.5,1.5,0,0,1,31.5,31.5Z" transform="translate(0 -1.5)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" />
                        <path id="Path_5" data-name="Path 5" d="M1.5,1.5h6l4.02,18.746a2.96,2.96,0,0,0,3,2.254H29.1a2.96,2.96,0,0,0,3-2.254L34.5,8.5H9" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" />
                    </svg>
                    <span className='floating-number'>{user && user.cart && user.cart.items && user.cart.items.length ? user.cart.items.length : 0}</span>
                    </span>
                </li>
                <li onClick={() => redirectTo('/password/reset/new')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 12 13.333">
                        <g id="Icon_feather-user" data-name="Icon feather-user" transform="translate(-2 -1.333)">
                            <path id="Path_24" data-name="Path 24" d="M13.333,14V12.667A2.667,2.667,0,0,0,10.667,10H5.333a2.667,2.667,0,0,0-2.667,2.667V14" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" />
                            <path id="Path_25" data-name="Path 25" d="M10.667,4.667A2.667,2.667,0,1,1,8,2a2.667,2.667,0,0,1,2.667,2.667Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" />
                        </g>
                    </svg>
                </li>
            </ul>
        </div>
    )
}
