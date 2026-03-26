import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaRocket, FaGlobe, FaCogs } from 'react-icons/fa';
import './Landing.css';

const Features = () => {
    const featuresList = [
        {
            icon: <FaShieldAlt />,
            title: "Advanced Security",
            desc: "Bank-grade encryption and multi-signature wallets to keep your assets safe."
        },
        {
            icon: <FaRocket />,
            title: "Lightning Fast",
            desc: "Execute transactions in milliseconds with our optimized blockchain bridge."
        },
        {
            icon: <FaGlobe />,
            title: "Global Reach",
            desc: "Connect with investors and markets worldwide without borders."
        },
        {
            icon: <FaCogs />,
            title: "Smart Automation",
            desc: "Automated trading and staking tools to maximize your returns."
        }
    ];

    return (
        <section id="features" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
            <div className="container">
                <h2 className="section-title">Why Choose Dhanik?</h2>
                <p style={{ textAlign: 'center', marginBottom: '4rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 4rem' }}>
                    We provide the tools and security you need to succeed in the evolving world of decentralized finance.
                </p>

                <div className="features-grid">
                    {featuresList.map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="gradient-card"
                            style={{ padding: '2rem', textAlign: 'center' }}
                        >
                            <div style={{ fontSize: '2.5rem', color: 'var(--primary-gold)', marginBottom: '1.5rem' }}>
                                {f.icon}
                            </div>
                            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
