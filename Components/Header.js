import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import itemImg from '../public/assets/images/item.jpeg'
import Button from './Button';
import { Router, useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { login, setCartFlag, setSession, setUserInfo } from '../utils/Actions';
import axios from 'axios';
import APIUrls from '../pages/api';
import vedayuuLogo from '../public/assets/images/logo.png';


export default function Header() {
    const router = useRouter();
    const user = useSelector(state => state.user)
    const categoryList = useSelector(state => state.categoryList)
    const cart_flag = useSelector(state => state.cart_flag)
    const [toggle, setToggle] = useState(false);
    const [toggleCart, setToggleCart] = useState(false);
    const [forgot, setForgot] = useState(false);
    const [toggleSignIn, setToggleSignIn] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showOtpFields, setShowOtpFields] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [dropdown, setDropDown] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cartError, setCartError] = useState('');
    const [counter, setcounter] = useState(0);
    const dispatch = useDispatch();
    var sum = 0;
    // useEffect(() => {
    //     console.log('CART MODIFIED')
    //     saveCartToDB();
    // }, [user.cart])
    const redirectTo = (path) => {
        router.push(path);
        setDropDown(false);
    }
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        password: '',
    });
    const handleLogin = (e) => {
        e.preventDefault();
        setSuccess('');
        console.log(userDetails)
        const response = dispatch(login(userDetails))
        response.then((res) => {
            console.log(res)
            if (res == 'login success.') {
                setShowSignUp(false);
                setShowLogin(false);
                window.location.reload();
            } else {
                setError(res)
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    const handleRegister = (e) => {
        e.preventDefault();
        setSuccess('');
        axios.post(APIUrls.register, {
            name: userDetails.name,
            email: userDetails.email,
            password: userDetails.password
        }).then((res) => {
            if (res.data.data['token']) {
                setShowSignUp(false);
                setShowLogin(false);
                dispatch(setUserInfo(
                    {
                        cookie: res.data.data['token'],
                        username: res.data.data['user'].name,
                        email: res.data.data['user'].email,
                        cart: res.data.data['user'].cart,
                        is_logged: true,
                    }));
                window.location.reload();
            } else {
                setError(res.data.data['message'])
            }
        }).catch((error) => {
            setError(error.response.data['message']);
        })
    }
    const handleForgotPassword = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (resetEmail) {
            axios.post(APIUrls.forgot,{
                email: resetEmail
            }).then(res => {
                console.log('FORGOT API', res.data)
                if(res.data.data.message) {
                    setSuccess('Link sent. Please check your e-mail')
                }
            }).catch(e => {
                console.log(e.response)
                setError(e.response.data.message);
            })
        }
    }
    const path = router.query.id;
    const category = router.query.category;
    const logout = () => {
        dispatch(setSession());
        setDropDown(false);
    }
    const handleQty = (index, type) => {
        setCartError('');
        let deleteItemIndex = '';
        let updatedData = user.cart.items.map((value, idx) => {
            if (idx == index) {
                if (type == "DOWN") {
                    if ((parseInt(value.qty) - 1) == 0) {
                        deleteItemIndex = index + 1;
                    }
                    value.qty = parseInt(value.qty) - 1;
                } else {
                    // if ((parseInt(value.qty) + 1) <= parseInt(value.max_qty)) {
                    //     value.qty = parseInt(value.qty) + 1;
                    // } else {
                    //     setCartError(`Only ${value.max_qty} available`);
                    // }
                    value.qty = parseInt(value.qty) + 1;
                }
            }
            return value
        });
        if (deleteItemIndex) {
            updatedData.splice(deleteItemIndex - 1, 1)
        }
        saveCartToDB(updatedData);
        dispatch(setUserInfo({
            ...user,
            cart: {
                items: [...updatedData]
            }
        }))
    }
    const handleDeletButton = (index) => {
        setCartError('');
        let updatedData = user.cart.items.map((value, idx) => {
            return value
        });

        updatedData.splice(index, 1)

        saveCartToDB(updatedData);
        dispatch(setUserInfo({
            ...user,
            cart: {
                items: [...updatedData]
            }
        }))
    }
    const saveCartToDB = (item) => {

        console.log("SAVING CART TO DB...", item)
        if (user.is_logged) {
            let cartItems = [];

            cartItems = item.map((value) => {
                console.log(value)
                return {
                    item: value.product_id,
                    color: value.color,
                    qty: value.qty
                }
            })
            console.log('CALL ADD TO CART API', cartItems)
            axios.post(APIUrls.save_cart, {
                cartItems: cartItems.length > 0 ? cartItems : []
            }).then((res) => {
                console.log('SAVED TO DB', res)
            }).catch((error) => {
                console.log(error.response)
            })
        }
    }
    return (
        <div className='header-wrapper'>
            <div className='header-1'>
                <div className='bar-wrapper'>
                    <svg className="d-md-none" onClick={() => setToggle(!toggle)} xmlns="http://www.w3.org/2000/svg" width="31.5" height="30" viewBox="0 0 31.5 30">
                        <path id="Icon_awesome-bars" data-name="Icon awesome-bars" d="M1.125,9.729h29.25A1.178,1.178,0,0,0,31.5,8.5V5.443a1.178,1.178,0,0,0-1.125-1.224H1.125A1.178,1.178,0,0,0,0,5.443V8.5A1.178,1.178,0,0,0,1.125,9.729Zm0,12.245h29.25A1.178,1.178,0,0,0,31.5,20.749V17.688a1.178,1.178,0,0,0-1.125-1.224H1.125A1.178,1.178,0,0,0,0,17.688v3.061A1.178,1.178,0,0,0,1.125,21.974Zm0,12.245h29.25A1.178,1.178,0,0,0,31.5,32.994V29.933a1.178,1.178,0,0,0-1.125-1.224H1.125A1.178,1.178,0,0,0,0,29.933v3.061A1.178,1.178,0,0,0,1.125,34.219Z" transform="translate(0 -4.219)" />
                    </svg>

                </div>
                <div className='logo-wrapper'>
                    <div className='logo' onClick={() => redirectTo('/')}>
                        <Image src={vedayuuLogo} width={135} height={35} quality={100}></Image>
                    </div>
                </div>
                <div className='icon-wrapper'>
                    {
                        user && user.is_logged ? (
                            <svg className='icon d-md-block d-none' onClick={() => setDropDown(!dropdown)} xmlns="http://www.w3.org/2000/svg" width="34.875" height="34.875" viewBox="0 0 34.875 34.875">
                                <path id="Icon_awesome-user-circle" data-name="Icon awesome-user-circle" d="M17.438.563A17.438,17.438,0,1,0,34.875,18,17.434,17.434,0,0,0,17.438.563Zm0,6.75A6.188,6.188,0,1,1,11.25,13.5,6.188,6.188,0,0,1,17.438,7.313Zm0,24.188a13.474,13.474,0,0,1-10.3-4.8,7.839,7.839,0,0,1,6.926-4.2,1.72,1.72,0,0,1,.5.077,9.309,9.309,0,0,0,2.876.485,9.274,9.274,0,0,0,2.876-.485,1.72,1.72,0,0,1,.5-.077,7.839,7.839,0,0,1,6.926,4.2A13.474,13.474,0,0,1,17.438,31.5Z" transform="translate(0 -0.563)" />
                            </svg>

                        ) : (
                            <span className='sign-in-text' onClick={() => { setToggleSignIn(!toggleSignIn); setShowSignUp(false); setShowLogin(true); setForgot(false); setError(''); setSuccess(''); }}>Sign in</span>
                        )
                    }
                    <svg className='icon' onClick={() => redirectTo('/search')} xmlns="http://www.w3.org/2000/svg" width="30.621" height="33.621" viewBox="0 0 30.621 33.621">
                        <g id="Icon_feather-search" data-name="Icon feather-search" transform="translate(-3 -3)">
                            <path id="Path_1" data-name="Path 1" d="M28.5,18c0,7.456-5.373,13.5-12,13.5S4.5,25.456,4.5,18,9.873,4.5,16.5,4.5,28.5,10.544,28.5,18Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
                            <path id="Path_2" data-name="Path 2" d="M31.5,31.5l-6.525-6.525" transform="translate(0 3)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
                        </g>
                    </svg>
                    <svg className='icon' onClick={() => setToggleCart(!toggleCart)} id="Icon_feather-shopping-cart" data-name="Icon feather-shopping-cart" xmlns="http://www.w3.org/2000/svg" width="36" height="33" viewBox="0 0 36 33">
                        <path id="Path_3" data-name="Path 3" d="M15,31.5A1.5,1.5,0,1,1,13.5,30,1.5,1.5,0,0,1,15,31.5Z" transform="translate(0 -1.5)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
                        <path id="Path_4" data-name="Path 4" d="M31.5,31.5A1.5,1.5,0,1,1,30,30,1.5,1.5,0,0,1,31.5,31.5Z" transform="translate(0 -1.5)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
                        <path id="Path_5" data-name="Path 5" d="M1.5,1.5h6l4.02,18.746a2.96,2.96,0,0,0,3,2.254H29.1a2.96,2.96,0,0,0,3-2.254L34.5,8.5H9" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
                    </svg>
                    <span className='floating-number'>{user && user.cart && user.cart.items && user.cart.items.length ? user.cart.items.length : 0}</span>


                </div>
            </div>
            <div className={toggle ? 'sidebar-wrapper d-block' : 'sidebar-wrapper d-none'}>
                <ul className='sidebar-list'>
                    <li>
                        <div className='cart-header-wrapper'>
                            <h1 className='cart-header'></h1>
                            <div className='close-icon' onClick={() => setToggle(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="29.25" height="29.25" viewBox="0 0 29.25 29.25">
                                    <path id="Icon_ionic-ios-close-circle" data-name="Icon ionic-ios-close-circle" d="M18,3.375A14.625,14.625,0,1,0,32.625,18,14.623,14.623,0,0,0,18,3.375Zm3.705,19.92L18,19.589l-3.705,3.705a1.124,1.124,0,1,1-1.589-1.589L16.411,18l-3.705-3.705a1.124,1.124,0,0,1,1.589-1.589L18,16.411l3.705-3.705a1.124,1.124,0,1,1,1.589,1.589L19.589,18l3.705,3.705a1.129,1.129,0,0,1,0,1.589A1.116,1.116,0,0,1,21.705,23.295Z" transform="translate(-3.375 -3.375)" />
                                </svg>

                            </div>
                        </div>
                    </li>
                    <li>{user.username && `Hi, ${user.username}`}</li>
                    {
                        categoryList ? (
                            categoryList.filter(d => d.isActive == true).map((value) => {
                                return (
                                    <li
                                        className={(path == value.name) || (category == value.name) ? 'active' : ''}
                                        onClick={() => redirectTo(`/category/${value.name}`)}
                                    >{value.name.charAt(0).toUpperCase() + value.name.substring(1)}</li>
                                )
                            })
                        ) : null
                    }
                    <li onClick={() => redirectTo('/password/reset/new')}>Reset Password</li>
                    {
                        user && user.role == "admin" ? (<li onClick={() => { setToggleSignIn(!toggleSignIn); setForgot(false); setShowLogin(true); setToggle(false); setError(''); setSuccess(''); redirectTo('/admin') }}>Admin Panel</li>) : null
                    }
                    <li onClick={() => { setToggleSignIn(false); setForgot(false); setShowLogin(true); setToggle(false); setError(''); setSuccess(''); redirectTo('/order') }}>My orders</li>
                    {/* <li>Settings</li> */}
                    {!user.is_logged && <li onClick={() => { setToggleSignIn(!toggleSignIn); setForgot(false); setShowLogin(true); setShowSignUp(false); setToggle(false); setError(''); setSuccess(''); }}>Sign in</li>}
                    {user.is_logged && <li onClick={() => logout()}>Log out</li>}
                </ul>
            </div>
            <div className={toggleCart || cart_flag ? 'cart-wrapper d-block' : 'cart-wrapper d-none'}>
                <ul className='sidebar-list'>
                    <li>
                        <div className='cart-header-wrapper'>
                            <h1 className='cart-header'>Your Cart</h1>
                            <div className='close-icon' onClick={() => {
                                setToggleCart(false);
                                dispatch(setCartFlag({ flag: false }))
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="29.25" height="29.25" viewBox="0 0 29.25 29.25">
                                    <path id="Icon_ionic-ios-close-circle" data-name="Icon ionic-ios-close-circle" d="M18,3.375A14.625,14.625,0,1,0,32.625,18,14.623,14.623,0,0,0,18,3.375Zm3.705,19.92L18,19.589l-3.705,3.705a1.124,1.124,0,1,1-1.589-1.589L16.411,18l-3.705-3.705a1.124,1.124,0,0,1,1.589-1.589L18,16.411l3.705-3.705a1.124,1.124,0,1,1,1.589,1.589L19.589,18l3.705,3.705a1.129,1.129,0,0,1,0,1.589A1.116,1.116,0,0,1,21.705,23.295Z" transform="translate(-3.375 -3.375)" />
                                </svg>

                            </div>
                        </div>
                    </li>
                    <li>
                        {
                            user && user.cart && user.cart.items && user.cart.items.length > 0 ? (
                                <>
                                    {
                                        user.cart.items.map((value, key) => {
                                            sum = sum + (parseFloat(value.salePrice) * parseInt(value.qty))
                                            console.log(value)
                                            return (
                                                <div className='item-wrapper' key={key}>
                                                    {value.image_src ? <Image src={value.image_src} height="100" width="100"></Image> : <span className='text-no-preview'>No preview available</span>}
                                                    <div className='item-details'>
                                                        <h1 className='mb-2' onClick={() => {
                                                            redirectTo(`/product/${value.category}/${value.product_id}`);
                                                        }}>{value.name}</h1>
                                                        <div className='icon-wrapper'>
                                                            <svg onClick={() => {
                                                                handleQty(key, 'DOWN')
                                                            }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                                                <g id="Icon_feather-minus-circle" data-name="Icon feather-minus-circle" transform="translate(-2 -2)">
                                                                    <path id="Path_7" data-name="Path 7" d="M33,18A15,15,0,1,1,18,3,15,15,0,0,1,33,18Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                                                                    <path id="Path_8" data-name="Path 8" d="M12,18H24" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                                                                </g>
                                                            </svg>
                                                            <input type="text" value={value.qty} className='text-input'>
                                                            </input>
                                                            <svg onClick={() => {
                                                                handleQty(key, 'UP')
                                                            }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                                                <g id="Icon_feather-plus-circle" data-name="Icon feather-plus-circle" transform="translate(-2 -2)">
                                                                    <path id="Path_9" data-name="Path 9" d="M33,18A15,15,0,1,1,18,3,15,15,0,0,1,33,18Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                                                                    <path id="Path_10" data-name="Path 10" d="M18,12V24" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                                                                    <path id="Path_11" data-name="Path 11" d="M12,18H24" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                                                                </g>
                                                            </svg>
                                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" onClick={() => {
                                                                handleDeletButton(key)
                                                            }}
                                                                width="32px" height="32px" viewBox="0 0 52 52">
                                                                <g>
                                                                    <path d="M45.5,10H33V6c0-2.2-1.8-4-4-4h-6c-2.2,0-4,1.8-4,4v4H6.5C5.7,10,5,10.7,5,11.5v3C5,15.3,5.7,16,6.5,16h39
		c0.8,0,1.5-0.7,1.5-1.5v-3C47,10.7,46.3,10,45.5,10z M23,7c0-0.6,0.4-1,1-1h4c0.6,0,1,0.4,1,1v3h-6V7z"/>
                                                                    <path d="M41.5,20h-31C9.7,20,9,20.7,9,21.5V45c0,2.8,2.2,5,5,5h24c2.8,0,5-2.2,5-5V21.5C43,20.7,42.3,20,41.5,20z
		 M23,42c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1V28c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1V42z M33,42c0,0.6-0.4,1-1,1h-2
		c-0.6,0-1-0.4-1-1V28c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1V42z"/>
                                                                </g>
                                                            </svg>

                                                        </div>
                                                        <h1 className='mt-2'>{`Rs. ${value.salePrice}/-`}</h1>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    {/* <div className='instruction-box'>
                                        {cartError && <p className='error-cart'>{cartError}</p>}
                                        <h6>Special instruction for seller</h6>
                                        <textarea value={user.cart && user.cart.description} onChange={(e) => {
                                            dispatch(setUserInfo({ ...user, cart: { ...user.cart, description: e.target.value } }))
                                        }}></textarea>
                                    </div> */}

                                    <div className='cart-total'>
                                        <h6>Subtotal</h6>
                                        <h6>Rs. {parseFloat(sum)}</h6>
                                    </div>
                                    <div className='btn-wrapper'>
                                        <Button text="CHECK OUT" redirectPath="/contact" />
                                    </div>
                                </>) : <div className='item-wrapper justify-content-center'>
                                Empty cart
                            </div>

                        }


                    </li>
                </ul>
            </div>
            {
                showSignUp ? (
                    <>
                        <div className={toggleSignIn ? 'sign-in-wrapper d-block' : 'sign-in-wrapper d-none'}>
                            <div className='d-flex justify-content-end p-0'>
                                <svg width="30" height="30" className='p-0' onClick={() => { setToggleSignIn(!toggleSignIn); setForgot(false); setShowLogin(true); setShowOtpFields(false); }}
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0" />
                                        <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" /></g>
                                    </g>
                                </svg>
                            </div>
                            <form name="sign-up-form" onSubmit={(e) => handleRegister(e)}>
                                <div className='input-wrapper'>
                                    <label className='text-label'>Name</label>
                                    <input
                                        type="text"
                                        className='text-input'
                                        value={userDetails.name}
                                        onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                                        required
                                    ></input>
                                </div>
                                <div className='input-wrapper'>
                                    <label className='text-label'>Email</label>
                                    <input
                                        type="email"
                                        className='text-input'
                                        value={userDetails.email}
                                        onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                                        required
                                    ></input>
                                </div>
                                <div className='input-wrapper'>
                                    <label className='text-label'>Password</label>
                                    <input
                                        type="password"
                                        className='text-input'
                                        value={userDetails.password}
                                        onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                                        required
                                    ></input>
                                </div>
                                {error && <div className='error-text'>{error}</div>}
                                <input className="footer-btn" type="submit" value="Sign up">
                                </input>
                            </form>
                            <h3 className='footer-text' onClick={() => { setToggleSignIn(true); setShowSignUp(false); setShowLogin(true); setShowOtpFields(false); setForgot(false) }}>Sign in</h3>
                        </div>
                    </>) : (
                    null
                )
            }
            {
                showLogin ? (
                    <>
                        <div className={toggleSignIn ? 'sign-in-wrapper d-block' : 'sign-in-wrapper d-none'}>
                            <div className='d-flex justify-content-end p-0'>
                                <svg width="30" height="30" className='p-0' onClick={() => { setToggleSignIn(!toggleSignIn); setForgot(false); setShowLogin(true); setShowOtpFields(false); }}
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0" />
                                        <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" /></g>
                                    </g>
                                </svg>
                            </div>
                            <form name='login-form' onSubmit={(e) => handleLogin(e)}>
                                <div className='input-wrapper'>
                                    <label className='text-label'>Email</label>
                                    <input
                                        type="email"
                                        className='text-input'
                                        value={userDetails.email}
                                        onChange={(e) => {
                                            setUserDetails({ ...userDetails, email: e.target.value })
                                        }}
                                        required
                                    ></input>
                                </div>
                                <div className='input-wrapper'>
                                    <div className='d-flex justify-content-between w-100 p-0'>
                                        <label className='text-label w-auto'>Password</label>
                                        <label className='text-label forgot-link w-auto' onClick={() => { setToggleSignIn(true); setShowLogin(false); setToggle(false); setForgot(true); setError(''); setSuccess(''); }}>Forgot?</label>
                                    </div>
                                    <input
                                        type="password"
                                        className='text-input'
                                        value={userDetails.password}
                                        onChange={(e) => {
                                            setUserDetails({ ...userDetails, password: e.target.value })
                                        }}
                                        required
                                    ></input>
                                </div>
                                {error && <div className='error-text'>{error}</div>}
                                {success && <div className='success-text'>{success}</div>}
                                <input className="footer-btn" type="submit" value="Sign in">
                                </input>
                            </form>
                            <h3 className='footer-text' onClick={() => { setToggleSignIn(true); setShowSignUp(true); setShowLogin(false); setShowOtpFields(false); setForgot(false) }}>Sign up</h3>
                        </div>
                    </>
                ) : null
            }
            {
                showOtpFields ? (
                    <>
                        <div className={toggleSignIn ? 'sign-in-wrapper d-block' : 'sign-in-wrapper d-none'}>
                            <div className='d-flex justify-content-end p-0'>
                                <svg width="30" height="30" className='p-0' onClick={() => { setToggleSignIn(!toggleSignIn); setForgot(false); setShowLogin(true); setShowOtpFields(false); }}
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0" />
                                        <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" /></g>
                                    </g>
                                </svg>
                            </div>
                            <div className='input-wrapper'>
                                <label className='text-label'>Confirmation code</label>
                                <input type="email" className='text-input'></input>
                            </div>
                            <div className='input-wrapper'>
                                <label className='text-label w-auto'>Password</label>
                                <input type="password" className='text-input'></input>
                            </div>
                            <div className='input-wrapper'>
                                <label className='text-label w-auto'>Confirm password</label>
                                <input type="password" className='text-input'></input>
                            </div>
                            <input className="footer-btn" type="submit" value="Sign up">
                            </input>
                            <h3 classame='footer-text' onClick={() => { setShowSignUp(true); setShowLogin(false); setShowOtpFields(false); setForgot(false) }}>Sign in</h3>
                        </div>
                    </>
                ) : null
            }
            {
                forgot ? (
                    <>
                        <div className={toggleSignIn ? 'sign-in-wrapper d-block' : 'sign-in-wrapper d-none'}>
                            <div className='d-flex justify-content-end p-0'>
                                <svg width="30" height="30" className='p-0' onClick={() => { setToggleSignIn(!toggleSignIn); setForgot(false); setShowLogin(true); setShowOtpFields(false); setForgot(false) }}
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0" />
                                        <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" /></g>
                                    </g>
                                </svg>
                            </div>
                            <form name='login-form' onSubmit={(e) => handleForgotPassword(e)}>
                                <div className='input-wrapper'>
                                    <label className='text-label'>Email</label>
                                    <input
                                        type="email"
                                        className='text-input'
                                        value={resetEmail}
                                        onChange={(e) => {
                                            setResetEmail(e.target.value)
                                        }}
                                        required
                                    ></input>
                                </div>
                                {error && <div className='error-text'>{error}</div>}
                                {success && <div className='success-text'>{success}</div>}
                                <input className="footer-btn" type="submit" value="Send Link">
                                </input>
                            </form>
                            <h3 className='footer-text' onClick={() => { setToggleSignIn(true); setShowSignUp(true); setShowLogin(false); setShowOtpFields(false); setForgot(false) }}>Sign up</h3>
                        </div>
                    </>
                ) : null
            }



            <div className={dropdown ? 'dropdown-wrapper d-block' : 'dropdown-wrapper d-none'}>
                <h1>{user.username && `${user.username}`}</h1>
                <h6>{user.email && `${user.email}`}</h6>
                <div className='list-wrapper'>
                    <div className='list' onClick={() => redirectTo('/password/reset/new')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13.333" viewBox="0 0 12 13.333">
                            <g id="Icon_feather-user" data-name="Icon feather-user" transform="translate(-2 -1.333)">
                                <path id="Path_24" data-name="Path 24" d="M13.333,14V12.667A2.667,2.667,0,0,0,10.667,10H5.333a2.667,2.667,0,0,0-2.667,2.667V14" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.333" />
                                <path id="Path_25" data-name="Path 25" d="M10.667,4.667A2.667,2.667,0,1,1,8,2a2.667,2.667,0,0,1,2.667,2.667Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.333" />
                            </g>
                        </svg>
                        <span>Reset Password</span>
                    </div>
                    {
                        user && user.role == "admin" ? (
                            <div className='list' onClick={() => redirectTo('/admin')}>
                                <svg width="15" style={{ marginLeft: '-1px' }} height="20" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" aria-labelledby="gridLargeIconTitle" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" color="#000000">
                                    <rect width="7" height="7" x="3" y="3" />
                                    <rect width="7" height="7" x="14" y="3" />
                                    <rect width="7" height="7" x="3" y="14" />
                                    <rect width="7" height="7" x="14" y="14" /> </svg>
                                <span>Admin Panel</span>
                            </div>
                        ) : null
                    }
                    <div className='list' onClick={() => { setToggleSignIn(false); setShowLogin(true); setForgot(false); setForgot(false); setToggle(false); setError(''); setSuccess(''); redirectTo('/order') }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13.333" height="14.667" viewBox="0 0 13.333 14.667">
                            <g id="Icon_feather-shopping-bag" data-name="Icon feather-shopping-bag" transform="translate(-1.333 -0.667)">
                                <path id="Path_21" data-name="Path 21" d="M4,1.333,2,4v9.333a1.333,1.333,0,0,0,1.333,1.333h9.333A1.333,1.333,0,0,0,14,13.333V4L12,1.333Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.333" />
                                <path id="Path_22" data-name="Path 22" d="M2,4H14" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.333" />
                                <path id="Path_23" data-name="Path 23" d="M10.667,6.667a2.667,2.667,0,1,1-5.333,0" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.333" />
                            </g>
                        </svg>

                        <span>My orders</span>
                    </div>
                    {/* <div className='list'>
                        <svg id="Icon_feather-settings" data-name="Icon feather-settings" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                            <path id="Path_19" data-name="Path 19" d="M10,8A2,2,0,1,1,8,6,2,2,0,0,1,10,8Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.333" />
                            <path id="Path_20" data-name="Path 20" d="M12.933,10a1.1,1.1,0,0,0,.22,1.213l.04.04a1.334,1.334,0,1,1-1.887,1.887l-.04-.04a1.109,1.109,0,0,0-1.88.787V14A1.333,1.333,0,1,1,6.72,14v-.06A1.1,1.1,0,0,0,6,12.933a1.1,1.1,0,0,0-1.213.22l-.04.04A1.334,1.334,0,1,1,2.86,11.307l.04-.04a1.109,1.109,0,0,0-.787-1.88H2A1.333,1.333,0,1,1,2,6.72h.06A1.1,1.1,0,0,0,3.067,6a1.1,1.1,0,0,0-.22-1.213l-.04-.04A1.334,1.334,0,1,1,4.693,2.86l.04.04a1.1,1.1,0,0,0,1.213.22H6a1.1,1.1,0,0,0,.667-1.007V2A1.333,1.333,0,1,1,9.333,2v.06a1.109,1.109,0,0,0,1.88.787l.04-.04A1.334,1.334,0,1,1,13.14,4.693l-.04.04a1.1,1.1,0,0,0-.22,1.213V6a1.1,1.1,0,0,0,1.007.667H14a1.333,1.333,0,0,1,0,2.667h-.06A1.1,1.1,0,0,0,12.933,10Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.333" />
                        </svg>

                        <span>Settings</span>
                    </div> */}
                    <div className='list'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13.333" height="13.333" viewBox="0 0 13.333 13.333">
                            <g id="Icon_feather-log-in" data-name="Icon feather-log-in" transform="translate(-1.333 -1.333)">
                                <path id="Path_16" data-name="Path 16" d="M10,2h2.667A1.333,1.333,0,0,1,14,3.333v9.333A1.333,1.333,0,0,1,12.667,14H10" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.333" />
                                <path id="Path_17" data-name="Path 17" d="M6.667,11.333,10,8,6.667,4.667" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.333" />
                                <path id="Path_18" data-name="Path 18" d="M10,8H2" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.333" />
                            </g>
                        </svg>

                        <span onClick={() => logout()}>Sign out</span>
                    </div>
                </div>
            </div >
            <div className='header-2'>
                {
                    categoryList ? (
                        <ul className='header-list'>
                            {
                                categoryList.filter(d => d.isActive == true).map((value) => {
                                    return (
                                        <li
                                            className={(path == value.name) || (category == value.name) ? 'active' : ''}
                                            onClick={() => redirectTo(`/category/${value.name}`)}
                                        >{value.name.toUpperCase()}</li>
                                    )
                                })
                            }
                        </ul>
                    ) : null
                }
            </div>
        </div >
    )
}
