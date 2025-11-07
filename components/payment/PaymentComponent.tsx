import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectAuth } from "@/store/features/authSlice";



const useRazorpay = () => {
     const { user_type, user, isAuthenticated } = useSelector(selectAuth);
  const userId = user?.id
  const [showSuccess, setShowSuccess] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        setSdkLoaded(true);
      };
      script.onerror = () => {
        setSdkLoaded(false);
      };
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);

  const displayRazorpay = async (orderDetails: any, id: any) => {
    if (!sdkLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    // console.log("order deatils", orderDetails);
    const result = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}lms/order/create_order/`,
      orderDetails,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!result) {
      alert("Server error. Are you online?");
      return;
    }
    const {
      amount,
      status,
       razorpay_order_id: order_id,
      id: razorpay_id,
      currency,
    } = result.data;

    const options = {
      key: "rzp_live_44by8SG2OOgTOL",
      amount: amount.toString(),
      currency: currency,
      name: "GYPRC",
      description: "Payment for your Course",
      image:
        "https://pixabay.com/vectors/windows-windows-icon-windows-logo-3384024/",
      order_id: order_id,
      handler: async (response:any) => {
        const data = {
          orderCreationId: order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          // razorpay_order: response.razorpay_order_id,
          courseId: orderDetails.courseId,
          razorpay_order: razorpay_id,
          razorpay_signature: response.razorpay_signature,
          amount: amount,
          status: status,
          student: userId,
          course: id,
        };

        const result = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}lms/payment/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("token")
              }`,
            },
          }
        );
        if (result) {
          // const enrollData = {
          //   student: localStorage.getItem("userId"),
          //   course: id,
          // };
          // addEnrollement(enrollData);
          localStorage.setItem("courseId", id);
          setShowSuccess(true);
          toast.success("Payment successful, Course added successfully!, Visit dashboard to view the course.");
        }
      },
      prefill: {
        name: user.name? user.name : "",
        email: user.email? user.email : "",
        contact: user.mobile ? user.mobile : "",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#F37254",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return { displayRazorpay, setShowSuccess, showSuccess };
};

export default useRazorpay;
