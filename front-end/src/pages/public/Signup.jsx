// Signup.jsx
// This component represents the signup page with a background image slider and a form for user registration.

import { useState, useEffect } from 'react';
import Form from "../../components/Form.jsx";
import { slideshow1, slideshow2, slideshow3, slideshow4, slideshow5, slideshow6, slideshow7 } from "../../assets/images/slideshow/index";





const Signup = () => {
    const images = [slideshow1, slideshow2, slideshow3, slideshow4, slideshow5, slideshow6, slideshow7];
    const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        (prevIndex + 1) % images.length 
      );
    }, 3000); 
    return () => clearInterval(interval); 
  }, [images.length]);


    return (
        <div className="mainContainer"
        style={{
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "background-image 1s ease-in-out", 
            minHeight: "100vh"
        }}
        >
            <div className='topHeader'>
                <div>
                    <h1 id="signupHeader">FANNI</h1>
                </div>
                <div>
                    <p id="signupSub1">Smart Solutions,<br/> Skilled Hands</p>
                    <p id="signupSub2">Book reliable professionals for every task — <br/>
                        technical, personal, or event-related. All in one place, <br/>
                        just a few clicks away.</p>
                </div>    
            </div>
            <div className='formDisplay'>
                <Form/>
            </div>
        </div>
        
       
    );
}

export default Signup;