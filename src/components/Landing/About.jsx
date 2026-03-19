import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaMicrochip, FaGlobe, FaNetworkWired, FaFingerprint, FaWaveSquare } from 'react-icons/fa';
import './Landing.css';

const AIVisual = () => {
    // Simulated random data for the "Live" feel
    const [hash, setHash] = useState('0x89...2B9A');
    const [block, setBlock] = useState(8849201);

    useEffect(() => {
        const interval = setInterval(() => {
            setBlock(b => b + 1);
            setHash('0x' + Math.random().toString(16).substr(2, 8).toUpperCase() + '...' + Math.random().toString(16).substr(2, 4).toUpperCase());
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '380px',
            background: 'linear-gradient(180deg, rgba(8, 8, 12, 0.9) 0%, rgba(15, 15, 25, 0.95) 100%)',
            borderRadius: '30px',
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(0, 180, 216, 0.05)'
        }}>
            {/* 1. Cyber Grid Floor (Perspective) */}
            <div style={{
                position: 'absolute',
                inset: '-50%',
                width: '200%',
                height: '200%',
                backgroundImage: `
                    linear-gradient(rgba(0, 180, 216, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 180, 216, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                opacity: 0.2,
                animation: 'gridMove 20s linear infinite',
            }}>
                <style>{`
                    @keyframes gridMove {
                        0% { transform: perspective(500px) rotateX(60deg) translateY(0) translateZ(-200px); }
                        100% { transform: perspective(500px) rotateX(60deg) translateY(40px) translateZ(-200px); }
                    }
                `}</style>
            </div>

            {/* 2. Ambient Glows */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-20%',
                width: '60%',
                height: '60%',
                background: 'radial-gradient(circle, rgba(157, 78, 221, 0.15), transparent 70%)',
                filter: 'blur(60px)',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                right: '-20%',
                width: '60%',
                height: '60%',
                background: 'radial-gradient(circle, rgba(0, 180, 216, 0.15), transparent 70%)',
                filter: 'blur(60px)',
                zIndex: 0
            }} />

            {/* 3. Central HUD Interface */}
            <div style={{ 
                position: 'relative', 
                width: 'clamp(260px, 90vw, 320px)', 
                height: 'clamp(260px, 90vw, 320px)', 
                zIndex: 2 
            }}>

                {/* Outer Rotating Dash Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        border: '2px dashed rgba(0, 180, 216, 0.2)',
                        borderRadius: '50%',
                    }}
                />

                {/* Inner Counter-Rotating Ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        inset: '20px',
                        borderTop: '2px solid rgba(157, 78, 221, 0.5)',
                        borderBottom: '2px solid rgba(0, 180, 216, 0.5)',
                        borderLeft: '2px solid transparent',
                        borderRight: '2px solid transparent',
                        borderRadius: '50%',
                    }}
                />

                {/* Scanning Radar Effect */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        inset: '10px',
                        borderRadius: '50%',
                        background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0, 180, 216, 0.15) 30deg, transparent 60deg)',
                    }}
                />

                {/* Core Orb */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(5, 5, 10, 0.8) 0%, rgba(0,0,0,0.9) 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 0 30px rgba(0, 180, 216, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                }}>
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <FaFingerprint size={40} color="#00B4D8" />
                    </motion.div>
                    <div style={{
                        marginTop: '10px',
                        fontSize: '0.6rem',
                        color: 'rgba(255,255,255,0.5)',
                        letterSpacing: '2px'
                    }}>
                        SCANNING
                    </div>
                </div>

                {/* Orbiting Particles */}
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6 + i, repeat: Infinity, ease: "linear", delay: i * 2 }}
                        style={{
                            position: 'absolute',
                            inset: `${-10 - i * 15}px`,
                            pointerEvents: 'none'
                        }}
                    >
                        <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: i === 0 ? '#00B4D8' : '#9D4EDD',
                            boxShadow: `0 0 10px ${i === 0 ? '#00B4D8' : '#9D4EDD'}`,
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) translateY(clamp(-160px, -40vw, -120px))`
                        }} />
                    </motion.div>
                ))}
            </div>

            {/* 4. Top Left Live Badge */}
            <div style={{
                position: 'absolute',
                top: '25px',
                left: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                padding: '10px 20px',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ position: 'relative', width: '12px', height: '12px' }}>
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: '#FF0000',
                            borderRadius: '50%'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: '2px',
                        background: '#FF0000',
                        borderRadius: '50%'
                    }} />
                </div>
                <span style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: '#fff',
                    letterSpacing: '1px'
                }}>
                    LIVE SYSTEM
                </span>
            </div>

            {/* 5. Bottom Right: Tech Data Panel */}
            <div style={{
                position: 'absolute',
                bottom: '30px',
                right: '30px',
                textAlign: 'right',
                zIndex: 3
            }}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={block}
                        initial={{ opacity: 0.8, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            fontFamily: '"Courier New", Courier, monospace',
                            fontSize: '0.8rem',
                            color: '#00B4D8',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            background: 'rgba(0,0,0,0.4)',
                            padding: '12px',
                            borderRadius: '8px',
                            borderLeft: '2px solid #00B4D8'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                            <span style={{ opacity: 0.7 }}>BLOCK</span>
                            <span style={{ fontWeight: 'bold' }}>#{block}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                            <span style={{ opacity: 0.7 }}>HASH</span>
                            <span style={{ fontWeight: 'bold' }}>{hash}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                            <span style={{ opacity: 0.7 }}>STATUS</span>
                            <span style={{ color: '#00FF9D', fontWeight: 'bold' }}>OPTIMAL</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 6. Stylish Play Button */}
            <motion.div
                whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '30px',
                    width: '60px',
                    height: '60px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                    zIndex: 10
                }}
            >
                <div style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.1)',
                    animation: 'pulseRing 2s infinite'
                }}>
                    <style>{`
                        @keyframes pulseRing {
                            0% { transform: scale(1); opacity: 0.5; }
                            100% { transform: scale(1.4); opacity: 0; }
                        }
                    `}</style>
                </div>
                <FaPlay size={20} color="#fff" style={{ marginLeft: '4px' }} />
            </motion.div>
        </div>
    );
};

