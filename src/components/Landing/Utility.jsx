import React from 'react';
import { motion } from 'framer-motion';
import { FaExchangeAlt, FaAward, FaChartLine, FaVoteYea, FaCreditCard, FaArrowRight } from 'react-icons/fa';
import './Landing.css';

const utilities = [
    {
        icon: <FaExchangeAlt />,
        title: "Peer-to-peer Payments",
        desc: "Send and receive funds instantly anywhere in the world with near-zero transaction fees. Secure, fast, and borderless.",
        color: "from-yellow-400 to-yellow-600"
    },
    {
        icon: <FaAward />,
        title: "Rewards & Internships",
        desc: "Earn Dhanik by completing financial literacy courses and participating in our exclusive internship programs.",
        color: "from-blue-400 to-blue-600"
    },
    {
        icon: <FaChartLine />,
        title: "Staking Income",
        desc: "Lock your tokens in our secure staking protocol to support the network and earn attractive annual percentage yields (APY).",
        color: "from-green-400 to-green-600"
    },
    {
        icon: <FaVoteYea />,
        title: "Governance Voting",
        desc: "Have a real say in the platform's future. Use your coins to vote on key proposals and protocol upgrades.",
        color: "from-purple-400 to-purple-600"
    },
    {
        icon: <FaCreditCard />,
        title: "Merchant Payments",
        desc: "Shop with your crypto. We are partnering with major retailers to enable direct purchases using Dhanik Coin.",
        color: "from-red-400 to-red-600"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const Utility = () => {
    return (
        <section id="utility" className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background Elements */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '-10%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
                filter: 'blur(80px)',
                zIndex: -1
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '-10%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(0, 180, 216, 0.05) 0%, transparent 70%)',
                filter: 'blur(80px)',
                zIndex: -1
            }}></div>

            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <h2 className="section-title">Token Utility</h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        maxWidth: '600px',
                        margin: '1rem auto',
                        fontSize: '1.1rem'
                    }}>
                        Discover the power of Dhanik. More than just a currency,
                        it's your key to a comprehensive financial ecosystem.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="features-grid"
                >
                    {utilities.map((util, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ y: -8 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* Visual/Image Placeholder Section */}
                            <div style={{
                                height: '140px',
                                background: `linear-gradient(135deg, rgba(20, 20, 20, 1), rgba(40, 40, 40, 1))`,
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                {/* Animated Background Glow */}
                                <motion.div
                                    animate={{
                                        opacity: [0.3, 0.6, 0.3],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        background: `radial-gradient(circle at center, ${index % 2 === 0 ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 180, 216, 0.2)'}, transparent 70%)`,
                                    }}
                                />

                                {/* Icon as Image Centerpiece */}
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    style={{
                                        fontSize: '3rem',
                                        color: index % 2 === 0 ? 'var(--primary-gold)' : 'var(--accent-blue)',
                                        zIndex: 1,
                                        filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.4))'
                                    }}
                                >
                                    {util.icon}
                                </motion.div>
                            </div>

                            {/* Content Section */}
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{
                                    fontSize: '1.3rem',
                                    fontWeight: '700',
                                    marginBottom: '0.8rem',
                                    color: '#fff'
                                }}>
                                    {util.title}
                                </h3>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    lineHeight: '1.5',
                                    marginBottom: '1rem',
                                    fontSize: '0.95rem',
                                    flex: 1
                                }}>
                                    {util.desc}
                                </p>
                                <motion.div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: index % 2 === 0 ? 'var(--primary-gold)' : 'var(--accent-blue)',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                    whileHover={{ x: 5 }}
                                >
                                    Learn more <FaArrowRight style={{ fontSize: '0.8rem' }} />
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Utility;
