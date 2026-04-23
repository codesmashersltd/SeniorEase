// App.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, StyleSheet, Alert, SafeAreaView, Image } from 'react-native';
import { CheckCircle2, HeartHandshake } from 'lucide-react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig'; 

export default function MobileDashboard() {
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState('');

  const services = [
    'Smartphone & Tablet Learning', 'WhatsApp & Video Call', 
    'Email & Password Learning', 'Scam Awareness', 
    'Online Shopping', 'Entertainment Apps', 
    'Online Forms & Admin', 'Family Support'
  ];

  const handleLogin = async () => {
    if (!customerName || !customerId || !password) {
      Alert.alert('Error', 'Please enter your Name, Unique Customer ID, and Password.');
      return;
    }
    setIsLoggedIn(true);
    try {
      await addDoc(collection(db, 'loginLogs'), {
        customerName: customerName,
        customerId: customerId,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.log('Log Error:', err);
    }
  };

  const handleRequestLearning = async (serviceName) => {
    const ticketStr = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedTicket(ticketStr);
    
    // Instantly show the success popup for better UX!
    setShowTicketModal(true);

    try {
      await addDoc(collection(db, 'tickets'), {
        name: customerName || 'Account User',
        email: customerName ? `${customerName.replace(/\s+/g, '').toLowerCase()}@member.local` : 'member@local.com',
        phone: 'Logged in Member App',
        enquiryType: serviceName,
        message: `Member App Request [${ticketStr}]: ${serviceName}`,
        status: 'Open',
        source: 'Mobile App',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.log('Ticket Error:', err);
      setShowTicketModal(false);
      Alert.alert('Error', 'Unable to generate ticket at this time. Please try again.');
    }
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginCard}>
          <View style={styles.logoContainer}>
            {/* You can replace this icon with your real image logo like this: */}
            {/* <Image source={require('./assets/logo.png')} style={{width: 80, height: 80}} resizeMode="contain" /> */}
            <HeartHandshake color="#0d9488" size={64} />
            <Text style={styles.logoTextBig}>Senior Ease</Text>
          </View>

          <Text style={styles.headerTitle}>Member Login</Text>
          <Text style={styles.subtitle}>Enter credentials to access mobile dashboard</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={customerName}
            onChangeText={setCustomerName}
          />
          <TextInput
            style={styles.input}
            placeholder="Unique Customer ID"
            value={customerId}
            onChangeText={setCustomerId}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Dashboard Header with Small Logo */}
      <View style={styles.dashboardHeader}>
        <View style={styles.smallLogoContainer}>
          {/* <Image source={require('./assets/logo.png')} style={{width: 32, height: 32}} resizeMode="contain" /> */}
          <HeartHandshake color="#0d9488" size={28} />
          <Text style={styles.logoTextSmall}>Senior Ease</Text>
        </View>
        <TouchableOpacity onPress={() => setIsLoggedIn(false)}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Details */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.greeting}>Welcome {customerName}</Text>
          </View>
          <Text style={styles.subText}>Customer ID: {customerId}</Text>
          
          <View style={styles.planBox}>
            <Text style={styles.planTitle}>Current Plan</Text>
            <Text style={styles.planName}>Plus Membership (£17.99 / m)</Text>
            <Text style={[styles.statusText, isCancelled ? styles.textRed : styles.textGreen]}>
              {isCancelled ? 'Pending Cancellation' : 'Active Subscription'}
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.cancelBtn, isCancelled && styles.cancelBtnDisabled]}
            disabled={isCancelled}
            onPress={() => setShowCancelModal(true)}
          >
            <Text style={[styles.cancelBtnText, isCancelled && styles.cancelBtnTextDisabled]}>
              {isCancelled ? 'Cancellation Requested' : 'Cancel Subscription'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dashboard Services */}
        <Text style={styles.servicesHeader}>Service Request Dashboard</Text>
        <Text style={styles.servicesSubHeader}>Select a service below to file a support ticket with our team.</Text>
        <View style={styles.grid}>
          {services.map((service, idx) => (
            <View key={idx} style={styles.gridItem}>
              <Text style={styles.gridItemText}>{service}</Text>
              <TouchableOpacity 
                style={styles.requestBtn}
                onPress={() => handleRequestLearning(service)}
              >
                <Text style={styles.requestBtnText}>Request Learning</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Cancel Modal */}
      <Modal visible={showCancelModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Subscription?</Text>
            <Text style={styles.modalSubtitle}>The Refund amount will process in next 3 days.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setShowCancelModal(false)}>
                <Text style={styles.modalBtnTextBlack}>Go Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnConfirm} onPress={() => { setIsCancelled(true); setShowCancelModal(false); }}>
                <Text style={styles.modalBtnTextWhite}>Confirm Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ticket Modal */}
      <Modal visible={showTicketModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
             <CheckCircle2 color="#0d9488" size={48} />
             <Text style={styles.modalTitle}>Request Sent!</Text>
             <Text style={styles.modalSubtitle}>Ticket: {generatedTicket}</Text>
             <TouchableOpacity style={[styles.modalBtnConfirm, { width: '100%', marginTop: 8 }]} onPress={() => setShowTicketModal(false)}>
                <Text style={styles.modalBtnTextWhite}>Done</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { padding: 20 },
  loginCard: { backgroundColor: 'white', padding: 24, borderRadius: 16, margin: 20, elevation: 2 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#6b7280', marginBottom: 24, textAlign: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  logoTextBig: { fontSize: 24, fontWeight: 'bold', color: '#0d9488', marginTop: 8 },
  dashboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  smallLogoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoTextSmall: { fontSize: 18, fontWeight: 'bold', color: '#0d9488' },
  input: { borderWidth: 1, borderColor: '#d1d5db', padding: 14, borderRadius: 12, marginBottom: 16 },
  button: { backgroundColor: '#0d9488', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginBottom: 24 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 22, fontWeight: 'bold' },
  logoutText: { color: '#ef4444', fontWeight: 'bold' },
  subText: { color: '#6b7280', marginTop: 4, marginBottom: 16 },
  planBox: { backgroundColor: '#f3f4f6', padding: 16, borderRadius: 12, marginBottom: 16 },
  planTitle: { color: '#6b7280', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
  planName: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  statusText: { fontWeight: 'bold', marginTop: 8 },
  textGreen: { color: '#059669' },
  textRed: { color: '#d97706' },
  cancelBtn: { borderWidth: 1, borderColor: '#fecaca', padding: 12, borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { color: '#dc2626', fontWeight: 'bold' },
  cancelBtnDisabled: { borderColor: '#e5e7eb', backgroundColor: '#f3f4f6' },
  cancelBtnTextDisabled: { color: '#9ca3af' },
  servicesHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  servicesSubHeader: { color: '#6b7280', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 16, elevation: 2, justifyContent: 'space-between', minHeight: 140 },
  gridItemText: { fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 16, fontSize: 16 },
  requestBtn: { backgroundColor: '#f0fdfa', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, alignItems: 'center' },
  requestBtnText: { color: '#0d9488', fontWeight: 'bold', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 24, padding: 24, alignItems: 'center', width: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 12 },
  modalSubtitle: { color: '#6b7280', textAlign: 'center', marginBottom: 24 },
  modalButtons: { flexDirection: 'row', width: '100%', gap: 12 },
  modalBtnCancel: { flex: 1, backgroundColor: '#f3f4f6', padding: 16, borderRadius: 12, alignItems: 'center' },
  modalBtnConfirm: { flex: 1, backgroundColor: '#0d9488', padding: 16, borderRadius: 12, alignItems: 'center' },
  modalBtnTextBlack: { fontWeight: 'bold', color: '#374151' },
  modalBtnTextWhite: { fontWeight: 'bold', color: 'white' }
});