const About = () => {
    return (
        <section id="about" className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background Gradient */}
            <div style={{
                position: 'absolute',
                top: '40%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(157, 78, 221, 0.08) 0%, transparent 70%)',
                filter: 'blur(100px)',
                zIndex: -1
            }}></div>

            <div className="container">
                <div className="about-grid">
                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>About Us</h2>
                        <h3 style={{
                            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                            marginBottom: '1.5rem',
                            lineHeight: '1.2',
                            background: 'linear-gradient(to right, #fff, #a5a5a5)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Building the Future of <br />
                            <span className="text-gradient">Decentralized Finance</span>
                        </h3>

                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '2rem', fontSize: '1.05rem' }}>
                            Dhanik  is a next-generation fintech and Web3 ecosystem designed to democratize access to digital wealth. We bridge the gap between complex blockchain technology and everyday financial goals.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {[
                                { title: 'Our Mission', desc: 'Making crypto safe, simple, and rewarding for everyone.', icon: <FaGlobe /> },
                                { title: 'Our Vision', desc: 'A world where financial freedom is accessible to all.', icon: <FaNetworkWired /> },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ x: 10 }}
                                    style={{
                                        display: 'flex',
                                        gap: '1.5rem',
                                        padding: '1.5rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '16px'
                                    }}
                                >
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '12px',
                                        background: 'rgba(0, 180, 216, 0.1)',
                                        color: '#00B4D8',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        flexShrink: 0
                                    }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: '#fff' }}>{item.title}</h4>
                                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <AIVisual />

                        {/* Decorative Caption */}
                        <div style={{
                            marginTop: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 1rem'
                        }}>
                            <p style={{
                                fontSize: '0.9rem',
                                color: 'rgba(255,255,255,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span style={{ width: '6px', height: '6px', background: '#00B4D8', borderRadius: '50%' }}></span>
                                Real-time Ecosystem Monitoring
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
