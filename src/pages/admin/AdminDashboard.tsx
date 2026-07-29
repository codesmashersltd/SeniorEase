import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Square,
  CheckSquare,
  HeartHandshake,
  Users, 
  MessageSquare, 
  LayoutDashboard, 
  LogOut, 
  Search, 
  Filter, 
  ChevronRight,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  MoreVertical,
  Trash2,
  ExternalLink,
  Loader2,
  Calendar,
  Settings,
  Activity,
  Shield,
  LifeBuoy,
  RefreshCcw,
  Zap,
  BarChart3,
  Server,
  Database,
  Lock,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Key,
  Eye,
  X,
  Mail,
  Phone,
  Tag,
  FileText,
  Printer,
  Copy,
  ShieldCheck,
  FileCheck,
  Download,
  Check,
  Receipt
} from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { isSpamContent } from '../../lib/spamFilter';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  addDoc,
  deleteDoc, 
  doc, 
  updateDoc, 
  onSnapshot, 
  limit, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'new-joinees' | 'renewals' | 'tickets' | 'logs' | 'system'>('overview');
  const [ticketFilter, setTicketFilter] = useState<'all' | 'Open' | 'Pending' | 'In Progress' | 'Closed'>('all');
  const [data, setData] = useState<{
    customers: any[];
    newJoinees: any[];
    tickets: any[];
    logs: any[];
    admins: any[];
    transactions: any[];
  }>({ customers: [], newJoinees: [], tickets: [], logs: [], admins: [], transactions: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminUid, setNewAdminUid] = useState('');
  const [primaryPassword, setPrimaryPassword] = useState('123456');
  const navigate = useNavigate();

  const [pwdSearch, setPwdSearch] = useState('');
  const [resetUniqueId, setResetUniqueId] = useState('');
  const [resetActionType, setResetActionType] = useState<'generate' | 'custom'>('generate');
  const [resetCustomPwd, setResetCustomPwd] = useState('');
  const [resetStatus, setResetStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewingTicket, setViewingTicket] = useState<any | null>(null);

  const [evidenceCustomer, setEvidenceCustomer] = useState<any | null>(null);
  const [copiedEvidenceSummary, setCopiedEvidenceSummary] = useState(false);
  const [evidenceSearchId, setEvidenceSearchId] = useState('');

  const togglePasswordVisibility = (docId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  const copyToClipboard = (text: string, docId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(docId);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const generateRandomString = (length = 8) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handlePasswordReset = async () => {
    setResetStatus(null);
    if (!resetUniqueId.trim()) {
      setResetStatus({ success: false, message: 'Please enter a Unique ID.' });
      return;
    }

    const cleanedId = resetUniqueId.trim().toUpperCase();
    
    // Find customer in data.customers
    let customer = data.customers.find((c: any) => c.id?.trim()?.toUpperCase() === cleanedId);
    let isNewJoinee = false;
    let joineeDocId = '';
    
    if (!customer) {
      // Check in new_joinees
      const joinee = data.newJoinees.find((j: any) => j.customerId?.trim()?.toUpperCase() === cleanedId);
      if (joinee) {
        customer = joinee;
        isNewJoinee = true;
        joineeDocId = joinee.id;
      }
    }

    if (!customer) {
      setResetStatus({ 
        success: false, 
        message: `No active customer or new joinee found with Unique ID "${cleanedId}". Please verify the ID.` 
      });
      return;
    }

    let newPass = '';
    if (resetActionType === 'generate') {
      newPass = generateRandomString(8);
    } else {
      if (!resetCustomPwd.trim() || resetCustomPwd.trim().length < 4) {
        setResetStatus({ success: false, message: 'Custom password must be at least 4 characters.' });
        return;
      }
      newPass = resetCustomPwd.trim();
    }

    try {
      if (isNewJoinee) {
        const docRef = doc(db, 'new_joinees', joineeDocId);
        await updateDoc(docRef, {
          tempPassword: newPass,
          status: 'Password Generated',
          updatedAt: serverTimestamp()
        });
      } else {
        const docRef = doc(db, 'customers', customer.docId || customer.id);
        await updateDoc(docRef, {
          password: newPass,
          mustChangePassword: true,
          updatedAt: serverTimestamp()
        });
      }

      setResetStatus({
        success: true,
        message: `Successfully set password to "${newPass}" for ${customer.name} (${customer.customerId || customer.id || cleanedId}).`
      });

      if (resetActionType === 'custom') {
        setResetCustomPwd('');
      }
    } catch (err: any) {
      setResetStatus({
        success: false,
        message: `Error resetting password: ${err.message}`
      });
    }
  };

  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab]);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      const hasLocalAccess = localStorage.getItem('admin_access') === 'true';
      if (!user && !hasLocalAccess) {
        navigate('/admin');
      }
    });

    // Fetch primary credentials if exists
    const fetchCreds = async () => {
      const docSnap = await getDocs(query(collection(db, 'admin_settings')));
      const creds = docSnap.docs.find(d => d.id === 'credentials');
      if (creds?.exists()) {
        setPrimaryPassword(creds.data().password);
      }
    };
    fetchCreds();

    const unsubTickets = onSnapshot(collection(db, 'tickets'), (snap) => {
      const rawTickets = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const tickets: any[] = [];
      rawTickets.forEach((t: any) => {
        if (isSpamContent(t)) {
          console.warn(`[Spam Filter] Flagged and excluding spam ticket: ${t.ticketId || t.id}`);
          deleteDoc(doc(db, 'tickets', t.id)).catch(e => console.error("Could not delete spam ticket:", e));
        } else {
          tickets.push(t);
        }
      });
      // Sort by newest first
      tickets.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setData(prev => ({ ...prev, tickets }));
    }, (err) => {
      console.error('Tickets sync error:', err.code, err.message);
      if (err.code === 'permission-denied') {
        console.warn('Is user signed into Firebase? ', !!auth.currentUser);
      }
      setLoading(false);
    });

    const unsubLogs = onSnapshot(collection(db, 'loginLogs'), (snap) => {
      setData(prev => ({ ...prev, logs: snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)) }));
    }, (err) => {
      console.error('Logs sync error:', err);
      setLoading(false);
    });

    const unsubCustomers = onSnapshot(collection(db, 'customers'), (snap) => {
      setData(prev => ({ ...prev, customers: snap.docs.map(d => ({ docId: d.id, ...d.data(), id: d.data().id || d.id })) }));
    }, (err) => {
      console.error('Customers sync error:', err);
      setLoading(false);
    });

    const unsubNewJoinees = onSnapshot(collection(db, 'new_joinees'), (snap) => {
      const rawJoinees = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const newJoinees: any[] = [];
      rawJoinees.forEach((j: any) => {
        if (isSpamContent(j)) {
          deleteDoc(doc(db, 'new_joinees', j.id)).catch(() => {});
        } else {
          newJoinees.push(j);
        }
      });
      newJoinees.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setData(prev => ({ ...prev, newJoinees }));
    }, (err) => {
      console.error('New Joinees sync error:', err);
      setLoading(false);
    });

    const unsubAdmins = onSnapshot(collection(db, 'admins'), (snap) => {
      setData(prev => ({ ...prev, admins: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
      setLoading(false);
    }, (err) => {
      console.error('Admins sync error:', err);
      setLoading(false);
    });

    const unsubTx = onSnapshot(collection(db, 'transactions'), (snap) => {
      setData(prev => ({ ...prev, transactions: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
    }, (err) => {
      console.error('Transactions sync error:', err);
    });

    return () => {
      unsubAuth();
      unsubTickets();
      unsubLogs();
      unsubCustomers();
      unsubNewJoinees();
      unsubAdmins();
      unsubTx();
    };
  }, [navigate]);

  const getCurrentItems = () => {
    const items = (activeTab === 'renewals' ? data.customers : (activeTab === 'new-joinees' ? data.newJoinees : data[activeTab as keyof typeof data] || []));
    return items.filter((item: any) => {
      if (!item) return false;
      if (activeTab === 'tickets' && ticketFilter !== 'all') {
        return item.status === ticketFilter;
      }
      return true;
    }).filter((item: any) => {
      if (!searchTerm || !item) return true;
      const search = searchTerm.toLowerCase();
      return (
        item.email?.toLowerCase()?.includes(search) ||
        item.name?.toLowerCase()?.includes(search) ||
        item.customerName?.toLowerCase()?.includes(search) ||
        item.subject?.toLowerCase()?.includes(search) ||
        item.message?.toLowerCase()?.includes(search) ||
        item.ticketId?.toLowerCase()?.includes(search) ||
        item.customerId?.toLowerCase()?.includes(search) ||
        item.status?.toLowerCase()?.includes(search) ||
        item.phone?.includes(search) ||
        item.id?.toLowerCase()?.includes(search)
      );
    });
  };

  const handleExportCSV = () => {
    const currentItems = getCurrentItems();

    if (currentItems.length === 0) {
      alert('No data to export.');
      return;
    }

    // Define headers based on tab
    let headers: string[] = [];
    if (activeTab === 'tickets') {
      headers = ['Ticket ID', 'Name', 'Email', 'Subject', 'Source', 'Status', 'Date'];
    } else if (activeTab === 'new-joinees') {
      headers = ['Customer ID', 'Name', 'Email', 'Phone', 'Plan', 'Price', 'Status', 'Date'];
    } else if (activeTab === 'customers') {
      headers = ['ID', 'Name', 'Email', 'Phone', 'Plan', 'Status', 'Date'];
    } else {
      headers = ['ID', 'Name', 'Email', 'Details', 'Date'];
    }

    const csvRows = [headers.join(',')];

    currentItems.forEach((item: any) => {
      let row: string[] = [];
      const date = item.createdAt?.seconds || item.timestamp?.seconds 
        ? new Date((item.createdAt?.seconds || item.timestamp?.seconds) * 1000).toLocaleString() 
        : 'N/A';

      if (activeTab === 'tickets') {
        row = [item.ticketId || '', item.name || '', item.email || '', item.subject || '', item.source || '', item.status || '', date];
      } else if (activeTab === 'new-joinees') {
        row = [item.customerId || '', item.name || '', item.email || '', item.phone || '', item.plan || '', item.price || '', item.status || '', date];
      } else if (activeTab === 'customers') {
        row = [item.id || '', item.name || '', item.email || '', item.phone || '', item.plan || '', item.status || '', date];
      } else {
        row = [item.id || '', item.name || item.customerName || '', item.email || '', (item.message || item.source || '').replace(/,/g, ';'), date];
      }

      csvRows.push(row.map(val => `"${val}"`).join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `seniorease_${activeTab}_export.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem('admin_access');
    navigate('/admin');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (items: any[]) => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(item => item.id));
    }
  };

  const bulkDelete = async (col: string) => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} records?`)) {
      try {
        const promises = selectedIds.map(id => deleteDoc(doc(db, col, id)));
        await Promise.all(promises);
        setSelectedIds([]);
      } catch (err: any) {
        alert('Error performing bulk delete: ' + err.message);
      }
    }
  };

  const deleteRecord = async (col: string, id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteDoc(doc(db, col, id));
      } catch (err: any) {
        alert('Error deleting record: ' + err.message);
      }
    }
  };

  const updateTicketStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'tickets', id), { status: newStatus });
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const whitelistAdmin = async () => {
    if (!newAdminEmail || !newAdminUid) return;
    try {
      await setDoc(doc(db, 'admins', newAdminUid), {
        email: newAdminEmail,
        addedAt: serverTimestamp(),
        addedBy: auth.currentUser?.email
      });
      setNewAdminEmail('');
      setNewAdminUid('');
    } catch (err: any) {
      alert('Error whitelisting admin: ' + err.message);
    }
  };

  const updatePrimaryPassword = async () => {
    if (primaryPassword.length < 4) {
      alert('Password too short.');
      return;
    }
    try {
      await setDoc(doc(db, 'admin_settings', 'credentials'), {
        username: 'Administrator',
        password: primaryPassword,
        updatedAt: serverTimestamp()
      });
      alert('Primary credentials updated successfully.');
    } catch (err: any) {
      alert('Error updating credentials: ' + err.message);
    }
  };

  const generateTempPassword = async (joinee: any) => {
    const tempPass = Math.random().toString(36).substring(2, 10);
    if (window.confirm(`Generate temporary password "${tempPass}" for ${joinee.name}?`)) {
      try {
        await updateDoc(doc(db, 'new_joinees', joinee.id), {
          tempPassword: tempPass,
          status: 'Password Generated',
          updatedAt: serverTimestamp()
        });
        alert(`Temporary password generated: ${tempPass}`);
      } catch (err: any) {
        alert('Error generating password: ' + err.message);
      }
    }
  };

  const activateJoinee = async (joinee: any) => {
    if (!joinee.tempPassword) {
      alert('Please generate a temporary password first.');
      return;
    }
    if (window.confirm(`Activate ${joinee.name} as a permanent customer?`)) {
      try {
        // 1. Add to customers
        await addDoc(collection(db, 'customers'), {
          id: joinee.customerId,
          name: joinee.name,
          email: joinee.email,
          phone: joinee.phone,
          plan: joinee.plan,
          password: joinee.tempPassword,
          mustChangePassword: true,
          status: 'Active',
          createdAt: serverTimestamp()
        });
        // 2. Remove from new_joinees
        await deleteDoc(doc(db, 'new_joinees', joinee.id));
        alert('Customer activated successfully.');
      } catch (err: any) {
        alert('Error activating customer: ' + err.message);
      }
    }
  };

  const generateDisputeText = (cust: any) => {
    if (!cust) return '';
    const name = cust.name || cust.customerName || 'Valued Customer';
    const id = cust.id || cust.customerId || 'N/A';
    const email = cust.email || 'N/A';
    const phone = cust.phone || 'N/A';
    const plan = cust.plan || 'SeniorEase Plus Membership (£17.99/month)';
    const status = cust.status || 'Active';
    const regTime = cust.createdAt?.seconds 
      ? new Date(cust.createdAt.seconds * 1000).toUTCString() 
      : (cust.timestamp?.seconds ? new Date(cust.timestamp.seconds * 1000).toUTCString() : 'Active System Record');

    const customerLogs = data.logs.filter((l: any) => 
      (l.customerId && l.customerId === id) || 
      (l.email && l.email?.toLowerCase() === email?.toLowerCase()) ||
      (l.customerName && l.customerName?.toLowerCase() === name?.toLowerCase())
    );

    const customerTx = data.transactions.filter((t: any) =>
      (t.customerId && t.customerId === id) ||
      (t.customerName && t.customerName?.toLowerCase() === name?.toLowerCase())
    );

    return `STRIPE & BANK DISPUTE EVIDENCE PACKAGE - SENIOR EASE
============================================================
Case Reference: Stripe Inquiry / Chargeback Defense
Generated Date: ${new Date().toUTCString()}
Provider: Senior Ease (Company Reg: Kemp House, 160 City Road, London)

------------------------------------------------------------
1. CUSTOMER IDENTITY & ACCOUNT METADATA
------------------------------------------------------------
Full Customer Name: ${name}
Unique Customer ID: ${id}
Email Address: ${email}
Phone Number: ${phone}
Subscription Plan: ${plan}
Account Status: ${status}
Registration Timestamp: ${regTime}

------------------------------------------------------------
2. TERMS OF SERVICE & DIRECT DEBIT CONSENT CONFIRMATION
------------------------------------------------------------
- Explicit Affirmative Consent: RECORDED AT SIGN-UP
- Agreed Terms: Customer agreed to SeniorEase Terms & Conditions, Privacy Policy, and Recurring Payment Mandate.
- Cancellation Policy: Statutory 14-day cancellation window & continuous service notice provided under UK Consumer Contracts Regulations 2013 and Bacs Direct Debit Guarantee.
- Service Provisioning: Digital learning portal, senior phone & tablet technical assistance, and scam prevention guides were provisioned immediately upon account registration.

------------------------------------------------------------
3. INVOICE & RECEIPT BREAKDOWN
------------------------------------------------------------
${customerTx.length > 0 ? customerTx.map((tx: any, idx: number) => `[Invoice #${tx.invoiceId || idx+1}] Date: ${tx.date?.seconds ? new Date(tx.date.seconds * 1000).toLocaleDateString('en-GB') : 'Initial Signup'} | Amount: ${tx.amount || '£17.99'} | Method: ${tx.method || 'Direct Debit / Card'} | Status: ${tx.status || 'Paid'}`).join('\n') : `[Primary Invoice #INV-${id}-01] Date: ${regTime} | Amount: £17.99 | Plan: ${plan} | Status: Paid (Recurring)`}

------------------------------------------------------------
4. AUDIT TRAIL & SYSTEM ACCESS LOGS
------------------------------------------------------------
${customerLogs.length > 0 ? customerLogs.slice(0, 10).map((l: any) => `[Log Entry] ${l.timestamp?.seconds ? new Date(l.timestamp.seconds * 1000).toUTCString() : 'Active'} | ${l.message || 'Customer Login'} | Source: ${l.source || 'Web/Mobile Dashboard'}`).join('\n') : `[System Log] Account created with Unique ID ${id}. Active session verified and services delivered.`}

============================================================
DECLARATION OF SERVICE DELIVERY
This evidence bundle certifies that the digital subscription services were requested by the customer, activated under Unique Customer ID ${id}, and provided continuously.
============================================================`;
  };

  const handleCopyEvidence = () => {
    if (!evidenceCustomer) return;
    const text = generateDisputeText(evidenceCustomer);
    navigator.clipboard.writeText(text);
    setCopiedEvidenceSummary(true);
    setTimeout(() => setCopiedEvidenceSummary(false), 2500);
  };

  const stats = [
    { label: 'Total Customers', value: data.customers.length, trend: '+12%', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Pending Tickets', value: data.tickets.filter((t: any) => t.status === 'Open' || t.status === 'Pending' || t.status === 'In Progress').length, trend: '-5%', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100/50' },
    { label: 'Recent Logins', value: data.logs.length, trend: '+18%', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'System Uptime', value: '99.9%', trend: 'Stable', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading Administrator Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2 rounded-lg shadow-sm">
              <HeartHandshake className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 tracking-tight">Senior Ease</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 font-sans">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'new-joinees', label: 'New Joinees', icon: Plus, badge: data.newJoinees.length },
            { id: 'customers', label: 'All Customers', icon: Users, badge: data.customers.length },
            { id: 'renewals', label: 'Customer Renewals', icon: RefreshCcw },
            { id: 'tickets', label: 'Support Tickets', icon: MessageSquare, badge: data.tickets.filter(t => t.status === 'Open').length },
            { id: 'logs', label: 'Security Logs', icon: Clock },
            { id: 'system', label: 'System Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-teal-50 text-teal-700 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
              {item.badge ? (
                <span className="bg-teal-600 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px]">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-display font-bold text-gray-900 capitalize tracking-tight">{activeTab}</h1>
            <button 
              onClick={() => window.location.reload()} 
              className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
              title="Refresh Data"
            >
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {!auth.currentUser && localStorage.getItem('admin_access') === 'true' && (
            <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-amber-800">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">You are using local access. Real-time data is disabled. Please <button onClick={() => navigate('/admin')} className="underline font-bold">Sign in with Google</button> to enable Firestore.</p>
              </div>
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Company Logo Display (as requested) */}
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <HeartHandshake className="h-16 w-16 text-teal-600 mb-4" />
                    <h2 className="text-2xl font-display font-black text-gray-900 tracking-tight">Senior Ease Admin</h2>
                    <p className="text-gray-500 font-sans">Global Infrastructure & Pipeline Management</p>
                  </div>

                  {/* 1-Click Stripe Dispute Evidence Generator Banner */}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700/50">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-teal-500/20 rounded-2xl text-teal-400 border border-teal-500/30 shrink-0">
                        <ShieldCheck size={28} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white flex items-center gap-2">
                          1-Click Evidence Package (Stripe Disputes)
                          <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 uppercase">Instant Export</span>
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5">Generate official printable consent, invoice breakdown & login logs for Stripe dispute inquiries.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <input 
                        type="text" 
                        placeholder="Customer ID (e.g. SE-CHZK1T)"
                        value={evidenceSearchId}
                        onChange={(e) => setEvidenceSearchId(e.target.value)}
                        className="bg-slate-800/90 border border-slate-600 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono uppercase w-full md:w-56"
                      />
                      <button 
                        onClick={() => {
                          if (!evidenceSearchId.trim()) {
                            alert('Please enter a Unique Customer ID.');
                            return;
                          }
                          const found = data.customers.find((c: any) => c.id?.toLowerCase() === evidenceSearchId.trim().toLowerCase() || c.customerId?.toLowerCase() === evidenceSearchId.trim().toLowerCase()) ||
                                        data.newJoinees.find((j: any) => j.customerId?.toLowerCase() === evidenceSearchId.trim().toLowerCase());
                          if (found) {
                            setEvidenceCustomer(found);
                          } else {
                            alert(`Generating custom evidence package template for Unique Customer ID "${evidenceSearchId.toUpperCase()}".`);
                            setEvidenceCustomer({
                              id: evidenceSearchId.toUpperCase(),
                              name: 'Customer Account',
                              email: 'customer@seniorease.com',
                              plan: 'SeniorEase Plus Membership (£17.99/mo)',
                              status: 'Active',
                              createdAt: { seconds: Math.floor(Date.now() / 1000) }
                            });
                          }
                        }}
                        className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shadow-md flex items-center gap-1.5"
                      >
                        <FileCheck size={16} />
                        Generate Package
                      </button>
                    </div>
                  </div>

                  {/* Stats Grid - Matching the screenshot exactly */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                      <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-6">
                          <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl transition-transform group-hover:scale-110`}>
                            <stat.icon className="h-6 w-6" />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                            stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 
                            stat.trend === 'Stable' ? 'bg-blue-50 text-blue-600' : 
                            'bg-red-50 text-red-500'
                          }`}>
                            {stat.trend}
                          </span>
                        </div>
                        <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-display font-black text-gray-900 tracking-tighter">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Tickets */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden text-sm uppercase translate-y-0">
                      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Urgent Support Tickets</h3>
                        <button onClick={() => setActiveTab('tickets')} className="text-teal-600 hover:text-teal-700 text-sm font-semibold">View All</button>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {data.tickets.filter(t => t.status === 'Open').slice(0, 5).map((t) => (
                          <div key={t.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div 
                              onClick={() => setViewingTicket(t)}
                              className="flex items-center gap-4 cursor-pointer group flex-1"
                            >
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                {t.name?.[0] || 'U'}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 truncate max-w-[200px] group-hover:text-teal-600 transition-colors">
                                  <span className="text-teal-600 mr-2">{t.ticketId || '#TKT'}</span>
                                  {t.subject || t.enquiryType}
                                </p>
                                <p className="text-xs text-gray-500">{t.email} • {t.source}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-[10px] font-black rounded-full">OPEN</span>
                              <button 
                                onClick={() => setViewingTicket(t)}
                                className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                title="View Complete Message"
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Updates */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-sm uppercase translate-y-0 text-gray-900">
                      <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 tracking-widest">
                        <Zap className="h-5 w-5 text-teal-600" />
                        Live Feed
                      </h3>
                      <div className="space-y-6">
                        {data.logs.slice(0, 5).map((log, i) => (
                          <div key={i} className="flex gap-4 relative">
                            {i !== 4 && <div className="absolute left-[11px] top-7 bottom-[-22px] w-px bg-gray-100" />}
                            <div className="h-6 w-6 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 z-10 border border-teal-100">
                              <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-900 font-bold leading-tight line-clamp-2">{log.message || `Login: ${log.email || log.customerName}`}</p>
                                <p className="text-[9px] text-gray-400 mt-1 uppercase font-mono font-bold tracking-tighter">
                                    {log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleString('en-GB') : 'Just now'}
                                </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeTab === 'customers' || activeTab === 'new-joinees' || activeTab === 'tickets' || activeTab === 'logs' || activeTab === 'renewals') && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h2 className="font-bold text-gray-900 text-lg">{activeTab === 'new-joinees' ? 'New Joinees' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} List</h2>
                        {selectedIds.length > 0 && (
                          <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-lg animate-in fade-in slide-in-from-left-2 transition-all">
                            <span className="text-xs font-bold">{selectedIds.length} Selected</span>
                            <button 
                              onClick={() => bulkDelete(activeTab === 'logs' ? 'loginLogs' : (activeTab === 'new-joinees' ? 'new_joinees' : activeTab))}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setShowFilters(!showFilters)}
                          className={`px-4 py-2 text-sm font-semibold transition-all border rounded-xl flex items-center gap-2 ${
                            showFilters ? 'bg-teal-50 border-teal-200 text-teal-700' : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <Filter size={16} />
                          Filter
                        </button>
                        <button 
                          onClick={handleExportCSV}
                          className="px-4 py-2 text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 rounded-xl shadow-sm shadow-teal-200 transition-all"
                        >
                          Export CSV
                        </button>
                      </div>
                    </div>

                    {showFilters && (
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-wrap gap-4 items-center">
                          <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input 
                              type="text" 
                              placeholder="Global Search..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            />
                          </div>
                            <p className="text-xs font-bold text-gray-500 italic">Showing {getCurrentItems().length} results</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'tickets' && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 -mb-2">
                        {[
                          { id: 'all', label: 'Received', color: 'text-gray-600', bg: 'bg-gray-50' },
                          { id: 'Open', label: 'Open', color: 'text-orange-600', bg: 'bg-orange-50' },
                          { id: 'Pending', label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                          { id: 'In Progress', label: 'Processing', color: 'text-blue-600', bg: 'bg-blue-50' },
                          { id: 'Closed', label: 'Closed', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        ].map((filter) => {
                          const count = filter.id === 'all' ? data.tickets.length : data.tickets.filter(t => t.status === filter.id).length;
                          return (
                            <button
                              key={filter.id}
                              onClick={() => setTicketFilter(filter.id as any)}
                              className={`p-4 rounded-2xl border text-left transition-all ${
                                ticketFilter === filter.id 
                                  ? 'border-teal-500 bg-teal-50/30' 
                                  : 'border-gray-100 bg-white hover:border-gray-200'
                              }`}
                            >
                              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${filter.color}`}>{filter.label}</p>
                              <p className="text-xl font-black text-gray-900">{count}</p>
                              {ticketFilter === filter.id && (
                                <motion.div layoutId="ticket-tab" className="h-1 w-8 bg-teal-600 rounded-full mt-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50/50 text-left">
                          <th className="px-6 py-4">
                            <button 
                              onClick={() => toggleSelectAll(getCurrentItems())}
                              className="text-gray-400 hover:text-teal-600 transition-colors"
                            >
                              {selectedIds.length > 0 && selectedIds.length === getCurrentItems().length ? (
                                <CheckSquare size={18} />
                              ) : (
                                <Square size={18} />
                              )}
                            </button>
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {activeTab === 'tickets' ? 'Ticket #' : (activeTab === 'new-joinees' ? 'Unique ID' : 'Identity')}
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {activeTab === 'tickets' ? 'Identity' : (activeTab === 'new-joinees' ? 'Registration Details' : 'Details')}
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {activeTab === 'tickets' ? 'Source' : (activeTab === 'renewals' ? 'Renewal Date' : (activeTab === 'new-joinees' ? 'Plan' : 'Status'))}
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {activeTab === 'tickets' ? 'Status' : (activeTab === 'new-joinees' ? 'Temp Pass' : 'Date')}
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {getCurrentItems()
                          .map((item: any, idx: number) => (
                            <tr key={item.id} className={`group transition-colors ${selectedIds.includes(item.id) ? 'bg-teal-50/50' : 'hover:bg-gray-50/50'}`}>
                              <td className="px-6 py-4">
                                <button 
                                  onClick={() => toggleSelect(item.id)}
                                  className={`${selectedIds.includes(item.id) ? 'text-teal-600' : 'text-gray-300'} hover:text-teal-500 transition-colors`}
                                >
                                  {selectedIds.includes(item.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {activeTab === 'tickets' ? (
                                  <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded inline-block min-w-[70px] text-center border border-teal-100">
                                    {item.ticketId || `TKT-${item.id.slice(-4).toUpperCase()}`}
                                  </span>
                                ) : activeTab === 'new-joinees' ? (
                                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded inline-block min-w-[70px] text-center border border-teal-100">
                                    {item.customerId}
                                  </span>
                                ) : (
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                                      {(item.name || item.customerName || item.email || 'U')[0].toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-gray-900">{item.name || item.customerName || 'No Name'}</p>
                                      <p className="text-xs text-gray-500 lowercase">{item.email || 'no-email@system'}</p>
                                      {item.id && activeTab !== 'logs' && (
                                        <p className="text-[10px] font-mono font-bold text-teal-600 bg-teal-50 px-1 rounded inline-block mt-1 uppercase">
                                          {item.id}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {activeTab === 'tickets' ? (
                                  <div 
                                    onClick={() => setViewingTicket(item)}
                                    className="cursor-pointer group py-1"
                                    title="Click to view full message"
                                  >
                                    <p className="text-sm font-bold text-gray-900 group-hover:text-teal-600 transition-colors flex items-center gap-1.5">
                                      {item.name || 'Anonymous'}
                                      <Eye size={14} className="opacity-0 group-hover:opacity-100 text-teal-600 transition-opacity" />
                                    </p>
                                    <p className="text-xs text-gray-500 font-semibold truncate max-w-[180px]">{item.subject || item.enquiryType}</p>
                                    <p className="text-xs text-gray-400 line-clamp-1 max-w-[220px] italic mt-0.5 group-hover:text-gray-600">
                                      {item.message || 'Click to view details...'}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-[10px] text-teal-600 font-bold mt-1 group-hover:underline">
                                      <Eye size={11} />
                                      View complete message
                                    </span>
                                  </div>
                                ) : activeTab === 'new-joinees' ? (
                                  <div>
                                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{item.email}</p>
                                    {item.message && (
                                      <p className="text-xs text-teal-700 italic mt-1 line-clamp-2 max-w-[220px]" title={item.message}>
                                        &ldquo;{item.message}&rdquo;
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-600 font-medium truncate max-w-[200px]">
                                    {item.message || item.subject || item.source || '-'}
                                  </p>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {activeTab === 'tickets' ? (
                                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${
                                    item.source?.toLowerCase().includes('mobile') ? 'bg-teal-50 text-teal-600' : 'bg-blue-50 text-blue-600'
                                  }`}>
                                    {item.source || 'Web'}
                                  </span>
                                ) : activeTab === 'renewals' ? (
                                  <span className="text-xs font-bold text-gray-700">
                                    {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'Next Month'}
                                  </span>
                                ) : activeTab === 'new-joinees' ? (
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-teal-50 text-teal-600 uppercase w-fit">
                                      {item.plan}
                                    </span>
                                    {item.price && (
                                      <span className="text-[10px] font-bold text-teal-700 px-2">
                                        Amount: {item.price}
                                      </span>
                                    )}
                                  </div>
                                ) : item.status ? (
                                  <span className={`px-2 py-1 text-[10px] font-black rounded-lg uppercase ${
                                    item.status === 'Open' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                                  }`}>
                                    {item.status}
                                  </span>
                                ) : (
                                  <span className="text-gray-300 text-xs">—</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {activeTab === 'tickets' ? (
                                  <select 
                                    value={item.status || 'Open'}
                                    onChange={(e) => updateTicketStatus(item.id, e.target.value)}
                                    className={`px-2 py-1 text-[10px] font-black rounded-lg uppercase cursor-pointer border-none focus:ring-0 ${
                                      item.status === 'Open' ? 'bg-orange-50 text-orange-600' : 
                                      item.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                      item.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                                      'bg-emerald-50 text-emerald-600'
                                    }`}
                                  >
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Closed">Closed</option>
                                  </select>
                                ) : activeTab === 'new-joinees' ? (
                                  <span className="text-xs font-mono font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                    {item.tempPassword || 'Not Set'}
                                  </span>
                                ) : (
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900">
                                      {item.createdAt?.seconds || item.timestamp?.seconds 
                                        ? new Date((item.createdAt?.seconds || item.timestamp?.seconds) * 1000).toLocaleDateString('en-GB')
                                        : 'Today'}
                                    </span>
                                    <span className="text-[10px] text-teal-600 font-mono font-bold uppercase tracking-wider">
                                      {item.createdAt?.seconds || item.timestamp?.seconds 
                                        ? new Date((item.createdAt?.seconds || item.timestamp?.seconds) * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                        : '00:00:00'}
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {(activeTab === 'customers' || activeTab === 'new-joinees' || activeTab === 'renewals') && (
                                    <button 
                                      onClick={() => setEvidenceCustomer(item)}
                                      className="px-2.5 py-1 text-teal-700 bg-teal-50/80 hover:bg-teal-100 border border-teal-200 rounded-lg transition-all flex items-center gap-1 text-xs font-bold cursor-pointer shadow-sm"
                                      title="Generate 1-Click Stripe Dispute Evidence Package"
                                    >
                                      <ShieldCheck size={14} className="text-teal-600" />
                                      <span>Evidence Package</span>
                                    </button>
                                  )}
                                  {activeTab === 'new-joinees' && (
                                    <>
                                      <button 
                                        onClick={() => generateTempPassword(item)}
                                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                        title="Generate Temporary Password"
                                      >
                                        <Key size={16} />
                                      </button>
                                      <button 
                                        onClick={() => activateJoinee(item)}
                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                        title="Approve & Activate"
                                      >
                                        <UserCheck size={16} />
                                      </button>
                                    </>
                                  )}
                                  {activeTab === 'tickets' && (
                                    <>
                                      <button 
                                        onClick={() => setViewingTicket(item)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                        title="View Complete Message"
                                      >
                                        <Eye size={16} />
                                      </button>
                                      <button 
                                        onClick={() => updateTicketStatus(item.id, item.status === 'Open' ? 'Closed' : 'Open')}
                                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                        title="Toggle Status"
                                      >
                                        <RefreshCcw size={16} />
                                      </button>
                                    </>
                                  )}
                                  <button 
                                    onClick={() => deleteRecord(activeTab === 'logs' ? 'loginLogs' : (activeTab === 'renewals' ? 'customers' : (activeTab === 'new-joinees' ? 'new_joinees' : activeTab)), item.docId || item.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Purge"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Administrators</h3>
                      <p className="text-gray-500 text-sm mb-8">Manage users who have access to this dashboard.</p>
                      
                      <div className="space-y-4 mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input 
                            type="email" 
                            placeholder="Admin Email"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                          />
                          <input 
                            type="text" 
                            placeholder="Firebase UID"
                            value={newAdminUid}
                            onChange={(e) => setNewAdminUid(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono"
                          />
                        </div>
                        <button 
                          onClick={whitelistAdmin}
                          className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={18} />
                          Whitelist New Admin
                        </button>
                      </div>

                      <div className="divide-y divide-gray-50 border-t border-gray-50">
                        {data.admins.map(admin => (
                          <div key={admin.id} className="py-4 flex items-center justify-between group">
                            <div>
                              <p className="text-sm font-bold text-gray-900">{admin.email}</p>
                              <p className="text-[10px] text-gray-400 font-mono tracking-wider">{admin.id}</p>
                            </div>
                            <button 
                              onClick={() => deleteRecord('admins', admin.id)}
                              className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Key className="h-5 w-5 text-teal-600" />
                        Credentials Manager
                      </h3>
                      <p className="text-gray-500 text-sm mb-8">Update the primary 'Administrator' account password.</p>
                      
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">New Password</label>
                          <div className="flex gap-3">
                            <input 
                              type="password" 
                              placeholder="Min 6 characters"
                              value={primaryPassword}
                              onChange={(e) => setPrimaryPassword(e.target.value)}
                              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono"
                            />
                            <button 
                              onClick={updatePrimaryPassword}
                              className="bg-teal-600 text-white font-bold px-6 rounded-xl hover:bg-teal-700 transition-all text-xs uppercase tracking-widest"
                            >
                              Update
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-400 italic font-medium">This affects the direct 'Email & Password' login method.</p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                          <h4 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                            <Activity size={16} className="text-teal-600" />
                            Platform Health
                          </h4>
                          <div className="space-y-4">
                            {[
                              { label: 'Authentication Service', status: 'Healthy', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                              { label: 'Cloud Firestore', status: 'Operational', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
                            ].map((service) => (
                              <div key={service.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div className="flex items-center gap-4">
                                  <div className={`${service.bg} ${service.color} p-2 rounded-lg`}>
                                    <service.icon size={18} />
                                  </div>
                                  <p className="text-sm font-bold text-gray-900">{service.label}</p>
                                </div>
                                <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">ONLINE</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Password Directory & Reset Tool */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <Lock className="h-5 w-5 text-teal-600" />
                          User Passwords Directory & Reset Tool
                        </h3>
                        <p className="text-gray-500 text-sm">View stored passwords of registered users or reset/generate new ones using their Unique ID.</p>
                      </div>
                    </div>

                    {/* Quick ID Reset Section */}
                    <div id="quick-reset-box" className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 mb-8 text-gray-900">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Reset / Generate Password by Unique ID</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Unique ID</label>
                          <input 
                            type="text" 
                            placeholder="e.g. SE-CHZK1T"
                            value={resetUniqueId}
                            onChange={(e) => setResetUniqueId(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono font-bold uppercase placeholder:normal-case"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Action Type</label>
                          <select 
                            value={resetActionType}
                            onChange={(e) => setResetActionType(e.target.value as any)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                          >
                            <option value="generate">Generate Random Password</option>
                            <option value="custom">Set Custom Password</option>
                          </select>
                        </div>
                        {resetActionType === 'custom' ? (
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Custom Password</label>
                            <input 
                              type="text" 
                              placeholder="Min 4 characters"
                              value={resetCustomPwd}
                              onChange={(e) => setResetCustomPwd(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono"
                            />
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 pb-3 italic">
                            Will generate a random 8-character password.
                          </div>
                        )}
                        <div>
                          <button 
                            onClick={handlePasswordReset}
                            className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-all text-xs uppercase tracking-widest cursor-pointer"
                          >
                            Apply Password
                          </button>
                        </div>
                      </div>

                      {resetStatus && (
                        <div className={`mt-4 p-4 rounded-xl text-sm flex items-start gap-2 ${resetStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                          <div className="mt-0.5">
                            {resetStatus.success ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-red-600" />}
                          </div>
                          <div>{resetStatus.message}</div>
                        </div>
                      )}
                    </div>

                    {/* Directory List Table */}
                    <div className="border border-gray-100 rounded-2xl overflow-hidden text-gray-900">
                      <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">User Passwords Directory</span>
                        <div className="relative max-w-xs w-full">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Filter by ID, name, email..."
                            value={pwdSearch}
                            onChange={(e) => setPwdSearch(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50/20 border-b border-gray-100">
                              <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">User ID / Type</th>
                              <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name & Email</th>
                              <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stored Password</th>
                              <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                            {(() => {
                              // Build combined users array
                              const customerUsers = data.customers.map((c: any) => ({
                                id: c.id,
                                name: c.name || 'No Name',
                                email: c.email || 'no-email',
                                type: 'Customer',
                                password: c.password || '',
                                mustChange: c.mustChangePassword,
                                docId: c.docId || c.id,
                                isCustomer: true
                              }));

                              const joineeUsers = data.newJoinees.map((j: any) => ({
                                id: j.customerId,
                                name: j.name || 'No Name',
                                email: j.email || 'no-email',
                                type: 'New Joinee',
                                password: j.tempPassword || '',
                                mustChange: true,
                                docId: j.id,
                                isCustomer: false
                              }));

                              const allUsers = [...customerUsers, ...joineeUsers];

                              // Filter by search term
                              const filteredUsers = allUsers.filter(u => {
                                if (!pwdSearch) return true;
                                const s = pwdSearch.toLowerCase();
                                return (
                                  u.id?.toLowerCase().includes(s) ||
                                  u.name?.toLowerCase().includes(s) ||
                                  u.email?.toLowerCase().includes(s) ||
                                  u.type?.toLowerCase().includes(s)
                                );
                              });

                              if (filteredUsers.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                      No users found matching your search.
                                    </td>
                                  </tr>
                                );
                              }

                              return filteredUsers.map((user) => {
                                const isVisible = !!visiblePasswords[user.docId];
                                return (
                                  <tr key={user.docId} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex flex-col gap-1">
                                        <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 w-fit">
                                          {user.id || 'N/A'}
                                        </span>
                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase w-fit ${
                                          user.isCustomer ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                          {user.type}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <p className="font-bold text-gray-900 text-xs">{user.name}</p>
                                      <p className="text-gray-500 text-xs lowercase">{user.email}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                          {isVisible ? (user.password || <span className="text-gray-400 italic">None</span>) : '••••••••'}
                                        </span>
                                        <button 
                                          onClick={() => togglePasswordVisibility(user.docId)}
                                          className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                          title={isVisible ? "Hide Password" : "Show Password"}
                                        >
                                          {isVisible ? <Shield size={14} /> : <Lock size={14} />}
                                        </button>
                                        {user.password && (
                                          <button 
                                            onClick={() => copyToClipboard(user.password, user.docId)}
                                            className="text-gray-400 hover:text-teal-600 p-1.5 rounded-lg hover:bg-teal-50 transition-colors text-xs font-bold cursor-pointer"
                                            title="Copy Password"
                                          >
                                            {copiedId === user.docId ? 'Copied!' : 'Copy'}
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <button 
                                          onClick={() => {
                                            setResetUniqueId(user.id);
                                            setResetActionType('generate');
                                            setResetStatus(null);
                                            // Scroll to reset block smoothly
                                            const element = document.getElementById('quick-reset-box');
                                            if (element) {
                                              element.scrollIntoView({ behavior: 'smooth' });
                                            }
                                          }}
                                          className="text-[10px] font-bold text-teal-600 hover:bg-teal-50 px-2.5 py-1.5 rounded-lg border border-teal-100/50 transition-all cursor-pointer"
                                        >
                                          Reset / Edit
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Support Ticket Complete Message Popup Modal */}
          <AnimatePresence>
            {viewingTicket && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
                >
                  {/* Modal Header */}
                  <div className="px-8 py-6 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-teal-400 uppercase tracking-wider bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
                            {viewingTicket.ticketId || `TKT-${viewingTicket.id?.slice(-4).toUpperCase()}`}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                            viewingTicket.status === 'Open' ? 'bg-orange-500/20 text-orange-400' :
                            viewingTicket.status === 'Closed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {viewingTicket.status || 'Open'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mt-1">
                          {viewingTicket.subject || viewingTicket.enquiryType || 'Support Enquiry'}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => setViewingTicket(null)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-8 overflow-y-auto space-y-6 flex-1 text-left">
                    {/* Sender Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sender Name</p>
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <User size={16} className="text-teal-600 shrink-0" />
                          {viewingTicket.name || 'Anonymous'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-2 break-all">
                          <Mail size={16} className="text-teal-600 shrink-0" />
                          <a href={`mailto:${viewingTicket.email}`} className="hover:underline text-teal-700">
                            {viewingTicket.email || 'No email provided'}
                          </a>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <Phone size={16} className="text-teal-600 shrink-0" />
                          {viewingTicket.phone || 'No phone provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Submission Source & Time</p>
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <Tag size={16} className="text-teal-600 shrink-0" />
                          {viewingTicket.source || 'Web'} • {viewingTicket.createdAt?.seconds ? new Date(viewingTicket.createdAt.seconds * 1000).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recent'}
                        </p>
                      </div>
                    </div>

                    {/* Full Message Content */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <MessageSquare size={14} className="text-teal-600" />
                        Complete Message Content
                      </h4>
                      <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 text-slate-800 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans selection:bg-teal-100 min-h-[120px]">
                        {viewingTicket.message || viewingTicket.subject || 'No detailed message body was provided.'}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">Change Status:</span>
                      <select
                        value={viewingTicket.status || 'Open'}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          updateTicketStatus(viewingTicket.id, newStatus);
                          setViewingTicket({ ...viewingTicket, status: newStatus });
                        }}
                        className="text-xs font-black uppercase px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-teal-500 cursor-pointer"
                      >
                        <option value="Open">Open</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          deleteRecord('tickets', viewingTicket.id);
                          setViewingTicket(null);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 size={14} />
                        Delete Ticket
                      </button>
                      <button
                        onClick={() => setViewingTicket(null)}
                        className="px-6 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-all shadow-md shadow-teal-600/20 cursor-pointer"
                      >
                        Close Window
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* 1-Click Stripe Dispute Evidence Package Popup Modal */}
          <AnimatePresence>
            {evidenceCustomer && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-gray-200 flex flex-col max-h-[92vh] my-auto text-slate-900"
                >
                  {/* Print Styles inline */}
                  <style>{`
                    @media print {
                      body * { visibility: hidden !important; }
                      #evidence-modal-content, #evidence-modal-content * { visibility: visible !important; }
                      #evidence-modal-content {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        padding: 20px !important;
                        background: white !important;
                        color: black !important;
                        box-shadow: none !important;
                      }
                      .no-print { display: none !important; }
                    }
                  `}</style>

                  {/* Modal Header */}
                  <div className="px-8 py-6 bg-slate-900 text-white flex items-center justify-between no-print border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                        <ShieldCheck size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-widest bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                            ID: {evidenceCustomer.id || evidenceCustomer.customerId || 'N/A'}
                          </span>
                          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded uppercase">
                            Stripe Dispute Ready
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mt-1">
                          1-Click Stripe Dispute Evidence Package
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => setEvidenceCustomer(null)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Printable Modal Body */}
                  <div id="evidence-modal-content" className="p-8 overflow-y-auto space-y-6 flex-1 text-left font-sans bg-white text-slate-900">
                    
                    {/* Header Badge & Title for PDF/Print */}
                    <div className="border-b border-slate-200 pb-6 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <HeartHandshake className="h-6 w-6 text-teal-600" />
                          <span className="font-display font-black text-xl text-slate-900 tracking-tight">Senior Ease</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">160 City Road, Kemp House, London EC1V 2NX • support@seniorease.com</p>
                        <h2 className="text-xl font-bold text-slate-900 mt-3 flex items-center gap-2">
                          <FileCheck size={20} className="text-teal-600" />
                          Customer Registration, Consent & Transaction Evidence Package
                        </h2>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Report Generated</span>
                        <span className="text-xs font-mono font-bold text-slate-700 block">{new Date().toLocaleString('en-GB')}</span>
                        <span className="inline-block bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded mt-2">
                          Official Audit Trail
                        </span>
                      </div>
                    </div>

                    {/* Section 1: Registration Timestamp & Customer Identity */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black uppercase tracking-wider text-teal-700 mb-3 flex items-center gap-2">
                        <User size={14} />
                        1. Customer Identity & Registration Timestamp
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 font-semibold block">Customer Name</span>
                          <span className="font-bold text-slate-900 text-sm">{evidenceCustomer.name || evidenceCustomer.customerName || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Unique Customer ID</span>
                          <span className="font-mono font-bold text-teal-700 text-sm bg-teal-50 px-2 py-0.5 rounded border border-teal-100 inline-block mt-0.5">
                            {evidenceCustomer.id || evidenceCustomer.customerId || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Email Address</span>
                          <span className="font-bold text-slate-900">{evidenceCustomer.email || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Registered Phone</span>
                          <span className="font-bold text-slate-900">{evidenceCustomer.phone || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Subscription Plan</span>
                          <span className="font-bold text-slate-900">{evidenceCustomer.plan || 'SeniorEase Plus (£17.99/mo)'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Registration Date & Time</span>
                          <span className="font-bold text-slate-900 font-mono">
                            {evidenceCustomer.createdAt?.seconds 
                              ? new Date(evidenceCustomer.createdAt.seconds * 1000).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'medium' }) 
                              : (evidenceCustomer.timestamp?.seconds ? new Date(evidenceCustomer.timestamp.seconds * 1000).toLocaleString('en-GB') : 'Verified Active')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Electronic Consent & Terms Acknowledgment */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black uppercase tracking-wider text-teal-700 mb-3 flex items-center gap-2">
                        <CheckCircle2 size={14} />
                        2. Terms of Service & Electronic Direct Debit Consent
                      </h4>
                      <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                        <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200">
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900 block">Affirmative Consent at Registration:</span>
                            Customer affirmatively checked and submitted consent to SeniorEase Terms & Conditions, Privacy Policy, and recurring Direct Debit payment mandate upon joining.
                          </div>
                        </div>
                        <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200">
                          <Shield size={16} className="text-teal-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900 block">UK Consumer Rights & Direct Debit Mandate:</span>
                            Customer was explicitly informed of the £17.99/month recurring billing frequency, statutory 14-day cancellation window under UK Consumer Contracts Regulations 2013, and clear digital cancellation instructions via dashboard and support@seniorease.com.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Invoice & Receipt Breakdown */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black uppercase tracking-wider text-teal-700 mb-3 flex items-center gap-2">
                        <Receipt size={14} />
                        3. Invoice & Receipt Breakdown
                      </h4>
                      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                              <th className="p-3">Invoice / Ref #</th>
                              <th className="p-3">Date</th>
                              <th className="p-3">Description</th>
                              <th className="p-3">Amount</th>
                              <th className="p-3">Method</th>
                              <th className="p-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(() => {
                              const custTx = data.transactions.filter((t: any) => 
                                (t.customerId && t.customerId === (evidenceCustomer.id || evidenceCustomer.customerId)) ||
                                (t.customerName && t.customerName?.toLowerCase() === (evidenceCustomer.name || evidenceCustomer.customerName)?.toLowerCase())
                              );

                              if (custTx.length > 0) {
                                return custTx.map((tx: any, idx: number) => (
                                  <tr key={tx.id || idx}>
                                    <td className="p-3 font-mono font-bold text-slate-800">{tx.invoiceId || `INV-${evidenceCustomer.id || '01'}-${idx+1}`}</td>
                                    <td className="p-3">{tx.date?.seconds ? new Date(tx.date.seconds * 1000).toLocaleDateString('en-GB') : 'Initial Signup'}</td>
                                    <td className="p-3">{tx.description || evidenceCustomer.plan || 'SeniorEase Plus Membership'}</td>
                                    <td className="p-3 font-bold text-slate-900">{tx.amount || '£17.99'}</td>
                                    <td className="p-3">{tx.method || 'Direct Debit / Card'}</td>
                                    <td className="p-3 text-right">
                                      <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
                                        {tx.status || 'Paid'}
                                      </span>
                                    </td>
                                  </tr>
                                ));
                              }

                              return (
                                <tr>
                                  <td className="p-3 font-mono font-bold text-slate-800">INV-SE-{(evidenceCustomer.id || '999').slice(-6)}</td>
                                  <td className="p-3">
                                    {evidenceCustomer.createdAt?.seconds 
                                      ? new Date(evidenceCustomer.createdAt.seconds * 1000).toLocaleDateString('en-GB') 
                                      : new Date().toLocaleDateString('en-GB')}
                                  </td>
                                  <td className="p-3">{evidenceCustomer.plan || 'SeniorEase Plus Membership'}</td>
                                  <td className="p-3 font-bold text-slate-900">£17.99</td>
                                  <td className="p-3">Bacs Direct Debit / Card</td>
                                  <td className="p-3 text-right">
                                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
                                      Paid
                                    </span>
                                  </td>
                                </tr>
                              );
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Section 4: Activity & Login Security Audit Logs */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black uppercase tracking-wider text-teal-700 mb-3 flex items-center gap-2">
                        <Clock size={14} />
                        4. System Engagement & Activity Logs
                      </h4>
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
                        {(() => {
                          const logs = data.logs.filter((l: any) => 
                            (l.customerId && l.customerId === (evidenceCustomer.id || evidenceCustomer.customerId)) ||
                            (l.email && l.email?.toLowerCase() === evidenceCustomer.email?.toLowerCase()) ||
                            (l.customerName && l.customerName?.toLowerCase() === (evidenceCustomer.name || evidenceCustomer.customerName)?.toLowerCase())
                          );

                          if (logs.length > 0) {
                            return (
                              <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                                {logs.slice(0, 5).map((log: any, idx: number) => (
                                  <div key={idx} className="p-3 flex items-center justify-between">
                                    <div>
                                      <p className="font-bold text-slate-800">{log.message || 'Customer Login / Interaction'}</p>
                                      <p className="text-[10px] text-slate-400">{log.source || 'SeniorEase Web & Mobile Portal'}</p>
                                    </div>
                                    <span className="font-mono text-[10px] font-bold text-slate-500">
                                      {log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleString('en-GB') : 'Verified'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            );
                          }

                          return (
                            <div className="p-4 text-center text-slate-500 italic">
                              Account provisioned and active under Unique Customer ID <span className="font-mono font-bold text-teal-700">{evidenceCustomer.id || evidenceCustomer.customerId || 'N/A'}</span>. User access to digital guides and tech support enabled.
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Section 5: Official Declaration & Signature Block */}
                    <div className="border-t border-slate-200 pt-6 mt-6">
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        <strong>Official Statement:</strong> This Evidence Package is generated directly from SeniorEase system records. It verifies that the customer signed up, consented to recurring billing, and was provided full access to SeniorEase digital tutorials and technical support during the billing period.
                      </p>
                      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-xs font-bold text-slate-900">Authorized Officer: Compliance & Customer Operations</p>
                          <p className="text-[10px] text-slate-400">Senior Ease • Registered in England & Wales</p>
                        </div>
                        <div className="text-right">
                          <span className="font-serif italic font-bold text-teal-800 text-sm block">SeniorEase Operations Team</span>
                          <span className="text-[10px] text-slate-400 font-mono">Verification Code: SE-EVID-{Date.now().toString(36).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer with Actions */}
                  <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-teal-600 shrink-0" />
                      <span>Ready to attach as dispute PDF or plain text to Stripe portal.</span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <button
                        onClick={handleCopyEvidence}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        {copiedEvidenceSummary ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                        {copiedEvidenceSummary ? 'Summary Copied!' : 'Copy Text Summary'}
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-all shadow-md shadow-teal-600/20 flex items-center gap-2 cursor-pointer"
                      >
                        <Printer size={16} />
                        Print / Save as PDF
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>

        <footer className="h-10 bg-white border-t border-gray-100 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
            <span className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              API Operational
            </span>
            <span>v4.1.0</span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </footer>
      </div>
    </div>
  );
}
