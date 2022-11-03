// Action here
import axios from 'axios';
import APIUrls from '../../pages/api';
import store from '../Store/index';
import setAuthorizationToken from "../AuthHeaders";
import {
    CLEAR_SESSION,
    SET_SIGNATURE,
    SET_USER_INFO,
    SET_IS_LOADING,
    SET_CURRENCY,
    SET_CATEGORY_LIST,
    SET_SHIPROCKET_TOKEN,
    SET_CART_FLAG

} from "./types";

export function setSignature(user) {
    return {
        type: SET_SIGNATURE,
        user: {
            data: user.data
        }
    }
}
export function setCurrency(user) {
    return {
        type: SET_CURRENCY,
        user: {
            currency: user.currency
        }
    }
}
export function setCategoryList(user) {
    return {
        type: SET_CATEGORY_LIST,
        user: {
            categoryList: user.categoryList
        }
    }
}
export function setSession(redirect) {
    document.cookie =
        "token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
    document.cookie =
        "username=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
    document.cookie =
        "email=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
    document.cookie =
        "cart=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
    document.cookie =
        "shipping_address=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
    document.cookie =
        "name=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
    setAuthorizationToken(null, null, null, null);
    store.dispatch(setUserInfo({
        cookie: undefined,
        cookie_name: undefined,
        role: undefined,
        username: undefined,
        email: undefined,
        user_code: undefined,
        portal_access: undefined,
        is_logged: false,
        shipping_address: undefined,
        name: undefined
    }))
    if (!redirect) window.location.href = "/";
    return {
        type: CLEAR_SESSION,
    }
}
export function setUserInfo(user) {
    document.cookie = `${"token"}=${user.cookie};path=/`;
    document.cookie = `${"username"}=${user.username};path=/`;
    document.cookie = `${"email"}=${user.email};path=/`;
    document.cookie = `${"role"}=${user.role};path=/`;
    document.cookie = `${"cart"}=${JSON.stringify({ data: user.cart })};path=/`;
    document.cookie = `${"shipping_address"}=${user.shipping_address ? JSON.stringify({ data: user.shipping_address }) : []};path=/`;
    console.log('saving cookie', user)
    if (user.cookie)
        setAuthorizationToken(`Bearer ${user.cookie}`, null, null, false); //Setting headers for API calls
    return {
        type: SET_USER_INFO,
        data: user
    }
}
export function setLoading(user) {
    return {
        type: SET_IS_LOADING,
        data: user
    }
}
export function setShipRocketToken(user) {
    return {
        type: SET_SHIPROCKET_TOKEN,
        data: user.token
    }
}
export function setCartFlag(user) {
    return {
        type: SET_CART_FLAG,
        data: user.flag
    }
}
export function logout() {
    return dispatch => {
        axios.post('/auth/logout', {}).then((res) => {
            if (res.data.status === 200) {
                // localStorage.removeItem('jwtToken');
                // localStorage.removeItem('user');
                // localStorage.removeItem('role');
                setAuthorizationToken("", "false", "7PHs6U33kX", "");
                dispatch(setCurrentUser({ isLoggedIn: false, id: '', isVerified: false, isPasswordReset: false }));
                dispatch(setUserRole({ role: " " }));
                // document.cookie = "id="
                if (localStorage.role === "super_admin" || localStorage.role === "admin") {
                    // document.cookie = "customer_id=0;path=/;";
                    // document.cookie = "transaction_id=0;path=/individualtrans;";
                    localStorage.removeItem("customer_id");
                    localStorage.removeItem("transaction_id");
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminCode');
                    localStorage.removeItem('adminRole');
                    localStorage.removeItem("whoami");
                    localStorage.removeItem("email-id");
                    localStorage.removeItem("customer_type");
                    localStorage.removeItem("global_search");
                    localStorage.removeItem("region");
                    localStorage.removeItem("route-role");
                    localStorage.removeItem("vendor_inventory");
                    localStorage.removeItem("logistics_id");
                    localStorage.removeItem("permission");
                    localStorage.removeItem("cellar_id");
                    localStorage.removeItem("list_id");
                    localStorage.removeItem("route-role");
                    localStorage.removeItem("region");
                    localStorage.removeItem("permission");
                    window.location.href = "/";
                }
                else if (localStorage.role === "user" && localStorage.adminCode && localStorage.adminToken && localStorage.adminRole) {
                    localStorage.user = localStorage.adminCode;
                    localStorage.jwtToken = localStorage.adminToken;
                    localStorage.role = localStorage.adminRole;
                    window.location.href = "/customer";
                }
                else {
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                    localStorage.removeItem("customer_id");
                    localStorage.removeItem("transaction_id");
                    localStorage.removeItem("email-id");
                    localStorage.removeItem("customer_type");
                    localStorage.removeItem("global_search");
                    localStorage.removeItem("region");
                    localStorage.removeItem("permission");
                    localStorage.removeItem("cellar_id");
                    localStorage.removeItem("list_id");
                    localStorage.removeItem("route-role");
                    window.location.href = "/";
                }

            }
        }).catch((error) => {
            console.log('error', error);
            dispatch(setSession())
        })
    }
}
const getCookie = (cName) => {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res;
}
const saveCartToDB = (item) => {

    console.log("SAVING CART TO DB...", item)
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
        cartItems: cartItems
    }).then((res) => {
        console.log('SAVED TO DB', res)
    }).catch((error) => {
        console.log(error)
    })
}
export function login(data) {
    return dispatch => {
        return axios.post(APIUrls.login, {
            email: data['email'],
            password: data['password']
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }).then(res => {
            console.log("LOGIN API", res.data)
            const cart = getCookie('cart');

            if (res.data.data['token']) {
                if (cart !== undefined && cart !== "undefined") {
                    if (JSON.parse(cart).data && JSON.parse(cart).data.items) {
                        let array = [];
                        console.log('json-cart', JSON.parse(cart).data.items)
                        array.push(...JSON.parse(cart).data.items)
                        console.log('called here', array)
                        let cartArray = [];
                        if (res.data.data['user'].cart.length > 0) {
                            res.data.data['user'].cart.map(value => {
                                let color = value.color;
                                value.item.variants.map((data) => {
                                    if (data.color == color) {
                                        cartArray.push({
                                            name: value.item.title,
                                            id: data._id,
                                            max_qty: data.totalStock ? data.totalStock : 1,
                                            color: data.color,
                                            price: data.price,
                                            salePrice: data.salePrice,
                                            qty: value.qty,
                                            product_id: value.item.id,
                                            category: value.item.category,
                                            image_src: data.displayImage

                                        })
                                    }
                                });
                            })
                        }
                        console.log('DERRIVED FROM API CART', cartArray)
                        dispatch(setUserInfo({
                            email: res.data.data['user'].email,
                            name: res.data.data['user'].name,
                            is_logged: true,
                            role: res.data.data['user'].role,
                            cookie: res.data.data['token'],
                            username: res.data.data['user'].name,
                            shipping_address: res.data.data['user'].shippingAddress,
                            cart: {
                                items: [...cartArray, ...array]
                            },
                        }));
                        saveCartToDB([...cartArray, ...array]);
                    } else {
                        let cartArray = [];
                        if (res.data.data['user'].cart.length > 0) {
                            res.data.data['user'].cart.map(value => {
                                let color = value.color;
                                value.item.variants.map((data) => {
                                    if (data.color == color) {
                                        cartArray.push({
                                            name: value.item.title,
                                            id: data._id,
                                            max_qty: data.totalStock ? data.totalStock : 1,
                                            color: data.color,
                                            price: data.price,
                                            salePrice: data.salePrice,
                                            qty: value.qty,
                                            product_id: value.item.id,
                                            category: value.item.category,
                                            image_src: data.displayImage

                                        })
                                    }
                                });
                            })
                        }
                        dispatch(setUserInfo({
                            email: res.data.data['user'].email,
                            name: res.data.data['user'].name,
                            role: res.data.data['user'].role,
                            is_logged: true,
                            cookie: res.data.data['token'],
                            username: res.data.data['user'].name,
                            shipping_address: res.data.data['user'].shippingAddress,
                            cart: {
                                items: [...cartArray]
                            },
                        }))
                        // dispatch(setUserInfo({
                        //     email: res.data.data['user'].email,
                        //     is_logged: true,
                        //     cookie: res.data.data['token'],
                        //     username: res.data.data['user'].name,
                        //     cart: {
                        //         items: []
                        //     },
                        // }))
                    }

                } else {
                    let cartArray = [];
                    if (res.data.data['user'].cart.length > 0) {
                        res.data.data['user'].cart.map(value => {
                            let color = value.color;
                            value.item.variants.map((data) => {
                                if (data.color == color) {
                                    cartArray.push({
                                        name: value.item.title,
                                        id: data._id,
                                        max_qty: data.totalStock ? data.totalStock : 1,
                                        color: data.color,
                                        price: data.price,
                                        salePrice: data.salePrice,
                                        qty: value.qty,
                                        product_id: value.item.id,
                                        category: value.item.category

                                    })
                                }
                            });
                        })
                    }
                    dispatch(setUserInfo({
                        email: res.data.data['user'].email,
                        name: res.data.data['user'].name,
                        role: res.data.data['user'].role,
                        is_logged: true,
                        cookie: res.data.data['token'],
                        username: res.data.data['user'].name,
                        shipping_address: res.data.data['user'].shippingAddress,
                        cart: {
                            items: [...cartArray]
                        },
                    }))
                    return 'login success.';
                }
                return 'login success.';
            } else {
                res.data['message']
            }


        }).catch((error) => {
            return error.response.data['message']
        })
    }
}
// export function register(nonce, name, email, password) {
//     return dispatch => {
//         return axios.post(APIUrls.register, {
//             name, email, password
//         }, {
//             headers: {
//                 'Auth-Key': '7PHs6U33kX',
//                 'Content-Type': 'application/json'
//             }
//         }).then(res => {
//             console.log("REGISTER API", res.data)
//             const token = res.data['token'];
//             const userCode = res.data['user-code'];
//             const roles = res.data['roles'];
//             const status = res.data['status'];
//             const message = res.data['message'];
//             if (status === 200 && message === "Successfully login.") {
//                 dispatch(setUserInfo(
//                     {
//                         cookie: token,
//                         username: roles.FULL_NAME,
//                         is_logged: true,
//                         user_code: userCode
//                     }));
//                 return message;
//             } else {
//                 return message;
//             }
//         }).catch((error) => {
//             console.log('error', error);
//         })
//     }
// }