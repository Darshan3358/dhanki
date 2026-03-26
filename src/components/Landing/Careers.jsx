import React from 'react';
import { motion } from 'framer-motion';
import './Landing.css';

const Careers = () => {
    return (
        <section id="careers" className="section-padding" style={{ background: 'var(--bg-dark)' }}>
            <div className="container">
                <h2 className="section-title">Careers at Dhanik</h2>
                <p style={{ textAlign: 'center', marginBottom: '4rem', color: 'var(--text-secondary)' }}>
                    Build the Future of Finance with Us. We look for passionate individuals to grow with us.
                </p>

                <div className="gradient-card">
                    <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '2rem', color: '#fff' }}>🎓 Internship Opportunities</h3>

                    <div className="responsive-grid">
                        <div>
                            <h4 style={{ color: 'var(--primary-gold)', marginBottom: '1rem', fontSize: '1.3rem' }}>Finance Internship</h4>
                            <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                <li>Forex market analysis</li>
                                <li>Stock market research</li>
                                <li>Crypto & blockchain fundamentals</li>
                                <li>Trading psychology & risk management</li>
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ color: 'var(--primary-gold)', marginBottom: '1rem', fontSize: '1.3rem' }}>Marketing Internship</h4>
                            <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                <li>Digital marketing campaigns</li>
                                <li>Social media growth</li>
                                <li>Content creation & branding</li>
                                <li>Community engagement</li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                        <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                            <strong>Benefits:</strong> Internship certificate, Experience letter, Real project exposure, Mentorship.
                        </p>
                        <motion.a
                            href="mailto:support@dhanik.in"
                            className="btn-primary"
                            whileHover={{ scale: 1.05 }}
                            style={{ display: 'inline-block' }}
                        >
                            Apply via Email
                        </motion.a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Careers;
