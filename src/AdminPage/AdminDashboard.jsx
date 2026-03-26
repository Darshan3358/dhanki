import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    ReceiptText,
    Settings,
    LogOut,
    TrendingUp,
    ShieldCheck,
    Wallet,
    Bell,
    Search,
    Filter,
    Menu,
    X,
    ChevronRight,
    Download,
    CheckCircle2,
    XCircle,
    UserSearch,
    CreditCard,
    ArrowUpRight,
    Activity,
    Edit,
    Ban,
    Shield,
    UserPlus,
    Coins,
    BarChart2,
    DollarSign,
    TrendingDown,
    FileText,
    PanelLeftClose,
    PanelLeftOpen,
    RefreshCw,
    Trophy,
    ArrowRight,
    ArrowRightLeft,
    Globe
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';
import './AdminDashboard.css';
import API_BASE_URL from '../apiConfig';
import logo from '../assets/DHANIK.png';
import { BrowserProvider, Contract, parseUnits, formatUnits, JsonRpcProvider } from 'ethers';
import { DHANIK_ADDRESS, DHANIK_ABI, getAddresses, switchToBSC, isBSC } from '../contracts';

// Animated Counter Component
const CountUp = ({ value, duration = 1.5 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = parseInt(value);
        if (start === end) return;
        let totalMilisecondsDur = duration * 1000;
        let incrementTime = (totalMilisecondsDur / end) > 10 ? (totalMilisecondsDur / end) : 10;
        let timer = setInterval(() => {
            start += Math.ceil(end / (totalMilisecondsDur / incrementTime));
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, incrementTime);
        return () => clearInterval(timer);
    }, [value, duration]);
    return <span>{count.toLocaleString()}</span>;
};

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [settings, setSettings] = useState({
        dhanikPrice: 0.015,
        minWithdrawal: 10,
        maintenanceMode: false,
        supportEmail: 'support@dhanik.in',
        supportLiveChat: '+91 91 87094 178',
        supportWebsite: 'https://www.dhanik.in/',
        supportFacebook: 'https://www.facebook.com/profile.php?id=61587832813071',
        supportInstagram: 'https://www.instagram.com/dhanikcrypto'
    });
    const [supportMessages, setSupportMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [txSearch, setTxSearch] = useState('');
    const [txFilter, setTxFilter] = useState('all');
    const [proofImage, setProofImage] = useState(null);
    const [financeRange, setFinanceRange] = useState('30D');
    const [adminWallet, setAdminWallet] = useState(null);
    const [isConnectingWallet, setIsConnectingWallet] = useState(false);
    const [updateOnChain, setUpdateOnChain] = useState(false);
    const [isUpdatingChain, setIsUpdatingChain] = useState(false);
    const [onChainPrice, setOnChainPrice] = useState(null);
    const [onChainInrRate, setOnChainInrRate] = useState(null);
    const [currentPhase, setCurrentPhase] = useState(null);
    const [manualPhase, setManualPhase] = useState("");
    const [marketInrPrice, setMarketInrPrice] = useState(null);
    const [contractAdminAddress, setContractAdminAddress] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const connectWallet = async () => {
        // Robust detection: check for window.ethereum or window.ethereum.providers
        const provider = window.ethereum?.providers?.find(p => p.isMetaMask) || window.ethereum;

        if (provider) {
            setIsConnectingWallet(true);
            try {
                // Request accounts using the modern eth_requestAccounts
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts.length > 0) {
                    setAdminWallet(accounts[0]);
                    console.log("Admin wallet connected:", accounts[0]);
                }
            } catch (err) {
                console.error("Wallet connection error:", err);
                if (err.code === 4001) {
                    alert('Connection request rejected. Please approve in MetaMask.');
                } else {
                    alert('Wallet connection failed: ' + (err.message || 'Unknown error'));
                }
            } finally {
                setIsConnectingWallet(false);
            }
        } else {
            alert('MetaMask not detected. Please ensure MetaMask is installed, enabled, and you are not in a private window that blocks extensions.');
        }
    };

    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [statsRes, usersRes, txRes, setRes, msgRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/admin/stats`, { headers }),
                fetch(`${API_BASE_URL}/api/admin/users`, { headers }),
                fetch(`${API_BASE_URL}/api/admin/transactions`, { headers }),
                fetch(`${API_BASE_URL}/api/admin/settings`, { headers }),
                fetch(`${API_BASE_URL}/api/admin/support-messages`, { headers })
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (usersRes.ok) {
                const data = await usersRes.json();
                if (Array.isArray(data)) setUsers(data);
            }
            if (txRes.ok) {
                const data = await txRes.json();
                if (Array.isArray(data)) setTransactions(data);
            }
            if (setRes.ok) setSettings(await setRes.json());
            if (msgRes.ok) {
                const data = await msgRes.json();
                if (Array.isArray(data)) setSupportMessages(data);
            }

            // Fetch on-chain price for display and sync input
            try {
                const prov = new JsonRpcProvider('https://bsc-dataseed.binance.org/');
                const { DHANIK } = getAddresses(56);
                const contract = new Contract(DHANIK, DHANIK_ABI, prov);
                const priceWei = await contract.currentPrice();
                const fetchedOnChain = formatUnits(priceWei, 18);
                setOnChainPrice(fetchedOnChain);

                const phase = await contract.currentPhase().catch(() => 1);
                setCurrentPhase(Number(phase));
                setManualPhase(Number(phase).toString());

                // Sync the input field with real contract price
                setSettings(prev => ({ ...prev, dhanikPrice: parseFloat(fetchedOnChain) }));

                // Fetch the actual admin address from the contract
                try {
                    const contractAdmin = await contract.admin();
                    setContractAdminAddress(contractAdmin);
                    console.log('Contract admin address:', contractAdmin);
                } catch (e) {
                    console.log('Could not fetch contract admin:', e);
                }

                // Fetch live INR rate from contract
                if (contract.usdtToInr) {
                    const fetchedInr = await contract.usdtToInr();
                    const inrVal = Number(fetchedInr);
                    setOnChainInrRate(inrVal);
                    // Sync the input field with real contract INR rate
                    setSettings(prev => ({ ...prev, usdtToInr: inrVal }));
                }
            } catch (e) {
                console.log("Could not fetch on-chain data:", e);
            }

            // Fetch live market INR rate
            try {
                const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=inr');
                const data = await res.json();
                if (data.tether?.inr) {
                    setMarketInrPrice(data.tether.inr);
                }
            } catch (e) {
                console.log("Could not fetch market INR price");
            }

        } catch (error) {
            console.error('Admin fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const detectExisting = async () => {
            const provider = window.ethereum?.providers?.find(p => p.isMetaMask) || window.ethereum;
            if (provider) {
                try {
                    const accounts = await provider.request({ method: 'eth_accounts' });
                    if (accounts && accounts.length > 0) {
                        setAdminWallet(accounts[0]);
                    }
                } catch (e) {
                    console.warn('Initial session check failed');
                }
            }
        };
        detectExisting();
        fetchAdminData();
    }, []);

    const handleTransactionAction = async (id, status, txData = null) => {
        try {
            const token = localStorage.getItem('token');
            let txHash = undefined;

            // ── INR Purchase Approval ─────────────────────────────────────
            // Contract has no buyWithINR. Admin transfers tokens directly
            // using transferFrom(admin, user, amount) — an admin-only function.
            if (status === 'completed' && txData && txData.type === 'purchase' && txData.currency === 'INR') {
                if (!adminWallet) {
                    alert('Please connect your admin wallet first (click the avatar in the header).');
                    await connectWallet();
                    return;
                }

                const userAddress = txData.user?.walletAddress;
                if (!userAddress) {
                    alert('User has no wallet address bound yet. Ask the user to connect their wallet first.');
                    return;
                }

                if (!window.confirm(
                    `Approve INR purchase?\n\nSend ${txData.amount?.toLocaleString()} DHANIK tokens (1:1 INR parity) to:\n${userAddress}\n\nThis will call transferFrom() on the BSC contract.`
                )) return;

                try {
                    // Step 1: Check current network
                    let provider = new BrowserProvider(window.ethereum);
                    let network = await provider.getNetwork();

                    // Step 2: Auto-switch to BSC if on wrong network
                    if (!isBSC(Number(network.chainId))) {
                        try {
                            await switchToBSC();
                            // Wait for MetaMask to stabilise on the new chain
                            await new Promise(r => setTimeout(r, 1000));
                        } catch (switchErr) {
                            alert('Could not switch to BNB Smart Chain. Please switch manually in MetaMask.');
                            return;
                        }
                    }

                    // Step 3: Create a FRESH provider after the switch
                    provider = new BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    network = await provider.getNetwork();

                    const { DHANIK } = getAddresses(Number(network.chainId));
                    const dhanikContract = new Contract(DHANIK, DHANIK_ABI, signer);

                    const adminAddr = await signer.getAddress();
                    // Force 1:1 Ratio for INR: 100 INR = 100 Dhanik
                    const tokenVal = txData.currency === 'INR' ? txData.amount : txData.tokens;
                    const tokens = parseUnits(tokenVal.toString(), 18);

                    // transferFrom(from, to, amount) — admin-only function
                    const tx = await dhanikContract.transferFrom(adminAddr, userAddress, tokens);
                    const receipt = await tx.wait();
                    txHash = receipt.hash;
                    console.log('Token transfer successful:', txHash);

                    /* 
                    // ── On-Chain Level Income Distribution ────────────────────────────
                    // Distribute commissions on-chain to referrers (5% L1, 2% L2, 1% L3)
                    const tokenAmount = parseFloat(tokenVal || 0);
                    const referrers = txData.referrers || []; // expect [{address, level, percentage}]

                    if (referrers.length > 0) {
                        alert(`Main transfer done! Now sending commissions to ${referrers.length} referrer(s) on-chain. Confirm each MetaMask popup.`);
                    }

                    for (const ref of referrers) {
                        if (!ref.address) continue;
                        try {
                            const commissionTokens = parseUnits(
                                ((tokenAmount * ref.percentage) / 100).toFixed(6), 18
                            );
                            const commTx = await dhanikContract.transferFrom(adminAddr, ref.address, commissionTokens);
                            await commTx.wait();
                            console.log(`L${ref.level} commission sent to ${ref.address}: ${commTx.hash}`);
                        } catch (commErr) {
                            console.warn(`Failed to send L${ref.level} commission on-chain:`, commErr.message);
                        }
                    }
                    */
                } catch (contractErr) {
                    console.error('Contract error:', contractErr);
                    alert('Contract transaction failed: ' + (contractErr.reason || contractErr.message));
                    return;
                }
            }

            // ── Commission / Level Income Withdrawal Approval ─────────────
            // The contract's transferTo(to, amount) is user-callable only.
            // For admin-triggered withdrawal payouts, use transferFrom(admin, user).
            if (status === 'completed' && txData && txData.type === 'withdrawal') {
                if (!adminWallet) {
                    alert('Please connect your admin wallet first.');
                    await connectWallet();
                    return;
                }

                const userAddress = txData.user?.walletAddress;
                if (!userAddress) {
                    alert('User has no wallet address. Cannot transfer tokens.');
                    return;
                }

                if (!window.confirm(
                    `Approve withdrawal?\n\nSend ${txData.amount?.toLocaleString()} DHANIK to:\n${userAddress}`
                )) return;

                try {
                    // Step 1: Check current network
                    let provider = new BrowserProvider(window.ethereum);
                    let network = await provider.getNetwork();

                    // Step 2: Auto-switch to BSC if on wrong network
                    if (!isBSC(Number(network.chainId))) {
                        try {
                            await switchToBSC();
                            await new Promise(r => setTimeout(r, 1000));
                        } catch (switchErr) {
                            alert('Could not switch to BNB Smart Chain. Please switch manually in MetaMask.');
                            return;
                        }
                    }

                    // Step 3: Create a FRESH provider after the switch
                    provider = new BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    network = await provider.getNetwork();

                    const { DHANIK } = getAddresses(Number(network.chainId));
                    const dhanikContract = new Contract(DHANIK, DHANIK_ABI, signer);

                    const adminAddr = await signer.getAddress();
                    const tokens = parseUnits(txData.amount.toString(), 18);

                    const tx = await dhanikContract.transferFrom(adminAddr, userAddress, tokens);
                    const receipt = await tx.wait();
                    txHash = receipt.hash;
                    console.log('Withdrawal transfer successful:', txHash);
                } catch (contractErr) {
                    console.error('Contract error:', contractErr);
                    alert('Contract transaction failed: ' + (contractErr.reason || contractErr.message));
                    return;
                }
            }

            // ── Update backend status ─────────────────────────────────────
            const res = await fetch(`${API_BASE_URL}/api/admin/transactions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status, txHash })
            });

            if (res.ok) {
                const resData = await res.json();

                /*
                // ── On-chain commission transfers for INR purchases ────────────
                const referrers = resData.referrers || [];
                if (referrers.length > 0 && txData?.type === 'purchase' && txData?.currency === 'INR' && adminWallet) {
                    try {
                        let provider = new BrowserProvider(window.ethereum);
                        const signer = await provider.getSigner();
                        const network = await provider.getNetwork();
                        const { DHANIK } = getAddresses(Number(network.chainId));
                        const dhanikContract = new Contract(DHANIK, DHANIK_ABI, signer);
                        const adminAddr = await signer.getAddress();
                        const tokenAmount = parseFloat(txData.tokens || 0);

                        for (const ref of referrers) {
                            if (!ref.address) continue;
                            try {
                                const commAmt = parseUnits(((tokenAmount * ref.percentage) / 100).toFixed(6), 18);
                                const commTx = await dhanikContract.transferFrom(adminAddr, ref.address, commAmt);
                                await commTx.wait();
                                console.log(`✅ L${ref.level} commission (${ref.percentage}%) sent on-chain to ${ref.address}`);
                            } catch (commErr) {
                                console.warn(`⚠️ L${ref.level} commission failed:`, commErr.message);
                            }
                        }
                        alert(`✅ Transaction approved and ${referrers.length} level income commission(s) sent on-chain!`);
                    } catch (chainErr) {
                        console.warn('Commission chain transfers failed:', chainErr.message);
                        alert(`Transaction approved. Commission transfers partially failed: ${chainErr.message}`);
                    }
                } else {
                    alert(`Transaction ${status} successfully${txHash ? ' ✅ On-chain: ' + txHash.substring(0, 10) + '...' : ''}`);
                }
                */
                alert(`Transaction ${status} successfully${txHash ? ' ✅ On-chain: ' + txHash.substring(0, 10) + '...' : ''}`);

                fetchAdminData();
            } else {
                const err = await res.json();
                alert('Backend update failed: ' + (err.message || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            alert('Error: ' + (error.reason || error.message));
        }
    };

    const handleUpdateOnChainPrice = async () => {
        if (!adminWallet) {
            alert("Please connect your Admin Wallet (MetaMask) first to update the Smart Contract.");
            return;
        }

        const confirmChain = window.confirm(`Update Smart Contract price to $${settings.dhanikPrice}?`);
        if (!confirmChain) return;

        setIsUpdatingChain(true);
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const { DHANIK } = getAddresses(chainId);
            const dhanikContract = new Contract(DHANIK, DHANIK_ABI, signer);

            if (!settings.dhanikPrice || isNaN(settings.dhanikPrice)) {
                alert("Please enter a valid price.");
                setIsUpdatingChain(false);
                return;
            }

            const phaseToUpdate = parseInt(manualPhase) || currentPhase || 1;
            const priceWei = parseUnits(settings.dhanikPrice.toString(), 18);

            console.log(`Updating Phase ${phaseToUpdate} price to ${settings.dhanikPrice} on-chain...`);
            const tx = await dhanikContract.priceUpdate(phaseToUpdate, priceWei);
            await tx.wait();
            alert("Smart Contract price updated successfully!");
            fetchAdminData();
        } catch (err) {
            console.error("Chain update error:", err);
            alert("On-chain update failed: " + (err.reason || err.message));
        } finally {
            setIsUpdatingChain(false);
        }
    };

    const handleUpdateSettings = async (e) => {
        if (e) e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            // Auto-detect if price changed relative to blockchain
            const priceChanged = onChainPrice !== null && parseFloat(settings.dhanikPrice).toFixed(6) !== parseFloat(onChainPrice).toFixed(6);
            const inrRateChanged = onChainInrRate !== null && Number(settings.usdtToInr) !== Number(onChainInrRate);

            if (priceChanged || inrRateChanged) {
                if (!adminWallet) {
                    alert("On-chain parameter change detected! Please connect your Admin Wallet (MetaMask) first to update the Smart Contract.");
                    return;
                }

                let confirmMsg = "Blockchain Transaction Required:\n";
                if (priceChanged) confirmMsg += `- Change Token Price: $${onChainPrice} -> $${settings.dhanikPrice}\n`;
                if (inrRateChanged) confirmMsg += `- Change INR Rate: ₹${onChainInrRate} -> ₹${settings.usdtToInr}\n`;
                confirmMsg += "\nProceed with Smart Contract update?";

                const confirmChain = window.confirm(confirmMsg);
                if (!confirmChain) return;

                setIsUpdatingChain(true);
                try {
                    const provider = new BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                    const { DHANIK } = getAddresses(chainId);
                    const dhanikContract = new Contract(DHANIK, DHANIK_ABI, signer);

                    if (priceChanged) {
                        const phase = Number(await dhanikContract.currentPhase().catch(() => 1));
                        const priceWei = parseUnits(settings.dhanikPrice.toString(), 18);
                        const tx = await dhanikContract.priceUpdate(phase, priceWei);
                        await tx.wait();
                        console.log("On-chain price updated");
                    }

                    if (inrRateChanged) {
                        const tx = await dhanikContract.updateInrRate(Math.floor(settings.usdtToInr));
                        await tx.wait();
                        console.log("On-chain INR rate updated");
                    }
                } catch (err) {
                    console.error("Chain update error:", err);
                    alert("On-chain update failed: " + (err.reason || err.message));
                    setIsUpdatingChain(false);
                    return;
                }
            }

            const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                alert('Settings updated successfully' + (priceChanged ? ' (Contract price synchronized)' : ''));
                fetchAdminData(); // Refresh to get latest on-chain price
            }
        } catch (error) {
            alert('Server error');
        } finally {
            setIsUpdatingChain(false);
        }
    };

    const handleUserAction = async (id, status) => {
        if (!window.confirm(`Change user status to "${status}"?`)) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchAdminData();
        } catch (error) { alert('Server error'); }
    };

    const handleUpdateSupportStatus = async (id, status) => {
        if (!id) {
            alert("Error: Message ID is missing.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/admin/support-messages/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            const data = await res.json();

            if (res.ok) {
                alert(`Success: status changed to ${status}`);
                fetchAdminData();
            } else {
                alert(`Error: ${data.message || 'Failed to update status'}`);
            }
        } catch (error) {
            console.error('Update support status error:', error);
            alert('Server connection error. Please try again.');
        }
    };

    const [userModal, setUserModal] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [userSearch, setUserSearch] = useState('');

    const openUserModal = (type, user) => {
        setUserModal({ type, user });
        if (type === 'edit') {
            setEditForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                walletAddress: user.walletAddress || '',
                status: user.status || 'Active',
                dhanik: user.wallet?.dhanik || 0,
                inrBalance: user.wallet?.inrBalance || 0,
                totalInvestment: user.totalInvestment || 0,
            });
        }
    };

    // Export users as CSV
    const exportUsersCSV = () => {
        const headers = ['Name', 'Email', 'Referral ID', 'Status', 'INR Balance', 'DHT Balance', 'Total Investment', 'Total Withdrawal', 'L1', 'L2', 'L3'];
        const rows = users.map(u => [
            u.name || '',
            u.email || '',
            u.referralId || '',
            u.status || 'Active',
            u.wallet?.inrBalance || 0,
            u.wallet?.dhanik || 0,
            u.totalInvestment || 0,
            u.totalWithdrawal || 0,
            u.referrals?.l1Count || 0,
            u.referrals?.l2Count || 0,
            u.referrals?.l3Count || 0,
        ]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click(); URL.revokeObjectURL(url);
    };

    // Export transactions as CSV
    const exportTransactionsCSV = () => {
        const headers = ['User', 'Email', 'Type', 'Amount', 'Currency', 'Tokens', 'TX ID', 'Status', 'Date'];
        const rows = transactions.map(tx => [
            tx.user?.name || 'System',
            tx.user?.email || '',
            tx.type || '',
            tx.amount || 0,
            tx.currency || 'INR',
            tx.tokens || '',
            tx.transactionId || tx.txHash || '',
            tx.status || '',
            new Date(tx.createdAt).toLocaleString(),
        ]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click(); URL.revokeObjectURL(url);
    };

    const handleSaveUserEdit = async () => {
        const { user } = userModal;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${user._id}/edit`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    name: editForm.name,
                    email: editForm.email,
                    phone: editForm.phone,
                    walletAddress: editForm.walletAddress,
                    status: editForm.status,
                    dhanik: parseFloat(editForm.dhanik) || 0,
                    totalInvestment: parseFloat(editForm.totalInvestment) || 0,
                })
            });
            if (res.ok) {
                alert('User updated successfully!');
                setUserModal(null);
                fetchAdminData();
            } else {
                const err = await res.json();
                alert(err.message || 'Update failed');
            }
        } catch { alert('Server error'); }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // Mini Sparkline Data
    const sparkData = [
        { v: 40 }, { v: 45 }, { v: 42 }, { v: 55 }, { v: 48 }, { v: 62 }, { v: 58 }, { v: 75 }, { v: 70 }, { v: 85 }
    ];

    const adminStats = [
        { label: 'Total Platform Users', value: stats?.totalUsers ?? 0, icon: <Users size={20} />, trend: '+12.5%', color: '#F5C518', sparkColor: '#F5C518' },
        { label: 'Total Revenue (INR)', value: `₹${(stats?.revenue ?? 0).toLocaleString()}`, icon: <Wallet size={20} />, trend: '+8.2%', color: '#00E676', sparkColor: '#00D4BD' },
        { label: 'Dhanik Sold', value: (stats?.tokenSold ?? 0).toLocaleString(), icon: <Activity size={20} />, trend: '+24%', color: '#00E5FF', sparkColor: '#00E5FF' },
        { label: 'Platform Nodes', value: stats?.activeNodes ?? 0, icon: <Shield size={20} />, trend: 'Stable', color: '#FF4D4D', sparkColor: '#FF4D4D' }
    ];

    const menuItems = [
        { name: 'Overview', icon: <LayoutDashboard size={20} /> },
        { name: 'Token Requests', icon: <Coins size={20} />, badge: transactions.filter(t => t.type === 'purchase' && t.status === 'pending').length },
        { name: 'Withdrawals', icon: <ArrowRight size={20} />, badge: transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending').length },
        { name: 'User Management', icon: <UserSearch size={20} /> },
        { name: 'Transactions', icon: <ReceiptText size={20} /> },
        { name: 'Support Messages', icon: <Bell size={20} />, badge: supportMessages.filter(m => m.status === 'Pending').length },
        { name: 'Settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="admin-container">
            {isSidebarOpen && isMobile && (
                <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            <aside className={`admin-sidebar ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="admin-logo">
                    <img src={logo} alt="DHANIK" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                    <span className="logo-text">DHANIK ADMIN</span>
                    {isMobile && (
                        <button
                            className="icon-btn-utility"
                            style={{ marginLeft: 'auto', background: 'transparent', border: 'none' }}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X size={20} color="var(--admin-text-dim)" />
                        </button>
                    )}
                </div>

                <nav className="admin-nav">
                    {menuItems.map((item) => (
                        <div
                            key={item.name}
                            className={`admin-nav-item ${activeTab === item.name ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab(item.name);
                                if (isMobile) setIsSidebarOpen(false);
                            }}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span>{item.name}</span>
                            {item.badge > 0 && <span className="sidebar-badge">{item.badge}</span>}
                        </div>
                    ))}
                </nav>


                <div className="admin-nav" style={{ marginTop: 'auto' }}>
                    <div className="admin-nav-item" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                        {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                        <span>{isSidebarCollapsed ? 'Expand' : 'Collapse'}</span>
                    </div>
                    <div className="admin-nav-item" style={{ color: 'var(--admin-danger)' }} onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </div>
                </div>
            </aside>

            <main className={`admin-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <header className="admin-header">
                    <div className="header-left">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {isMobile && (
                                <button
                                    className="menu-toggle-btn"
                                    onClick={() => setIsSidebarOpen(true)}
                                >
                                    <Menu size={24} />
                                </button>
                            )}
                            <div>
                                <motion.h1 key={activeTab} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                    {activeTab}
                                </motion.h1>
                                <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.95rem', fontWeight: 500 }}>
                                    System Status: <span style={{ color: 'var(--admin-success)' }}>Operational</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="header-right">
                        <div className="icon-btn-utility" onClick={fetchAdminData}>
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </div>
                        <div className="icon-btn-utility">
                            <Bell size={18} />
                            <span className="notification-dot"></span>
                        </div>
                        <div className="admin-user-profile" onClick={connectWallet} style={{ cursor: 'pointer' }}>
                            <div className={`admin-avatar ${adminWallet ? 'connected' : ''}`} style={{ background: adminWallet ? '#00E676' : 'var(--admin-gold)' }}>
                                {adminWallet ? <ShieldCheck size={16} /> : 'AD'}
                            </div>
                            <div className="profile-info desktop-only">
                                <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'white' }}>
                                    {adminWallet ? `${adminWallet.substring(0, 6)}...${adminWallet.slice(-4)}` : 'Connect Wallet'}
                                </p>
                                <p style={{ fontSize: '0.7rem', color: adminWallet && contractAdminAddress && adminWallet.toLowerCase() === contractAdminAddress.toLowerCase() ? 'var(--admin-success)' : adminWallet ? 'var(--admin-danger)' : 'var(--admin-text-dim)' }}>
                                    {adminWallet
                                        ? contractAdminAddress
                                            ? adminWallet.toLowerCase() === contractAdminAddress.toLowerCase()
                                                ? '✓ Contract Admin'
                                                : '✗ Wrong wallet — not contract admin'
                                            : 'Checking admin...'
                                        : 'Click to connect'}
                                </p>
                                {adminWallet && contractAdminAddress && adminWallet.toLowerCase() !== contractAdminAddress.toLowerCase() && (
                                    <p style={{ fontSize: '0.65rem', color: '#FF9800', marginTop: '2px' }}>
                                        Need: {contractAdminAddress.substring(0, 8)}...
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'Overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="admin-stats-grid">
                                {adminStats.map((stat, idx) => (
                                    <div key={idx} className="admin-stat-card">
                                        <div className="stat-header">
                                            <div className="stat-icon" style={{ color: stat.color }}>
                                                {stat.icon}
                                            </div>
                                        </div>
                                        <div className="stat-value">
                                            {typeof stat.value === 'string' && stat.value.includes('₹') ? '₹' : ''}
                                            <CountUp value={stat.value.toString().replace(/[^0-9]/g, '')} />
                                        </div>
                                        <div className="stat-footer">
                                            <span className="stat-label">{stat.label}</span>
                                            <span className={`stat-trend ${stat.trend.includes('+') ? 'trend-up' : ''}`}>
                                                {stat.trend.includes('+') ? <TrendingUp size={14} /> : stat.trend === 'Stable' ? null : <TrendingDown size={14} />}
                                                {stat.trend}
                                            </span>
                                        </div>
                                        <div className="mini-chart">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={sparkData}>
                                                    <defs>
                                                        <linearGradient id={`sparkG-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={stat.sparkColor} stopOpacity={0.4} />
                                                            <stop offset="95%" stopColor={stat.sparkColor} stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <Line type="monotone" dataKey="v" stroke={stat.sparkColor} strokeWidth={2} dot={false} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="charts-layout-grid">
                                <div className="admin-content-card">
                                    <div className="card-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Activity size={18} color="var(--admin-gold)" />
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Token Purchase Activity</h3>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '10px' }}>
                                            {['Today', 'Weekly', 'Monthly'].map((f, i) => (
                                                <button key={f} className={`btn-outline-small ${i === 0 ? 'active' : ''}`}>{f}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ padding: '24px 24px 0 24px' }}>
                                        <ResponsiveContainer width="100%" height={320}>
                                            <AreaChart data={transactions.slice(0, 15).reverse().map((t) => ({
                                                name: new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                                                val: t.amount || 0
                                            }))}>
                                                <defs>
                                                    <linearGradient id="glowG" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="var(--admin-gold)" stopOpacity={0.15} />
                                                        <stop offset="95%" stopColor="var(--admin-gold)" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                                <XAxis dataKey="name" hide />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--admin-text-dim)', fontSize: 11 }} />
                                                <Tooltip contentStyle={{ background: '#0B1120', border: '1px solid var(--admin-border)', borderRadius: '12px' }} />
                                                <Area type="monotone" dataKey="val" stroke="var(--admin-gold)" strokeWidth={2.5} fill="url(#glowG)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="admin-content-card">
                                    <div className="card-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Trophy size={18} color="var(--admin-neon-blue)" />
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Top Earners</h3>
                                        </div>
                                    </div>
                                    <div className="top-earners-card">
                                        {users.slice().sort((a, b) => (b.income?.total || 0) - (a.income?.total || 0)).slice(0, 5).map((u, i) => (
                                            <div key={i} className="earner-row">
                                                <div className="earner-rank">{i + 1}</div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>{u.name}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)' }}>ID: {u.referralId}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: 700, color: 'var(--admin-success)', fontSize: '1rem' }}>₹{u.income?.total?.toLocaleString()}</p>
                                                    <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>Total Profit</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="admin-content-card animate-slide-up" style={{ marginTop: '24px' }}>
                                <div className="card-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FileText size={20} color="var(--admin-gold)" />
                                        <h3>Recent System Transactions</h3>
                                    </div>
                                    <button className="btn-outline-small" onClick={() => setActiveTab('Transactions')}>View All Ledger</button>
                                </div>
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Ref ID</th>
                                                <th>User</th>
                                                <th>Type</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.slice(0, 6).map((tx, i) => (
                                                <tr key={tx._id || i}>
                                                    <td><span style={{ fontSize: '0.8rem', color: 'var(--admin-gold)', fontWeight: 600 }}>#{tx.user?.referralId || 'SYS'}</span></td>
                                                    <td>{tx.user?.name || 'Unknown'}</td>
                                                    <td><span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)' }}>{tx.type}</span></td>
                                                    <td style={{ fontWeight: 700 }}>{tx.amount?.toLocaleString()} {tx.currency}</td>
                                                    <td><span className={`status-badge status-${(tx.status || 'pending').toLowerCase()}`}>{tx.status}</span></td>
                                                    <td style={{ color: 'var(--admin-text-dim)', fontSize: '0.8rem' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}



                    {activeTab === 'Token Requests' && (
                        <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="admin-content-card">
                                <div className="card-header">
                                    <h3>Pending Verification Requests</h3>
                                    <span className="count-badge">{transactions.filter(t => t.type === 'purchase' && t.status === 'pending').length} Action Required</span>
                                </div>
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Amount</th>
                                                <th>DHANIK Tokens</th>
                                                <th>Transaction ID</th>
                                                <th>Proof</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.filter(t => t.type === 'purchase' && t.status === 'pending').map((tx, i) => (
                                                <tr key={tx._id || i}>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                            <div className="admin-avatar" style={{ width: 36, height: 36 }}>{tx.user?.name?.[0]}</div>
                                                            <div><p style={{ fontWeight: 700 }}>{tx.user?.name}</p><p style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>{tx.user?.email}</p></div>
                                                        </div>
                                                    </td>
                                                    <td style={{ fontWeight: 800 }}>{tx.currency === 'INR' ? '₹' : ''}{tx.amount?.toLocaleString()}</td>
                                                    <td style={{ color: 'var(--admin-gold)', fontWeight: 800 }}>
                                                        {(tx.currency === 'INR' ? tx.amount : tx.tokens)?.toLocaleString()} DHANIK
                                                    </td>
                                                    <td><code style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px' }}>{tx.transactionId || 'N/A'}</code></td>
                                                    <td>
                                                        {tx.paymentScreenshot ? (
                                                            <button className="btn-outline-small" onClick={() => setProofImage(`${API_BASE_URL}/uploads/` + tx.paymentScreenshot)}>View Proof</button>
                                                        ) : '—'}
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button onClick={() => handleTransactionAction(tx._id, 'completed', tx)} className="admin-btn btn-approve">Approve</button>
                                                            <button onClick={() => handleTransactionAction(tx._id, 'rejected', tx)} className="admin-btn btn-reject">Reject</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'User Management' && (
                        <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="admin-content-card">
                                <div className="card-header admin-search-header">
                                    <div className="search-bar-wrapper">
                                        <Search size={18} className="search-icon" />
                                        <input
                                            type="text"
                                            placeholder="Search by name, email or ID..."
                                            className="search-input-prime"
                                            value={userSearch}
                                            onChange={e => setUserSearch(e.target.value)}
                                        />
                                    </div>
                                    <button className="btn-primary shimmer-btn" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={exportUsersCSV}>
                                        <Download size={16} /> Export CSV
                                    </button>
                                </div>
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>User Profile</th>
                                                <th>Assets Detail</th>
                                                <th>Activity Stats</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users
                                                .filter(u => {
                                                    const q = userSearch.toLowerCase();
                                                    return !q || (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || (u.referralId || '').toLowerCase().includes(q);
                                                })
                                                .map((user, i) => (
                                                    <tr key={user._id || i}>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                                <div className="admin-avatar" style={{ borderRadius: '12px' }}>{user.name?.[0]}</div>
                                                                <div>
                                                                    <p style={{ fontWeight: 700 }}>{user.name}</p>
                                                                    <p style={{ fontSize: '0.72rem', color: 'var(--admin-text-dim)' }}>ID: {user.referralId}</p>
                                                                    <div className="network-badge-row">
                                                                        <span className="net-badge l1" title="Level 1">L1: {user.referrals?.l1Count ?? user.referrals?.level1?.length ?? 0}</span>
                                                                        <span className="net-badge l2" title="Level 2">L2: {user.referrals?.l2Count ?? user.referrals?.level2?.length ?? 0}</span>
                                                                        <span className="net-badge l3" title="Level 3">L3: {user.referrals?.l3Count ?? user.referrals?.level3?.length ?? 0}</span>
                                                                    </div>
                                                                    <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="assets-cell">
                                                                <div className="main-balance">₹{(user.wallet?.inrBalance || 0).toLocaleString()}</div>
                                                                <div className="sub-asset gold">{(user.wallet?.dhanik || 0).toLocaleString()} DHANIK</div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="tx-stat-cell">
                                                                <div className="tx-in">+{(user.totalInvestment || 0).toLocaleString()} In</div>
                                                                <div className="tx-out">-{(user.totalWithdrawal || 0).toLocaleString()} Out</div>
                                                            </div>
                                                        </td>
                                                        <td><span className={`status-badge status-${(user.status || 'Active').toLowerCase()}`}>{user.status || 'Active'}</span></td>
                                                        <td>
                                                            <div className="admin-action-row">
                                                                <button className="action-btn-label edit" onClick={() => openUserModal('edit', user)}>
                                                                    <Edit size={14} /> Edit
                                                                </button>
                                                                <button className="action-btn-label network" onClick={() => openUserModal('referrals', user)}>
                                                                    <Users size={14} /> Network
                                                                </button>
                                                                <button
                                                                    className={`action-btn-label ${user.status === 'Banned' ? 'unban' : 'ban'}`}
                                                                    onClick={() => handleUserAction(user._id, user.status === 'Banned' ? 'Active' : 'Banned')}
                                                                >
                                                                    <Ban size={14} /> {user.status === 'Banned' ? 'Unban' : 'Ban'}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'Withdrawals' && (
                        <motion.div key="withdrawals" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="admin-content-card">
                                <div className="card-header">
                                    <h3>Withdrawal Requests</h3>
                                    <span className="count-badge">{transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending').length} Pending</span>
                                </div>
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Source</th>
                                                <th>Amount</th>
                                                <th>Method</th>
                                                <th>Details</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.filter(t => t.type === 'withdrawal' && (t.status === 'pending' || t.status === 'Pending')).map((tx, i) => (
                                                <tr key={tx._id || i}>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                            <div className="admin-avatar" style={{ width: 36, height: 36 }}>{tx.user?.name?.[0]}</div>
                                                            <div><p style={{ fontWeight: 700 }}>{tx.user?.name}</p><p style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>{tx.user?.email}</p></div>
                                                        </div>
                                                    </td>
                                                    <td>{tx.source || 'Level Income'}</td>
                                                    <td style={{ fontWeight: 800 }}>{tx.amount?.toLocaleString()} {tx.currency}</td>
                                                    <td>{tx.method || 'Bank Transfer'}</td>
                                                    <td><span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{tx.paymentDetails || 'N/A'}</span></td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button onClick={() => handleTransactionAction(tx._id, 'completed', tx)} className="admin-btn btn-approve">Approve</button>
                                                            <button onClick={() => handleTransactionAction(tx._id, 'rejected', tx)} className="admin-btn btn-reject">Reject</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending').length === 0 && (
                                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No pending withdrawals</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {activeTab === 'Transactions' && (
                        <motion.div key="tx" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="admin-content-card">
                                <div className="card-header">
                                    <h3>Platform Ledger</h3>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <button className="btn-primary shimmer-btn" style={{ padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={exportTransactionsCSV}>
                                            <Download size={15} /> Export CSV
                                        </button>
                                        <div className="search-bar-wrapper" style={{ maxWidth: '200px' }}>
                                            <Search size={16} className="search-icon" />
                                            <input type="text" placeholder="Filter ID..." className="search-input-prime"
                                                value={txSearch} onChange={e => setTxSearch(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Type</th>
                                                <th>Volume</th>
                                                <th>TX Hash</th>
                                                <th>Status</th>
                                                <th>Timestamp</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions
                                                .filter(tx => !txSearch || (tx.user?.name || '').toLowerCase().includes(txSearch.toLowerCase()) || (tx.transactionId || tx.txHash || '').toLowerCase().includes(txSearch.toLowerCase()))
                                                .map((tx, i) => (
                                                    <tr key={tx._id || i}>
                                                        <td>
                                                            <div>
                                                                <p style={{ fontWeight: 700 }}>{tx.user?.name || 'System'}</p>
                                                                <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>{tx.user?.referralId || ''}</p>
                                                            </div>
                                                        </td>
                                                        <td><span style={{ textTransform: 'capitalize' }}>{tx.type?.replace('_', ' ')}</span></td>
                                                        <td style={{ fontWeight: 700 }}>₹{tx.amount?.toLocaleString()} {tx.currency}</td>
                                                        <td><code style={{ fontSize: '0.7rem' }}>{(tx.transactionId || tx.txHash || 'N/A').substring(0, 14)}...</code></td>
                                                        <td><span className={`status-badge status-${(tx.status || 'pending').toLowerCase()}`}>{tx.status}</span></td>
                                                        <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-dim)' }}>{new Date(tx.createdAt).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'Support Messages' && (
                        <motion.div key="support-msgs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-content-card animate-slide-up">
                            <div className="card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Bell size={20} color="var(--admin-gold)" />
                                    <h3>User Inquiries & Messages</h3>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Sender</th>
                                            <th>Subject</th>
                                            <th>Message</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {supportMessages.length === 0 ? (
                                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-dim)' }}>No support messages found.</td></tr>
                                        ) : (
                                            supportMessages.map((msg, i) => (
                                                <tr key={msg._id || i}>
                                                    <td>
                                                        <div>
                                                            <p style={{ fontWeight: 700 }}>{msg.user?.name || 'Guest'}</p>
                                                            <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>{msg.user?.email}</p>
                                                        </div>
                                                    </td>
                                                    <td><span style={{ fontWeight: 600 }}>{msg.subject}</span></td>
                                                    <td style={{ maxWidth: '300px' }}>
                                                        <p style={{ fontSize: '0.85rem', whiteSpace: 'normal', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={msg.message}>
                                                            {msg.message}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge status-${(msg.status || 'pending').toLowerCase()}`}>
                                                            {msg.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-dim)' }}>{new Date(msg.createdAt).toLocaleString()}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            {msg.status === 'Pending' && (
                                                                <button
                                                                    type="button"
                                                                    className="btn-primary"
                                                                    style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                                                                    onClick={() => handleUpdateSupportStatus(msg._id?.toString() || msg._id, 'Closed')}
                                                                >
                                                                    Close Ticket
                                                                </button>
                                                            )}
                                                            {msg.status === 'Closed' ? (
                                                                <span style={{ fontSize: '0.7rem', color: '#00E676' }}>Resolved</span>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="btn-outline-prime"
                                                                    style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                                                                    onClick={() => handleUpdateSupportStatus(msg._id?.toString() || msg._id, 'Replied')}
                                                                >
                                                                    Mark Replied
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'Settings' && (
                        <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="settings-grid" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            {/* Card 1: Token Minting & Price Control */}
                            <div className="admin-content-card" style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                                    <Coins size={22} color="var(--admin-gold)" />
                                    <h3>Token Price Control</h3>
                                </div>
                                <div className="admin-form-grid">
                                    <div className="form-group-admin" style={{ gridColumn: '1 / -1' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <label style={{ margin: 0 }}>Dhanik Token Price (USDT)</label>
                                            {onChainPrice && (
                                                <span style={{ fontSize: '0.7rem', color: 'var(--admin-gold)', fontWeight: 'bold' }}>
                                                    Phase {currentPhase || '--'} On-Chain: ${parseFloat(onChainPrice).toFixed(4)}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                                            <div style={{ width: '90px', flexShrink: 0 }}>
                                                <p style={{ fontSize: '0.65rem', color: 'var(--admin-text-dim)', marginBottom: '6px' }}>Target Phase</p>
                                                <input
                                                    type="number"
                                                    className="admin-input-prime"
                                                    value={manualPhase}
                                                    onChange={(e) => setManualPhase(e.target.value)}
                                                    placeholder="Phase"
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ marginBottom: '6px' }}>
                                                    <p style={{ fontSize: '0.65rem', color: 'var(--admin-text-dim)', margin: 0 }}>New Market Price (USDT)</p>
                                                </div>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type="number"
                                                        step="0.0001"
                                                        className="admin-input-prime"
                                                        style={{ paddingRight: '120px' }}
                                                        value={settings.dhanikPrice ?? ''}
                                                        onChange={(e) => setSettings({ ...settings, dhanikPrice: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-primary"
                                                        style={{
                                                            position: 'absolute',
                                                            right: '5px',
                                                            top: '5px',
                                                            bottom: '5px',
                                                            padding: '0 15px',
                                                            fontSize: '0.75rem',
                                                            borderRadius: '8px',
                                                            fontWeight: 800
                                                        }}
                                                        onClick={handleUpdateOnChainPrice}
                                                        disabled={isUpdatingChain}
                                                    >
                                                        {isUpdatingChain ? '...' : 'Update Chain'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {onChainPrice !== null && settings.dhanikPrice && parseFloat(settings.dhanikPrice).toFixed(6) !== parseFloat(onChainPrice).toFixed(6) && (
                                    <div style={{ margin: '1.5rem 0', padding: '1rem', background: 'rgba(245, 197, 24, 0.08)', borderRadius: '12px', border: '1px solid rgba(245, 197, 24, 0.2)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-gold)' }}>
                                            <Activity size={16} />
                                            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Price Mismatch Detected</span>
                                        </div>
                                        <p style={{ fontSize: '0.72rem', color: 'var(--admin-text-dim)', marginTop: '4px' }}>
                                            Local: $<b>{settings.dhanikPrice}</b> vs Chain: $<b>{onChainPrice}</b>. Trigger a contract update to sync.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Card 3: Platform Contact & Links */}
                            <div className="admin-content-card" style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                                    <Globe size={22} color="var(--admin-neon-blue)" />
                                    <h3>Support & Social Config</h3>
                                </div>
                                <div className="admin-form-grid">
                                    <div className="form-group-admin">
                                        <label>Support Email</label>
                                        <input type="email" className="admin-input-prime" value={settings.supportEmail ?? ''} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} />
                                    </div>
                                    <div className="form-group-admin">
                                        <label>Support Phone</label>
                                        <input type="text" className="admin-input-prime" value={settings.supportLiveChat ?? ''} onChange={(e) => setSettings({ ...settings, supportLiveChat: e.target.value })} />
                                    </div>
                                    <div className="form-group-admin" style={{ gridColumn: '1 / -1' }}>
                                        <label>Official Website URL</label>
                                        <input type="text" className="admin-input-prime" value={settings.supportWebsite ?? ''} onChange={(e) => setSettings({ ...settings, supportWebsite: e.target.value })} />
                                    </div>
                                    <div className="form-group-admin">
                                        <label>Facebook Profile URL</label>
                                        <input type="text" className="admin-input-prime" value={settings.supportFacebook ?? ''} onChange={(e) => setSettings({ ...settings, supportFacebook: e.target.value })} />
                                    </div>
                                    <div className="form-group-admin">
                                        <label>Instagram Profile URL</label>
                                        <input type="text" className="admin-input-prime" value={settings.supportInstagram ?? ''} onChange={(e) => setSettings({ ...settings, supportInstagram: e.target.value })} />
                                    </div>
                                </div>
                                <button
                                    onClick={handleUpdateSettings}
                                    className="btn-outline-prime"
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', marginTop: '10px' }}
                                >
                                    Update Support Info
                                </button>
                            </div>

                            <div className="admin-content-card" style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                                    <ShieldCheck size={22} color="var(--admin-danger)" />
                                    <h3>Platform Governance</h3>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--admin-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div>
                                            <p style={{ fontWeight: 700 }}>Maintenance Mode</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-dim)' }}>Disable all user transactions</p>
                                        </div>
                                        <div onClick={() => { setSettings(s => ({ ...s, maintenanceMode: !s.maintenanceMode })); handleUpdateSettings(); }} style={{ width: '50px', height: '26px', background: settings.maintenanceMode ? 'var(--admin-danger)' : 'rgba(255,255,255,0.1)', borderRadius: '20px', cursor: 'pointer', transition: '0.3s', padding: '3px' }}>
                                            <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', transform: settings.maintenanceMode ? 'translateX(24px)' : 'translateX(0)', transition: '0.3s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {
                userModal && (
                    <div className="sidebar-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setUserModal(null)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()} className="admin-content-card" style={{ width: '100%', maxWidth: userModal.type === 'referrals' ? '560px' : '620px', padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0 }}>{userModal.type === 'edit' ? 'Commit User Overrides' : 'Network Hierarchy'}</h3>
                                <button onClick={() => setUserModal(null)} className="icon-btn-utility"><X size={18} /></button>
                            </div>

                            {userModal.type === 'edit' ? (
                                <>
                                    <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.85rem', marginBottom: '20px' }}>Modifying profile for <strong style={{ color: 'var(--admin-gold)' }}>{userModal.user?.name}</strong> · ID: {userModal.user?.referralId}</p>
                                    <div className="admin-form-grid">
                                        <div className="form-group-admin">
                                            <label>Full Name</label>
                                            <input type="text" className="admin-input-prime" placeholder="Full name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                        </div>
                                        <div className="form-group-admin">
                                            <label>Email Address</label>
                                            <input type="email" className="admin-input-prime" placeholder="Email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                                        </div>
                                        <div className="form-group-admin">
                                            <label>Phone Number</label>
                                            <input type="text" className="admin-input-prime" placeholder="Phone" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                                        </div>
                                        <div className="form-group-admin">
                                            <label>Account Status</label>
                                            <select className="admin-input-prime" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Banned">Banned</option>
                                            </select>
                                        </div>
                                        <div className="form-group-admin">
                                            <label>DHANIK Token Balance</label>
                                            <input type="number" className="admin-input-prime" placeholder="DHANIK amount" value={editForm.dhanik} onChange={e => setEditForm({ ...editForm, dhanik: e.target.value })} />
                                        </div>
                                        <div className="form-group-admin">
                                            <label>Total Investment (₹)</label>
                                            <input type="number" className="admin-input-prime" placeholder="Amount in INR" value={editForm.totalInvestment} onChange={e => setEditForm({ ...editForm, totalInvestment: e.target.value })} />
                                        </div>
                                        <div className="form-group-admin" style={{ gridColumn: '1 / -1' }}>
                                            <label>Wallet Address</label>
                                            <input type="text" className="admin-input-prime" placeholder="USDT/Crypto wallet address" value={editForm.walletAddress} onChange={e => setEditForm({ ...editForm, walletAddress: e.target.value })} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                        <button className="btn-outline" style={{ flex: 1 }} onClick={() => setUserModal(null)}>Cancel</button>
                                        <button className="btn-primary shimmer-btn" style={{ flex: 2 }} onClick={handleSaveUserEdit}>Commit Changes</button>
                                    </div>
                                </>
                            ) : (
                                <div className="referrals-view">
                                    {/* User identity header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid var(--admin-border)' }}>
                                        <div className="admin-avatar" style={{ width: 44, height: 44, fontSize: '1.1rem', borderRadius: '12px' }}>{userModal.user?.name?.[0]}</div>
                                        <div>
                                            <p style={{ fontWeight: 800, fontSize: '1rem' }}>{userModal.user?.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)' }}>ID: {userModal.user?.referralId} · {userModal.user?.email}</p>
                                        </div>
                                    </div>

                                    {/* Upline */}
                                    <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                                        <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(245,197,24,0.12)', borderRadius: '30px', border: '1px solid rgba(245,197,24,0.3)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-gold)' }}>
                                            ↑ Referred By: {userModal.user?.referredBy || 'Direct Signup'}
                                        </div>
                                    </div>

                                    {/* Tree connector line */}
                                    <div style={{ textAlign: 'center', color: 'var(--admin-border)', lineHeight: '1', fontSize: '1.2rem' }}>│</div>
                                    <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                                        <div style={{ display: 'inline-block', padding: '6px 18px', background: 'rgba(139,92,246,0.15)', borderRadius: '20px', border: '1px solid rgba(139,92,246,0.3)', fontSize: '0.78rem', fontWeight: 800, color: '#A78BFA' }}>
                                            ● {userModal.user?.name} (This User)
                                        </div>
                                    </div>

                                    {/* Network levels grid */}
                                    <div className="admin-network-levels">
                                        <div style={{ padding: '16px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
                                            <p style={{ fontSize: '0.65rem', color: '#A78BFA', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '6px' }}>LEVEL 1</p>
                                            <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#C4B5FD' }}>{userModal.user?.referrals?.l1Count ?? userModal.user?.referrals?.level1?.length ?? 0}</p>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>Direct Referrals</p>
                                        </div>
                                        <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
                                            <p style={{ fontSize: '0.65rem', color: '#60A5FA', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '6px' }}>LEVEL 2</p>
                                            <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#93C5FD' }}>{userModal.user?.referrals?.l2Count ?? userModal.user?.referrals?.level2?.length ?? 0}</p>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>Sub-Referrals</p>
                                        </div>
                                        <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                                            <p style={{ fontSize: '0.65rem', color: '#34D399', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '6px' }}>LEVEL 3</p>
                                            <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#6EE7B7' }}>{userModal.user?.referrals?.l3Count ?? userModal.user?.referrals?.level3?.length ?? 0}</p>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>Deep Network</p>
                                        </div>
                                    </div>

                                    {/* Total network summary */}
                                    <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-dim)' }}>Total Network Size</p>
                                            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--admin-gold)' }}>
                                                {((userModal.user?.referrals?.l1Count ?? userModal.user?.referrals?.level1?.length ?? 0) +
                                                    (userModal.user?.referrals?.l2Count ?? userModal.user?.referrals?.level2?.length ?? 0) +
                                                    (userModal.user?.referrals?.l3Count ?? userModal.user?.referrals?.level3?.length ?? 0)).toLocaleString()} Members
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-dim)' }}>Referral Code</p>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--admin-neon-blue)' }}>{userModal.user?.referralId}</p>
                                        </div>
                                    </div>

                                    <button className="btn-outline" style={{ width: '100%', marginTop: '16px' }} onClick={() => setUserModal(null)}>Close View</button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )
            }

            {
                proofImage && (
                    <div className="sidebar-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setProofImage(null)}>
                        <div onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
                            <img src={proofImage} alt="Payment Proof" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '20px', border: '2px solid var(--admin-border)' }} />
                            <button onClick={() => setProofImage(null)} style={{ position: 'absolute', top: -20, right: -20, background: 'var(--admin-danger)', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontWeight: 900 }}>X</button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AdminDashboard;
