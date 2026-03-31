// Signup.jsx
import { useState, useEffect } from 'react';
import Form from "../../components/Form.jsx";
import { slideshow1, slideshow2, slideshow3, slideshow4, slideshow5, slideshow6, slideshow7 } from "../../assets/images/slideshow/index";
import './Signup.css';

const Signup = () => {
    const images = [slideshow1, slideshow2, slideshow3, slideshow4, slideshow5, slideshow6, slideshow7];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
                setFade(true);
            }, 500);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div
            className={`signup-container ${fade ? 'fade-in' : 'fade-out'}`}
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
        >
            {/* Dark overlay so text is always readable */}
            <div className="signup-overlay" />

            {/* Left: branding & tagline */}
            <div className="signup-left">
                <h1 className="signup-brand">HOMENGO</h1>
                <p className="signup-headline">Smart Solutions,<br />Skilled Hands</p>
                <p className="signup-sub">
                    Book reliable professionals for every task —
                    technical, personal, or event-related.
                    All in one place, just a few clicks away.
                </p>
            </div>

            {/* Right: registration form */}
            <div className="signup-right">
                <Form />
            </div>
        </div>
    );
};

export default Signup;