import React, { useState } from "react";
import axios from "axios";
//import { faFacebook } from '@fortawesome/free-brands-svg-icons';
//import { faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../assets/styles/Footer.css";
import { API_BASE_URL } from "../api"; // adjust path


const Footer=()=>{


    const [email, setEmail] = useState("");

    const handleSubscribe = async () => {
        if (!email) {
        alert("Please enter a valid email.");
        return;
        }

        try {
        const res = await axios.post(`${API_BASE_URL}/api/subscriptions/subscribe`, {
            email,
        });

        alert(res.data.message || "Subscribed successfully!");
        setEmail(""); // clear field after subscribing
        } catch (err) {
        console.error("Subscription error:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Something went wrong. Try again.");
        }
    };

    return(
            <div className='footerContainer'>
                    <div className='column1'>
                        <h3> HOMENGO </h3>
                        <h4>About us</h4>
                        <a href='#aboutUs'>About us</a>
                        <a href='#'>Our vision</a>
                        <a href='#'>How it works</a>
                        <a href='#'>Terms & Conditions</a>
                        <a href='#'>Privacy Policy</a>
                    </div>
                    <div className='columns'>
                        <h4>Quick Links</h4>
                        <a href='#homeScreen'>Home</a>
                        <a href='#services'>All Services</a>
                        <a href='#'>Service Providers</a>
                        <a href='#'>Contact Us</a>
                        <a href='#'>FAQ</a>
                        {/* <div style={{display:"flex", gap:"10px"}}>
                            <a><FontAwesomeIcon icon={faFacebook} size='1x' color='black'/></a>
                            <a><FontAwesomeIcon icon={faInstagram} size='1x' color='black'/></a>
                            <a><FontAwesomeIcon icon={faXTwitter} size='1x' color='black'/></a>
                        </div> */}

                    </div>
                    <div className='columns'>
                        <h4>Subscribe to <br/>Our Newsletter</h4>
                        <span>Subscribe to get the latest  <br/>
                        services and offers</span>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        <button onClick={handleSubscribe}>Subscribe</button>
                    </div>
                    <div className='columns'>
                        <h4>Contact Us</h4>
                        <span>Amman, jordan</span>
                        <span></span>
                        <span></span>
                    </div>         
        </div>    
    )
}
export default Footer;