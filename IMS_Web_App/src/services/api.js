import axios from 'axios';

// Mock data for demo purposes
const MOCK_DATA = {
  patients: [
    {
      id: 'P001',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-06-15',
      gender: 'Male',
      email: 'john.doe@email.com',
      phone: '+1234567890',
      address: '123 Main St, City, State 12345',
      bloodType: 'O+',
      allergies: 'Penicillin',
      medicalHistory: 'Hypertension, Type 2 Diabetes',
      registeredDate: '2024-01-15',
    },
    {
      id: 'P002',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1992-03-22',
      gender: 'Female',
      email: 'jane.smith@email.com',
      phone: '+1234567891',
      address: '456 Oak Ave, City, State 12345',
      bloodType: 'A+',
      allergies: 'None',
      medicalHistory: 'Asthma',
      registeredDate: '2024-02-10',
    },
  ],
  staff: [
    {
      id: 'S001',
      name: 'Dr. Sarah Johnson',
      email: 'admin@hospital.com',
      role: 'admin',
      department: 'Administration',
      specialization: 'Hospital Management',
      phone: '+1234567892',
      joinedDate: '2020-01-01',
    },
    {
      id: 'S002',
      name: 'Dr. Michael Chen',
      email: 'doctor@hospital.com',
      role: 'doctor',
      department: 'Cardiology',
      specialization: 'Cardiologist',
      phone: '+1234567893',
      joinedDate: '2021-03-15',
    },
    {
      id: 'S003',
      name: 'Dr. Emily Davis',
      email: 'radiologist@hospital.com',
      role: 'radiologist',
      department: 'Radiology',
      specialization: 'Diagnostic Imaging',
      phone: '+1234567894',
      joinedDate: '2021-06-20',
    },
  ],
  appointments: [
    {
      id: 'A001',
      patientId: 'P001',
      patientName: 'John Doe',
      doctorId: 'S002',
      doctorName: 'Dr. Michael Chen',
      date: '2024-11-30',
      time: '10:00',
      type: 'Consultation',
      status: 'Scheduled',
      notes: 'Regular checkup',
    },
    {
      id: 'A002',
      patientId: 'P002',
      patientName: 'Jane Smith',
      doctorId: 'S002',
      doctorName: 'Dr. Michael Chen',
      date: '2024-12-01',
      time: '14:30',
      type: 'Follow-up',
      status: 'Completed',
      notes: 'Review test results',
    },
  ],
  images: [
    {
      id: 'I001',
      appointmentId: 'A001',
      patientId: 'P001',
      patientName: 'John Doe',
      type: 'MRI',
      category: 'Brain',
      uploadedBy: 'Dr. Emily Davis',
      uploadDate: '2024-11-25',
      scanDate: '2024-11-25',
      machineId: 'MRI-001',
      status: 'Pending Review',
      comments: 'Standard brain MRI protocol',
      fileUrl: '/placeholder-image.jpg',
    },
  ],
  diagnoses: [
    {
      id: 'D001',
      appointmentId: 'A002',
      patientId: 'P002',
      patientName: 'Jane Smith',
      doctorId: 'S002',
      doctorName: 'Dr. Michael Chen',
      diagnosis: 'Mild Asthma - Well Controlled',
      report: 'Patient shows improvement in respiratory function. Current medication regimen is effective.',
      date: '2024-11-20',
      status: 'Confirmed',
      followUpRequired: true,
      followUpDate: '2025-02-20',
    },
  ],
  invoices: [
    {
      id: 'INV001',
      patientId: 'P001',
      patientName: 'John Doe',
      appointmentId: 'A001',
      date: '2024-11-25',
      items: [
        { description: 'Consultation Fee', amount: 150.00 },
        { description: 'MRI Scan', amount: 800.00 },
        { description: 'Diagnostic Fee', amount: 100.00 },
      ],
      subtotal: 1050.00,
      tax: 105.00,
      total: 1155.00,
      status: 'Pending',
      dueDate: '2024-12-25',
    },
  ],
  workflowTasks: [
    {
      taskId: 101,
      taskNo: 'T-2024-001',
      taskType: 'IMAGING_REQUEST',
      status: 'PENDING',
      description: 'Perform Brain MRI with contrast',
      createdOn: '2024-12-11T09:00:00',
      completedOn: null,
      imageId: null,
      fileUrl: null,
      modality: 'MRI',
      uploadDate: null,
      imageUploadedByStaffId: null,
      imageUploadedByStaffName: null,
      patientId: 1001,
      patientName: 'John Doe',
      patientEmail: 'john@example.com',
      patientPhone: '+1234567890',
      patientAddress: '123 Main St',
      patientDateOfBirth: '1985-06-15',
      patientGender: 'Male',
      patientMedicalRecordNumber: 'MRN-001',
      assignedStaffId: 201,
      assignedStaffName: 'Tech. Sarah',
      assignedStaffEmail: 'sarah@hospital.com',
      assignedStaffRole: 'ROLE_TECHNICIAN',
      assignedStaffDepartment: 'Radiology',
      visitId: 501,
      visitNo: 'V-2024-888',
      visitReason: 'Severe Headaches',
      checkInTime: '2024-12-11T08:30:00',
      checkOutTime: null,
      visitDoctorId: 305,
      visitDoctorName: 'Dr. Michael Chen',
      visitDoctorEmail: 'chen@hospital.com',
      attachmentCount: 0,
      hasImage: false,
      isVisitActive: true
    },
    {
      taskId: 102,
      taskNo: 'T-2024-002',
      taskType: 'LAB_request',
      status: 'PENDING',
      description: 'Chest X-Ray PA View',
      createdOn: '2024-12-11T10:15:00',
      completedOn: null,
      imageId: null,
      fileUrl: null,
      modality: 'XRAY',
      uploadDate: null,
      imageUploadedByStaffId: null,
      imageUploadedByStaffName: null,
      patientId: 1002,
      patientName: 'Jane Smith',
      patientEmail: 'jane@example.com',
      patientPhone: '+987654321',
      patientAddress: '456 Oak Ave',
      patientDateOfBirth: '1992-03-22',
      patientGender: 'Female',
      patientMedicalRecordNumber: 'MRN-005',
      assignedStaffId: 201,
      assignedStaffName: 'Tech. Sarah',
      assignedStaffEmail: 'sarah@hospital.com',
      assignedStaffRole: 'ROLE_TECHNICIAN',
      assignedStaffDepartment: 'Radiology',
      visitId: 502,
      visitNo: 'V-2024-999',
      visitReason: 'Chest Pain',
      checkInTime: '2024-12-11T10:00:00',
      checkOutTime: null,
      visitDoctorId: 305,
      visitDoctorName: 'Dr. Michael Chen',
      visitDoctorEmail: 'chen@hospital.com',
      attachmentCount: 1,
      hasImage: false,
      isVisitActive: true
    },
    {
      taskId: 103,
      taskNo: 'T-2024-003',
      taskType: 'IMAGING_REVIEW',
      status: 'PENDING_REVIEW', // Status indicating it's ready for Radiologist
      description: 'Review Chest CT Scan for nodules',
      createdOn: '2024-12-10T14:30:00',
      scanDate: '2024-12-12T11:00:00', // Added scanDate
      completedOn: null,
      modality: 'CT',
      attachmentCount: 125, // Image count
      patientId: 1001,
      patientName: 'John Doe',
      patientMedicalRecordNumber: 'MRN-001',
      visitId: 501,
      visitNo: 'V-2024-888',
      visitReason: 'Follow up',
      visitDoctorName: 'Dr. Michael Chen',
    },
    {
      taskId: 104,
      taskNo: 'T-2024-004',
      taskType: 'IMAGING_REVIEW',
      status: 'PENDING_REVIEW',
      description: 'Right Knee MRI interpretation',
      createdOn: '2024-12-11T09:00:00',
      scanDate: '2024-12-12T14:15:00',
      completedOn: null,
      modality: 'MRI',
      attachmentCount: 45,
      patientId: 1002,
      patientName: 'Jane Smith',
      patientMedicalRecordNumber: 'MRN-005',
      visitId: 502,
      visitNo: 'V-2024-999',
      visitReason: 'Knee Pain',
      visitDoctorName: 'Dr. Sarah Johnson',
    }
  ],
};

