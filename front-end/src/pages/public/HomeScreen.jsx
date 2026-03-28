// HomeScreen.jsx
// This component represents the home screen of the application, showcasing services and the process of booking.
// It includes a slideshow of images and navigation to different service categories.

import { useState, useEffect } from 'react';
import { FontAwesomeIcon, faStar, faUser, EngineeringOutlinedIcon, ReviewsOutlinedIcon, faScrewdriverWrench, faMagnifyingGlass, faLocationDot, faCheck, PinDropOutlinedIcon, EditNoteOutlinedIcon } from '../../assets/icons.js';
import "../../assets/styles/HomeScreen.css";
import { slideshow1, slideshow2, slideshow3, slideshow4, slideshow5, slideshow6, slideshow7 } from "../../assets/images/slideshow";

const HomeScreen = () => {
    const image1 = [slideshow1, slideshow2, slideshow3, slideshow4, slideshow5, slideshow6, slideshow7];
    const image2 = [slideshow4, slideshow5, slideshow6, slideshow7];

    const [currentIndex, setCurrentIndex] = useState(0);
    const counters = {
        workers: { displayValue: '10+', label: 'Verified Service Providers' },
        locations: { displayValue: '1+', label: 'Service Locations' },
        contracts: { displayValue: '100+', label: 'Completed Contracts' },
        rating: { displayValue: '0.5 ★', label: 'Average Rating' }
    };

    // Slideshow effect for first image array
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                (prevIndex + 1) % image1.length
            );
        }, 3000);
        return () => clearInterval(interval);
    }, [image1.length]);

    // Slideshow effect for second image array
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                (prevIndex + 1) % image2.length
            );
        }, 3000);
        return () => clearInterval(interval);
    }, [image2.length]);

    // Fetch counters from backend
    // Fetch counters from backend
    // useEffect(() => {
    //     const fetchCounters = async () => {
    //         try {
    //             setLoadingCounters(true);
    //             const response = await fetch(`${API_BASE_URL}/counters`);

    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }

    //             const data = await response.json();

    //             if (data.success && data.data) {
    //                 // Transform array to object for easier access
    //                 const countersObj = {};
    //                 data.data.forEach(counter => {
    //                     countersObj[counter.type] = {
    //                         displayValue: counter.displayValue,
    //                         label: counter.label,
    //                         icon: counter.icon
    //                     };
    //                 });
    //                 setCounters(countersObj);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching counters:', error);
    //             // Keep default values if API fails
    //         } finally {
    //             setLoadingCounters(false);
    //         }
    //     };

    //     fetchCounters();
    // }, []); // useEffect dependency array

    // Map counter types to appropriate icons
    const getCounterIcon = (type) => {
        switch (type) {
            case 'workers':
                return <EngineeringOutlinedIcon style={{ fontSize: 90, color: "#FA7F39" }} />;
            case 'locations':
                return <PinDropOutlinedIcon style={{ fontSize: 90, color: "#FA7F39" }} />;
            case 'contracts':
                return <EditNoteOutlinedIcon style={{ fontSize: 90, color: "#FA7F39" }} />;
            case 'rating':
                return <ReviewsOutlinedIcon style={{ fontSize: 90, color: "#FA7F39" }} />;
            default:
                return <EngineeringOutlinedIcon style={{ fontSize: 90, color: "#FA7F39" }} />;
        }
    };
    return (
        <div className="homeScreenContainer">
            <div className="welcomeBlock" id="homeScreen">
                <div style={{ marginTop: "50px" }}>
                    <span> One place that brings together everything <br /> you need — endless solutions at your fingertips.</span>
                    <p> Find top professionals to meet your home, <br /> personal, and event needs easily and all in <br /> one place, designed to serve you. </p>
                    <button onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>Book A Service</button>
                </div>
                <div className='imgsBlock'>
                    <img src={image1[currentIndex]} alt="slideshow" />
                    <img id="downImage" src={image2[currentIndex]} alt="slideshow" />
                </div>
                {/* <div className='imgsBlock' style={{
                        backgroundImage: `url(${images[currentIndex]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transition: "background-image 1s ease-in-out", 
                        minHeight: "100vh"
                    }}
                    >
                    </div> */}
            </div>
            <div className='aboutUsBlock'>
                <h1 id="aboutUs">About Us</h1>
                <p> <span style={{color:"#F57F25"}}>HOMENGO</span> is an innovative Jordanian online platform that connects you with trusted service <br />
                    providers — all in one place. <br />
                    Whether you're looking for a plumber, electrician, nutritionist, event photographer, or even a <br />
                    party planner, <span style={{color:"#F57F25"}}>HOMENGO</span> brings the service right to your doorstep — safely and effortlessly. <br />
                </p>
                <p> We believe that time is your most valuable asset. That's why we designed <span style={{color:"#F57F25"}}>HOMENGO</span> to make your <br />
                    service booking experience faster, clearer, and more professional. <br />
                    We connect you with local, trusted, and reviewed professionals to ensure you always receive the <br />
                    quality you deserve. </p>
            </div>
            <div className='mainservicesBlock'>
                <section id="services"><h1>Our Services</h1></section>
                <div className='innerServiceContainer'>
                    <button>
                        <div className='serviceBlock'>
                            <FontAwesomeIcon icon={faScrewdriverWrench} size='3x' color='#FCB790' />
                            <h3>General Services</h3>
                            <p>Home and field services like<br />
                                plumbing, electricity, cleaning,<br />
                                and moving delivered to your<br />
                                door by trusted providers.</p>
                        </div>
                    </button>
                    <button>
                        <div className='serviceBlock'>
                            <FontAwesomeIcon icon={faUser} size='3x' color='#FCB790' />
                            <h3> Personal Services</h3>
                            <p>Personal care services like<br />
                                nutrition, physical therapy,<br />
                                beauty, and coaching<br />
                                delivered to you by certified
                                professionals.</p>
                        </div>
                    </button>
                    <button>
                        <div className='serviceBlock'>
                            <FontAwesomeIcon icon={faStar} size='3x' color='#FCB790' />
                            <h3>Event Services</h3>
                            <p>Event planning, photography,<br />
                                lighting, and sound<br />
                                everything you need for your<br />
                                special day, delivered<br />
                                professionally and hassle-free.</p>
                        </div>
                    </button>
                </div>
            </div>
            <div className='processBlock'>
                <h1>Our Process</h1>
                <div className='processContainer'>
                    <div className='processStpes'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} size='3x' color='#FCB790' className='processIcons' />
                        <h2>Explore Services</h2>
                        <p>Choose a needed service <br />
                            from the available categories</p>
                    </div>
                    <hr
                        style={{
                            display: 'flex',
                            width: "210px",
                            marginTop: '90px',
                            transform: "rotate(20deg)",
                            borderTop: "2px dashed black",
                        }}
                    ></hr>
                    <div className='processStpes'>
                        <h2>Specify Details</h2>
                        <p>Provide your location, pick <br />
                            the time, and add info</p>
                        <FontAwesomeIcon icon={faLocationDot} size='3x' color='#FCB790' className='processIcons' />
                    </div>
                    <hr
                        style={{
                            display: 'flex',
                            width: "210px",
                            marginTop: '90px',
                            transform: "rotate(-20deg)",
                            borderTop: "2px dashed black",

                        }}
                    ></hr>
                    <div className='processStpes'>
                        <FontAwesomeIcon icon={faUser} size='3x' color='#FCB790' className='processIcons' />
                        <h2>Select Provider </h2>
                        <p>Review ratings and make <br />
                            your choice </p>
                    </div>
                    <hr
                        style={{
                            display: 'flex',
                            width: "210px",
                            marginTop: '90px',
                            transform: "rotate(20deg)",
                            borderTop: "2px dashed black",
                        }}
                    ></hr>
                    <div className='processStpes'>
                        <h2>Fulfillment & Satisfaction</h2>
                        <p>Your request is fulfilled <br />
                            professionally</p>
                        <FontAwesomeIcon icon={faCheck} size='3x' color='#FCB790' className='processIcons' />
                    </div>
                </div>
            </div>
            <div className='statsBlock'>
                <div className='ratesContainer'>
                    
                        <>
                            <div className='ratesBlock'>
                                {getCounterIcon('workers')}
                                <h3>{counters.workers?.label || 'Verified Service Providers'}</h3>
                                <h4>100</h4>
                            </div>
                            <div className='ratesBlock'>
                                {getCounterIcon('locations')}
                                <h3>{counters.locations?.label || 'Service Locations'}</h3>
                                <h4>12</h4>
                            </div>
                            <div className='ratesBlock'>
                                {getCounterIcon('contracts')}
                                <h3>{counters.contracts?.label || 'Completed Contracts'}</h3>
                                <h4>2000+</h4>
                            </div>
                            <div className='ratesBlock'>
                                {getCounterIcon('rating')}
                                <h3>{counters.rating?.label || 'Average Rating'}</h3>
                                <h4>4.8 ★</h4>
                            </div>
                        </>
                </div>
            </div>

        </div>
    )
}
export default HomeScreen;