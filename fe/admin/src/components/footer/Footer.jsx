import React from 'react';
import footerImage from '../../assets/images/logo-2.png';
const Footer = () => {
    return (
        <div className="footer-section-area padding-top-bottom">
            <div className="container" style={{ backgroundColor: '#1f2b31' }}>
                <div className="row" style={{ display :'flex'}}>
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" style={{width :'40%'}}>
                        <img src={footerImage} alt="Logo" />
                        <p style={{ color: 'white' }}>
                            JKS was started with a common goal of serving the finance community while they make transitions.
                            All our team members bring to table their unique expertise and experience of stock market which they would like to pass on to future investors.
                        </p>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" style={{ width: '20%' }}>
                        <div>
                            <h3 style={{ color: 'white', paddingTop: '20px', paddingLeft: '0px' }}>Contact Us</h3>
                        </div>
                        <div style={{ paddingTop: '25px' }}>
                            <ul style={{ color: 'white' }}>
                                <li>JKS, Office 206, Hubtown Solaris, Prof. NS Phadke Road, Churchgate (E) Mumbai, Maharashtra, India</li>
                                <li><i className="fa fa-envelope-o fa-2x"></i> info.bom@jks.com</li>
                                <li><i className="fa fa-phone fa-2x"></i> +91 98 19384052</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" style={{ width: '10%' }}>
                        <div>
                            <h3 style={{ color: 'white', paddingTop: '25px', paddingLeft: '0px' }}>Quick Links</h3>
                        </div>
                        <div className="information" style= {{ paddingTop: '25px' }}>
                            <ul style={{ color: 'white', textDecoration : 'none'}}>
                                <li><a style={{ color: 'white', paddingTop: '10px' }} href=""><i className="fa fa-arrow-right"></i> HOME</a></li>
                                <li><a style={{ color: 'white' }} href=""><i className="fa fa-arrow-right"></i> DASHBOARD</a></li>
                                <li><a style={{ color: 'white' }} href="/"><i className="fa fa-arrow-right"></i> ABOUT</a></li>
                                <li><a style={{ color: 'white' }} href="#"><i className="fa fa-arrow-right"></i> CONTACT US</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" style={{ width: '30%' }}>
                        <div>
                            <h3 style={{ color: 'white', paddingTop: '20px', paddingLeft: '0px' }}>Location</h3>
                        </div>
                        <div className="our-service">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d60383.60024757153!2d72.8317!3d18.9325!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x65cbb9c5d81e88aa!2sJKS%20Wealth%20Management%20Pvt.%20Ltd!5e0!3m2!1sen!2sus!4v1571992752493!5m2!1sen!2sus"
                                width="400"
                                height="200"
                                frameBorder="0"
                                style={{ border: '0', paddingLeft: '0px' }}
                                allowFullScreen={false}
                                title="Location Map"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
