import axios from 'axios'
import APIUrls from '../pages/api';
// import KasturiLogo from '../../assets/images/Kasturi-logo.png'
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
const razorpay = async (data) => {
    console.log(data, "in razor pay")

    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }
    console.log(data, "in map data")

    // const result = await axios.post("http://localhost:5000/order/order", data);
    //const token = localStorage.getItem("access_token")

    const token = localStorage.getItem('token');
    const result = await axios.post(`${APIUrls.validate_order}`, {
        data
    });

    if (!result) {
        alert("Server error. Are you online?");
        return;
    }
    console.log("The response from the order", result);
    const { amount, id } = result.data.rzpOrderId;
    console.log('amount from API', amount)
    const options = {
        key: "rzp_test_ejvTIa9rCCiPkc",
        amount: parseInt(amount),
        currency: 'INR',
        name: "Vedayuu",
        // description: "Thank you for ordering",
        // image: { KasturiLogo },
        // order_id: rzpOrderId,
        handler: async function (response) {
            if (response.razorpay_payment_id) {
                console.log('response rpay', response.razorpay_payment_id);
                return response.razorpay_payment_id
            }
            // const data = {
            //     orderCreationId: rzpOrderId,
            //     razorpayPaymentId: response.razorpay_payment_id,
            //     razorpayOrderId: response.razorpay_order_id,
            //     razorpaySignature: response.razorpay_signature,
            // };

            // alert(data.orderCreationId)
            // alert(data.razorpayPaymentId)
            // alert(data.razorpayOrderId)
            // alert(data.razorpaySignature)

            // const result = await axios.post(
            //     `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}order/success`,
            //     data
            // );
            // console.log(rzpOrderId, "orderId")
            // alert(result.data);

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

export default razorpay