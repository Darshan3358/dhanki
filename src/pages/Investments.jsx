import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Upload,
    Download,
    FileText,
    AlertCircle,
    ExternalLink,
    Activity
} from 'lucide-react';
import './Investments.css';

const Investments = () => {
    const [amount, setAmount] = useState('');
    const [txId, setTxId] = useState('');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [sponsorId, setSponsorId] = useState(user?.referredBy || 'System');

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1.0, staggerChildren: 0.15, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const investmentHistory = [];

    return (
        <div className="investments-container">
            <motion.div
                className="page-header"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div>
                    <h1>Investment <span className="gold-glow-text">Plans</span></h1>
                    <p>Submit your investment request and start earning passive ROI.</p>
                </div>
                <div className="active-scheme-tag">
                    <Activity size={16} />
                    <span>Phase 3 Live</span>
                </div>
            </motion.div>

            <motion.div
                className="investment-card"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="card-header">
                    <h2 className="card-title">Investment Request</h2>
                    <p className="card-subtitle">Fill the form below to make an investment</p>
                </div>

                <form className="investment-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-grid">
                        <motion.div className="form-group" variants={itemVariants}>
                            <label>Investment Amount (₹)</label>
                            <div className="input-wrapper">
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="Enter investment amount (Min: ₹500)"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <p className="input-helper">Minimum investment amount: ₹500</p>
                        </motion.div>

                        <motion.div className="form-group" variants={itemVariants}>
                            <label>Transaction ID</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Enter your transaction ID"
                                    value={txId}
                                    onChange={(e) => setTxId(e.target.value)}
                                />
                            </div>
                        </motion.div>

                        <motion.div className="form-group" variants={itemVariants}>
                            <label>Payment Slip</label>
                            <div className="file-upload-wrapper">
                                <input type="file" id="file-upload" className="file-input-custom" />
                                <label htmlFor="file-upload" className="file-label">
                                    <Upload size={18} className="gold-glow-text" />
                                    <span>Choose File (No file chosen)</span>
                                </label>
                            </div>
                            <p className="input-helper">Upload your payment receipt/screenshot</p>
                        </motion.div>

                        <motion.div className="form-group" variants={itemVariants}>
                            <label>Sponsor ID</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    className="input-field"
                                    style={{ background: 'rgba(255,255,255,0.01)', cursor: 'not-allowed' }}
                                    value={sponsorId}
                                    readOnly
                                />
                            </div>
                            <p className="input-helper">Auto-detected from your referrer</p>
                        </motion.div>
                    </div>

                    <motion.div className="submit-container" variants={itemVariants}>
                        <button className="btn-primary shimmer-btn submit-btn">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                Submit Investment Request
                                <ArrowRight size={20} />
                            </div>
                        </button>
                        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            <AlertCircle size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                            Note: Your investment request will be processed within 24 hours after verification
                        </p>
                    </motion.div>
                </form>
            </motion.div>

            {/* History Section */}
            <motion.section
                className="history-section"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="history-header">
                    <h2>Investment <span className="gold-glow-text">History</span></h2>
                    <div className="history-actions">
                        <motion.button
                            className="export-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Download size={18} />
                            Export CSV
                        </motion.button>
                    </div>
                </div>

                <div className="table-container">
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Amount</th>
                                    <th>Purchase Date</th>
                                    <th>Transaction ID</th>
                                    <th>Status</th>
                                    <th>Approved Date</th>
                                    <th>Invoice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {investmentHistory.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={{ fontWeight: '700' }}>{item.amount}</td>
                                        <td>{item.date}</td>
                                        <td><code>{item.txId}</code></td>
                                        <td>
                                            <span className={`status-pill ${item.status.toLowerCase()}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{item.approvedDate}</td>
                                        <td>
                                            <button className="action-btn-icon"><ExternalLink size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {investmentHistory.length === 0 && (
                        <motion.div
                            className="empty-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <div className="empty-icon-wrapper">
                                <FileText size={42} className="gold-glow-text" style={{ opacity: 0.5 }} />
                            </div>
                            <h3>No Investment History</h3>
                            <p>Make an investment above to start your ROI journey today!</p>
                        </motion.div>
                    )}
                </div>
            </motion.section>
        </div>
    );
};

export default Investments;
