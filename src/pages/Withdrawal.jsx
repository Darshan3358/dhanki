import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet,
    AlertTriangle,
    History,
    ArrowUpRight,
    Users,
    CreditCard,
    DollarSign,
    Activity,
    Lock,
    Building2,
    Zap,
    CheckCircle2,
    BarChart3,
    TrendingUp,
    ShieldAlert,
    Clock,
    ChevronRight,
    Search,
    RefreshCcw,
    Info
} from 'lucide-react';
import './Withdrawal.css';
import API_BASE_URL from '../apiConfig';
import { BrowserProvider, Contract, formatUnits } from 'ethers';
import { DHANIK_ABI, getAddresses } from '../contracts';

const Withdrawal = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeSource, setActiveSource] = useState('Total Income');
    const [amount, setAmount] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [method, setMethod] = useState('Bank Transfer');
    const [balances, setBalances] = useState({ commission: 0, balance: 0 });
    const [walletAddress, setWalletAddress] = useState(localStorage.getItem('walletAddress') || '');
    const [history, setHistory] = useState([]);

    const fetchContractBalances = async (addr) => {
        try {
            const provider = new BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();
            const { DHANIK } = getAddresses(network.chainId);
            const dhanikContract = new Contract(DHANIK, DHANIK_ABI, provider);
            
            const [commBal, tokenBal] = await Promise.all([
                dhanikContract.commissionBalance ? dhanikContract.commissionBalance(addr) : Promise.resolve(0n),
                dhanikContract.balanceOf(addr)
            ]);

            setBalances({
                commission: formatUnits(commBal, 18),
                balance: formatUnits(tokenBal, 18)
            });
        } catch (err) {
            console.error('Bal error:', err);
        }
    };

    useEffect(() => {
        if (walletAddress) {
            setIsConnected(true);
            fetchContractBalances(walletAddress);
        }
        // Fetch history
        const fetchHistory = async () => {
             const token = localStorage.getItem('token');
             const res = await fetch(`${API_BASE_URL}/api/referral/income-history`, { // or a specific withdrawal history
                 headers: { 'Authorization': `Bearer ${token}` }
             });
             if (res.ok) setHistory(await res.json());
        };
        fetchHistory();
    }, [walletAddress]);

    const stats = [
        { title: 'Level Income', subtitle: 'On-chain Commission', value: `DH ${parseFloat(balances.commission).toLocaleString()}`, icon: <Users size={18} />, color: '#00E5FF', progress: 30 },
        { title: 'Token Balance', subtitle: 'Main Wallet', value: `DH ${parseFloat(balances.balance).toLocaleString()}`, icon: <Wallet size={18} />, color: '#FFD200', progress: 50 },
        { title: 'Total Withdrawn', subtitle: 'Lifetime', value: '₹0', icon: <CheckCircle2 size={18} />, color: '#8B5CF6', progress: 0 },
    ];

    const historyData = [
        { id: 1, source: 'Total Income', amount: 'DH 500.00', date: '2026-02-15', method: 'Bank Transfer', status: 'Completed' },
        { id: 2, source: 'Stake ROI', amount: 'DH 1,200.00', date: '2026-02-10', method: 'MetaMask', status: 'Pending' },
        { id: 3, source: 'Level Income', amount: '₹2,500.00', date: '2026-02-05', method: 'Bank Transfer', status: 'Completed' },
    ];

    const handleConnect = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsConnected(true);
            setIsLoading(false);
        }, 1500);
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/token/withdrawal`, { // Assuming this endpoint exists
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount,
                    source: activeSource,
                    method,
                    details: 'Manual withdrawal request'
                })
            });

            if (res.ok) {
                setShowSuccess(true);
                setAmount('');
                setTimeout(() => setShowSuccess(false), 5000);
            } else {
                alert('Withdrawal request failed');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="withdrawal-container">
            <motion.div
                className="withdrawal-header"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div>
                    <h1>Withdrawal <span className="gold-glow-text">Center</span></h1>
                    <p className="header-welcome">Welcome! Manage your earnings and withdraw funds securely to your preferred destination.</p>
                </div>
                {!isConnected ? (
                    <button className="btn-primary shimmer-btn connect-btn" onClick={handleConnect} disabled={isLoading}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Wallet size={18} />
                            {isLoading ? 'Connecting...' : 'Connect Wallet'}
                        </div>
                    </button>
                ) : (
                    <div className="connected-status">
                        <div className="pulse-dot active"></div>
                        <span>MetaMask Connected: 0x7d...f2a</span>
                    </div>
                )}
            </motion.div>

            <AnimatePresence>
                {!isConnected && (
                    <motion.div
                        className="warning-alert"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, margin: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="warning-icon"><AlertTriangle size={24} /></div>
                        <div className="warning-text">
                            <h4>Wallet Connection Required</h4>
                            <p>Please connect your crypto wallet to verify your identity and view your real-time withdrawal balances.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="withdrawal-stats-grid">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        className="withdraw-stat-card"
                        style={{ '--glow-color': stat.color }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="stat-card-header">
                            <div>
                                <h3>{stat.title}</h3>
                                <p>{stat.subtitle}</p>
                            </div>
                            <div className="stat-card-icon" style={{ color: stat.color }}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="withdraw-stat-value">{stat.value}</div>
                        <div className="stat-progress-bar">
                            <motion.div
                                className="stat-progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.progress}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                style={{ background: stat.color }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="withdrawal-main-grid">
                <motion.div
                    className="request-card"
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="card-header-flex">
                        <h2 className="section-title"><ArrowUpRight size={22} className="gold-glow-text" /> Create Request</h2>
                        <div className="fee-info-tag">Fee: 5%</div>
                    </div>

                    <form onSubmit={handleWithdraw}>
                        <div className="form-group-custom">
                            <label>Select Fund Source</label>
                            <div className="source-selection">
                                <div
                                    className={`source-card ${activeSource === 'Total Income' ? 'active' : ''}`}
                                    onClick={() => setActiveSource('Total Income')}
                                >
                                    <div className="source-icon-box" style={{ background: 'rgba(255, 210, 0, 0.1)', color: '#FFD200' }}>
                                        <Zap size={20} />
                                    </div>
                                    <div className="source-details">
                                        <h4>Total Income</h4>
                                        <p>{isConnected ? 'DH 1,250.00' : 'DH 0.00'}</p>
                                    </div>
                                    {activeSource === 'Total Income' && <CheckCircle2 size={16} className="active-check" />}
                                </div>
                                <div
                                    className={`source-card ${activeSource === 'SOS' ? 'active' : ''}`}
                                    onClick={() => setActiveSource('SOS')}
                                >
                                    <div className="source-icon-box" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#EC4899' }}>
                                        <ShieldAlert size={20} />
                                    </div>
                                    <div className="source-details">
                                        <h4>SOS Fund</h4>
                                        <p>{isConnected ? 'DH 500.00' : 'DH 0.00'}</p>
                                    </div>
                                    {activeSource === 'SOS' && <CheckCircle2 size={16} className="active-check" />}
                                </div>
                            </div>
                        </div>

                        <div className="form-group-custom">
                            <label>
                                <span>Amount to Withdraw (DH)</span>
                                <span className="max-available">MAX: {isConnected ? '1250' : '0'}</span>
                            </label>
                            <div className="input-container-premium">
                                <DollarSign size={18} className="input-icon-left" />
                                <input
                                    type="number"
                                    className="withdraw-input-prime"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={!isConnected}
                                />
                                <button type="button" className="max-btn-prime" onClick={() => setAmount(isConnected ? '1250' : '')}>MAX</button>
                            </div>
                            <div className="input-footer-info">
                                <span>Min: DH 100</span>
                                <span>Est. Fee: DH {(parseFloat(amount || 0) * 0.05).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="form-group-custom">
                            <label>Withdrawal Method</label>
                            <div className="method-grid">
                                <button
                                    type="button"
                                    className={`method-btn-prime ${method === 'Bank Transfer' ? 'selected' : ''}`}
                                    onClick={() => setMethod('Bank Transfer')}
                                >
                                    <Building2 size={18} />
                                    Bank Transfer
                                </button>
                                <button
                                    type="button"
                                    className={`method-btn-prime ${method === 'MetaMask' ? 'selected' : ''}`}
                                    onClick={() => setMethod('MetaMask')}
                                >
                                    <Wallet size={18} />
                                    MetaMask (Crypto)
                                </button>
                            </div>
                        </div>

                        {method === 'Bank Transfer' && (
                            <motion.div
                                className="method-details-area"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="form-group-custom">
                                    <label>Account / UPI Details</label>
                                    <input type="text" className="withdraw-input-prime small" placeholder="Enter Account Number or UPI ID" />
                                </div>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary shimmer-btn submit-withdraw-btn"
                            disabled={!isConnected || isLoading || !amount}
                        >
                            {isLoading ? 'Processing Transaction...' : 'Confirm Withdrawal Request'}
                        </button>
                    </form>

                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                className="success-overlay"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="success-icon-container">
                                    <CheckCircle2 size={64} color="#00E5FF" />
                                </div>
                                <h3>Request Submitted!</h3>
                                <p>Your withdrawal request is being processed. Expected arrival: 24-48 hours.</p>
                                <button className="btn-secondary" onClick={() => setShowSuccess(false)} style={{ marginTop: '1.5rem' }}>View History</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div
                    className="history-card"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.0, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="history-header-flex">
                        <h2 className="section-title"><History size={22} className="gold-glow-text" /> History</h2>
                        <button className="refresh-btn-simple"><RefreshCcw size={16} /></button>
                    </div>

                    <div className="table-wrapper-withdraw">
                        {isConnected ? (
                            <table className="withdraw-history-table">
                                <thead>
                                    <tr>
                                        <th>Source</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>TX Hash</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyData.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="source-td">
                                                    <span className="source-name">{item.source}</span>
                                                    <span className="source-date">{item.date}</span>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: '700' }}>{item.amount}</td>
                                            <td className="method-td">{item.method}</td>
                                            <td className="method-td">
                                                {item.txHash ? (
                                                    <code title={item.txHash} style={{ fontSize: '0.75rem', opacity: 0.8, color: 'var(--admin-gold)' }}>
                                                        {item.txHash.substring(0, 8)}...
                                                    </code>
                                                ) : '—'}
                                            </td>
                                            <td>
                                                <span className={`status-pill ${item.status?.toLowerCase()}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="tx-detail-btn"><Info size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-history-withdraw">
                                <div className="empty-icon-box">
                                    <DollarSign size={40} className="gold-glow-text" />
                                </div>
                                <h3>No History Found</h3>
                                <p>Connect your wallet to see past transactions</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="withdrawal-footer-grid">
                <motion.div className="footer-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <div className="footer-stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="footer-stat-info">
                        <h4>Total Withdrawn</h4>
                        <p>{isConnected ? '₹25,800' : '₹0'}</p>
                    </div>
                </motion.div>

                <motion.div className="footer-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                    <div className="footer-stat-icon" style={{ background: 'rgba(255, 210, 0, 0.1)', color: '#FFD200' }}>
                        <Clock size={24} />
                    </div>
                    <div className="footer-stat-info">
                        <h4>Processing</h4>
                        <p>{isConnected ? '₹1,200' : '₹0'}</p>
                    </div>
                </motion.div>

                <motion.div className="footer-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                    <div className="footer-stat-icon" style={{ background: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF' }}>
                        <Zap size={24} />
                    </div>
                    <div className="footer-stat-info">
                        <h4>System Fee</h4>
                        <p>5% Native</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Withdrawal;
