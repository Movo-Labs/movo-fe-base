'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Sidebar from '@/components/Sidebar';
import BalanceCard from '@/components/BalanceCard';
import InvoiceTable from '@/components/InvoiceTable';
import CreateInvoiceForm from '@/components/CreateInvoiceForm';
import PreviewInvoice from '@/components/PreviewInvoice';
import { WalletConnectModal } from '@/components/WalletConnectModal';
import MerchantProfileModal from '@/components/MerchantProfileModal';
import { fetchInvoices, formatDate, mapInvoiceStatus, getMerchantProfile, type Invoice as APIInvoice, type MerchantProfile } from '@/utils/api';

const InvoiceSuccessScreen = ({ onBackToDashboard }: { onBackToDashboard: () => void }) => {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="text-center max-w-md">
        {/* Animated Checkmark */}
        <div className="mb-6 relative">
          <div className="w-32 h-32 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
            <svg 
              className="w-16 h-16 text-green-600 animate-check-draw"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7"
                style={{
                  strokeDasharray: 24,
                  strokeDashoffset: 0,
                  animation: 'draw 0.5s ease-in-out 0.3s forwards'
                }}
              />
            </svg>
          </div>
          {/* Confetti effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-500 rounded-full animate-confetti"
                style={{
                  left: '50%',
                  top: '50%',
                  animationDelay: `${i * 0.1}s`,
                  transform: `rotate(${i * 45}deg)`
                }}
              />
            ))}
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
          Invoice Created Successfully! 🎉
        </h1>
        <p className="text-lg text-gray-600 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Your invoice has been created and is ready to be shared with your customer.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={onBackToDashboard}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => {
              onBackToDashboard();
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
            }}
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            View All Invoices
          </button>
        </div>

        {/* Stats or additional info */}
        <div className="mt-12 grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">✓</div>
            <div className="text-sm text-gray-600 mt-1">Created</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">📧</div>
            <div className="text-sm text-gray-600 mt-1">Email Sent</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">🔗</div>
            <div className="text-sm text-gray-600 mt-1">Link Ready</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes confetti {
          0% {
            transform: translate(-50%, -50%) rotate(var(--rotate, 0deg)) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--rotate, 0deg)) translateY(-100px);
            opacity: 0;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-confetti {
          animation: confetti 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Movo?",
      answer: "Movo is a cross-border payment platform leveraging the X402 protocol by Coinbase. It enables businesses to accept cryptocurrency payments and seamlessly convert them to local currencies like Indonesian Rupiah (IDR). With Movo, merchants can expand their global reach, reduce transaction fees, and receive payments instantly without the complexities of traditional international payment systems."
    },
    {
      question: "How to use Movo?",
      answer: "Using Movo is simple: First, connect your crypto wallet to the platform. Then, create an invoice by entering your customer's details, amount, and currency. Share the invoice link with your customer, who can pay using USDC on Base network. Once paid, the payment is automatically converted to your preferred local currency and deposited to your account. You can track all transactions in real-time through your dashboard."
    },
    {
      question: "What cryptocurrencies are supported?",
      answer: "Movo currently supports USDC (USD Coin) payments on the Base network. USDC is a stablecoin pegged to the US Dollar, providing price stability and fast transaction processing. We're continuously working to add support for more cryptocurrencies and blockchain networks."
    },
    {
      question: "How long does it take to receive payments?",
      answer: "Crypto payments are processed almost instantly on the blockchain. Once your customer completes the payment, it's confirmed within seconds. The conversion to your local currency and settlement to your account typically happens within 1-2 business days, depending on your bank and location."
    },
    {
      question: "What are the fees?",
      answer: "Movo charges competitive fees for our services. Transaction fees are typically 1-2% per invoice, significantly lower than traditional payment processors and international wire transfers. There are no hidden fees, no monthly subscriptions, and no setup costs. You only pay when you receive payments."
    },
    {
      question: "Is Movo secure?",
      answer: "Yes, security is our top priority. All transactions are processed on-chain using smart contracts, providing transparency and immutability. We use industry-standard encryption for all data transmissions. Your wallet remains in your control at all times - we never have access to your private keys. All payments are verified on the blockchain before settlement."
    },
    {
      question: "Where do I register?",
      answer: "Registration is simple! Just connect your crypto wallet (MetaMask, Coinbase Wallet, or other WalletConnect-compatible wallets) to our platform. Once connected, you'll be prompted to complete your merchant profile with basic business information. No lengthy paperwork or approval process required - you can start creating invoices immediately."
    },
    {
      question: "Do I need KYC verification?",
      answer: "For basic functionality and small transaction volumes, KYC verification is not required. However, for higher transaction limits and to access additional features like direct bank payouts, you may need to complete KYC verification. This helps us comply with regulatory requirements and protect both merchants and customers."
    },
    {
      question: "Which countries are supported?",
      answer: "Movo currently supports businesses in Indonesia with IDR settlements. We're actively expanding to more countries in Southeast Asia and beyond. If you're interested in using Movo in your country, please contact our support team to express your interest and we'll notify you when we launch in your region."
    },
    {
      question: "How do I contact support?",
      answer: "Our support team is here to help! You can reach us through multiple channels: Email us at support@movo.com, join our Discord community for real-time assistance, or follow us on Twitter @MovoPayments. We typically respond within 24 hours and provide comprehensive documentation and tutorials on our website."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="text-gray-600 mt-1">Everything you need to know about Movo</p>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className={`bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg border-2 ${
              openIndex === index ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className={`w-full px-8 py-6 flex items-center justify-between text-left transition-all duration-300 ${
                openIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <span className="text-xl font-semibold text-gray-900 pr-4">
                {faq.question}
              </span>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                openIndex === index 
                  ? 'bg-blue-600 rotate-45' 
                  : 'bg-gray-100 hover:bg-blue-100'
              }`}>
                <svg 
                  className={`w-6 h-6 transition-colors ${
                    openIndex === index ? 'text-white' : 'text-gray-600'
                  }`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-8 pb-6 bg-blue-50">
                <p className="text-gray-700 text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isConnected, address } = useAccount();
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showPreviewInvoice, setShowPreviewInvoice] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [invoicePreviewData, setInvoicePreviewData] = useState(null);
  const [invoicePreviewReferences, setInvoicePreviewReferences] = useState([]);
  const [savedFormData, setSavedFormData] = useState(null);
  const [savedCustomReferences, setSavedCustomReferences] = useState([]);
  
  // Merchant profile
  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Real invoice data
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check merchant profile when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      checkMerchantProfile();
      loadInvoices();
    } else {
      // Clear data when wallet disconnects
      setInvoices([]);
      setMerchantProfile(null);
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const checkMerchantProfile = async () => {
    if (!address) return;
    
    try {
      const profile = await getMerchantProfile(address);
      setMerchantProfile(profile);
      
      // Show profile modal if not completed
      if (!profile.profileCompleted) {
        setShowProfileModal(true);
      }
    } catch (error) {
      console.error('Failed to load merchant profile:', error);
    }
  };

  const loadInvoices = async () => {
    if (!address) {
      setError('Please connect your wallet');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch invoices filtered by connected wallet address
      const data = await fetchInvoices(address);
      
      // Transform backend data to frontend format
      const transformedInvoices = data.map((invoice: APIInvoice) => ({
        id: invoice.id,
        invoiceNo: invoice.invoiceNo,
        customer: invoice.customerName,
        email: invoice.customerEmail,
        status: mapInvoiceStatus(invoice.status),
        created: formatDate(invoice.createdAt),
        expired: formatDate(invoice.expiresAt),
        paidAmount: invoice.amount,
        currency: invoice.currency,
        equivalentAmount: invoice.usdcAmount ? `≈ ${invoice.usdcAmount} USDC` : null
      }));
      
      setInvoices(transformedInvoices);
    } catch (err) {
      console.error('Failed to load invoices:', err);
      setError('Failed to load invoices. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    const dateString = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return `${timeString}, ${dateString}`;
  };

  const handlePreviewInvoice = (data: any, references: any) => {
    setInvoicePreviewData(data);
    setInvoicePreviewReferences(references);
    setSavedFormData(data);
    setSavedCustomReferences(references);
    setShowCreateInvoice(false);
    setShowPreviewInvoice(true);
  };

  const handleBackToEdit = () => {
    setShowPreviewInvoice(false);
    setShowCreateInvoice(true);
  };

  const handleCreateInvoice = async () => {
    console.log('Creating invoice with data:', invoicePreviewData);
    console.log('Custom references:', invoicePreviewReferences);
    
    // Reload invoices after creation
    await loadInvoices();
    
    // Clear form data
    setSavedFormData(null);
    setSavedCustomReferences([]);
    setInvoicePreviewData(null);
    setInvoicePreviewReferences([]);
    
    // Hide preview and show success screen
    setShowPreviewInvoice(false);
    setShowCreateInvoice(false);
    setShowSuccessScreen(true);
  };

  const handleBackFromSuccess = () => {
    setShowSuccessScreen(false);
    // Optionally scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if ((showCreateInvoice || showPreviewInvoice || showSuccessScreen) && activeTab !== 'invoices') {
      setShowCreateInvoice(false);
      setShowPreviewInvoice(false);
      setShowSuccessScreen(false);
    }
    
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Overview of your account activity and performance</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📅</span>
                  <span>{getCurrentDateTime()}</span>
                </div>
              </div>
            </div>

            <div className="w-full">
              <BalanceCard
                title="Rupiah Balance"
                currency="IDR"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Recent Invoices</h2>
                  <p className="text-gray-600">Your latest Invoice activity</p>
                </div>
                <button 
                  onClick={() => setActiveTab('invoices')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All
                </button>
              </div>
              
              {!isConnected ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-600 text-lg mb-2">👛 Please connect your wallet</p>
                  <p className="text-gray-500">Connect your wallet to view your invoices</p>
                </div>
              ) : isLoading ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading invoices...</p>
                </div>
              ) : error ? (
                <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
                  <p className="text-red-600">{error}</p>
                  <button 
                    onClick={loadInvoices}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : invoices.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-600 text-lg mb-2">📄 No invoices yet</p>
                  <p className="text-gray-500">Create your first invoice to get started</p>
                  <button 
                    onClick={() => setActiveTab('invoices')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Invoice
                  </button>
                </div>
              ) : (
                <InvoiceTable invoices={invoices.slice(0, 5)} />
              )}
            </div>
          </div>
        );
      
      case 'invoices':
        if (showSuccessScreen) {
          return <InvoiceSuccessScreen onBackToDashboard={handleBackFromSuccess} />;
        }
        
        if (showPreviewInvoice && invoicePreviewData) {
          return (
            <PreviewInvoice
              invoiceData={invoicePreviewData}
              customReferences={invoicePreviewReferences}
              onBack={handleBackToEdit}
              onCreate={handleCreateInvoice}
            />
          );
        }
        
        if (showCreateInvoice) {
          return (
            <CreateInvoiceForm 
              onBack={() => setShowCreateInvoice(false)}
              onPreview={handlePreviewInvoice}
              initialData={savedFormData}
              initialReferences={savedCustomReferences}
            />
          );
        }
        
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
                <p className="text-gray-600 mt-1">Manage and track your cryptocurrency payment invoices</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={loadInvoices}
                  disabled={isLoading}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  title="Refresh invoices"
                >
                  <span className={isLoading ? 'animate-spin' : ''}>🔄</span>
                  Refresh
                </button>
                <button 
                  onClick={() => setShowCreateInvoice(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">+</span>
                  Create Invoice
                </button>
              </div>
            </div>
            
            {!isConnected ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-600 text-2xl mb-4">👛 Please connect your wallet</p>
                <p className="text-gray-500 text-lg">Connect your wallet to view and manage your invoices</p>
              </div>
            ) : isLoading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4 text-lg">Loading invoices...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg border border-red-200 p-12 text-center">
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button 
                  onClick={loadInvoices}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Retry
                </button>
              </div>
            ) : invoices.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-600 text-xl mb-2">📄 No invoices found</p>
                <p className="text-gray-500 mb-6">You haven&apos;t created any invoices yet for this wallet</p>
                <button 
                  onClick={() => setShowCreateInvoice(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Create Your First Invoice
                </button>
              </div>
            ) : (
              <InvoiceTable invoices={invoices} />
            )}
          </div>
        );
      
      case 'payout':
        return (
          <div className="fixed inset-0 left-64 top-0 right-0 bottom-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 blur-md"></div>
            <div className="relative flex items-center justify-center h-full">
              <h2 className="text-6xl font-bold text-gray-800">Coming Soon</h2>
            </div>
          </div>
        );
      
      case 'kyc':
        return (
          <div className="fixed inset-0 left-64 top-0 right-0 bottom-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 blur-md"></div>
            <div className="relative flex items-center justify-center h-full">
              <h2 className="text-6xl font-bold text-gray-800">Coming Soon</h2>
            </div>
          </div>
        );
      
      case 'faq':
        return <FAQSection />;
      
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        merchantProfile={merchantProfile}
        onEditProfile={() => setShowProfileModal(true)}
      />
      <main className={`flex-1 overflow-y-auto ${!isConnected ? 'filter blur-sm' : ''}`}>
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
      <WalletConnectModal />
      <MerchantProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onProfileCompleted={() => {
          setShowProfileModal(false);
          checkMerchantProfile();
          loadInvoices();
        }}
      />
    </div>
  );
}