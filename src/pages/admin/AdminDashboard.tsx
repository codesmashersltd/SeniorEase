import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CreditCard, 
  Ticket, 
  LogOut, 
  Search, 
  Bell,
  CheckCircle2,
  AlertCircle,
  Shield,
  HeartHandshake,
  Download,
  Trash2,
  LayoutDashboard,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, updatePassword } from 'firebase/auth';
import { db, auth } from '../../lib/firebase';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tickets, setTickets] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [renewals, setRenewals] = useState<any[]>([]);
  const [loginLogs, setLoginLogs] = useState<any[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
      return;
    }
    
    let unsubscribeTickets: (() => void) | null = null;
    let unsubscribeCustomers: (() => void) | null = null;
    let unsubscribeRenewals: (() => void) | null = null;
    let unsubscribeLogs: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDbError(null);
        // Fetch Tickets
        const qT = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
        unsubscribeTickets = onSnapshot(qT, (querySnapshot) => {
          const ticketsData: any[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            ticketsData.push({
              id: doc.id,
              ticketId: `TKT-${doc.id.substring(0, 6).toUpperCase()}`,
              customerName: data.name,
              email: data.email,
              service: data.enquiryType,
              status: data.status,
              source: data.source || 'Contact Us',
              date: data.createdAt?.toDate().toLocaleDateString() || 'Just now',
              message: data.message
            });
          });
          setTickets(ticketsData);
        }, (error) => setDbError(error.message));

        // Fetch Customers
        const qC = query(collection(db, 'customers'));
        unsubscribeCustomers = onSnapshot(qC, (querySnapshot) => {
          const customersData: any[] = [];
          querySnapshot.forEach((doc) => customersData.push({ id: doc.id, ...doc.data() }));
          setCustomers(customersData);
        }, (error) => console.error("Customers Error:", error));

        // Fetch Renewals
        const qR = query(collection(db, 'renewals'));
        unsubscribeRenewals = onSnapshot(qR, (querySnapshot) => {
          const renewalsData: any[] = [];
          querySnapshot.forEach((doc) => renewalsData.push({ id: doc.id, ...doc.data() }));
          setRenewals(renewalsData);
        }, (error) => console.error("Renewals Error:", error));

        // Fetch Login Logs
        const qL = query(collection(db, 'loginLogs'), orderBy('timestamp', 'desc'));
        unsubscribeLogs = onSnapshot(qL, (querySnapshot) => {
          const logsData: any[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            logsData.push({
              id: doc.id,
              customerName: data.customerName || 'Unknown',
              customerId: data.customerId || '---',
              dateStr: data.timestamp?.toDate().toLocaleString() || 'Just now',
              timestamp: data.timestamp
            });
          });
          setLoginLogs(logsData);
        }, (error) => console.error("Login Logs Error:", error));

      } else {
        navigate('/admin');
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeTickets) unsubscribeTickets();
      if (unsubscribeCustomers) unsubscribeCustomers();
      if (unsubscribeRenewals) unsubscribeRenewals();
      if (unsubscribeLogs) unsubscribeLogs();
    };
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin');
  };

  const handleDeleteDoc = async (colName: string, docId: string) => {
    if (window.confirm('Are you sure you want to delete this record? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, colName, docId));
      } catch (error: any) {
        console.error("Error deleting document:", error);
        alert(`Failed to delete: ${error.message}`);
      }
    }
  };

  const handleStatusChange = async (docId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'tickets', docId), { status: newStatus });
    } catch (error: any) {
      console.error("Error updating status:", error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordErr('');
    
    if (newPassword !== confirmPassword) {
      setPasswordErr("Passwords do not match.");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordErr("Password should be at least 6 characters.");
      return;
    }
    
    const user = auth.currentUser;
    if (!user) {
      setPasswordErr("No admin authenticated.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await updatePassword(user, newPassword);
      setPasswordMsg('Password has been successfully updated!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error("Error changing password:", error);
      if (error.code === 'auth/requires-recent-login') {
        setPasswordErr("For security, please log out and log back in before changing your password.");
      } else {
        setPasswordErr(error.message || "Failed to update password.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleExportCSV = () => {
    const joineeTickets = tickets.filter(t => t.source !== 'Dashboard');
    if (joineeTickets.length === 0) {
      alert("No new joinees to export.");
      return;
    }

    const headers = ["Enquiry ID", "Customer Name", "Email", "Details", "Message", "Source", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...joineeTickets.map(t => [
        `"${t.ticketId}"`,
        `"${t.customerName?.replace(/"/g, '""') || ''}"`,
        `"${t.email?.replace(/"/g, '""') || ''}"`,
        `"${t.service?.replace(/"/g, '""') || ''}"`,
        `"${t.message?.replace(/"/g, '""') || ''}"`,
        `"${t.source?.replace(/"/g, '""') || ''}"`,
        `"${t.status?.replace(/"/g, '""') || ''}"`,
        `"${t.date?.replace(/"/g, '""') || ''}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `new_joinees_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        const totalCustomers = customers.length;
        const pendingRenewals = renewals.filter(r => r.status === 'Pending').length;
        const paymentsReceived = renewals.filter(r => r.status === 'Paid').length;
        const paymentsInProgress = renewals.filter(r => r.status === 'In Progress').length;
        
        const openSupport = tickets.filter(t => t.source === 'Dashboard' && (t.status === 'Open' || t.status === 'In Progress')).length;
        const closedSupport = tickets.filter(t => t.source === 'Dashboard' && (t.status === 'Closed' || t.status === 'Resolved')).length;
        const openJoinee = tickets.filter(t => t.source !== 'Dashboard' && (t.status === 'Open' || t.status === 'In Progress')).length;
        const closedJoinee = tickets.filter(t => t.source !== 'Dashboard' && (t.status === 'Closed' || t.status === 'Resolved')).length;

        const statCards = [
          { title: "Total Customers", value: totalCustomers, icon: <Users size={24} className="text-teal-600" /> },
          { title: "Pending Renewals", value: pendingRenewals, icon: <AlertCircle size={24} className="text-amber-500" /> },
          { title: "Payments Received", value: paymentsReceived, icon: <CheckCircle2 size={24} className="text-green-500" /> },
          { title: "Payments In Progress", value: paymentsInProgress, icon: <CreditCard size={24} className="text-blue-500" /> },
          { title: "Open Support Tickets", value: openSupport, icon: <Ticket size={24} className="text-red-500" /> },
          { title: "Closed Support Tickets", value: closedSupport, icon: <CheckCircle2 size={24} className="text-gray-500" /> },
          { title: "New Joinee Requests", value: openJoinee, icon: <Users size={24} className="text-teal-500" /> },
          { title: "New Joinee Closed", value: closedJoinee, icon: <CheckCircle2 size={24} className="text-gray-500" /> },
        ];

        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {statCards.map((stat, i) => (
                 <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-gray-500 mb-2">{stat.title}</p>
                     <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                   </div>
                   <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                     {stat.icon}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        );

      case 'loginLogs':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Customer Login Activity</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Customer Name</th>
                    <th className="px-6 py-4 font-medium">Customer ID</th>
                    <th className="px-6 py-4 font-medium">Time Logged In (Local)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {loginLogs.length === 0 ? (
                     <tr>
                       <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                         No customer login logs found.
                       </td>
                     </tr>
                  ) : null}
                  {loginLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{log.customerName}</td>
                      <td className="px-6 py-4 font-mono text-gray-600">{log.customerId}</td>
                      <td className="px-6 py-4 text-gray-500">{log.dateStr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Live Customers</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Search customers..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none w-64" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Customer ID</th>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Plan</th>
                    <th className="px-6 py-4 font-medium">Join Date</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {customers.length === 0 ? (
                     <tr>
                       <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                         No customers found. Database is currently empty.
                       </td>
                     </tr>
                  ) : null}
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-teal-700 font-medium">{customer.id}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{customer.email}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{customer.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                          {customer.plan || 'Free Member'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{customer.joinDate}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteDoc('customers', customer.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Customer">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'renewals':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Upcoming Renewals & Invoices</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Customer Info</th>
                    <th className="px-6 py-4 font-medium">Plan</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Renewal Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {renewals.length === 0 ? (
                     <tr>
                       <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                         No renewals found. Database is currently empty.
                       </td>
                     </tr>
                  ) : null}
                  {renewals.map((renewal, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{renewal.name}</div>
                        <div className="font-mono text-xs text-gray-500 mt-0.5">{renewal.customerId}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{renewal.plan}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{renewal.amount}</td>
                      <td className="px-6 py-4 text-gray-500">{renewal.renewalDate}</td>
                      <td className="px-6 py-4">
                        {renewal.status === 'Paid' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800">
                            <CheckCircle2 size={14} /> Paid
                          </span>
                          ) : renewal.status === 'Failed' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800">
                              <AlertCircle size={14} /> Failed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
                              <AlertCircle size={14} /> Pending/In Progress
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDeleteDoc('renewals', renewal.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Renewal">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        );

      case 'tickets':
        const supportTickets = tickets.filter(t => t.source === 'Dashboard');
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Support Tickets</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Ticket ID</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Service Requested</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {dbError ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-red-500 font-medium">
                        {dbError}
                      </td>
                    </tr>
                  ) : supportTickets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No support tickets found from member dashboards.
                      </td>
                    </tr>
                  ) : null}
                  {supportTickets.map((ticket, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-teal-700">{ticket.ticketId}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{ticket.customerName}</div>
                        <div className="font-mono text-xs text-gray-500 mt-0.5">{ticket.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="font-medium">{ticket.service}</div>
                        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{ticket.message}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{ticket.date}</td>
                      <td className="px-6 py-4">
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-bold border-0 outline-none cursor-pointer focus:ring-2 focus:ring-teal-500 transition-colors ${
                            ticket.status === 'Open' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                            ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                            ticket.status === 'Closed' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' :
                            'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          <option value="Open" className="bg-white text-gray-900 font-medium">Open</option>
                          <option value="In Progress" className="bg-white text-gray-900 font-medium">In Progress</option>
                          <option value="Resolved" className="bg-white text-gray-900 font-medium">Resolved</option>
                          <option value="Closed" className="bg-white text-gray-900 font-medium">Closed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteDoc('tickets', ticket.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Ticket">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'joinees':
        const joineeTickets = tickets.filter(t => t.source !== 'Dashboard');
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">New Joinees (Leads & Enquiries)</h3>
              <div className="flex gap-3 items-center">
                <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full">New Leads</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Enquiry ID</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Details</th>
                    <th className="px-6 py-4 font-medium">Date / Source</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {dbError ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-red-500 font-medium">
                        {dbError}
                      </td>
                    </tr>
                  ) : joineeTickets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No new leads or enquiries found. When someone fills out the contact or join form, it will appear here.
                      </td>
                    </tr>
                  ) : null}
                  {joineeTickets.map((ticket, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-teal-700">{ticket.ticketId}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{ticket.customerName}</div>
                        <div className="font-mono text-xs text-gray-500 mt-0.5">{ticket.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="font-medium">{ticket.service}</div>
                        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{ticket.message}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <div>{ticket.date}</div>
                        <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                          {ticket.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-bold border-0 outline-none cursor-pointer focus:ring-2 focus:ring-teal-500 transition-colors ${
                            ticket.status === 'Open' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                            ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                            ticket.status === 'Closed' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' :
                            'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          <option value="Open" className="bg-white text-gray-900 font-medium">Open</option>
                          <option value="In Progress" className="bg-white text-gray-900 font-medium">In Progress</option>
                          <option value="Resolved" className="bg-white text-gray-900 font-medium">Resolved</option>
                          <option value="Closed" className="bg-white text-gray-900 font-medium">Closed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteDoc('tickets', ticket.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Lead">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Generate Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-start gap-4">
                <h3 className="font-bold text-gray-900 text-lg">Customers Report</h3>
                <p className="text-sm text-gray-500 flex-grow">Export all live customer data from the database.</p>
                <button
                  onClick={() => {
                    if (customers.length === 0) { alert("No customers to export."); return; }
                    const headers = ["Customer ID", "Name", "Email", "Phone", "Plan", "Join Date"];
                    const csv = [headers.join(","), ...customers.map(c => [
                      `"${c.id}"`, `"${c.name?.replace(/"/g, '""') || ''}"`, `"${c.email?.replace(/"/g, '""') || ''}"`,
                      `"${c.phone?.replace(/"/g, '""') || ''}"`, `"${c.plan?.replace(/"/g, '""') || ''}"`, `"${c.joinDate?.replace(/"/g, '""') || ''}"`
                    ].join(","))].join("\n");
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
                    link.download = `customers_report_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                  }}
                  className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors w-full justify-center"
                >
                  <Download size={18} />
                  Download Customers CSV
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-start gap-4">
                <h3 className="font-bold text-gray-900 text-lg">Renewals & Payments</h3>
                <p className="text-sm text-gray-500 flex-grow">Export all payment histories and upcoming renewals.</p>
                <button
                  onClick={() => {
                    if (renewals.length === 0) { alert("No renewals to export."); return; }
                    const headers = ["Customer ID", "Name", "Plan", "Amount", "Renewal Date", "Status"];
                    const csv = [headers.join(","), ...renewals.map(r => [
                      `"${r.customerId?.replace(/"/g, '""') || ''}"`, `"${r.name?.replace(/"/g, '""') || ''}"`, `"${r.plan?.replace(/"/g, '""') || ''}"`,
                      `"${r.amount?.replace(/"/g, '""') || ''}"`, `"${r.renewalDate?.replace(/"/g, '""') || ''}"`, `"${r.status?.replace(/"/g, '""') || ''}"`
                    ].join(","))].join("\n");
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
                    link.download = `renewals_report_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                  }}
                  className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors w-full justify-center"
                >
                  <Download size={18} />
                  Download Renewals CSV
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-start gap-4">
                <h3 className="font-bold text-gray-900 text-lg">New Joinee Leads</h3>
                <p className="text-sm text-gray-500 flex-grow">Export all sales enquiries and leads that arrived through the 'Join Now' and 'Book Intro' forms.</p>
                <button
                  onClick={handleExportCSV}
                  className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors w-full justify-center"
                >
                  <Download size={18} />
                  Download Joinees CSV
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-start gap-4">
                <h3 className="font-bold text-gray-900 text-lg">Support Tickets</h3>
                <p className="text-sm text-gray-500 flex-grow">Export all support requests submitted by active members via their dashboard.</p>
                <button
                  onClick={() => {
                    const suppTickets = tickets.filter(t => t.source === 'Dashboard');
                    if (suppTickets.length === 0) { alert("No tickets to export."); return; }
                    const headers = ["Ticket ID", "Customer", "Email", "Service", "Message", "Status", "Date"];
                    const csv = [headers.join(","), ...suppTickets.map(t => [
                      `"${t.ticketId}"`, `"${t.customerName?.replace(/"/g, '""') || ''}"`, `"${t.email?.replace(/"/g, '""') || ''}"`,
                      `"${t.service?.replace(/"/g, '""') || ''}"`, `"${t.message?.replace(/"/g, '""') || ''}"`,
                      `"${t.status?.replace(/"/g, '""') || ''}"`, `"${t.date?.replace(/"/g, '""') || ''}"`
                    ].join(","))].join("\n");
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
                    link.download = `support_tickets_report_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                  }}
                  className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors w-full justify-center"
                >
                  <Download size={18} />
                  Download Tickets CSV
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'adminProfile':
        return (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900">Admin Profile Settings</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">Account Security</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Change your admin password below. Make sure you use a secure password. If you originally signed in with Google, you will need to log out and use Email/Password sign-in to utilize this password, assuming Email/Password auth is enabled in Firebase.
                </p>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {passwordMsg && (
                    <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg text-sm mb-4">
                      {passwordMsg}
                    </div>
                  )}
                  {passwordErr && (
                    <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg text-sm mb-4">
                      {passwordErr}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="Confirm new password"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={isChangingPassword}
                      className="bg-teal-600 text-white font-medium py-2 px-6 rounded-lg shadow hover:bg-teal-700 transition disabled:bg-teal-800 disabled:cursor-not-allowed"
                    >
                      {isChangingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="p-6 flex items-start gap-4">
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                   <Shield size={24} />
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2">Authenticated Admin</h3>
                   <div className="text-sm text-gray-600 space-y-1">
                     <p><span className="font-medium text-gray-900">ID:</span> {auth.currentUser?.uid || 'Unknown'}</p>
                     <p><span className="font-medium text-gray-900">Email:</span> {auth.currentUser?.email || 'Unknown'}</p>
                     <p><span className="font-medium text-gray-900">Provider:</span> {auth.currentUser?.providerData[0]?.providerId || 'Unknown'}</p>
                   </div>
                 </div>
               </div>
            </div>
            
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-gray-300 flex flex-col hidden md:flex min-h-screen">
        <div className="p-6 flex items-center gap-3 text-white border-b border-gray-800">
          <div className="bg-teal-600 p-2 rounded-xl">
            <HeartHandshake size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-wide">Admin Portal</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'dashboard' ? 'bg-teal-600 text-white shadow-md' : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'customers' ? 'bg-teal-600 text-white shadow-md' : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Users size={20} />
            Customers
          </button>
          <button 
            onClick={() => setActiveTab('renewals')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'renewals' ? 'bg-teal-600 text-white shadow-md' : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            <CreditCard size={20} />
            Renewals
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'tickets' ? 'bg-teal-600 text-white shadow-md' : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Ticket size={20} />
            Support Tickets
          </button>
          <button 
            onClick={() => setActiveTab('joinees')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'joinees' ? 'bg-teal-600 text-white shadow-md' : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Users size={20} />
            New Joinee
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'reports' ? 'bg-teal-600 text-white shadow-md' : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            <FileText size={20} />
            Reports
          </button>
          <button 
            onClick={() => setActiveTab('loginLogs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'loginLogs' ? 'bg-teal-600 text-white shadow-md' : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Shield size={20} />
            Login Logs
          </button>
          <button 
            onClick={() => setActiveTab('adminProfile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'adminProfile' ? 'bg-teal-600 text-white shadow-md' : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Shield size={20} />
            Admin Profile
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between md:hidden -mx-0">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-1.5 rounded-xl">
              <HeartHandshake size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">Admin Portal</span>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
            <LogOut size={20} />
          </button>
        </header>

        {/* Mobile Tabs */}
        <div className="bg-white border-b border-gray-200 px-2 flex overflow-x-auto md:hidden no-scrollbar">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'dashboard' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'customers' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500'}`}
          >
            Customers
          </button>
          <button 
            onClick={() => setActiveTab('renewals')}
            className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'renewals' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500'}`}
          >
            Renewals
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'tickets' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500'}`}
          >
            Tickets
          </button>
          <button 
            onClick={() => setActiveTab('joinees')}
            className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'joinees' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500'}`}
          >
            New Joinee
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'reports' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500'}`}
          >
            Reports
          </button>
          <button 
            onClick={() => setActiveTab('loginLogs')}
            className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'loginLogs' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500'}`}
          >
            Login Logs
          </button>
          <button 
            onClick={() => setActiveTab('adminProfile')}
            className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'adminProfile' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500'}`}
          >
            Admin Profile
          </button>
        </div>

        {/* Topbar (Desktop) */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 hidden md:flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 capitalize tracking-tight">
            {activeTab.replace(/([A-Z])/g, ' $1').trim()}
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <button 
              onClick={() => setActiveTab('adminProfile')}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-sm">
                A
              </div>
              <span className="text-sm font-bold text-gray-700">Admin User</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-8 flex-1 overflow-y-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
