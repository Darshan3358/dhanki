import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    History,
    Search,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCcw,
    DollarSign,
    CheckCircle2,
    Clock,
    ExternalLink,
    Info
} from 'lucide-react';
import './Transactions.css';

const Transactions = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const tabs = ['All', 'Withdrawal', 'Investment', 'Income'];

    const transactionData = [
        { id: 'TX-99821', type: 'Investment', desc: 'Package Purchase Phase 3', amount: '₹15,000.00', date: '2026-02-18 14:20', status: 'Success', hash: '0x7d...f2a', color: '#00E5FF' },
        { id: 'TX-99820', type: 'Income', desc: 'Daily ROI Payout', amount: 'DH 45.20', date: '2026-02-18 00:05', status: 'Success', hash: '0x3a...e1b', color: '#FFD200' },
        { id: 'TX-99819', type: 'Withdrawal', desc: 'MetaMask Transfer', amount: '₹2,500.00', date: '2026-02-17 19:45', status: 'Pending', hash: '0x9c...a3d', color: '#EC4899' },
        { id: 'TX-99818', type: 'Income', desc: 'Sponsor Bonus (Referral)', amount: 'DH 120.00', date: '2026-02-17 11:30', status: 'Success', hash: '0x1f...c6e', color: '#FFD200' },
        { id: 'TX-99817', type: 'Investment', desc: 'Package Purchase Phase 3', amount: '₹5,000.00', date: '2026-02-16 09:15', status: 'Success', hash: '0x5b...d8a', color: '#00E5FF' },
        { id: 'TX-99816', type: 'Withdrawal', desc: 'MetaMask Transfer', amount: '₹1,200.00', date: '2026-02-15 22:10', status: 'Failed', hash: '0x2e...b4f', color: '#EF4444' },
    ];

    const filteredTransactions = transactionData.filter(tx => {
        const matchesTab = activeTab === 'All' || tx.type === activeTab;
        const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.desc.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="transactions-container">
            <motion.div
                className="transactions-header"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div>
                    <h1>Transaction <span className="gold-glow-text">History</span></h1>
                    <p>View and track all your financial activities with real-time status updates.</p>
                </div>
                <button className="refresh-btn-main shimmer-btn">
                    <RefreshCcw size={18} /> Refresh History
                </button>
            </motion.div>

            <motion.div
                className="filter-bar"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="filter-tabs">
                    {tabs.map(tab => (
                        <div
                            key={tab}
                            className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                <div className="search-container">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search Transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </motion.div>

            <motion.div
                className="transactions-table-card"
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Hash / ID</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {filteredTransactions.map((tx, idx) => (
                                    <motion.tr
                                        key={tx.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <td>
                                            <div className="type-badge" style={{ borderColor: tx.color, color: tx.color }}>
                                                {tx.type === 'Investment' && <ArrowDownLeft size={14} />}
                                                {tx.type === 'Withdrawal' && <ArrowUpRight size={14} />}
                                                {tx.type === 'Income' && <DollarSign size={14} />}
                                                {tx.type}
                                            </div>
                                        </td>
                                        <td className="tx-desc">{tx.desc}</td>
                                        <td className="tx-amount">{tx.amount}</td>
                                        <td className="tx-date">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Clock size={14} opacity={0.5} />
                                                {tx.date}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-pill ${tx.status.toLowerCase()}`}>
                                                {tx.status === 'Success' && <CheckCircle2 size={12} />}
                                                {tx.status === 'Pending' && <Clock size={12} />}
                                                {tx.status === 'Failed' && <Info size={12} />}
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="tx-hash">
                                            <code>{tx.hash}</code>
                                            <ExternalLink size={12} className="hash-link" />
                                        </td>
                                        <td>
                                            <button className="view-detail-btn">Details</button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {filteredTransactions.length === 0 && (
                        <div className="no-transactions">
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.02)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                color: 'rgba(255, 210, 0, 0.2)'
                            }}>
                                <History size={40} />
                            </div>
                            <h3>No Transactions Found</h3>
                            <p>No transactions found matching your criteria at this moment.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Transactions;
