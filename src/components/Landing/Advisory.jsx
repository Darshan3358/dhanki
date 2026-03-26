import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaLightbulb, FaShieldAlt } from 'react-icons/fa';
import './Landing.css';

const advisoryServices = [
    {
        icon: <FaChartLine />,
        title: 'Market Education',
        subtitle: 'Build Your Foundation',
        description: 'Comprehensive education covering stock market fundamentals, forex trading mechanics, cryptocurrency & blockchain technology, and portfolio diversification strategies. Learn from industry experts and gain confidence in financial markets.',
        features: [
            'Stock market basics',
            'Forex market structure',
            'Crypto & blockchain fundamentals',
            'Portfolio diversification concepts'
        ],
        gradient: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)',
        iconBg: 'rgba(255, 215, 0, 0.15)'
    },
    {
        icon: <FaLightbulb />,
        title: 'Trading Guidance',
        subtitle: 'Master Your Strategy',
        description: 'Advanced trading education focused on risk management, market structure analysis, technical & fundamental analysis techniques, and trading psychology. Develop a disciplined approach to market participation.',
        features: [
            'Risk management techniques',
            'Market structure analysis',
            'Technical & fundamental insights',
            'Trading psychology coaching'
        ],
        gradient: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
        iconBg: 'rgba(0, 180, 216, 0.15)'
    },
    {
        icon: <FaShieldAlt />,
        title: 'Investment Planning',
        subtitle: 'Secure Your Future',
        description: 'Strategic financial planning education covering goal setting, asset allocation principles, long-term wealth building strategies, and preservation techniques. Create a roadmap for sustainable financial growth.',
        features: [
            'Financial goal setting',
            'Asset allocation concepts',
            'Long-term vs short-term education',
            'Wealth preservation strategies'
        ],
        gradient: 'linear-gradient(135deg, #9D4EDD 0%, #7209B7 100%)',
        iconBg: 'rgba(157, 78, 221, 0.15)'
    }
];

const Advisory = () => {
    return (
        <section id="advisory" className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background Glow Effects */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '-5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
                filter: 'blur(80px)',
                zIndex: -1
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '-5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(0, 180, 216, 0.1) 0%, transparent 70%)',
                filter: 'blur(80px)',
                zIndex: -1
            }}></div>

            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="section-title">Financial Advisory</h2>
                    <p style={{
                        textAlign: 'center',
                        maxWidth: '800px',
                        margin: '0 auto 5rem',
                        color: 'var(--text-secondary)',
                        fontSize: '1.15rem',
                        lineHeight: '1.7'
                    }}>
                        We provide <span style={{ color: 'var(--primary-gold)', fontWeight: '600' }}>education-driven</span> financial advisory solutions focused on knowledge, risk awareness, and long-term growth.
                    </p>
                </motion.div>

                <div className="features-grid">
                    {advisoryServices.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            style={{
                                background: 'rgba(20, 20, 30, 0.6)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                overflow: 'hidden',
                                boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* Visual Header with Icon */}
                            <div style={{
                                height: '160px',
                                background: service.gradient,
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                {/* Animated Background Pattern */}
                                <motion.div
                                    animate={{
                                        opacity: [0.3, 0.5, 0.3],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                                    }}
                                />

                                {/* Icon */}
                                <motion.div
                                    whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        fontSize: '3.5rem',
                                        color: '#fff',
                                        zIndex: 1,
                                        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
                                    }}
                                >
                                    {service.icon}
                                </motion.div>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{
                                    marginBottom: '0.4rem',
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    background: service.gradient,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    {service.title}
                                </h3>

                                <p style={{
                                    color: 'var(--accent-blue)',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    marginBottom: '1rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    {service.subtitle}
                                </p>

                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    marginBottom: '1.5rem'
                                }}>
                                    {service.description}
                                </p>

                                <ul style={{
                                    paddingLeft: '0',
                                    listStyle: 'none',
                                    color: 'var(--text-secondary)',
                                    lineHeight: '1.8',
                                    flex: 1,
                                    fontSize: '0.9rem'
                                }}>
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '0.6rem'
                                        }}>
                                            <span style={{
                                                width: '5px',
                                                height: '5px',
                                                borderRadius: '50%',
                                                background: service.gradient,
                                                marginRight: '0.8rem',
                                                flexShrink: 0
                                            }}></span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Risk Disclosure */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{
                        marginTop: '3rem',
                        padding: '1.5rem',
                        border: '1px solid rgba(255, 100, 100, 0.3)',
                        background: 'rgba(255, 50, 50, 0.05)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 10px 30px rgba(255, 50, 50, 0.1)'
                    }}
                >
                    <h4 style={{
                        color: '#ff6b6b',
                        marginBottom: '0.8rem',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        ⚠️ Risk Disclosure
                    </h4>
                    <p style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: '1.6'
                    }}>
                        Dhanik provides financial education and advisory support only. We do not offer guaranteed profits, portfolio management services, or investment solicitation. Market participation involves risk and users should consult licensed financial advisors before making investment decisions.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Advisory;
