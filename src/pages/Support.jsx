import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Mail,
    MessageSquare,
    Globe,
    ExternalLink,
    Clock,
    Send,
    HelpCircle,
    ChevronDown,
    MapPin,
    Phone,
    Facebook,
    Instagram
} from 'lucide-react';
import './Support.css';
import API_BASE_URL from '../apiConfig';

const Support = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        email: 'support@dhanik.in',
        liveChat: '+91 91 87094 178',
        website: 'https://www.dhanik.in/',
        facebook: 'https://www.facebook.com/profile.php?id=61587832813071',
        instagram: 'https://www.instagram.com/dhanikcrypto'
    });

    useEffect(() => {
        const fetchSupportData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/support/contact-info`);
                if (response.ok) {
                    setContactInfo(await response.json());
                }
            } catch (err) {
                console.error('Failed to fetch support data');
            }
        };
        fetchSupportData();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!formData.subject || !formData.message) return alert('Please fill all fields');

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/support/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Message sent successfully!');
                setFormData({ subject: '', message: '' });
            } else {
                alert('Failed to send message. Please log in.');
            }
        } catch (err) {
            alert('Error connecting to support');
        } finally {
            setLoading(false);
        }
    };

    const faqs = [
        { q: "How do I purchase Dhanik tokens?", a: "Go to the 'Buy Token' section, connect your wallet, enter the amount of USDT you want to spend, and confirm the transaction." },
        { q: "What is the referral commission structure?", a: "We offer a 3-level commission structure: Level 1 (5%), Level 2 (2%), and Level 3 (1%)." },
        { q: "How long does it take to credit tokens?", a: "Tokens are usually credited instantly after the transaction is verified by our team, typically within 15-30 minutes." },
        { q: "Can I withdraw my referral earnings?", a: "Yes, referral earnings are credited to your main wallet and can be withdrawn according to our withdrawal policy." }
    ];

    const contactMethods = [
        { name: 'Email Support', detail: contactInfo.email, icon: <Mail />, color: '#FFD200', link: `mailto:${contactInfo.email}` },
        { name: 'Phone Support', detail: contactInfo.liveChat, icon: <Phone />, color: '#00E5FF', link: `tel:${contactInfo.liveChat.replace(/\s+/g, '')}` },
        { name: 'Official Website', detail: contactInfo.website.replace('https://', ''), icon: <Globe />, color: '#8B5CF6', link: contactInfo.website },
        { name: 'Facebook', detail: 'Join our Community', icon: <Facebook />, color: '#1877F2', link: contactInfo.facebook },
        { name: 'Instagram', detail: 'Follow us officially', icon: <Instagram />, color: '#E1306C', link: contactInfo.instagram },
    ];

    return (
        <div className="support-container">
            <motion.div
                className="page-header"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div>
                    <h1>Company <span className="gold-glow-text">Support</span></h1>
                    <p>Get in touch with us or browse our frequently asked questions.</p>
                </div>
                <div className="support-status">
                    <Clock size={16} />
                    <span>Response Time: &lt; 2 hours</span>
                </div>
            </motion.div>

            <div className="support-grid">
                <div className="support-left">
                    <motion.div
                        className="contact-card-prime"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h3>Send us a <span className="gold-glow-text">Message</span></h3>
                        <p>Have a specific issue? Fill out the form below.</p>

                        <form className="support-form" onSubmit={handleSendMessage}>
                            <div className="input-group-prime">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Transaction Issue"
                                    className="prime-input"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div className="input-group-prime">
                                <label>Message</label>
                                <textarea
                                    placeholder="Describe your issue in detail..."
                                    className="prime-textarea"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn-primary full-btn" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Message'}
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>

                    <div className="faq-section">
                        <h3>General <span className="gold-glow-text">FAQs</span></h3>
                        <div className="faq-list">
                            {faqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className={`faq-item ${activeFaq === idx ? 'active' : ''}`}
                                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                >
                                    <div className="faq-question">
                                        <span>{faq.q}</span>
                                        <ChevronDown size={18} />
                                    </div>
                                    <div className="faq-answer">
                                        <p>{faq.a}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="support-right">
                    <motion.div
                        className="quick-contact-grid"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {contactMethods.map((method, idx) => {
                            const isPhoneEmpty = method.name === 'Phone Support' && (!method.detail || method.detail.trim() === '');
                            return (
                                <a key={idx} href={isPhoneEmpty ? '#' : method.link} target="_blank" rel="noopener noreferrer" className="method-card" style={{ textDecoration: 'none', cursor: isPhoneEmpty ? 'default' : 'pointer' }}>
                                    <div className="icon-box" style={{ background: `${method.color}15`, color: method.color }}>
                                        {method.icon}
                                    </div>
                                    <div className="info">
                                        <h4>{method.name}</h4>
                                        <p>{isPhoneEmpty ? 'No Data' : method.detail}</p>
                                    </div>
                                    {!isPhoneEmpty && <ExternalLink size={16} className="ext-link" />}
                                </a>
                            );
                        })}
                    </motion.div>

                    <div className="company-info-card">
                        <div className="shield-header">
                            <ShieldCheck size={32} className="gold-glow-text" />
                            <h3>Official DHANIK</h3>
                        </div>
                        <p className="company-desc">
                            Dhanik Token is a decentralized digital asset built on the Binance Smart Chain. Our mission is to provide a transparent and efficient ecosystem for digital investments.
                        </p>
                        <div className="info-list">
                            <div className="info-item">
                                <MapPin size={18} />
                                <span>Global Support Team</span>
                            </div>
                            <div className="info-item">
                                <Phone size={18} />
                                <span>Contact via Official Channels</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
