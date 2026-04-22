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
  HeartHandshake
} from 'lucide-react';
import { motion } from 'motion/react';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock Data
const mockCustomers = [
  { id: 'SE-123456', name: 'John Doe', email: 'john@example.com', phone: '07700 900001', plan: 'Plus SaaS', joinDate: '2023-11-15' },
  { id: 'SE-789012', name: 'Sarah Smith', email: 'sarah.s@example.com', phone: '07700 900002', plan: 'Family Portal', joinDate: '2024-01-22' },
  { id: 'SE-345678', name: 'Michael Brown', email: 'mbrown@example.com', phone: '07700 900003', plan: 'Essential SaaS', joinDate: '2024-02-10' },
  { id: 'SE-901234', name: 'Emma Wilson', email: 'emma.wilson@example.com', phone: '07700 900004', plan: 'Plus SaaS', joinDate: '2023-09-05' },
];

const mockRenewals = [
  { id: 'SE-901234', name: 'Emma Wilson', plan: 'Plus SaaS', renewalDate: '2024-05-05', status: 'Pending', amount: '£17.99' },
  { id: 'SE-123456', name: 'John Doe', plan: 'Plus SaaS', renewalDate: '2024-05-15', status: 'Paid', amount: '£17.99' },
  { id: 'SE-789012', name: 'Sarah Smith', plan: 'Family Portal', renewalDate: '2024-05-22', status: 'Failed', amount: '£29.99' },
  { id: 'SE-345678', name: 'Michael Brown', plan: 'Essential SaaS', renewalDate: '2024-05-28', status: 'Pending', amount: '£9.99' },
];

const mockTickets = [
  { ticketId: 'TKT-849201', customerId: 'SE-345678', customerName: 'Michael Brown', service: 'Email Setup', status: 'Open', date: '2024-04-20' },
  { ticketId: 'TKT-129384', customerId: 'SE-123456', customerName: 'John Doe', service: 'Device Configuration', status: 'In Progress', date: '2024-04-19' },
  { ticketId: 'TKT-564738', customerId: 'SE-789012', customerName: 'Sarah Smith', service: 'Video Call Help', status: 'Resolved', date: '2024-04-15' },
];

const revenueData = [
  { name: 'Jan', received: 1200, inProgress: 150, failed: 0 },
  { name: 'Feb', received: 1500, inProgress: 200, failed: 50 },
  { name: 'Mar', received: 1800, inProgress: 100, failed: 0 },
  { name: 'Apr', received: 1400, inProgress: 600, failed: 100 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customers');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'customers':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">All Customers</h3>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {mockCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-teal-700 font-medium">{customer.id}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{customer.email}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{customer.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                          {customer.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{customer.joinDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'renewals':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Analytics</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `£${value}`} />
                    <Tooltip cursor={{fill: '#f3f4f6'}} formatter={(value) => `£${value}`} />
                    <Legend />
                    <Bar dataKey="received" name="Received" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="inProgress" name="In Progress" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {mockRenewals.map((renewal, index) => (
                      <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{renewal.name}</div>
                          <div className="font-mono text-xs text-gray-500 mt-0.5">{renewal.id}</div>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'tickets':
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {mockTickets.map((ticket, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-teal-700">{ticket.ticketId}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{ticket.customerName}</div>
                        <div className="font-mono text-xs text-gray-500 mt-0.5">{ticket.customerId}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{ticket.service}</td>
                      <td className="px-6 py-4 text-gray-500">{ticket.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                          ticket.status === 'Open' ? 'bg-red-100 text-red-800' :
                          ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between md:hidden">
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
        <div className="bg-white border-b border-gray-200 px-2 flex overflow-x-auto md:hidden">
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
        </div>

        {/* Topbar (Desktop) */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 hidden md:flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 capitalize tracking-tight">
            {activeTab.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-sm">
                A
              </div>
              <span className="text-sm font-bold text-gray-700">Admin User</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-8 flex-1 overflow-y-auto">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Renewals</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <Ticket size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>

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