const MOCK_TASK_DETAILS = {
  taskId: 101,
  taskNo: 'T-2024-001',
  status: 'IN_PROGRESS', 
  priority: 'High',
  createdOn: '2024-12-11T09:00:00',
  description: 'Perform Brain MRI with contrast. Patient reports chronic headaches.',
  modality: 'MRI',
  
  // Flattened Patient Details
  patientId: 'P001',
  patientName: 'John Doe',
  patientDateOfBirth: '1985-06-15',
  patientGender: 'Male',
  patientMedicalRecordNumber: 'MRN-001',
  patientEmail: 'john@example.com',
  patientPhone: '+1 234-567-8900',
  patientMedicalHistory: 'Hypertension, Type 2 Diabetes', 
  
  // Flattened Visit Details
  visitId: 'V-2024-888',
  visitReason: 'Severe Headaches',
  visitDoctorName: 'Dr. Michael Chen',

  // UPDATED IMAGES WITH BASE64
  images: [
    { 
      id: 1, 
      // Simple Gray Square Base64
      url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAADklEQVQIW2NkQAOMpAsAAgwAAutXYW4AAAAASUVORK5CYII=', 
      name: 'BRAIN_AXIAL_001.dcm' 
    },
    { 
      id: 2, 
      // Simple Gray Square Base64
      url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAADklEQVQIW2NkQAOMpAsAAgwAAutXYW4AAAAASUVORK5CYII=', 
      name: 'BRAIN_AXIAL_002.dcm' 
    },
    { 
      id: 3, 
      // Simple Gray Square Base64
      url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAADklEQVQIW2NkQAOMpAsAAgwAAutXYW4AAAAASUVORK5CYII=', 
      name: 'BRAIN_SAGITTAL_001.dcm' 
    }
  ],

  visitHistory: [
    { date: '2024-12-11', type: 'Specialist', reason: 'Severe Headaches', doctor: 'Dr. Chen' },
    { date: '2024-08-15', type: 'General', reason: 'Annual Checkup', doctor: 'Dr. Sarah' },
  ]
};

