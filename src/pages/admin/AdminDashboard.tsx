import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
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
  ArrowDownRight
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
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'tickets' | 'logs' | 'system'>('overview');
  const [data, setData] = useState<{
    customers: any[];
    tickets: any[];
    logs: any[];
    admins: any[];
  }>({ customers: [], tickets: [], logs: [], admins: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminUid, setNewAdminUid] = useState('');
  const [primaryPassword, setPrimaryPassword] = useState('123456');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) navigate('/admin');
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
      setData(prev => ({ ...prev, tickets: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
    });

    const unsubLogs = onSnapshot(collection(db, 'loginLogs'), (snap) => {
      setData(prev => ({ ...prev, logs: snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)) }));
    });

    const unsubCustomers = onSnapshot(collection(db, 'customers'), (snap) => {
      setData(prev => ({ ...prev, customers: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
    });

    const unsubAdmins = onSnapshot(collection(db, 'admins'), (snap) => {
      setData(prev => ({ ...prev, admins: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
      setLoading(false);
    });

    return () => {
      unsubAuth();
      unsubTickets();
      unsubLogs();
      unsubCustomers();
      unsubAdmins();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/admin');
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

  const updateTicketStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Open' ? 'In Progress' : 'Resolved';
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

  const stats = [
    { label: 'Total Customers', value: data.customers.length, trend: '+12%', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Pending Tickets', value: data.tickets.filter((t: any) => t.status === 'Open').length, trend: '-5%', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
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
              <LifeBuoy className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Senior Ease</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'tickets', label: 'Support Tickets', icon: MessageSquare },
            { id: 'logs', label: 'Security Logs', icon: Clock },
            { id: 'system', label: 'System Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-teal-50 text-teal-700 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
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
          <h1 className="text-lg font-semibold text-gray-900 capitalize">{activeTab}</h1>
          
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
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                      <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                            <stat.icon className="h-6 w-6" />
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : stat.trend === 'Stable' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                            {stat.trend}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
                                <p className="font-bold text-gray-900 truncate max-w-[200px]">{t.subject || t.enquiryType}</p>
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
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-sm uppercase translate-y-0 text-white/100">
                      <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-teal-600" />
                        Live Feed
                      </h3>
                      <div className="space-y-6">
                        {data.logs.slice(0, 5).map((log, i) => (
                          <div key={i} className="flex gap-4 relative">
                            {i !== 4 && <div className="absolute left-[11px] top-7 bottom-[-15px] w-px bg-gray-100" />}
                            <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 z-10">
                              <div className="h-2 w-2 rounded-full bg-teal-600" />
                            </div>
                            <div>
                                <p className="text-gray-900 font-bold leading-tight">{log.message || `Login detected: ${log.email}`}</p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-mono">
                                    {log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString() : 'Just now'}
                                </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeTab === 'customers' || activeTab === 'tickets' || activeTab === 'logs') && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 text-lg">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} List</h2>
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

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50/50 text-left">
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Identity</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Details</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data[activeTab as keyof typeof data]
                          .filter((item: any) => 
                            item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.subject?.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((item: any) => (
                            <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                                    {(item.name || item.customerName || item.email || 'U')[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-gray-900">{item.name || item.customerName || 'No Name'}</p>
                                    <p className="text-xs text-gray-500 lowercase">{item.email || 'no-email@system'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-xs text-gray-600 font-medium truncate max-w-[200px]">
                                  {item.message || item.subject || item.source || '-'}
                                </p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {item.status ? (
                                  <span className={`px-2 py-1 text-[10px] font-black rounded-lg uppercase ${
                                    item.status === 'Open' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                                  }`}>
                                    {item.status}
                                  </span>
                                ) : (
                                  <span className="text-gray-300 text-xs">—</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                                {item.createdAt?.seconds || item.timestamp?.seconds 
                                  ? new Date((item.createdAt?.seconds || item.timestamp?.seconds) * 1000).toLocaleDateString()
                                  : 'Today'}
                              </td>
                              <td className="px-6 py-4 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {activeTab === 'tickets' && (
                                    <button 
                                      onClick={() => updateTicketStatus(item.id, item.status)}
                                      className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                      title="Update Status"
                                    >
                                      <RefreshCcw size={16} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => deleteRecord(activeTab === 'logs' ? 'loginLogs' : activeTab, item.id)}
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
