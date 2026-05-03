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
  Key
} from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
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
  }>({ customers: [], newJoinees: [], tickets: [], logs: [], admins: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminUid, setNewAdminUid] = useState('');
  const [primaryPassword, setPrimaryPassword] = useState('123456');
  const navigate = useNavigate();

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
      const tickets = snap.docs.map(d => ({ id: d.id, ...d.data() }));
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
      setData(prev => ({ ...prev, customers: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
    }, (err) => {
      console.error('Customers sync error:', err);
      setLoading(false);
    });

    const unsubNewJoinees = onSnapshot(collection(db, 'new_joinees'), (snap) => {
      setData(prev => ({ ...prev, newJoinees: snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)) }));
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

    return () => {
      unsubAuth();
      unsubTickets();
      unsubLogs();
      unsubCustomers();
      unsubNewJoinees();
      unsubAdmins();
    };
  }, [navigate]);

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
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                                {t.name?.[0] || 'U'}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 truncate max-w-[200px]">
                                  <span className="text-teal-600 mr-2">{t.ticketId || '#TKT'}</span>
                                  {t.subject || t.enquiryType}
                                </p>
                                <p className="text-xs text-gray-500">{t.email} • {t.source}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-[10px] font-black rounded-full">OPEN</span>
                              <button 
                                onClick={() => updateTicketStatus(t.id, t.status)}
                                className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                              >
                                <ExternalLink size={16} />
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
                        <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-all border border-gray-200 flex items-center gap-2">
                          <Filter size={16} />
                          Filter
                        </button>
                        <button className="px-4 py-2 text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 rounded-xl shadow-sm shadow-teal-200 transition-all">
                          Export CSV
                        </button>
                      </div>
                    </div>

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
                              onClick={() => {
                                  const search = searchTerm.toLowerCase();
                                  const currentItems = data[activeTab === 'renewals' ? 'customers' : activeTab as keyof typeof data].filter((item: any) => {
                                    if (activeTab === 'tickets' && ticketFilter !== 'all') {
                                      if (item.status !== ticketFilter) return false;
                                    }
                                    if (!searchTerm) return true;
                                    return (
                                      item.email?.toLowerCase().includes(search) ||
                                      item.name?.toLowerCase().includes(search) ||
                                      item.customerName?.toLowerCase().includes(search) ||
                                      item.subject?.toLowerCase().includes(search) ||
                                      item.ticketId?.toLowerCase().includes(search) ||
                                      item.id?.toLowerCase().includes(search)
                                    );
                                  });
                                  toggleSelectAll(currentItems);
                              }}
                              className="text-gray-400 hover:text-teal-600 transition-colors"
                            >
                              {selectedIds.length > 0 && selectedIds.length === data[activeTab === 'renewals' ? 'customers' : activeTab as keyof typeof data].length ? (
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
                        {(activeTab === 'renewals' ? data.customers : (activeTab === 'new-joinees' ? data.newJoinees : data[activeTab as keyof typeof data]))
                          .filter((item: any) => {
                            if (activeTab === 'tickets' && ticketFilter !== 'all') {
                              return item.status === ticketFilter;
                            }
                            return true;
                          })
                          .filter((item: any) => {
                            if (!searchTerm) return true;
                            const search = searchTerm.toLowerCase();
                            return (
                              item.email?.toLowerCase().includes(search) ||
                              item.name?.toLowerCase().includes(search) ||
                              item.customerName?.toLowerCase().includes(search) ||
                              item.subject?.toLowerCase().includes(search) ||
                              item.message?.toLowerCase().includes(search) ||
                              item.ticketId?.toLowerCase().includes(search) ||
                              item.customerId?.toLowerCase().includes(search) ||
                              item.status?.toLowerCase().includes(search) ||
                              item.phone?.includes(search)
                            );
                          })
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
                                  <div>
                                    <p className="text-sm font-bold text-gray-900">{item.name || 'Anonymous'}</p>
                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{item.subject || item.enquiryType}</p>
                                  </div>
                                ) : activeTab === 'new-joinees' ? (
                                  <div>
                                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{item.email}</p>
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
                                  <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-teal-50 text-teal-600 uppercase">
                                    {item.plan}
                                  </span>
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
                                    <button 
                                      onClick={() => updateTicketStatus(item.id, item.status === 'Open' ? 'Closed' : 'Open')}
                                      className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                      title="Toggle Status"
                                    >
                                      <RefreshCcw size={16} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => deleteRecord(activeTab === 'logs' ? 'loginLogs' : (activeTab === 'renewals' ? 'customers' : (activeTab === 'new-joinees' ? 'new_joinees' : activeTab)), item.id)}
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
              )}
            </motion.div>
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
