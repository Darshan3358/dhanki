import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    History,
    Wallet,
    PlusCircle,
    RefreshCcw,
    Clock,
    ShieldCheck,
    TrendingUp,
    Lock,
    CheckCircle2,
    ChevronDown,
    Zap,
    Info
} from 'lucide-react';
import './StakeROI.css';

const StakeROI = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [stakeAmount, setStakeAmount] = useState('');
    const [lockPeriod, setLockPeriod] = useState(30);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [liveROI, setLiveROI] = useState(3150.0000);

    // Live ROI Ticker simulation
    useEffect(() => {
        let interval;
        if (isConnected) {
            interval = setInterval(() => {
                setLiveROI(prev => prev + (Math.random() * 0.0001));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isConnected]);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1.0, staggerChildren: 0.15, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    const stakingOptions = [
        { days: 30, roi: 5, label: '30 Days', multiplier: 0.05 },
        { days: 90, roi: 18, label: '90 Days', multiplier: 0.18 },
        { days: 180, roi: 45, label: '180 Days', multiplier: 0.45 },
        { days: 365, roi: 100, label: '365 Days', multiplier: 1.0 },
    ];

    const historyData = [
        { id: 1, amount: '5,000 DH', startDate: '2026-01-15', unlockDate: '2026-02-14', period: '30 Days', status: 'Completed', roi: '250 DH' },
        { id: 2, amount: '12,500 DH', startDate: '2026-02-01', unlockDate: '2026-05-01', period: '90 Days', status: 'Active', roi: '2,250 DH' },
        { id: 3, amount: '2,000 DH', startDate: '2025-12-10', unlockDate: '2026-06-10', period: '180 Days', status: 'Active', roi: '900 DH' },
    ];

    const handleConnect = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsConnected(true);
            setIsLoading(false);
        }, 1500);
    };

    const handleStake = (e) => {
        e.preventDefault();
        if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setShowSuccess(true);
            setStakeAmount('');
            setTimeout(() => setShowSuccess(false), 5000);
        }, 2000);
    };

    const calculateROI = () => {
        const amount = parseFloat(stakeAmount) || 0;
        const selectedOption = stakingOptions.find(opt => opt.days === lockPeriod);
        if (!selectedOption) return 0;
        return (amount * selectedOption.multiplier).toFixed(2);
    };

    return (
        <div className="stake-roi-container">
            <motion.div
                className="stake-header"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div>
                    <h1>Stake <span className="gold-glow-text">ROI</span></h1>
                    <p>Stake your tokens to earn high ROI rewards and boost your earnings.</p>
                </div>
                {!isConnected && (
                    <button className="btn-primary shimmer-btn connect-header-btn" onClick={handleConnect}>
                        <Wallet size={18} /> Connect Wallet
                    </button>
                )}
            </motion.div>

            <motion.div
                className="stake-stats-row"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="stake-stat-card" variants={itemVariants}>
                    <div className="stat-icon-small"><Lock size={16} /></div>
                    <div>
                        <span className="stat-label">Total Staked</span>
                        <div className="stat-value">{isConnected ? '19,500.00' : '0.00'} <span className="gold-glow-text">DH</span></div>
                    </div>
                </motion.div>

                <motion.div className="stake-stat-card" variants={itemVariants}>
                    <div className="stat-icon-small" style={{ color: '#00E5FF', background: 'rgba(0, 229, 255, 0.1)' }}><TrendingUp size={16} /></div>
                    <div>
                        <span className="stat-label">Pending ROI</span>
                        <div className="stat-value" style={{ color: '#00E5FF' }}>
                            {isConnected ? liveROI.toFixed(4) : '0.0000'} <span className="gold-glow-text">DH</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div className="stake-stat-card" variants={itemVariants}>
                    <div className="status-badge-container">
                        <span className="stat-label">System Status</span>
                        <div className={`status-badge ${isConnected ? 'active' : ''}`}>
                            <div className="pulse-dot" style={{
                                background: isConnected ? '#00E5FF' : '#9CA3AF',
                                boxShadow: isConnected ? '0 0 10px #00E5FF' : 'none',
                                animation: isConnected ? 'pulse 2s infinite' : 'none'
                            }}></div>
                            {isConnected ? 'Network Live' : 'Not Linked'}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <div className="staking-grid">
                <motion.div
                    className="new-stake-card"
                    initial={{ opacity: 0, scale: 0.98, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    {!isConnected ? (
                        <div className="connect-wallet-view">
                            <div className="card-icon" style={{ color: '#FFD200', marginBottom: '1.5rem' }}>
                                <motion.div
                                    animate={isLoading ? { rotate: 360 } : {}}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    <PlusCircle size={64} />
                                </motion.div>
                            </div>
                            <h2>Start Staking</h2>
                            <p className="connect-prompt">Connect your wallet to start earning up to 100% annual ROI rewards.</p>
                            <button
                                className="btn-primary shimmer-btn"
                                onClick={handleConnect}
                                disabled={isLoading}
                                style={{ padding: '16px 40px', fontSize: '1.1rem' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Wallet size={20} />
                                    {isLoading ? 'Connecting...' : 'Connect Wallet'}
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="staking-form-view">
                            <div className="form-header">
                                <PlusCircle size={24} className="gold-glow-text" />
                                <h3>New Stake Request</h3>
                            </div>

                            <form onSubmit={handleStake}>
                                <div className="form-group-custom">
                                    <label>Amount to Stake (DH)</label>
                                    <div className="input-with-max">
                                        <input
                                            type="number"
                                            placeholder="Min 100 DH"
                                            value={stakeAmount}
                                            onChange={(e) => setStakeAmount(e.target.value)}
                                            required
                                        />
                                        <button type="button" onClick={() => setStakeAmount('45280')}>MAX</button>
                                    </div>
                                    <span className="balance-info">Available Balance: 45,280 DH</span>
                                </div>

                                <div className="form-group-custom">
                                    <label>Select Lock Period</label>
                                    <div className="period-grid">
                                        {stakingOptions.map((opt) => (
                                            <div
                                                key={opt.days}
                                                className={`period-item ${lockPeriod === opt.days ? 'selected' : ''}`}
                                                onClick={() => setLockPeriod(opt.days)}
                                            >
                                                <span className="period-days">{opt.label}</span>
                                                <span className="period-roi">{opt.roi}% ROI</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="roi-calculator">
                                    <div className="calc-row">
                                        <span>Estimated Reward:</span>
                                        <span className="gold-glow-text" style={{ fontWeight: 'bold' }}>{calculateROI()} DH</span>
                                    </div>
                                    <div className="calc-row">
                                        <span>Lock Ends:</span>
                                        <span>{new Date(Date.now() + lockPeriod * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary shimmer-btn stake-submit-btn"
                                    disabled={isLoading || !stakeAmount}
                                >
                                    {isLoading ? 'Processing...' : 'Confirm External Stake'}
                                </button>
                            </form>

                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div
                                        className="success-overlay"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                    >
                                        <CheckCircle2 size={48} color="#00E5FF" />
                                        <h4>Stake Successful!</h4>
                                        <p>Your tokens have been locked successfully.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    className="history-card"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="history-header">
                        <h3><Clock size={20} className="gold-glow-text" /> Staking History</h3>
                        <button className="refresh-btn" onClick={() => { }}>
                            <RefreshCcw size={18} />
                        </button>
                    </div>

                    <div className="staking-table-wrapper">
                        {isConnected ? (
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Amount</th>
                                        <th>Term</th>
                                        <th>Est. ROI</th>
                                        <th>Unlock Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyData.map((item) => (
                                        <tr key={item.id}>
                                            <td style={{ fontWeight: '600' }}>{item.amount}</td>
                                            <td>{item.period}</td>
                                            <td className="gold-glow-text">{item.roi}</td>
                                            <td>{item.unlockDate}</td>
                                            <td>
                                                <span className={`status-pill ${item.status.toLowerCase()}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-history">
                                <div style={{ opacity: 0.1, marginBottom: '1rem' }}>
                                    <History size={60} />
                                </div>
                                <p>No staking history found</p>
                                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Connect wallet to view your stakes</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Information Section */}
            <div className="info-grid-row">
                <motion.div
                    className="info-box"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="info-icon" style={{ color: '#FFD200' }}>
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h4>Secure Staking</h4>
                        <p>Tokens are locked in a secure smart contract until the term ends.</p>
                    </div>
                </motion.div>

                <motion.div
                    className="info-box"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="info-icon" style={{ color: '#00E5FF' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h4>Dynamic Rewards</h4>
                        <p>ROI is calculated based on the lock period chosen at the start.</p>
                    </div>
                </motion.div>

                <motion.div
                    className="info-box"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="info-icon" style={{ color: '#FFD200' }}>
                        <Lock size={24} />
                    </div>
                    <div>
                        <h4>Immutable Terms</h4>
                        <p>Once staked, tokens cannot be withdrawn before the unlock date.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default StakeROI;
