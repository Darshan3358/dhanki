import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    CreditCard,
    FileText,
    Building2,
    Upload,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    Lock
} from 'lucide-react';
import './KYC.css';

const steps = [
    { id: 1, title: 'Profile Photo', icon: <User size={20} /> },
    { id: 2, title: 'Aadhar Details', icon: <CreditCard size={20} /> },
    { id: 3, title: 'PAN Details', icon: <FileText size={20} /> },
    { id: 4, title: 'Bank Details', icon: <Building2 size={20} /> },
];

const KYC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        aadharNumber: '',
        panNumber: '',
        bankName: '',
        accountNumber: '',
        ifscCode: ''
    });

    const nextStep = () => {
        if (currentStep === 4) {
            setIsSubmitted(true);
        } else {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="upload-area-prime"
                    >
                        <div className="photo-placeholder-prime">
                            <div className="avatar-preview">
                                <User size={80} style={{ opacity: 0.2 }} />
                                <div className="plus-icon-overlay"><Upload size={20} /></div>
                            </div>
                            <p>Click or drag to upload Profile Photo</p>
                        </div>
                        <div className="upload-note">
                            <p>Please upload a clear, front-facing photo.</p>
                            <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Max 5MB (JPG, PNG)</p>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="kyc-input-group">
                            <label>Full Name (as per Aadhar)</label>
                            <div className="prime-input-wrapper">
                                <User size={18} className="input-icon" />
                                <input type="text" className="kyc-input-prime" placeholder="Enter your full name" />
                            </div>
                        </div>
                        <div className="kyc-input-group">
                            <label>Aadhar Number</label>
                            <div className="prime-input-wrapper">
                                <CreditCard size={18} className="input-icon" />
                                <input
                                    type="text"
                                    name="aadharNumber"
                                    className="kyc-input-prime"
                                    placeholder="12-digit Aadhar number"
                                    value={formData.aadharNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="kyc-input-group">
                            <label>Upload Aadhar Card</label>
                            <div className="mini-upload-grid">
                                <div className="mini-upload-box">Front Side</div>
                                <div className="mini-upload-box">Back Side</div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="kyc-input-group">
                            <label>PAN Card Number</label>
                            <div className="prime-input-wrapper">
                                <FileText size={18} className="input-icon" />
                                <input
                                    type="text"
                                    name="panNumber"
                                    className="kyc-input-prime"
                                    placeholder="Enter 10-digit PAN"
                                    value={formData.panNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="kyc-input-group">
                            <label>Upload PAN Card Copy</label>
                            <div className="upload-area-prime dashed">
                                <Upload size={32} style={{ opacity: 0.2 }} />
                                <span>Select PAN Card Image</span>
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="kyc-input-group">
                            <label>Bank Name</label>
                            <div className="prime-input-wrapper">
                                <Building2 size={18} className="input-icon" />
                                <input
                                    type="text"
                                    name="bankName"
                                    className="kyc-input-prime"
                                    placeholder="e.g. HDFC Bank"
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="kyc-input-row">
                            <div className="kyc-input-group">
                                <label>Account Number</label>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    className="kyc-input-prime"
                                    placeholder="Account Number"
                                    value={formData.accountNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="kyc-input-group">
                                <label>IFSC Code</label>
                                <input
                                    type="text"
                                    name="ifscCode"
                                    className="kyc-input-prime"
                                    placeholder="IFSC Code"
                                    value={formData.ifscCode}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="kyc-input-group">
                            <label>Upload Passbook / Cheque</label>
                            <div className="upload-area-prime dashed">
                                <Building2 size={32} style={{ opacity: 0.2 }} />
                                <span>Select Document</span>
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    if (isSubmitted) {
        return (
            <div className="kyc-container">
                <motion.div
                    className="kyc-success-view"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="success-icon-lottie">
                        <CheckCircle2 size={120} color="#00E5FF" />
                    </div>
                    <h2>KYC Submitted <span className="gold-glow-text">Successfully!</span></h2>
                    <p>Your documents are under review. This usually takes 24-48 hours. We will notify you once verified.</p>
                    <div className="review-steps">
                        <div className="review-step-item">
                            <div className="step-dot active"></div>
                            <span>Submitted</span>
                        </div>
                        <div className="review-step-item">
                            <div className="step-dot"></div>
                            <span>Verification in Progress</span>
                        </div>
                        <div className="review-step-item">
                            <div className="step-dot"></div>
                            <span>Account Verified</span>
                        </div>
                    </div>
                    <button className="btn-primary shimmer-btn" style={{ marginTop: '2rem', padding: '12px 40px' }} onClick={() => setIsSubmitted(false)}>
                        Return to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="kyc-container">
            <motion.div
                className="kyc-header"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div>
                    <h1>KYC <span className="gold-glow-text">Verification</span></h1>
                    <p>Complete your identity verification to unlock all platform features and withdrawals.</p>
                </div>
                <div className="security-tag">
                    <ShieldCheck size={16} />
                    <span>Bank-Grade Security</span>
                </div>
            </motion.div>

            <div className="kyc-stepper">
                <div className="stepper-line">
                    <div
                        className="stepper-line-progress"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    ></div>
                </div>
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                    >
                        <div className="step-number">
                            {currentStep > step.id ? <CheckCircle2 size={20} /> : step.id}
                        </div>
                        <span className="step-label">{step.title}</span>
                    </div>
                ))}
            </div>

            <motion.div
                className="kyc-form-card"
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="form-step-header">
                    <div className="step-icon-bg">{steps[currentStep - 1].icon}</div>
                    <h3>{steps[currentStep - 1].title}</h3>
                </div>

                <div className="step-content">
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </div>

                <div className="nav-buttons">
                    <button
                        className="nav-btn-back"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                    >
                        <ChevronLeft size={20} />
                        Back
                    </button>

                    <button className="btn-primary shimmer-btn nav-btn-next" onClick={nextStep}>
                        {currentStep === 4 ? 'Confirm & Submit' : 'Next Step'}
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="privacy-info-box">
                    <Lock size={16} style={{ color: '#FFD200', flexShrink: 0 }} />
                    <p>Your documents are protected using AES-256 encryption. We never share your data with third parties.</p>
                </div>
            </motion.div>
        </div>
    );
};

export default KYC;
