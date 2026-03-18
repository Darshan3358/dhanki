import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaUsers, FaShieldAlt, FaRocket, FaGlobe } from 'react-icons/fa';
import './Landing.css';

const Hero = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const features = [
        { icon: <FaShieldAlt />, title: 'Secure', color: '#FFD700' },
        { icon: <FaRocket />, title: 'Fast', color: '#00B4D8' },
        { icon: <FaGlobe />, title: 'Global', color: '#D4AF37' }
    ];

    return (
        <section id="hero" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            paddingTop: '80px',
            paddingBottom: '80px'
        }}>
            {/* Animated Background Gradients */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    zIndex: -1
                }}
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(0, 180, 216, 0.15) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    zIndex: -1
                }}
            />

            {/* Floating Particles */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                        width: '4px',
                        height: '4px',
                        background: i % 2 === 0 ? 'var(--primary-gold)' : 'var(--accent-blue)',
                        borderRadius: '50%',
                        boxShadow: `0 0 10px ${i % 2 === 0 ? 'var(--primary-gold)' : 'var(--accent-blue)'}`,
                        zIndex: -1
                    }}
                />
            ))}

            <div className="container">
                <div className="hero-section-grid">
                    {/* Left Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="hero-promo-container">
                            <div className="hero-promo-pill">
                                <span style={{ fontSize: '1.2rem' }}>✨</span>
                                <span style={{
                                    color: 'var(--primary-gold)',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    letterSpacing: '1px'
                                }}>
                                    NEXT-GEN CRYPTO
                                </span>
                            </div>
                        </motion.div>

                        <motion.h1 className="hero-heading" variants={itemVariants}>
                            <span style={{ color: '#FFF' }}>Invest in the</span><br />
                            <span className="text-gradient">Future of Finance</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} style={{
                            fontSize: '1.2rem',
                            color: 'var(--text-secondary)',
                            marginBottom: '2.5rem',
                            lineHeight: '1.8',
                            maxWidth: '550px'
                        }}>
                            Join 50,000+ investors building wealth with Dhanik.
                            Secure, transparent, and designed for everyone.
                        </motion.p>

                        <motion.div
                            className="hero-buttons"
                            variants={itemVariants}
                        >
                            <motion.button
                                whileHover={{
                                    y: -4,
                                    boxShadow: '0 20px 40px rgba(255, 215, 0, 0.4)'
                                }}
                                whileTap={{ scale: 0.96, y: 0 }}
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                    color: '#000',
                                    border: 'none',
                                    padding: '18px 50px',
                                    fontSize: '1.25rem',
                                    fontWeight: '800',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase'
                                }}
                                onClick={() => window.location.href = '/login'}
                            >
                                Get Started
                                <FaRocket style={{ fontSize: '1.2rem' }} />
                            </motion.button>

                            <motion.button
                                whileHover={{
                                    background: 'rgba(255,255,255,0.1)',
                                    borderColor: '#FFF',
                                    scale: 1.05
                                }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: 'transparent',
                                    border: '2px solid rgba(255, 255, 255, 0.4)',
                                    color: '#FFF',
                                    padding: '18px 50px',
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(5px)'
                                }}
                                onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                            >
                                Learn More
                            </motion.button>
                        </motion.div>

                        {/* Feature Pills - Pushed Down for Space */}
                        <motion.div
                            variants={itemVariants}
                            className="hero-feature-pills"
                            style={{ marginTop: '4rem' }}
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -5, background: 'rgba(255,255,255,0.08)' }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        background: 'rgba(15, 18, 24, 0.8)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        padding: '14px 28px',
                                        borderRadius: '50px',
                                        cursor: 'default',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <div style={{
                                        color: feature.color,
                                        fontSize: '1.4rem',
                                        filter: `drop-shadow(0 0 8px ${feature.color})`
                                    }}>
                                        {feature.icon}
                                    </div>
                                    <span style={{
                                        color: 'rgba(255,255,255,0.9)',
                                        fontWeight: '600',
                                        fontSize: '1.1rem',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {feature.title}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Visual - Multiple Animated Cards */}
                    <motion.div
                        className="hero-cards-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        {/* Card 1 - Market Cap */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{
                                y: -10,
                                boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)',
                                borderColor: 'var(--primary-gold)',
                                scale: 1.02
                            }}
                            className="hero-card-inner"
                            style={{
                                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(0, 0, 0, 0.4))',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                        >
                            {/* Animated Glow */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '-50%',
                                    right: '-50%',
                                    width: '200px',
                                    height: '200px',
                                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent)',
                                    filter: 'blur(40px)'
                                }}
                            />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                    style={{
                                        width: '42px',
                                        height: '42px',
                                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1))',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '0.8rem',
                                        fontSize: '1.5rem',
                                        boxShadow: '0 8px 16px rgba(212, 175, 55, 0.2)'
                                    }}
                                >
                                    💰
                                </motion.div>
                                <h3 style={{
                                    fontSize: '1.8rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    marginBottom: '0.2rem'
                                }}>
                                    $10M+
                                </h3>
                                <p style={{
                                    color: 'var(--primary-gold)',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    marginBottom: '0.5rem'
                                }}>
                                    Market Cap
                                </p>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.8rem',
                                    lineHeight: '1.4'
                                }}>
                                    Growing market value with strong investor confidence.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 2 - Active Users */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{
                                y: -10,
                                boxShadow: '0 20px 40px rgba(0, 180, 216, 0.3)',
                                borderColor: 'var(--accent-blue)',
                                scale: 1.02
                            }}
                            className="hero-card-inner"
                            style={{
                                background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.1), rgba(0, 0, 0, 0.4))',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                border: '1px solid rgba(0, 180, 216, 0.2)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                width: '100%',
                                minWidth: '240px'
                            }}
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.5
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '-50%',
                                    left: '-50%',
                                    width: '200px',
                                    height: '200px',
                                    background: 'radial-gradient(circle, rgba(0, 180, 216, 0.3), transparent)',
                                    filter: 'blur(40px)'
                                }}
                            />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        width: '42px',
                                        height: '42px',
                                        background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.3), rgba(0, 180, 216, 0.1))',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '0.8rem',
                                        boxShadow: '0 8px 16px rgba(0, 180, 216, 0.2)'
                                    }}
                                >
                                    <FaUsers style={{ fontSize: '1.3rem', color: 'var(--accent-blue)' }} />
                                </motion.div>
                                <h3 style={{
                                    fontSize: '1.8rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    marginBottom: '0.2rem'
                                }}>
                                    50K+
                                </h3>
                                <p style={{
                                    color: 'var(--accent-blue)',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    marginBottom: '0.5rem'
                                }}>
                                    Active Users
                                </p>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.8rem',
                                    lineHeight: '1.4'
                                }}>
                                    Thriving community actively trading and building wealth.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 3 - Growth */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{
                                y: -10,
                                boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)',
                                borderColor: 'var(--primary-gold)',
                                scale: 1.02
                            }}
                            className="hero-card-inner"
                            style={{
                                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(0, 0, 0, 0.4))',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1
                                }}
                                style={{
                                    position: 'absolute',
                                    bottom: '-50%',
                                    right: '-50%',
                                    width: '200px',
                                    height: '200px',
                                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent)',
                                    filter: 'blur(40px)'
                                }}
                            />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        width: '42px',
                                        height: '42px',
                                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1))',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '0.8rem',
                                        boxShadow: '0 8px 16px rgba(212, 175, 55, 0.2)'
                                    }}
                                >
                                    <FaChartLine style={{ fontSize: '1.3rem', color: 'var(--primary-gold)' }} />
                                </motion.div>
                                <h3 style={{
                                    fontSize: '1.8rem',
                                    fontWeight: '700',
                                    color: 'var(--primary-gold)',
                                    marginBottom: '0.2rem'
                                }}>
                                    +24.5%
                                </h3>
                                <p style={{
                                    color: 'var(--primary-gold)',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    marginBottom: '0.5rem'
                                }}>
                                    24h Growth
                                </p>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.8rem',
                                    lineHeight: '1.4'
                                }}>
                                    Consistent upward momentum with impressive returns.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 4 - Security */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            whileHover={{
                                y: -10,
                                boxShadow: '0 20px 40px rgba(0, 180, 216, 0.3)',
                                borderColor: 'var(--accent-blue)',
                                scale: 1.02
                            }}
                            className="hero-card-inner"
                            style={{
                                background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.1), rgba(0, 0, 0, 0.4))',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                border: '1px solid rgba(0, 180, 216, 0.2)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                width: '100%',
                                minWidth: '240px'
                            }}
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1.5
                                }}
                                style={{
                                    position: 'absolute',
                                    bottom: '-50%',
                                    left: '-50%',
                                    width: '200px',
                                    height: '200px',
                                    background: 'radial-gradient(circle, rgba(0, 180, 216, 0.3), transparent)',
                                    filter: 'blur(40px)'
                                }}
                            />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        width: '42px',
                                        height: '42px',
                                        background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.3), rgba(0, 180, 216, 0.1))',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '0.8rem',
                                        boxShadow: '0 8px 16px rgba(0, 180, 216, 0.2)'
                                    }}
                                >
                                    <FaShieldAlt style={{ fontSize: '1.3rem', color: 'var(--accent-blue)' }} />
                                </motion.div>
                                <h3 style={{
                                    fontSize: '1.8rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    marginBottom: '0.2rem'
                                }}>
                                    100%
                                </h3>
                                <p style={{
                                    color: 'var(--accent-blue)',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    marginBottom: '0.5rem'
                                }}>
                                    Secure
                                </p>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.8rem',
                                    lineHeight: '1.4'
                                }}>
                                    Bank-grade security protecting your investments 24/7.
                                </p>
                            </div>
                        </motion.div>

                        {/* Floating Coin Background */}
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 360]
                            }}
                            transition={{
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                            }}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '300px',
                                height: '300px',
                                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05), transparent)',
                                borderRadius: '50%',
                                zIndex: -1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '8rem',
                                opacity: 0.3
                            }}
                        >
                            ₹
                        </motion.div>
                    </motion.div>
                </div>
            </div >
        </section >
    );
};

export default Hero;
