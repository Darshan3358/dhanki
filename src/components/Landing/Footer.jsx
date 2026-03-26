import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaTelegram, FaLinkedin, FaGithub } from 'react-icons/fa';
import './Landing.css';
import API_BASE_URL from '../../apiConfig';

const Footer = () => {
    const [contact, setContact] = useState({
        email: 'support@dhanik.in',
        liveChat: '+91 91 87094 178',
        facebook: 'https://www.facebook.com/profile.php?id=61587832813071',
        instagram: 'https://www.instagram.com/dhanikcrypto'
    });

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/support/contact-info`);
                if (res.ok) setContact(await res.json());
            } catch (e) {
                console.error("Failed to fetch footer contact info");
            }
        };
        fetchInfo();
    }, []);

    return (
        <footer style={{
            background: 'rgba(10, 14, 23, 0.98)',
            padding: '4rem 2rem 2rem',
            borderTop: '1px solid rgba(255, 215, 0, 0.1)'
        }}>
            <div className="container">
                <div className="footer-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3rem'
                }}>
                    <div>
                        <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.5rem' }}>DHANIK</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Democratizing wealth through next-gen decentralized finance and education-driven advisory.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--primary-gold)', marginBottom: '1.5rem' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
                            <li><a href="#about" style={{ color: 'var(--text-secondary)' }}>About Us</a></li>
                            <li><a href="#features" style={{ color: 'var(--text-secondary)' }}>Features</a></li>
                            <li><a href="#utility" style={{ color: 'var(--text-secondary)' }}>Token Utility</a></li>
                            <li><a href="#careers" style={{ color: 'var(--text-secondary)' }}>Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--primary-gold)', marginBottom: '1.5rem' }}>Contact</h4>
                        <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
                            <li style={{ color: 'var(--text-secondary)' }}>{contact.email}</li>
                            <li style={{ color: 'var(--text-secondary)' }}>Inquiry: {contact.liveChat}</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--primary-gold)', marginBottom: '1.5rem' }}>Follow Us</h4>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '1.5rem' }}>
                            <a href={contact.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}><FaFacebook /></a>
                            <a href={contact.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}><FaInstagram /></a>
                            <a href="#" style={{ color: 'var(--text-secondary)' }}><FaTwitter /></a>
                            <a href="#" style={{ color: 'var(--text-secondary)' }}><FaTelegram /></a>
                        </div>
                    </div>
                </div>
                <div style={{
                    textAlign: 'center',
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.9rem'
                }}>
                    © {new Date().getFullYear()} Dhanik Coin. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
