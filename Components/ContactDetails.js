import React, { useCallback, useEffect, useState } from "react";
import Button from "./Button";
import Image from "next/image";
import itemImg from "../public/assets/images/item.jpeg";
import Router, { useRouter } from "next/router";
import { setUserInfo } from "../utils/Actions";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import axios from "axios";
import useRazorpay from "react-razorpay";
import APIUrls from "../pages/api";
import { SHIPROCKET_PASSWORD, SHIPROCKET_USERNAME } from "../credentials";
import uuid from "react-uuid";
import { E_COM_PASSWORD, E_COM_USERNAME } from "../env";
import setAuthorizationToken from "../utils/AuthHeaders";

var currentOrderAddress;
var currentCouponinfo;
export default function ContactDetails() {
  const [cartError, setCartError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [orderError, setOrderError] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [couponInfo, setCouponInfo] = useState();
  const user = useSelector((state) => state.user);
  const [counter, setCounter] = useState(0);
  const state = useSelector((state) => state);
  const shipRocketToken = useSelector((state) => state.shipRocketToken);
  const [countryList, setCountryList] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const alert = useAlert();
  const [currentAddress, setCurrentAddress] = useState("");
  const [orderAddress, setOrderAddress] = useState();
  const [userInfo, setUserDetails] = useState({
    country: "India",
    firstName: "",
    lastName: "",
    company: "",
    add1: "",
    add2: "",
    city: "",
    pinCode: "",
    state: "",
    phone: "",
    isDefault: true,
  });
  useEffect(() => {
    if (!user.is_logged) {
      // Router.push('/')
      alert.show("Please sign in", { type: "info" });
    }
    checkCoupon();
  }, [user]);
  useEffect(() => {
    if (user.shipping_address) {
      let currentHead = 0,
        address;
      if (user.shipping_address.length > 0) {
        user.shipping_address.map((d, index) => {
          if (d.isDefault == true) {
            currentHead = d._id;
            address = d;
          }
        });
        setCurrentAddress(currentHead);
        setOrderAddress(address);
        currentOrderAddress = address;
      }
    }
  }, []);
  useEffect(() => {
    var config = {
      method: "get",
      url: "https://apiv2.shiprocket.in/v1/external/countries",
      headers: {
        "Content-Type": "application/json",
        Authorization: "",
      },
    };

    axios(config)
      .then(function (response) {
        let list = [];
        console.log(response.data);
        if (response.data.data) {
          response.data.data.map((d) => {
            list.push(d.name);
          });
          setCountryList(list);
          setUserDetails({
            ...userInfo,
            country: list[0],
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  const checkCoupon = () => {
    if (coupon) {
      let orderItems = [];
      const prevCart = getCookie("cart");
      const cart_items = JSON.parse(prevCart).data.items;
      let sum = 0;
      if (cart_items && cart_items.length > 0) {
        cart_items.map((d) => {
          // console.log('here', d)
          console.log("in map", d);
          sum = sum + d.price * d.qty;
        });
        console.log("cart value", sum);
      }
      axios.get(APIUrls.fetch_coupon).then((res) => {
        console.log("FETCH COUPON", res.data);
        setCounter(1);
        if (res.data.data) {
          let info;
          let isValid = false;
          if (res.data.data.length > 0) {
            res.data.data.map((d) => {
              var currentDate = new Date();
              var expiryDate = new Date(d.expiryDate);
              if (
                d.name.toLowerCase() == coupon.toLowerCase() &&
                d.count > 0 &&
                currentDate <= expiryDate &&
                sum >= d.min_amount
              ) {
                isValid = true;
                info = d;
              }
            });
            if (isValid) {
              console.log("valid");
              setCouponInfo(info);
              currentCouponinfo = info;
            } else {
              setCouponInfo(null);
              currentCouponinfo = null;
            }
          } else {
            setCouponInfo(null);
            currentCouponinfo = null;
          }
        }
      });
    }
  };

  //Razor Pay
  const Razorpay = useRazorpay();
  // const handlePayment = useCallback(async () => {
  //     console.log('current address', currentAddress)
  //     // const order = await createOrder(params);
  //     let total = 0;
  //     if (user && user.cart && user.cart.items && user.cart.items.length > 0) {
  //         total = user.cart.items.reduce((total, data) => total + (parseFloat(data.salePrice) * parseInt(data.qty)), 0)
  //     }
  //     let price = 0;
  //     if (currentCouponinfo && currentCouponinfo.discount) {
  //         price = ((total - currentCouponinfo.discount) * 100)

  //     } else {
  //         price = ((total) * 100)
  //     }

  //     const data = await fetch(APIUrls.init_razorpay, {
  //         method: 'POST',
  //         headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({ amount: price })
  //     }).then((t) =>
  //         t.json()
  //     )

  //     console.log('response from razor pay',data)
  //     const options = {
  //         key: "rzp_test_ejvTIa9rCCiPkc",
  //         // key:"rzp_live_0I3nMo0UFceWVI",
  //         order_id:data.id,
  //         amount: data.data.amount.toString(),
  //         currency: "INR",
  //         name: "Craft Center",
  //         description: "Test Transaction",
  //         image: "https://example.com/your_logo",
  //         order_id: "",
  //         prefill: {
  //             name: user.username,
  //             email: user.email,
  //             contact: currentOrderAddress.phone,
  //         },
  //         handler: (res) => {
  //             // console.log(res)
  //             // if (res.razorpay_payment_id) {
  //             //     if (currentOrderAddress) {
  //             //         createOrderAPI(currentOrderAddress, res.razorpay_payment_id, 'create');
  //             //     }
  //             //     // else {
  //             //     //     const shippingAddress = JSON.parse(getCookie('shipping_address')).data;
  //             //     //     if (shippingAddress && shippingAddress.length > 0) {
  //             //     //         let currentHead = 0;
  //             //     //         shippingAddress.map((d, index) => {
  //             //     //             if (d.isDefault == true) {
  //             //     //                 currentHead = d;
  //             //     //             }
  //             //     //         });
  //             //     //         createOrderAPI(currentHead, res.razorpay_payment_id);

  //             //     //     }
  //             //     // }
  //             // } else {
  //             //     console.log('payment status', res)
  //             // }

  //         },
  //         notes: {
  //             address: "Razorpay Corporate Office",
  //         },
  //         theme: {
  //             color: "#3399cc",
  //         },
  //     };

  //     const rzpay = new Razorpay(options);
  //     rzpay.on("payment.failed", function (response) {
  //         alert.show(response.error.description, { type: 'error' });
  //     });
  //     rzpay.open();
  // }, [Razorpay]);
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  const razorpay = async (data, orderItems) => {
    console.log(data, "in razor pay");

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    console.log(data, "in map data");

    // const result = await axios.post("http://localhost:5000/order/order", data);
    //const token = localStorage.getItem("access_token")

    const token = localStorage.getItem("token");
    const result = await axios.post(`${APIUrls.validate_order}`, {
      data,
    });

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }
    console.log("The response from the order", result);
    const { amount, id } = result.data.rzpOrderId;
    console.log("amount from API", amount);
    const options = {
      key: "rzp_test_ejvTIa9rCCiPkc",
      amount: parseInt(amount),
      currency: "INR",
      name: "Vedayuu",
      // description: "Thank you for ordering",
      // image: { KasturiLogo },
      // order_id: rzpOrderId,
      handler: async function (response) {
        if (response.razorpay_payment_id) {
          const result = await axios.post(`${APIUrls.create_order}`, {
            data: {
              coupon_info: currentCouponinfo ? currentCouponinfo : "",
              username: user.username,
              email: user.email,
              phone: currentOrderAddress.phone,
              orders: {
                purchaseDate: new Date().toLocaleString(),
                name: user.username,
                email: user.email,
                items: orderItems,
                deliveryStatus: "order placed",
                paymentStatus: "paid",
                address: currentOrderAddress,
                transactionId: response.razorpay_payment_id,
                orderId: id,
                coupon_info: currentCouponinfo ? currentCouponinfo : "",
              },
            },
          });
          if (currentOrderAddress) {
            createOrderAPI(
              currentOrderAddress,
              response.razorpay_payment_id,
              "create",
              id
            );
          } else {
            const shippingAddress = JSON.parse(
              getCookie("shipping_address")
            ).data;
            if (shippingAddress && shippingAddress.length > 0) {
              let currentHead = 0;
              shippingAddress.map((d, index) => {
                if (d.isDefault == true) {
                  currentHead = d;
                }
              });
              createOrderAPI(
                currentHead,
                response.razorpay_payment_id,
                "create",
                id
              );
            }
          }
          // axios.post(`https://api.razorpay.com/v1/payments/${response.razorpay_payment_id}/capture`, {
          //     amount,
          //     currency: "INR"
          // }).then(res => {
          //     console.log("CAPTURE", res)
          //     if (res.data.status == 'captured') {

          //     }
          // }).catch(e => {
          //     console.log(e)
          // })
        } else {
          console.log("payment status", res);
        }
      },
      prefill: {
        name: data.username,
        email: data.email,
        contact: data.phone,
      },
      notes: {
        address: data.address,
      },
      theme: {
        color: "#ff8100",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  const handlePayment = async () => {
    let orderItems = [];
    setAuthorizationToken(`Bearer ${getCookie("token")}`, null, null, false);
    const prevCart = getCookie("cart");
    const cart_items = JSON.parse(prevCart).data.items;
    if (cart_items && cart_items.length > 0) {
      cart_items.map((d) => {
        // console.log('here', d)
        let name = `${d.name}-${d.color}`;
        orderItems.push({
          productId: d.product_id,
          imageURL: d.image_src,
          title: d.name.toString(),
          qty: d.qty,
          price: d.salePrice,
          db_price: d.price,
          salePrice: d.salePrice,
          color: d.color,
          name: name,
          sku: Math.random(),
          units: d.qty,
          selling_price: d.salePrice.toString(),
          discount: currentCouponinfo
            ? (currentCouponinfo.discount / user.cart.items.length).toString()
            : "0",
          tax: "0",
          hsn: "123456",
        });
      });
    }
    let order_id_old = Date.now();
    const data = {
      // coupon_info: currentCouponinfo ? currentCouponinfo : null,
      username: user.username,
      email: user.email,
      phone: currentOrderAddress.phone,
      orders: {
        purchaseDate: new Date().toLocaleString(),
        name: user.username,
        email: user.email,
        items: orderItems,
        deliveryStatus: "order placed",
        paymentStatus: "paid",
        address: currentOrderAddress,
        transactionId: "",
        orderId: order_id_old,
        coupon_info: currentCouponinfo ? currentCouponinfo : "",
      },
    };
    const response = await razorpay(data, orderItems);

    console.log("CREATE ORDER API", response);
    // const prevAddress = getCookie('shipping_address')
    // dispatch(setUserInfo({
    //     ...user,
    //     shipping_address: JSON.parse(prevAddress).data,
    //     cart: {
    //         items: []
    //     },
    // }));
    // saveCartToDB([]);
    // router.push('/order')
  };
  const fetchAWB = async () => {
    var data = new FormData();
    data.append("username", E_COM_USERNAME);
    data.append("password", E_COM_PASSWORD);
    data.append("count", "1");
    data.append("type", "PPD");
    setAuthorizationToken(null, null, null, null);

    var config = {
      method: "post",
      url: "https://api.ecomexpress.in/apiv2/fetch_awb/",
      data: data,
    };

    return axios(config)
      .then(function (response) {
        console.log("AWB RESPONSE", response.data);
        return response.data.awb;
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const createOrderAPI = async (address, id, type, order_id) => {
    let orderItems = [];
    const prevCart = getCookie("cart");
    const cart_items = JSON.parse(prevCart).data.items;
    if (cart_items && cart_items.length > 0) {
      cart_items.map((d) => {
        // console.log('here', d)
        let name = `${d.name}-${d.color}`;
        orderItems.push({
          productId: d.product_id,
          imageURL: d.image_src,
          title: d.name.toString(),
          qty: d.qty,
          price: d.salePrice,
          db_price: d.price,
          salePrice: d.salePrice,
          color: d.color,
          name: name,
          sku: Math.random(),
          units: d.qty,
          selling_price: d.salePrice.toString(),
          discount: currentCouponinfo
            ? (currentCouponinfo.discount / user.cart.items.length).toString()
            : "0",
          tax: "0",
          hsn: "123456",
        });
      });
    }
    let order_id_old = Date.now();
    // var data = JSON.stringify({
    //     "email": SHIPROCKET_USERNAME,
    //     "password": SHIPROCKET_PASSWORD
    // });

    // var config = {
    //     method: 'post',
    //     url: 'https://apiv2.shiprocket.in/v1/external/auth/login',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': ''
    //     },
    //     data: data
    // };
    const AWB = await fetchAWB();
    console.log("AWB", AWB);
    var data1;
    data1 = [
      {
        AWB_NUMBER: AWB[0].toString(),
        ORDER_NUMBER: order_id.toString(),
        PRODUCT: "PPD",
        CONSIGNEE: "Test API User",
        CONSIGNEE_ADDRESS1: "H. No. A10",
        CONSIGNEE_ADDRESS2: "Block-T",
        CONSIGNEE_ADDRESS3: "Sector 39 Test",
        DESTINATION_CITY: address.city,
        PINCODE: "111111",
        STATE: "DL",
        MOBILE: "1111111111",
        TELEPHONE: "0123456789",
        ITEM_DESCRIPTION: "SOLD BY VEDAYUU",
        PIECES: orderItems.length,
        COLLECTABLE_VALUE: 0,
        DECLARED_VALUE: currentCouponinfo
          ? orderItems.reduce(
              (total, data) => total + data.salePrice * data.qty,
              0
            ) - currentCouponinfo.discount
          : orderItems.reduce(
              (total, data) => total + data.salePrice * data.qty,
              0
            ),
        ACTUAL_WEIGHT: 0.5,
        VOLUMETRIC_WEIGHT: 0,
        LENGTH: 12,
        BREADTH: 5,
        HEIGHT: 2,
        PICKUP_NAME: address.firstName,
        PICKUP_ADDRESS_LINE1: address.add1,
        PICKUP_ADDRESS_LINE2: address.add2,
        PICKUP_PINCODE: address.pinCode,
        PICKUP_PHONE: address.phone,
        PICKUP_MOBILE: address.phone,
        RETURN_NAME: address.firstName,
        RETURN_ADDRESS_LINE1: address.add1,
        RETURN_ADDRESS_LINE2: address.add2,
        RETURN_PINCODE: address.pinCode,
        RETURN_PHONE: address.phone,
        RETURN_MOBILE: address.phone,
        ADDONSERVICE: [""],
        DG_SHIPMENT: "false",
        ADDITIONAL_INFORMATION: {
          essentialProduct: "Y",
          OTP_REQUIRED_FOR_DELIVERY: "Y",
          DELIVERY_TYPE: "",
          SELLER_TIN: "SELLER_TIN_1234",
          INVOICE_NUMBER: order_id,
          INVOICE_DATE: new Date().toLocaleDateString(),
          ESUGAM_NUMBER: "eSUGAM_1234",
          ITEM_CATEGORY: "ELECTRONICS",
          PACKING_TYPE: "Box",
          PICKUP_TYPE: "WH",
          RETURN_TYPE: "WH",
          CONSIGNEE_ADDRESS_TYPE: "WH",
          PICKUP_LOCATION_CODE: "PICKUP_ADDR_002",
          SELLER_GSTIN: "GISTN988787",
          GST_HSN: "123456",
          GST_ERN: "123456789123",
          GST_TAX_NAME: "DELHI GST",
          GST_TAX_BASE: 900.0,
          DISCOUNT: orderItems.reduce(
            (total, data) => total + (data.price - data.salePrice) * data.qty,
            0
          ),
          GST_TAX_RATE_CGSTN: 5.0,
          GST_TAX_RATE_SGSTN: 5.0,
          GST_TAX_RATE_IGSTN: 0.0,
          GST_TAX_TOTAL: 100.0,
          GST_TAX_CGSTN: 50.0,
          GST_TAX_SGSTN: 50.0,
          GST_TAX_IGSTN: 0.0,
        },
      },
    ];
    setAuthorizationToken(null, null, null, null);
    if (type == "create") {
      var data = new FormData();
      data.append("username", E_COM_USERNAME);
      data.append("password", E_COM_PASSWORD);
      data.append("json_input", JSON.stringify(data1));

      var config = {
        method: "post",
        url: "https://api.ecomexpress.in/apiv2/manifest_awb/",
        data: data,
      };

      axios(config)
        .then(async function (response) {
          console.log("E_COM ADD ORDER", response.data);
          const { reason, order_number, awb } = response.data.shipments[0];
          if (reason == "Updated Successfully") {
            if (order_number) {
              console.log("CREATE ORDER API", response.data);
              setAuthorizationToken(
                `Bearer ${getCookie("token")}`,
                null,
                null,
                false
              );
              const result = await axios.put(`${APIUrls.order}/${order_id}`, {
                awb_id: AWB[0].toString(),
              });
              const prevAddress = getCookie("shipping_address");
              dispatch(
                setUserInfo({
                  ...user,
                  shipping_address: JSON.parse(prevAddress).data,
                  cart: {
                    items: [],
                  },
                })
              );
              saveCartToDB([]);
              router.push("/order");
            }

            // if (response.data.order_id) {

            // } else {
            // //   setOrderError(response.data.message);
            // //   setAddressList(response.data.data.data);
            // }
          } else {
            setOrderError(reason);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      console.log("orderItems", orderItems, id);
    }

    let token;
    // axios(config)
    //     .then(async function (response) {
    //         console.log(response)
    //         token = `Bearer ${response.data.token}`
    //         if (token != null) {
    //             if (type == 'create') {

    //             } else if (type == 'invoice') {
    //                 var data = JSON.stringify({
    //                     "ids": new Array(idx)
    //                 });

    //                 var config = {
    //                     method: 'post',
    //                     url: 'https://apiv2.shiprocket.in/v1/external/orders/print/invoice',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Authorization': `Bearer ${token}`
    //                     },
    //                     data: data
    //                 };

    //                 axios(config)
    //                     .then(function (response) {
    //                         console.log("INVOICE API", response.data);
    //                     })
    //                     .catch(function (error) {
    //                         console.log(error);
    //                     });
    //             }
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    return token;
  };

  const addShippingAddress = (e) => {
    e.preventDefault();
    console.log(userInfo);
    if (
      !userInfo.country ||
      !userInfo.firstName ||
      !userInfo.add1 ||
      !userInfo.city ||
      !userInfo.pinCode ||
      !userInfo.state ||
      !userInfo.phone
    ) {
      alert.show("Please fill required fields", { type: "info" });
    } else {
      const prevAddress = getCookie("shipping_address");
      // console.info("Previous Data", prevAddress);
      // console.log(JSON.parse(prevAddress).data);
      const prevAddressData = prevAddress && JSON.parse(prevAddress).data;
      let address = [];
      if (prevAddressData.length > 0 && userInfo.isDefault == true) {
        prevAddressData.map((d) => {
          d.isDefault = false;
          return d;
        });
      }
      let payLoad = [...prevAddressData, userInfo];
      axios
        .post(APIUrls.add_shipping_address, {
          addresses: payLoad,
        })
        .then((res) => {
          console.log("ADD ADDRESS", res.data);
          alert.show("Address saved", { type: "success" });
          if (
            res.data.data.shippingAddress &&
            res.data.data.shippingAddress.length > 0
          ) {
            let currentHead = 0,
              address;
            let newAddresses = [];
            if (res.data.data.shippingAddress.length > 0) {
              newAddresses = res.data.data.shippingAddress.map((d, index) => {
                if (d.isDefault == true) {
                  currentHead = d._id;
                  address = d;
                }
                return d;
              });
              dispatch(
                setUserInfo({
                  ...user,
                  shipping_address: newAddresses,
                })
              );
              setCurrentAddress(currentHead);
              setOrderAddress(address);
              currentOrderAddress = address;
            }
          }
        })
        .catch((e) => console.log(e.response.statusText));
    }
  };
  const saveCartToDB = (item) => {
    console.log("SAVING CART TO DB...", item);
    let cartItems = [];

    cartItems = item.map((value) => {
      return {
        item: value.product_id,
        color: value.color,
        qty: value.qty,
      };
    });
    console.log("CALL ADD TO CART API", cartItems);
    axios
      .post(APIUrls.save_cart, {
        cartItems: cartItems,
      })
      .then((res) => {
        console.log("SAVED TO DB", res);
        alert.show("Order placed successfully", { type: "success" });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getCookie = (cName) => {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split("; ");
    let res;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
  };
  const authShipRocket = () => {};
  const handlePinCode = async () => {
    console.info("Pin Code", userInfo.pinCode);
    const url = `https://api.postalpincode.in/pincode/${userInfo.pinCode}`;

    const res = await fetch(url);
    const response = await res.json();
    console.info("POST OFFICE", response[0]);
    if (response[0].PostOffice && response[0].PostOffice.length > 0) {
      await setUserDetails({
        ...userInfo,
        city: response[0].PostOffice[0].Block,
        state: response[0].PostOffice[0].State,
        country: response[0].PostOffice[0].Country,
      });
    } else {
      alert.show("Sorry, we can't ship to this location", {
        type: "error",
      });
    }
    console.info("POST OFFICE", userInfo);
  };
  const validatePin = () => {
    //e-com pin api here\
    setAuthorizationToken(null, null, null, null);
    var data = new FormData();
    data.append("username", E_COM_USERNAME);
    data.append("password", E_COM_PASSWORD);
    data.append("pincode", currentOrderAddress.pinCode);

    var config = {
      method: "GET",
      url: `https://api.postalpincode.in/pincode/${currentOrderAddress.pinCode}`,
    };

    axios(config)
      .then(function (response) {
        if (response.data.length > 0) {
          handlePayment();
        } else
          alert.show("Sorry, we can't ship to this location", {
            type: "error",
          });
      })
      .catch(function (error) {
        console.info(error);
        alert.show("Invalid PINCODE", {
          type: "error",
        });
      });
    // handlePayment();
  };
  var sum = 0;
  return (
    <div className="contact-details-wrapper container">
      <div className="row justify-content-between">
        <div className="col-12 col-lg-6">
          {/* <h1>Contact Information</h1>
                    <div className='input-wrapper col-12'>
                        <input type="text" className='text-input'></input>
                        <label>
                            <input type="checkbox"></input>
                            Email me with news and offers
                        </label>
                    </div> */}
          {orderError && (
            <div className="address-error">
              <h6 className="address-text">{orderError}</h6>
              {addressList && addressList.length > 0
                ? addressList.map((d) => <p>{d.country}</p>)
                : null}
            </div>
          )}
          <h1 className="address-text">Saved shipping address</h1>
          <div className="shipping-address-list col-12">
            {user &&
            user.shipping_address &&
            user.shipping_address.length > 0 ? (
              user.shipping_address.map((d, index) => {
                console.log(d);
                return (
                  <div className="address-wrapper col-12 col-sm-6 col-md-4 d-flex">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={currentAddress == d._id ? true : false}
                      onChange={() => {
                        setCurrentAddress(d._id);
                        setOrderAddress(d);
                        currentOrderAddress = d;
                      }}
                    ></input>
                    <div>
                      <p className="header-text">{`${d.firstName} ${d.lastName}`}</p>
                      <p>{`${d.company}`}</p>
                      <p>{`${d.add1}`}</p>
                      <p>{`${d.add2}`}</p>
                      <p>{`${d.city},${d.pinCode}`}</p>
                      <p>
                        {d.state}, {d.country}
                      </p>
                      <p>{d.phone}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="shipping-address-list col-12 mb-5">
                No saved address
              </div>
            )}
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="address-text">New shipping address</h1>
            {user &&
            user.cart &&
            user.cart.items &&
            user.cart.items.length > 0 &&
            currentAddress ? (
              <button className="continue-btn" onClick={() => validatePin()}>
                Continue
              </button>
            ) : null}
          </div>
          <div className="col-12">
            <form name="shipping-form" onSubmit={(e) => addShippingAddress(e)}>
              <div className="input-group">
                <label>
                  Country/Region<span className="required-field">*</span>
                </label>
                <select
                  name="country"
                  id="country"
                  value={userInfo.country}
                  onChange={(e) =>
                    setUserDetails({
                      ...userInfo,
                      country: e.target.value,
                    })
                  }
                >
                  {countryList
                    ? countryList.map((d) => <option value={d}>{d}</option>)
                    : null}
                </select>
              </div>
              <div className="col-12 d-md-flex">
                <div className="input-group pe-md-3">
                  <label>
                    First name<span className="required-field">*</span>
                  </label>
                  <input
                    type="text"
                    className="text-input"
                    value={userInfo.firstName}
                    onChange={(e) =>
                      setUserDetails({
                        ...userInfo,
                        firstName: e.target.value,
                      })
                    }
                  ></input>
                </div>
                <div className="input-group">
                  <label>Last name</label>
                  <input
                    type="text"
                    className="text-input"
                    onChange={(e) =>
                      setUserDetails({
                        ...userInfo,
                        lastName: e.target.value,
                      })
                    }
                  ></input>
                </div>
              </div>
              <div className="col-12">
                <div className="input-group">
                  <label>Company (optional)</label>
                  <input
                    type="text"
                    className="text-input"
                    onChange={(e) =>
                      setUserDetails({
                        ...userInfo,
                        company: e.target.value,
                      })
                    }
                  ></input>
                </div>
              </div>
              <div className="col-12">
                <div className="input-group">
                  <label>
                    Address line 1<span className="required-field">*</span>
                  </label>
                  <input
                    type="text"
                    className="text-input"
                    onChange={(e) =>
                      setUserDetails({
                        ...userInfo,
                        add1: e.target.value,
                      })
                    }
                  ></input>
                </div>
              </div>
              <div className="col-12">
                <div className="input-group">
                  <label>Address line 2</label>
                  <input
                    type="text"
                    className="text-input"
                    onChange={(e) =>
                      setUserDetails({
                        ...userInfo,
                        add2: e.target.value,
                      })
                    }
                  ></input>
                </div>
              </div>
              <div className="col-12 d-md-flex">
                <div className="input-group pe-md-3">
                  <label>
                    City<span className="required-field">*</span>
                  </label>
                  <input
                    value={userInfo.city}
                    type="text"
                    className="text-input"
                    onChange={(e) =>
                      setUserDetails({
                        ...userInfo,
                        city: e.target.value,
                      })
                    }
                  ></input>
                </div>
                <div className="input-group">
                  <label>
                    PIN code<span className="required-field">*</span>
                  </label>
                  <input
                    type="number"
                    maxLength="6"
                    className="text-input"
                    // max="6"
                    onBlur={handlePinCode}
                    onChange={(e) =>
                      setUserDetails({
                        ...userInfo,
                        pinCode: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="input-group">
                  <label>
                    State<span className="required-field">*</span>
                  </label>
                  <input
                    value={userInfo.state}
                    type="text"
                    className="text-input"
                    onChange={(e) =>
                      setUserDetails({
                        ...userInfo,
                        state: e.target.value,
                      })
                    }
                  ></input>
                </div>
              </div>
              <div className="col-12">
                <div className="input-group">
                  <label>
                    Phone<span className="required-field">*</span>
                  </label>
                  <input
                    type="number"
                    step={0}
                    className="text-input"
                    onChange={(e) =>
                      setUserDetails({
                        ...userInfo,
                        phone: e.target.value,
                      })
                    }
                  ></input>
                </div>
              </div>
              <div className="input-wrapper col-12">
                <label>
                  <input
                    type="checkbox"
                    checked={userInfo.isDefault}
                    onChange={(e) =>
                      setUserDetails({
                        ...userInfo,
                        isDefault: e.target.checked,
                      })
                    }
                  ></input>
                  Use this address as Primary address
                </label>
              </div>
              <div className="col-12 btn-wrapper">
                <button type="submit" className="shipping-btn">
                  Add address
                </button>
                <button type="button" className="return-btn">
                  Return to cart
                </button>
              </div>
            </form>
          </div>
          <div className="footer-policy d-flex flex-column flex-sm-row">
            <span>Refund policy</span>
            <span>Privacy policy </span>
            <span>Terms of service</span>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="cart-wrapper">
            <ul className="sidebar-list">
              <li>
                {user &&
                user.cart &&
                user.cart.items &&
                user.cart.items.length > 0 ? (
                  <>
                    {user.cart.items.map((value, key) => {
                      sum =
                        sum + parseFloat(value.salePrice) * parseInt(value.qty);
                      console.log(sum);
                      return (
                        <div className="item-wrapper">
                          {value.image_src ? (
                            <Image
                              src={value.image_src}
                              height="100"
                              width="100"
                            ></Image>
                          ) : (
                            <span className="text-no-preview">
                              No preview available
                            </span>
                          )}
                          <div className="item-details ms-3">
                            <h1 className="mb-2">{value.name}</h1>
                            <h1 className="mt-2">
                              Rs. {value.salePrice} x {value.qty}
                            </h1>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="item-wrapper justify-content-center">
                    Empty cart
                  </div>
                )}

                <div className="gift-card-wrapper d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <input
                      type="text"
                      placeholder="Gift card or discount code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="text0input"
                    ></input>
                    <button onClick={() => checkCoupon()} disabled={!coupon}>
                      Apply
                    </button>
                  </div>
                  {couponInfo == null && counter !== 0 ? (
                    <div className="d-flex justify-content-between">
                      <h6 className="error-coupon">Coupon invalid</h6>
                      <h6></h6>
                    </div>
                  ) : null}
                </div>
                <div className="cart-total-normal d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <h6>Total</h6>
                    <h6>Rs. {parseFloat(sum)}</h6>
                  </div>
                  {couponInfo && couponInfo.name ? (
                    <div className="d-flex justify-content-between">
                      <h6 className="success-coupon">Coupon Applied</h6>
                      <h6 className="success-coupon">
                        - Rs. {parseFloat(couponInfo.discount)}
                      </h6>
                    </div>
                  ) : null}
                  <div className="d-flex justify-content-between">
                    <h6>Shipping</h6>
                    <h6>calculated at next step</h6>
                  </div>
                </div>
                <div className="cart-total">
                  <h6>Subtotal</h6>
                  <h6>
                    Rs.{" "}
                    {couponInfo && couponInfo.discount
                      ? parseFloat(sum) - parseFloat(couponInfo.discount)
                      : parseFloat(sum)}
                  </h6>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
