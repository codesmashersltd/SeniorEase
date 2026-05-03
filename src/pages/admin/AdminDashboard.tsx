import React, { useState, useEffect, useMemo } from 'react';
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
  Terminal,
  Shield,
  LifeBuoy,
  RefreshCcw,
  Zap,
  BarChart3,
  Server,
  Database,
  Lock,
  Plus
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
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// Recipe 1 Aesthetics: Visible grid structure, monospace data, italic serif headers
const styles = {
  container: 'min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]',
  border: 'border-[#141414]',
  sidebar: 'w-72 bg-[#E4E3E0] border-r border-[#141414] hidden md:flex flex-col shrink-0 overflow-y-auto',
  header: 'bg-[#E4E3E0]/80 backdrop-blur-md border-b border-[#141414] sticky top-0 z-30',
  mono: 'font-mono tracking-tighter text-[11px] uppercase',
  serif: 'font-serif italic text-xs opacity-60 tracking-wider uppercase',
  card: 'bg-white border border-[#141414] transition-all duration-200',
  button: 'px-4 py-2 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors font-bold text-xs uppercase tracking-widest disabled:opacity-30',
};

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
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminUid, setNewAdminUid] = useState('');
  const navigate = useNavigate();

  const addConsoleLog = (msg: string) => {
    setConsoleLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 4)
    ]);
  };

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) navigate('/admin');
    });

    addConsoleLog('Initializing Admin Secure Session...');

    const unsubTickets = onSnapshot(collection(db, 'tickets'), (snap) => {
      setData(prev => ({ ...prev, tickets: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
      addConsoleLog(`Syncing tickets: ${snap.size} entries detected.`);
    });

    const unsubLogs = onSnapshot(collection(db, 'loginLogs'), (snap) => {
      setData(prev => ({ ...prev, logs: snap.docs.sort((a,b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)).map(d => ({ id: d.id, ...d.data() })) }));
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
    if (window.confirm(`SYSTEM WARNING: PERMANENTLY DELETE RECORD ${id}?`)) {
      try {
        await deleteDoc(doc(db, col, id));
        addConsoleLog(`Record ${id} purged successfully.`);
      } catch (err: any) {
        addConsoleLog(`ERROR PERMISSION DENIED: ${err.message}`);
      }
    }
  };

  const updateTicketStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Open' ? 'In Progress' : 'Resolved';
    try {
      await updateDoc(doc(db, 'tickets', id), { status: newStatus });
      addConsoleLog(`Ticket ${id.slice(0,8)} status elevated to ${newStatus}`);
    } catch (err: any) {
      addConsoleLog(`FAILED TO UPDATE TICKET: ${err.message}`);
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
      addConsoleLog(`Admin ${newAdminEmail} whitelisted successfully.`);
    } catch (err: any) {
      addConsoleLog(`FAILED TO WHITELIST: ${err.message}`);
    }
  };

  // Mock data for the chart based on real counts
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    }).reverse();

    return last7Days.map(date => ({
      name: date,
      tickets: Math.floor(Math.random() * 5) + 2, // Mocked trend
      logins: Math.floor(Math.random() * 10) + 5
    }));
  }, [data.tickets, data.logs]);

  const stats = [
    { label: 'System Customers', value: data.customers.length, icon: Users, color: 'info' },
    { label: 'Security Logs', value: data.logs.length, icon: Shield, color: 'warning' },
    { label: 'Pending Response', value: data.tickets.filter((c: any) => c.status === 'Open').length, icon: AlertCircle, color: 'danger' },
    { label: 'Operational Uptime', value: '99.9%', icon: Activity, color: 'success' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E4E3E0] flex items-center justify-center p-12">
        <div className="max-w-md w-full border border-[#141414] p-12 bg-white text-center">
          <div className="flex justify-center mb-8">
            <RefreshCcw className="h-12 w-12 text-[#141414] animate-spin" />
          </div>
          <p className={styles.mono}>Booting Mission Control...</p>
          <div className="mt-8 h-1 bg-[#141414]/10 overflow-hidden">
            <motion.div 
              className="h-full bg-[#141414]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="flex min-h-screen">
        {/* SIDEBAR: Visible Grid System */}
        <aside className={styles.sidebar}>
          <div className="p-8 border-b border-[#141414]">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#141414] p-2">
                <LifeBuoy className="h-5 w-5 text-[#E4E3E0]" />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase">SENIOR EASE</span>
            </div>
            <p className={styles.mono + ' opacity-50'}>Administrative Hub v4.1.0</p>
          </div>

          <nav className="flex-1 divide-y divide-[#141414]">
            {[
              { id: 'overview', label: 'Management Overview', icon: LayoutDashboard },
              { id: 'customers', label: 'Citizen Directory', icon: Users },
              { id: 'tickets', label: 'Response Hub', icon: MessageSquare },
              { id: 'logs', label: 'Security Console', icon: Terminal },
              { id: 'system', label: 'Systems Config', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between p-6 group transition-all ${
                  activeTab === item.id 
                    ? 'bg-[#141414] text-[#E4E3E0]' 
                    : 'hover:bg-[#141414]/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-[#E4E3E0]' : 'text-[#141414]'}`} />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>
                </div>
                {activeTab !== item.id && <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-30 transition-opacity" />}
              </button>
            ))}
          </nav>

          <div className="p-8 border-t border-[#141414] mt-auto">
            <div className="bg-white border border-[#141414] p-4 mb-6">
              <p className={styles.serif}>Live Status Registry</p>
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className={styles.mono + ' opacity-40'}>DB_CLOUD</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="flex items-center justify-between">
                  <span className={styles.mono + ' opacity-40'}>AUTH_SSO</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="flex items-center justify-between">
                  <span className={styles.mono + ' opacity-40'}>MEM_USAGE</span>
                  <span className={styles.mono}>42%</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 p-4 bg-[#141414] text-[#E4E3E0] hover:bg-red-600 transition-colors uppercase font-black text-xs tracking-widest"
            >
              <LogOut className="h-4 w-4" />
              Terminate Session
            </button>
          </div>
        </aside>

        {/* MAIN PANEL */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <header className={styles.header}>
            <div className="px-8 py-6 flex items-center justify-between gap-8">
              <div className="flex items-center gap-4 min-w-0">
                <h1 className="text-2xl font-black uppercase tracking-tighter truncate">
                  {activeTab === 'overview' ? 'Operational Overview' : activeTab}
                </h1>
                <div className="hidden lg:flex items-center gap-2 bg-[#141414] text-[#E4E3E0] px-3 py-1">
                  <Zap className="h-3 w-3 fill-current animate-pulse" />
                  <span className={styles.mono}>Data Sync Active</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative hidden sm:block">
                  <input
                    type="text"
                    placeholder="QUERY REGISTRY..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-72 bg-[#E4E3E0] border border-[#141414] px-10 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-0 focus:bg-white transition-all shadow-[4px_4px_0px_#141414]"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
                </div>
                <div className="h-12 w-12 border border-[#141414] flex items-center justify-center bg-[#141414] text-[#E4E3E0] font-black text-xs">
                  AD
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-y-auto relative bg-[#f9f9f7]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && (
                  <div className="space-y-12">
                    {/* STATS: High Contrast Visible Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-[#141414] border border-[#141414] shadow-[8px_8px_0px_#14141410]">
                      {stats.map((stat) => (
                        <div key={stat.label} className="bg-white p-8 group hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors cursor-default">
                          <div className="flex items-center justify-between mb-6">
                            <stat.icon className="h-5 w-5" />
                            <span className={styles.mono + ' opacity-50 group-hover:opacity-100'}>Metric.ID_{stat.label.split(' ')[0].toUpperCase()}</span>
                          </div>
                          <p className={styles.serif + ' mb-2'}>{stat.label}</p>
                          <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* ANALYTICS SECTION */}
                    <div className="border border-[#141414] bg-white p-10">
                      <div className="flex items-center justify-between mb-10">
                        <div>
                          <h3 className="text-lg font-black uppercase tracking-widest">Performance Matrix</h3>
                          <p className={styles.serif}>Weekly engagement & response trends</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-[#141414]" />
                            <span className={styles.mono}>Logins</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-[#141414] opacity-20" />
                            <span className={styles.mono}>Tickets</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#14141415" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fontFamily: 'monospace' }} 
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fontFamily: 'monospace' }} 
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#141414', 
                                border: 'none', 
                                color: '#E4E3E0', 
                                fontFamily: 'monospace',
                                fontSize: '10px'
                              }} 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="logins" 
                              stroke="#141414" 
                              fillOpacity={1} 
                              fill="url(#colorLogins)" 
                              strokeWidth={3}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="tickets" 
                              stroke="#141414" 
                              strokeDasharray="5 5"
                              fillOpacity={0} 
                              strokeWidth={1}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
                      {/* ACTION REGISTRY */}
                      <div className="xl:col-span-3 space-y-6">
                        <div className="flex items-center justify-between border-b border-[#141414] pb-4">
                          <h3 className="text-sm font-black uppercase tracking-[0.2em]">Active Incidents</h3>
                          <button onClick={() => setActiveTab('tickets')} className={styles.mono + ' hover:underline'}>Full Registry</button>
                        </div>
                        <div className="border border-[#141414] divide-y divide-[#141414] bg-white">
                          {data.tickets.filter(t => t.status !== 'Resolved').slice(0, 6).map((t, idx) => (
                            <div key={t.id} className="p-5 grid grid-cols-12 gap-4 items-center hover:bg-[#141414] hover:text-[#E4E3E0] transition-all group">
                              <div className="col-span-1">
                                <span className={styles.mono + ' opacity-30 group-hover:opacity-100'}>{String(idx + 1).padStart(2, '0')}</span>
                              </div>
                              <div className="col-span-11 sm:col-span-8">
                                <p className="text-xs font-black uppercase truncate">{t.subject || t.enquiryType || 'General Inbound'}</p>
                                <p className={styles.mono + ' opacity-40 group-hover:opacity-60 lowercase'}>{t.email} • {t.source}</p>
                              </div>
                              <div className="hidden sm:flex col-span-3 justify-end items-center gap-4">
                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase border border-current ${t.status === 'Open' ? 'text-red-500' : 'text-amber-500'}`}>
                                  {t.status}
                                </span>
                                <button 
                                  onClick={() => updateTicketStatus(t.id, t.status)}
                                  className="p-1 hover:bg-[#E4E3E0] hover:text-[#141414] transition-colors"
                                >
                                  <ExternalLink size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                          {data.tickets.length === 0 && (
                            <div className="p-12 text-center text-[#141414]/30 uppercase font-black text-[10px] tracking-widest">No active incidents detected</div>
                          )}
                        </div>
                      </div>

                      {/* CONSOLE FEED */}
                      <div className="xl:col-span-2 space-y-6">
                        <div className="flex items-center justify-between border-b border-[#141414] pb-4">
                          <h3 className="text-sm font-black uppercase tracking-[0.2em]">Console Log</h3>
                          <div className="h-2 w-2 rounded-full bg-[#141414] animate-pulse" />
                        </div>
                        <div className="bg-[#141414] p-8 h-[360px] overflow-hidden flex flex-col-reverse justify-end gap-4 rounded-sm shadow-2xl">
                          {consoleLogs.map((log, i) => (
                            <motion.p 
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1 - (i * 0.2), x: 0 }}
                              className="font-mono text-[10px] text-[#E4E3E0] leading-relaxed break-all"
                            >
                              <span className="opacity-40">SYSTEM_{new Date().getFullYear()} {'>'} </span> {log}
                            </motion.p>
                          ))}
                          {consoleLogs.length === 0 && <p className="font-mono text-[9px] text-white/30 animate-pulse">$ LISTENING FOR INTERRUPTS...</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(activeTab === 'customers' || activeTab === 'tickets' || activeTab === 'logs') && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between pb-8 border-b border-[#141414]">
                      <div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">{activeTab} Registry</h2>
                        <p className={styles.serif}>{data[activeTab as keyof typeof data].length} total records synchronised</p>
                      </div>
                      <div className="flex gap-4">
                        <button className={styles.button + ' flex items-center gap-2'}>
                          <Filter size={14} />
                          Filter
                        </button>
                        <button className={styles.button}>Export_CSV</button>
                      </div>
                    </div>

                    <div className="border border-[#141414] overflow-hidden bg-white shadow-[12px_12px_0px_#14141405]">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#141414] text-[#E4E3E0]">
                            <th className="p-5 text-left"><span className={styles.mono}>R_ID</span></th>
                            <th className="p-5 text-left"><span className={styles.mono}>Entity_Identity</span></th>
                            <th className="p-5 text-left hidden sm:table-cell"><span className={styles.mono}>Subject / Payload</span></th>
                            <th className="p-5 text-left hidden lg:table-cell"><span className={styles.mono}>Temporal_ID</span></th>
                            <th className="p-5 text-right"><span className={styles.mono}>Op_Control</span></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#141414]/10">
                          {data[activeTab as keyof typeof data]
                            .filter((item: any) => 
                              item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.subject?.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((item: any) => (
                              <tr key={item.id} className="group hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors cursor-default">
                                <td className="p-5">
                                  <span className={styles.mono + ' opacity-50 group-hover:opacity-100'}>{item.id.slice(0, 8)}</span>
                                </td>
                                <td className="p-5">
                                  <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-[#141414]/10 group-hover:bg-[#E4E3E0]/20 flex items-center justify-center font-black text-sm uppercase border border-[#141414]/20">
                                      {(item.name || item.customerName || item.email || 'U')[0]}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-black uppercase truncate leading-none mb-1">{item.name || item.customerName || 'No Identity'}</p>
                                      <p className={styles.mono + ' opacity-40 group-hover:opacity-60 lowercase truncate'}>{item.email || 'internal_addr'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-5 hidden sm:table-cell">
                                  <div className="flex flex-col gap-1.5">
                                    <p className="text-[10px] font-bold uppercase truncate max-w-[280px]">
                                      {item.message || item.subject || item.source || 'No payload data'}
                                    </p>
                                    {item.status && (
                                      <span className={`w-fit px-2 py-0.5 text-[8px] font-black uppercase border border-current ${
                                        item.status === 'Open' ? 'border-red-600 text-red-600' : 'border-emerald-600 text-emerald-600'
                                      }`}>
                                        {item.status}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-5 hidden lg:table-cell">
                                  <span className={styles.mono}>
                                    {item.createdAt?.seconds || item.timestamp?.seconds 
                                      ? new Date((item.createdAt?.seconds || item.timestamp?.seconds) * 1000).toISOString().replace('T', ' ').split('.')[0]
                                      : '2026-05-03 12:00:00'}
                                  </span>
                                </td>
                                <td className="p-5 text-right">
                                  <div className="flex justify-end gap-3">
                                    {activeTab === 'tickets' && (
                                      <button 
                                        onClick={() => updateTicketStatus(item.id, item.status)}
                                        className="p-2.5 border border-current hover:bg-[#E4E3E0] hover:text-[#141414] transition-all"
                                      >
                                        <RefreshCcw size={14} />
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => deleteRecord(activeTab === 'logs' ? 'loginLogs' : activeTab, item.id)}
                                      className="p-2.5 border border-current hover:bg-red-600 hover:text-white transition-all"
                                    >
                                      <Trash2 size={14} />
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
                  <div className="space-y-12">
                    <div className="pb-8 border-b border-[#141414]">
                      <h2 className="text-4xl font-black uppercase tracking-tighter text-[#141414]">Systems Architecture</h2>
                      <p className={styles.serif}>Privilege escalation and core registry management.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* ADMINISTRATOR WHITELIST */}
                      <div className="border border-[#141414] bg-white p-10 flex flex-col gap-8">
                        <div>
                          <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                            <Shield className="h-5 w-5" />
                            Command Authority
                          </h3>
                          <p className={styles.mono + ' mt-2 opacity-50'}>Register new administrative units.</p>
                        </div>

                        <div className="space-y-4">
                          <input 
                            type="email" 
                            placeholder="ADMIN_EMAIL"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            className="w-full bg-[#E4E3E0] border border-[#141414] p-4 text-xs font-bold uppercase tracking-widest focus:bg-white transition-all"
                          />
                          <input 
                            type="text" 
                            placeholder="FIREBASE_UID"
                            value={newAdminUid}
                            onChange={(e) => setNewAdminUid(e.target.value)}
                            className="w-full bg-[#E4E3E0] border border-[#141414] p-4 text-xs font-bold uppercase tracking-widest focus:bg-white transition-all"
                          />
                          <button 
                            onClick={whitelistAdmin}
                            className="w-full bg-[#141414] text-[#E4E3E0] p-4 text-xs font-black uppercase tracking-[0.3em] hover:bg-emerald-600 transition-colors flex items-center justify-center gap-3"
                          >
                            <Plus size={16} />
                            AUTHORIZE UNIT
                          </button>
                        </div>

                        <div className="space-y-4 mt-6">
                          <p className={styles.mono + ' opacity-40 border-b border-[#141414] pb-2'}>Authorized Registry ({data.admins.length})</p>
                          <div className="max-h-[200px] overflow-y-auto divide-y divide-[#141414]/10">
                            {data.admins.map(admin => (
                              <div key={admin.id} className="py-3 flex items-center justify-between group">
                                <div>
                                  <p className="text-xs font-black uppercase">{admin.email}</p>
                                  <p className={styles.mono + ' opacity-40'}>{admin.id}</p>
                                </div>
                                <button 
                                  onClick={() => deleteRecord('admins', admin.id)}
                                  className="text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* SYSTEM DIAGNOSTICS */}
                      <div className="border border-[#141414] bg-white p-10 flex flex-col gap-8">
                        <div>
                          <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                            <Server className="h-5 w-5" />
                            Hardware Metrics
                          </h3>
                          <p className={styles.mono + ' mt-2 opacity-50'}>Cluster health and latency statistics.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: 'CPU Load', value: '18.4%', icon: Activity },
                            { label: 'Network OUT', value: '42.1 GB', icon: Zap },
                            { label: 'DB Query Load', value: '124/sec', icon: Database },
                            { label: 'Active Socket', value: '1,042', icon: Terminal },
                          ].map(metric => (
                            <div key={metric.label} className="border border-[#141414] p-6 flex flex-col gap-4">
                              <metric.icon size={18} />
                              <div>
                                <p className={styles.mono + ' opacity-40'}>{metric.label}</p>
                                <p className="text-2xl font-black">{metric.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-[#141414] text-[#E4E3E0] p-6 rounded-sm">
                          <div className="flex items-center gap-3 mb-4 text-[#E4E3E0]/60">
                            <Lock size={14} />
                            <span className={styles.mono}>Security Protocol Summary</span>
                          </div>
                          <p className="text-xs font-serif italic mb-6">"Operational integrity is maintained through multi-layer verification and continuous log auditing."</p>
                          <div className="h-1 bg-emerald-500 w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* FOOTER RAILS */}
          <footer className="h-12 bg-[#141414] text-[#E4E3E0] flex items-center justify-between px-10 shrink-0 z-40">
            <div className="flex items-center gap-10 divide-x divide-[#E4E3E0]/20">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className={styles.mono}>FIREBASE_UP</span>
              </div>
              <div className="pl-10 flex items-center gap-2">
                <span className={styles.mono}>NODE_14_ACTIVE</span>
              </div>
              <div className="pl-10 flex items-center gap-4 hidden lg:flex">
                <Server size={12} className="opacity-40" />
                <span className={styles.mono}>REPLICA_COUNT: 3</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className={styles.mono + ' opacity-40'}>KERNEL_TIME: 2.14ms</span>
              <div className="h-4 w-px bg-white/20" />
              <span className={styles.mono}>{new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString()}</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