// API Base URL (configure for production)
const API_CORE_URL = import.meta.env.VITE_CORE_BASE_URL || '';
// Create axios instance
const api = axios.create({
  baseURL: API_CORE_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // localStorage.removeItem('user');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to simulate API call with mock data
const mockApiCall = async (data, shouldFail = false) => {
  await delay();
  if (shouldFail) {
    throw new Error('API request failed. Using demo data.');
  }
  return { data };
};

// API Service
const apiService = {
  // Patient APIs
  patients: {
    getAll: async () => {
      try {
        // Try real API first
        const response = await api.get('/patients');
        return response;
      } catch (error) {
        console.warn('API unavailable, using mock data:', error.message);
        return await mockApiCall(MOCK_DATA.patients);
      }
    },

    getCurrentPatient: async () => {
      try {
        // Try real API first
        const response = await api.get('/patients/profile');
        return response;
      } catch (error) {
        console.warn('API unavailable, using mock data:', error.message);
        return await mockApiCall(MOCK_DATA.patients);
      }
    },
    
    getById: async (id) => {
      try {
        const response = await api.get(`/patients/${id}`);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, using mock data');
        const patient = MOCK_DATA.patients.find(p => p.id === id);
        return await mockApiCall(patient);
      }
    },
    
    create: async (patientData) => {
      try {
        const response = await api.post('/patients/register', patientData);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating create');
        const newPatient = {
          id: `P${String(MOCK_DATA.patients.length + 1).padStart(3, '0')}`,
          ...patientData,
          registeredDate: new Date().toISOString().split('T')[0],
        };
        MOCK_DATA.patients.push(newPatient);
        return await mockApiCall(newPatient);
      }
    },
    
    update: async (id, patientData) => {
      try {
        const response = await api.put(`/patients/${id}`, patientData);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating update');
        const index = MOCK_DATA.patients.findIndex(p => p.id === id);
        if (index !== -1) {
          MOCK_DATA.patients[index] = { ...MOCK_DATA.patients[index], ...patientData };
        }
        return await mockApiCall(MOCK_DATA.patients[index]);
      }
    },
    
    delete: async (id) => {
      try {
        const response = await api.delete(`/patients/${id}`);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating delete');
        const index = MOCK_DATA.patients.findIndex(p => p.id === id);
        if (index !== -1) {
          MOCK_DATA.patients.splice(index, 1);
        }
        return await mockApiCall({ success: true });
      }
    },
    
    search: async (query) => {
      try {
        const response = await api.get(`/patients/search?term=${query}`);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, using mock search');
        const results = MOCK_DATA.patients.filter(p =>
          p.firstName.toLowerCase().includes(query.toLowerCase()) ||
          p.lastName.toLowerCase().includes(query.toLowerCase()) ||
          p.id.toLowerCase().includes(query.toLowerCase())
        );
        return await mockApiCall(results);
      }
    },
  },

  // Staff APIs
  staff: {
    getAll: async () => {
      try {
        const response = await api.get('/staff');
        return response.data;
      } catch (error) {
        console.warn('API unavailable, using mock data');
        return await mockApiCall(MOCK_DATA.staff);
      }
    },
    
    create: async (staffData) => {
      try {
        const response = await api.post('/staff', staffData);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating create');
        const newStaff = {
          id: `S${String(MOCK_DATA.staff.length + 1).padStart(3, '0')}`,
          ...staffData,
          joinedDate: new Date().toISOString().split('T')[0],
        };
        MOCK_DATA.staff.push(newStaff);
        return await mockApiCall(newStaff);
      }
    },
    
    update: async (id, staffData) => {
      try {
        const response = await api.put(`/staff/${id}`, staffData);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating update');
        const index = MOCK_DATA.staff.findIndex(s => s.id === id);
        if (index !== -1) {
          MOCK_DATA.staff[index] = { ...MOCK_DATA.staff[index], ...staffData };
        }
        return await mockApiCall(MOCK_DATA.staff[index]);
      }
    },
    
    delete: async (id) => {
      try {
        const response = await api.delete(`/staff/${id}`);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating delete');
        const index = MOCK_DATA.staff.findIndex(s => s.id === id);
        if (index !== -1) {
          MOCK_DATA.staff.splice(index, 1);
        }
        return await mockApiCall({ success: true });
      }
    },
  },

  // Appointment APIs
  appointments: {
    getAll: async () => {
      try {
        const response = await api.get('/appointments');
        return response.data;
      } catch (error) {
        console.warn('API unavailable, using mock data');
        return await mockApiCall(MOCK_DATA.appointments);
      }
    },
    
    create: async (appointmentData) => {
      try {
        const response = await api.post('/appointments', appointmentData);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating create');
        const newAppointment = {
          id: `A${String(MOCK_DATA.appointments.length + 1).padStart(3, '0')}`,
          ...appointmentData,
        };
        MOCK_DATA.appointments.push(newAppointment);
        return await mockApiCall(newAppointment);
      }
    },
    
    update: async (id, appointmentData) => {
      try {
        const response = await api.put(`/appointments/${id}`, appointmentData);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating update');
        const index = MOCK_DATA.appointments.findIndex(a => a.id === id);
        if (index !== -1) {
          MOCK_DATA.appointments[index] = { ...MOCK_DATA.appointments[index], ...appointmentData };
        }
        return await mockApiCall(MOCK_DATA.appointments[index]);
      }
    },
    
    cancel: async (id) => {
      try {
        const response = await api.patch(`/appointments/${id}/cancel`);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating cancel');
        const index = MOCK_DATA.appointments.findIndex(a => a.id === id);
        if (index !== -1) {
          MOCK_DATA.appointments[index].status = 'Cancelled';
        }
        return await mockApiCall(MOCK_DATA.appointments[index]);
      }
    },
  },
  
  serviceCatalogs: {
    getAll: async () => {
      try {
        const response = await api.get('/data/service-catalogs');
        return response;
      } catch (error) {
        console.warn('API unavailable, using mock service catalog data');
      }
    },
  },

  // Medical Images APIs
  images: {
    getAll: async () => {
      try {
        const response = await api.get('/images');
        return response.data;
      } catch (error) {
        console.warn('API unavailable, using mock data');
        return await mockApiCall(MOCK_DATA.images);
      }
    },
    
    upload: async (imageData) => {
      try {
        const formData = new FormData();
        Object.keys(imageData).forEach(key => {
          formData.append(key, imageData[key]);
        });
        const response = await api.post('/images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating upload');
        const newImage = {
          id: `I${String(MOCK_DATA.images.length + 1).padStart(3, '0')}`,
          ...imageData,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'Pending Review',
        };
        MOCK_DATA.images.push(newImage);
        return await mockApiCall(newImage);
      }
    },
    
    updateMetadata: async (id, metadata) => {
      try {
        const response = await api.patch(`/images/${id}`, metadata);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating update');
        const index = MOCK_DATA.images.findIndex(i => i.id === id);
        if (index !== -1) {
          MOCK_DATA.images[index] = { ...MOCK_DATA.images[index], ...metadata };
        }
        return await mockApiCall(MOCK_DATA.images[index]);
      }
    },
  },

  // Diagnosis APIs
  diagnoses: {
    getAll: async () => {
      try {
        const response = await api.get('/diagnoses');
        return response.data;
      } catch (error) {
        console.warn('API unavailable, using mock data');
        return await mockApiCall(MOCK_DATA.diagnoses);
      }
    },
    
    create: async (diagnosisData) => {
      try {
        const response = await api.post('/diagnoses', diagnosisData);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating create');
        const newDiagnosis = {
          id: `D${String(MOCK_DATA.diagnoses.length + 1).padStart(3, '0')}`,
          ...diagnosisData,
          date: new Date().toISOString().split('T')[0],
        };
        MOCK_DATA.diagnoses.push(newDiagnosis);
        return await mockApiCall(newDiagnosis);
      }
    },
    
    update: async (id, diagnosisData) => {
      try {
        const response = await api.put(`/diagnoses/${id}`, diagnosisData);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating update');
        const index = MOCK_DATA.diagnoses.findIndex(d => d.id === id);
        if (index !== -1) {
          MOCK_DATA.diagnoses[index] = { ...MOCK_DATA.diagnoses[index], ...diagnosisData };
        }
        return await mockApiCall(MOCK_DATA.diagnoses[index]);
      }
    },
    
    confirm: async (id) => {
      try {
        const response = await api.patch(`/diagnoses/${id}/confirm`);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating confirm');
        const index = MOCK_DATA.diagnoses.findIndex(d => d.id === id);
        if (index !== -1) {
          MOCK_DATA.diagnoses[index].status = 'Confirmed';
        }
        return await mockApiCall(MOCK_DATA.diagnoses[index]);
      }
    },
  },

  // Billing/Invoice APIs
  invoices: {
    getAll: async () => {
      try {
        const response = await api.get('/invoices');
        return response.data;
      } catch (error) {
        console.warn('API unavailable, using mock data');
        return await mockApiCall(MOCK_DATA.invoices);
      }
    },
    
    create: async (invoiceData) => {
      try {
        const response = await api.post('/invoices', invoiceData);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating create');
        const newInvoice = {
          id: `INV${String(MOCK_DATA.invoices.length + 1).padStart(3, '0')}`,
          ...invoiceData,
          date: new Date().toISOString().split('T')[0],
        };
        MOCK_DATA.invoices.push(newInvoice);
        return await mockApiCall(newInvoice);
      }
    },
    
    update: async (id, invoiceData) => {
      try {
        const response = await api.put(`/invoices/${id}`, invoiceData);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating update');
        const index = MOCK_DATA.invoices.findIndex(inv => inv.id === id);
        if (index !== -1) {
          MOCK_DATA.invoices[index] = { ...MOCK_DATA.invoices[index], ...invoiceData };
        }
        return await mockApiCall(MOCK_DATA.invoices[index]);
      }
    },
    
    updateStatus: async (id, status) => {
      try {
        const response = await api.post(`/invoices/${id}/status`, { status });
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating status update');
        const index = MOCK_DATA.invoices.findIndex(inv => inv.id === id);
        if (index !== -1) {
          MOCK_DATA.invoices[index].status = status;
        }
        return await mockApiCall(MOCK_DATA.invoices[index]);
      }
    },
  },

  // Dashboard Statistics
  dashboard: {
    getStats: async () => {
      try {
       return await mockApiCall({
          totalPatients: MOCK_DATA.patients.length,
          totalStaff: MOCK_DATA.staff.length,
          totalAppointments: MOCK_DATA.appointments.length,
          pendingAppointments: MOCK_DATA.appointments.filter(a => a.status === 'Scheduled').length,
          completedAppointments: MOCK_DATA.appointments.filter(a => a.status === 'Completed').length,
          totalRevenue: MOCK_DATA.invoices.reduce((sum, inv) => sum + inv.total, 0),
          pendingPayments: MOCK_DATA.invoices.filter(inv => inv.status === 'Pending').length,
        });
        return response.data;
      } catch (error) {
        console.warn('API unavailable, using mock stats');
        return await mockApiCall({
          totalPatients: MOCK_DATA.patients.length,
          totalStaff: MOCK_DATA.staff.length,
          totalAppointments: MOCK_DATA.appointments.length,
          pendingAppointments: MOCK_DATA.appointments.filter(a => a.status === 'Scheduled').length,
          completedAppointments: MOCK_DATA.appointments.filter(a => a.status === 'Completed').length,
          totalRevenue: MOCK_DATA.invoices.reduce((sum, inv) => sum + inv.total, 0),
          pendingPayments: MOCK_DATA.invoices.filter(inv => inv.status === 'Pending').length,
        });
      }
    },
  },

  // NEW WORKFLOW SERVICE
  workflow: {
    getPendingTasks: async (status = 'PENDING') => {
      try {
        const response = await api.get('/workflow-task', {
          params: { status }
        });
        return response.data;
      } catch (error) {
        console.warn('API unavailable, using mock workflow data');
        // Return only PENDING tasks
        return await mockApiCall(MOCK_DATA.workflowTasks.filter(t => t.status === 'PENDING'));
      }
    },

    getRadiologistWorklist: async (status = 'PENDING_REVIEW') => {
      try {
        const response = await api.get('/workflow-task', {
          params: { status }
        });
        return response.data;
      } catch (error) {
        console.warn('API unavailable, using mock radiologist worklist');
        return await mockApiCall(
          MOCK_DATA.workflowTasks.filter(t => t.status === status)
        );
      }
    },

    completeTask: async (taskId, formData) => {
      try {
        // formData contains files and potentially other fields
        const response = await api.post(`/workflow-task/${taskId}/complete`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating task completion');
        const index = MOCK_DATA.workflowTasks.findIndex(t => t.taskId === taskId);
        if (index !== -1) {
          MOCK_DATA.workflowTasks[index].status = 'COMPLETED';
          MOCK_DATA.workflowTasks[index].completedOn = new Date().toISOString();
          MOCK_DATA.workflowTasks[index].hasImage = true;
        }
        return await mockApiCall({ success: true, message: 'Task completed successfully' });
      }
    },
    getTaskDetails: async (taskId) => {
      try {
        const response = await api.get(`/workflow-task/${taskId}`);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, using mock task details');
        // Return mock data, but inject the requested taskId
        
         const response = await mockApiCall({ ...MOCK_TASK_DETAILS, taskId: taskId });
         return  response.data
      }
    },

    createTask: async (taskData) => {
      try {
        const response = await api.post('/workflow-task', taskData);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating task creation');
        return await mockApiCall({ success: true, taskId: Math.floor(Math.random() * 1000) });
      }
    },
  },
  diagnostics: {
    submitReport: async (reportData) => {
      try {
        // reportData should include { taskId, classification, findings, ... }
        const response = await api.post('/workflow-task/submit/diagnostic-report', reportData);
        return response.data;
      } catch (error) {
        console.warn('API unavailable, simulating report submission');
        return await mockApiCall({ success: true, reportId: 'RPT-' + Date.now() });
      }
    }
  }
};

export default apiService;