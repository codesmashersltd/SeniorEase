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
  Settings
} from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc, onSnapshot, limit } from 'firebase/firestore';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'tickets' | 'logs'>('overview');
  const [data, setData] = useState<{
    customers: any[];
    tickets: any[];
    logs: any[];
  }>({ customers: [], tickets: [], logs: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) navigate('/admin');
    });

    // Real-time listeners for stats
    const unsubTickets = onSnapshot(collection(db, 'tickets'), (snap) => {
      setData(prev => ({ ...prev, tickets: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
    });

    const unsubLogs = onSnapshot(collection(db, 'loginLogs'), (snap) => {
      setData(prev => ({ ...prev, logs: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
    });

    const unsubCustomers = onSnapshot(collection(db, 'customers'), (snap) => {
      setData(prev => ({ ...prev, customers: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
      setLoading(false);
    });

    return () => {
      unsubAuth();
      unsubTickets();
      unsubLogs();
      unsubCustomers();
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
      } catch (err) {
        alert('Failed to delete: ' + err);
      }
    }
  };

  const stats = [
    { label: 'Total Customers', value: data.customers.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Support Tickets', value: data.tickets.length, icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Recent Logins', value: data.logs.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Open Tickets', value: data.tickets.filter((c: any) => c.status === 'Open').length, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Senior Ease</span>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'tickets', label: 'Tickets', icon: MessageSquare },
              { id: 'logs', label: 'Login Logs', icon: Clock },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 capitalize">
              {activeTab === 'overview' ? 'Hello Admin' : activeTab}
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Current Tickets</h2>
                    <button onClick={() => setActiveTab('tickets')} className="text-sm text-indigo-600 font-bold hover:text-indigo-700">View all</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {data.tickets.filter(t => t.status !== 'Resolved').slice(0, 6).map((item) => (
                      <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${item.source === 'Contact Us' ? 'bg-teal-50 text-teal-600' : 'bg-blue-50 text-blue-600'}`}>
                            <MessageSquare className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.subject || item.enquiryType || 'General Enquiry'}</p>
                            <p className="text-xs text-gray-500">by {item.name || item.email}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          item.status === 'Open' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {item.status || 'pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">Recent Logins</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {data.logs.slice(0, 8).map((log) => (
                      <div key={log.id} className="px-6 py-4 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{log.customerName}</p>
                          <p className="text-[10px] text-gray-400 truncate">{log.source} • {log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString() : 'Recent'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'customers' || activeTab === 'tickets' || activeTab === 'logs') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Entry</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Description</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Info</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data[activeTab as keyof typeof data]
                      .filter((item: any) => 
                        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.subject?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs uppercase">
                                {(item.name || item.customerName || item.email || 'U')[0]}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{item.name || item.customerName || 'No Name'}</p>
                                <p className="text-[10px] text-gray-400 truncate font-medium">{item.email || item.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <p className="text-sm text-gray-600 truncate">{item.message || item.subject || item.source || '-'}</p>
                              <p className="text-[10px] text-gray-400">{item.enquiryType || ''}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                <Calendar size={10} />
                                {item.createdAt?.seconds || item.timestamp?.seconds 
                                  ? new Date((item.createdAt?.seconds || item.timestamp?.seconds) * 1000).toLocaleDateString() 
                                  : 'Today'}
                              </span>
                              {item.status && (
                                <span className={`w-fit px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                                  item.status === 'Open' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                  {item.status}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => deleteRecord(activeTab === 'logs' ? 'loginLogs' : activeTab, item.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {data[activeTab as keyof typeof data].length === 0 && (
                <div className="p-20 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 bg-gray-100 rounded-2xl mb-4">
                    <Search className="h-8 w-8 text-gray-300" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">No records to display</h3>
                  <p className="text-xs text-gray-400 mt-1">Check back later or try a different search.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
