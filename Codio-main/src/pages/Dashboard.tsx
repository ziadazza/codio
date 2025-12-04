import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import apiService from '@/services/api';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Mail, 
  Settings, 
  LogOut,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  UserPlus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Upload,
  Image,
  Users as TeamIcon,
  Target,
  BarChart3,
  Shield,
  Globe,
  Megaphone
} from 'lucide-react';

// أنواع البيانات
const DATA_TYPES = {
  BUSINESS_REQUESTS: 'businessRequests',
  USERS: 'users',
  ADS: 'advertisements',
  SETTINGS: 'settings'
};

// حالات الطلبات
const REQUEST_STATUS = {
  NEW: 'جديد',
  REVIEW: 'قيد المراجعة',
  COMPLETED: 'مكتمل',
  REJECTED: 'مرفوض'
};

// حالات الإعلانات
const AD_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

export default function CodioAdminDashboard() {
  // حالات المصادقة والنظام
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // حالات البحث والتصفية
  const [companiesSearchTerm, setCompaniesSearchTerm] = useState('');
  const [companiesFilterStatus, setCompaniesFilterStatus] = useState('all');
  const [usersSearchTerm, setUsersSearchTerm] = useState('');
  const [adsSearchTerm, setAdsSearchTerm] = useState('');
  const [adsFilterStatus, setAdsFilterStatus] = useState('all');

  // إشعارات العمليات (toast)
  const [notification, setNotification] = useState({ visible: false, message: '', type: 'success' });
  const showNotification = (message, type = 'success', ttl = 3000) => {
    setNotification({ visible: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), ttl);
  };

  // حالات النماذج والعروض
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showAdForm, setShowAdForm] = useState(false);

  // البيانات الديناميكية
  const [businessRequests, setBusinessRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [systemSettings, setSystemSettings] = useState({
    companyName: 'Codio',
    adminEmail: 'admin@codio.com',
    maxFileSize: 5, // MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  // نماذج جديدة
  const [newCompany, setNewCompany] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    business_type: '',
    city: '',
    position: '',
    number_of_branches: '1',
    promotional_images: [],
    team_members: []
  });

  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    target_url: '',
    image_path: null,
    status: AD_STATUS.ACTIVE,
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  });

  // ===== نظام إدارة البيانات =====

  // التحقق من وجود توكن عند فتح التطبيق
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // تحميل جميع البيانات عند المصادقة
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await loadBusinessRequests();
      await loadUsers();
      await loadAdvertisements();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // تحميل البيانات من API فقط
  const loadBusinessRequests = async () => {
    try {
      const response = await apiService.getBusinessRequests();
      console.log('Raw business requests from API:', response);
      const formattedRequests = response.data.map(request => ({
        id: request.id,
        companyName: request.company_name || 'غير محدد',
        contactPerson: request.contact_person || 'غير محدد',
        email: request.email || 'غير محدد',
        phone: request.phone || 'غير محدد',
        whatsapp: request.whatsapp || request.phone || 'غير محدد',
        businessType: request.business_type || 'غير محدد',
        numberOfBranches: request.number_of_branches || '1',
        city: request.city || 'غير محدد',
        position: request.position || 'غير محدد',
        status: request.status || REQUEST_STATUS.NEW,
        date: request.date || request.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        time: request.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: request.notes || 'لا توجد ملاحظات',
        companyNameEn: request.company_name_en || '',
        establishmentYear: request.establishment_year || '',
        employeeCount: request.employee_count || '',
        district: request.district || '',
        street: request.street || '',
        buildingNumber: request.building_number || '',
        website: request.website || '',
        instagram: request.instagram || '',
        facebook: request.facebook || '',
        telegram: request.telegram || '',
        linkedin: request.linkedin || '',
        tiktok: request.tiktok || '',
        snapchat: request.snapchat || '',
        promotionalImages: (request.promotional_images || []).map(img => getImageUrl(img)),
        teamMembers: request.team_members || [],
        costEffectiveness: request.cost_effectiveness || '',
        brandBuilding: request.brand_building || '',
        marketingResults: request.marketing_results || ''
      }));
      setBusinessRequests(formattedRequests);
    } catch (error) {
      console.error('Error loading business requests:', error);
      setBusinessRequests([]);
    }
  };

  // تحويل status من العربية إلى الإنجليزية للـ API
  const convertStatusToAPI = (status) => {
    const statusMap = {
      'نشط': 'active',
      'غير نشط': 'inactive',
      'active': 'active',
      'inactive': 'inactive'
    };
    return statusMap[status] || 'active';
  };

  // تحويل status من الإنجليزية إلى العربية للعرض
  const convertStatusFromAPI = (status) => {
    const statusMap = {
      'active': 'نشط',
      'inactive': 'غير نشط',
      'نشط': 'نشط',
      'غير نشط': 'غير نشط'
    };
    return statusMap[status] || 'نشط';
  };

  // تحويل مسار الصورة إلى URL كامل
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // إذا كانت URL كاملة بالفعل
    if (imagePath.startsWith('http')) return imagePath;
    // إذا كانت blob URL
    if (imagePath.startsWith('blob:')) return imagePath;
    // إذا كانت data URL
    if (imagePath.startsWith('data:')) return imagePath;
    
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    // إذا كانت المسار يبدأ بـ /storage فلا نضيف /storage مرة أخرى
    if (imagePath.startsWith('/storage/')) return `${baseUrl}${imagePath}`;
    return `${baseUrl}/storage/${imagePath}`;
  };

  const loadUsers = async () => {
    try {
      const response = await apiService.getUsers();
      const formattedUsers = response.data.map(user => ({
        id: user.id,
        name: user.name || 'غير محدد',
        email: user.email || 'غير محدد',
        phone: user.phone || 'غير محدد',
        role: user.role || 'مستخدم',
        status: convertStatusFromAPI(user.status || 'active'),
        joinDate: user.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        profileImage: getImageUrl(user.profile_image),
        teamRole: user.team_role || 'موظف',
        department: user.department || 'عام'
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const loadAdvertisements = async () => {
    try {
      const response = await apiService.getAdvertisements();
      // console.log('Raw ads from API:', response.data);
      const formattedAds = response.data.map(ad => {
        const imageUrl = getImageUrl(ad.image_path);
        // console.log(`Ad ${ad.id}: image_path="${ad.image_path}" -> imageUrl="${imageUrl}"`);
        return {
          id: ad.id,
          title: ad.title || 'بدون عنوان',
          description: ad.description || '',
          targetUrl: ad.target_url || '',
          image: imageUrl || 'https://via.placeholder.com/400x200',
          image_path: ad.image_path,
          status: ad.status || AD_STATUS.ACTIVE,
          startDate: ad.start_date?.split('T')[0] || new Date().toISOString().split('T')[0],
          endDate: ad.end_date?.split('T')[0] || '',
          createdAt: ad.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          impressions: ad.impressions || 0,
          clicks: ad.clicks || 0
        };
      });
      // console.log('Formatted ads:', formattedAds);
      setAdvertisements(formattedAds);
    } catch (error) {
      console.error('Error loading advertisements:', error);
      setAdvertisements([]);
    }
  };

  // توليد معرف فريد
  const generateId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  };

  // تحديث البيانات
  const refreshData = () => {
    setIsRefreshing(true);
    loadAllData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // ===== إحصائيات ديناميكية =====
  const stats = {
    totalRequests: businessRequests.length,
    activeUsers: users.filter(u => u.status === 'نشط').length,
    newMessages: businessRequests.filter(r => r.status === REQUEST_STATUS.NEW).length,
    revenue: businessRequests.filter(r => r.status === REQUEST_STATUS.COMPLETED).length * 5000,
    pendingRequests: businessRequests.filter(r => 
      r.status === REQUEST_STATUS.NEW || r.status === REQUEST_STATUS.REVIEW
    ).length,
    completedRequests: businessRequests.filter(r => r.status === REQUEST_STATUS.COMPLETED).length,
    rejectedRequests: businessRequests.filter(r => r.status === REQUEST_STATUS.REJECTED).length,
    totalAds: advertisements.length,
    activeAds: advertisements.filter(a => a.status === AD_STATUS.ACTIVE).length,
    totalImpressions: advertisements.reduce((sum, ad) => sum + (ad.impressions || 0), 0),
    totalClicks: advertisements.reduce((sum, ad) => sum + (ad.clicks || 0), 0),
    clickThroughRate: advertisements.length > 0 ? 
      (advertisements.reduce((sum, ad) => sum + (ad.clicks || 0), 0) / 
       advertisements.reduce((sum, ad) => sum + (ad.impressions || 1), 0) * 100).toFixed(1) : 0
  };

  // ===== إدارة الشركات =====
  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await apiService.updateBusinessRequestStatus(requestId, newStatus);
      await loadBusinessRequests();
      setSelectedRequest(null);
      showNotification('تم تحديث حالة الطلب بنجاح', 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification(error?.message || 'فشل تحديث الحالة', 'error');
    }
  };

  const deleteRequest = async (requestId) => {
    try {
      await apiService.deleteBusinessRequest(requestId);
      await loadBusinessRequests();
      setSelectedRequest(null);
      showNotification('تم حذف الطلب بنجاح', 'success');
    } catch (error) {
      console.error('Error deleting request:', error);
      showNotification(error?.message || 'فشل حذف الطلب', 'error');
    }
  };

  const updateCompany = async (updatedCompany) => {
    try {
      await apiService.updateBusinessRequest(updatedCompany.id, {
        company_name: updatedCompany.companyName,
        contact_person: updatedCompany.contactPerson,
        email: updatedCompany.email,
        phone: updatedCompany.phone,
        business_type: updatedCompany.businessType,
        city: updatedCompany.city,
        position: updatedCompany.position,
        number_of_branches: updatedCompany.numberOfBranches,
        status: updatedCompany.status,
        notes: updatedCompany.notes
      });
      await loadBusinessRequests();
      setEditingCompany(null);
      showNotification('تم تحديث بيانات الشركة', 'success');
    } catch (error) {
      console.error('Error updating company:', error);
      showNotification(error?.message || 'فشل تحديث بيانات الشركة', 'error');
    }
  };

  const addCompany = async () => {
    try {
      await apiService.createBusinessRequest({
        company_name: newCompany.company_name,
        contact_person: newCompany.contact_person,
        email: newCompany.email,
        phone: newCompany.phone,
        business_type: newCompany.business_type,
        city: newCompany.city,
        position: newCompany.position,
        number_of_branches: newCompany.number_of_branches,
        status: REQUEST_STATUS.NEW,
        notes: 'لا توجد ملاحظات',
        promotional_images: newCompany.promotional_images,
        team_members: newCompany.team_members
      });
      await loadBusinessRequests();
      setShowCompanyForm(false);
      resetNewCompanyForm();
      showNotification('تمت إضافة الشركة بنجاح', 'success');
    } catch (error) {
      console.error('Error adding company:', error);
      showNotification(error?.message || 'فشل إضافة الشركة', 'error');
    }
  };

  const resetNewCompanyForm = () => {
    setNewCompany({
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      business_type: '',
      city: '',
      position: '',
      number_of_branches: '1',
      promotional_images: [],
      team_members: []
    });
  };

  // ===== إدارة المستخدمين =====
  const deleteUser = async (userId) => {
    try {
      await apiService.deleteUser(userId);
      await loadUsers();
      showNotification('تم حذف المستخدم بنجاح', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification(error?.message || 'فشل حذف المستخدم', 'error');
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      await apiService.updateUser(updatedUser.id, {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        department: updatedUser.department,
        status: convertStatusToAPI(updatedUser.status),
        profile_image: updatedUser.profileImage,
        team_role: updatedUser.teamRole
      });
      await loadUsers();
      setEditingUser(null);
      showNotification('تم تحديث بيانات المستخدم', 'success');
    } catch (error) {
      console.error('Error updating user:', error);
      showNotification(error?.message || 'فشل تحديث المستخدم', 'error');
    }
  };

  const addUser = async (newUser) => {
    try {
      await apiService.createUser({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        department: newUser.department,
        status: convertStatusToAPI(newUser.status || 'نشط'),
        profile_image: newUser.profileImage,
        team_role: newUser.teamRole,
        password: 'password123' // كلمة مرور افتراضية
      });
      await loadUsers();
      setEditingUser(null);
      showNotification('تمت إضافة المستخدم بنجاح', 'success');
    } catch (error) {
      console.error('Error adding user:', error);
      showNotification(error?.message || 'فشل إضافة المستخدم', 'error');
    }
  };

  // ===== إدارة الإعلانات =====
  const addAdvertisement = async () => {
    try {
      // التحقق من أن الصورة تم رفعها بنجاح (ليست blob URL)
      if (!newAd.image_path) {
        showNotification('يرجى رفع صورة الإعلان', 'error');
        return;
      }
      if (newAd.image_path.startsWith('blob:')) {
        showNotification('الرجاء الانتظار حتى ينتهي رفع الصورة', 'error');
        return;
      }

      console.log('Creating advertisement with:', {
        title: newAd.title,
        image_path: newAd.image_path,
        status: newAd.status
      });

      const response = await apiService.createAdvertisement({
        title: newAd.title,
        description: newAd.description,
        target_url: newAd.target_url,
        image_path: newAd.image_path,
        status: newAd.status,
        start_date: newAd.start_date,
        end_date: newAd.end_date,
        impressions: 0,
        clicks: 0
      });
      
      console.log('Advertisement created response:', response);
      
      await loadAdvertisements();
      setShowAdForm(false);
      resetNewAdForm();
      showNotification('تمت إضافة الإعلان بنجاح', 'success');
    } catch (error) {
      console.error('Error adding advertisement:', error);
      showNotification(error?.message || 'فشل إضافة الإعلان', 'error');
    }
  };

  const updateAdvertisement = async (updatedAd) => {
    try {
      await apiService.updateAdvertisement(updatedAd.id, {
        title: updatedAd.title,
        description: updatedAd.description,
        target_url: updatedAd.targetUrl,
        image_path: updatedAd.image,
        status: updatedAd.status,
        start_date: updatedAd.startDate,
        end_date: updatedAd.endDate,
        impressions: updatedAd.impressions,
        clicks: updatedAd.clicks
      });
      await loadAdvertisements();
      showNotification('تم تحديث الإعلان بنجاح', 'success');
    } catch (error) {
      console.error('Error updating advertisement:', error);
      showNotification(error?.message || 'فشل تحديث الإعلان', 'error');
    }
  };

  const deleteAdvertisement = async (adId) => {
    try {
      await apiService.deleteAdvertisement(adId);
      await loadAdvertisements();
      showNotification('تم حذف الإعلان بنجاح', 'success');
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      showNotification(error?.message || 'فشل حذف الإعلان', 'error');
    }
  };

  const resetNewAdForm = () => {
    setNewAd({
      title: '',
      description: '',
      target_url: '',
      image_path: null,
      status: AD_STATUS.ACTIVE,
      start_date: new Date().toISOString().split('T')[0],
      end_date: ''
    });
  };

  // ===== إدارة الإعدادات =====
  const clearAllData = async () => {
    if (confirm('هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        // حذف جميع البيانات من الخادم
        await Promise.all([
          ...businessRequests.map(req => apiService.deleteBusinessRequest(req.id)),
          ...users.map(user => apiService.deleteUser(user.id)),
          ...advertisements.map(ad => apiService.deleteAdvertisement(ad.id))
        ]);
        
        // إعادة تحميل البيانات
        await loadAllData();
        showNotification('تم مسح جميع البيانات', 'success');
      } catch (error) {
        console.error('Error clearing data:', error);
        showNotification(error?.message || 'فشل مسح البيانات', 'error');
      }
    }
  };

  // ===== أدوات مساعدة =====
  const getStatusColor = (status) => {
    const colors = {
      [REQUEST_STATUS.NEW]: 'border',
      [REQUEST_STATUS.REVIEW]: 'border',
      [REQUEST_STATUS.COMPLETED]: 'border',
      [REQUEST_STATUS.REJECTED]: 'border',
      'نشط': 'border',
      'غير نشط': 'border'
    };
    return colors[status] || 'border';
  };

  const getStatusStyle = (status) => {
    const styles = {
      [REQUEST_STATUS.NEW]: { backgroundColor: '#f4ff1a20', color: '#f4ff1a', borderColor: '#f4ff1a40' },
      [REQUEST_STATUS.REVIEW]: { backgroundColor: '#f4ff1a20', color: '#f4ff1a', borderColor: '#f4ff1a40' },
      [REQUEST_STATUS.COMPLETED]: { backgroundColor: '#f4ff1a20', color: '#f4ff1a', borderColor: '#f4ff1a40' },
      [REQUEST_STATUS.REJECTED]: { backgroundColor: '#ff444420', color: '#ff4444', borderColor: '#ff444440' },
      'نشط': { backgroundColor: '#f4ff1a20', color: '#f4ff1a', borderColor: '#f4ff1a40' },
      'غير نشط': { backgroundColor: '#ff444420', color: '#ff4444', borderColor: '#ff444440' }
    };
    return styles[status] || { backgroundColor: '#66620', color: '#888', borderColor: '#2a2a2a' };
  };

  const getStatusIcon = (status) => {
    const icons = {
      [REQUEST_STATUS.NEW]: <Clock className="w-4 h-4" />,
      [REQUEST_STATUS.REVIEW]: <Eye className="w-4 h-4" />,
      [REQUEST_STATUS.COMPLETED]: <CheckCircle className="w-4 h-4" />,
      [REQUEST_STATUS.REJECTED]: <XCircle className="w-4 h-4" />
    };
    return icons[status] || null;
  };

  // معالجة رفع الصور
  const handleImageUpload = async (event, setImages) => {
    const files = Array.from(event.target.files);
    setIsLoading(true);
    
    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const response = await apiService.uploadFile(file);
          return response.path || response.url || response.data?.path || response.data?.url;
        })
      );
      
      setImages(prev => [...prev, ...uploadedImages]);
      showNotification('تم رفع الصور بنجاح', 'success');
    } catch (error) {
      console.error('Error uploading images:', error);
      showNotification(error?.message || 'فشل رفع الصور', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSingleImageUpload = async (file, setImagePath) => {
    setIsLoading(true);
    
    try {
      const response = await apiService.uploadFile(file);
      const imagePath = response.path || response.url || response.data?.path || response.data?.url;
      setImagePath(imagePath);
      showNotification('تم رفع الصورة بنجاح', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification(error?.message || 'فشل رفع الصورة', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index, images, setImages) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  // التصفية والبحث
  const filteredRequests = businessRequests.filter(request => {
    const matchesSearch = 
      request.companyName.toLowerCase().includes(companiesSearchTerm.toLowerCase()) ||
      request.contactPerson.toLowerCase().includes(companiesSearchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(companiesSearchTerm.toLowerCase()) ||
      request.phone.toLowerCase().includes(companiesSearchTerm.toLowerCase());
    
    const matchesFilter = companiesFilterStatus === 'all' || request.status === companiesFilterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(usersSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(usersSearchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(usersSearchTerm.toLowerCase())
  );

  const filteredAds = advertisements.filter(ad => {
    const matchesSearch = 
      ad.title.toLowerCase().includes(adsSearchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(adsSearchTerm.toLowerCase());
    
    const matchesFilter = adsFilterStatus === 'all' || ad.status === adsFilterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // التصدير
  const exportToCSV = (data, filename, headers, fields) => {
    const csvData = data.map(item => fields.map(field => item[field] || ''));
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCompanies = () => {
    const headers = [
      'اسم الشركة', 'الشخص المسؤول', 'البريد الإلكتروني', 'الهاتف', 'الواتساب',
      'نوع النشاط', 'عدد الفروع', 'المدينة', 'المنصب', 'الحالة', 'التاريخ', 'الوقت', 'الملاحظات'
    ];
    
    const fields = [
      'companyName', 'contactPerson', 'email', 'phone', 'whatsapp',
      'businessType', 'numberOfBranches', 'city', 'position', 'status', 'date', 'time', 'notes'
    ];

    exportToCSV(filteredRequests, `طلبات_الشركات_${new Date().toISOString().split('T')[0]}.csv`, headers, fields);
  };

  const exportUsers = () => {
    const headers = ['الاسم', 'البريد الإلكتروني', 'الهاتف', 'الدور', 'القسم', 'الحالة', 'تاريخ الانضمام'];
    const fields = ['name', 'email', 'phone', 'role', 'department', 'status', 'joinDate'];
    
    exportToCSV(users, `المستخدمين_${new Date().toISOString().split('T')[0]}.csv`, headers, fields);
  };

  // ===== المصادقة =====
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    try {
      const response = await apiService.login({ username, password });
      if (response.token) {
        localStorage.setItem('admin_token', response.token);
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
      } else {
        setLoginError('بيانات الدخول غير صحيحة');
      }
    } catch (error) {
      setLoginError(error.message || 'فشل تسجيل الدخول، تحقق من بيانات الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  // ===== واجهة تسجيل الدخول =====
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1b1b1b' }}>
        <Card className="w-full max-w-md p-8 backdrop-blur-xl border-2" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-3xl mx-auto mb-4 shadow-lg" style={{ backgroundColor: '#f4ff1a', color: '#1b1b1b' }}>
              C
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#f4ff1a' }}>لوحة التحكم</h1>
            <p style={{ color: '#888' }}>Codio Admin Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="p-3 border rounded-lg text-sm" style={{ backgroundColor: '#ff444420', borderColor: '#ff444450', color: '#ff4444' }}>
                {loginError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" style={{ color: '#f4ff1a' }}>اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="placeholder:opacity-50"
                style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                placeholder="أدخل اسم المستخدم"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: '#f4ff1a' }}>كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="placeholder:opacity-50"
                style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                placeholder="أدخل كلمة المرور"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full font-bold shadow-lg"
              style={{ backgroundColor: '#f4ff1a', color: '#1b1b1b' }}
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>

            <div className="text-center text-sm pt-4 border-t" style={{ color: '#888', borderColor: '#2a2a2a' }}>
              <p className="mb-2">تسجيل الدخول عبر API Backend</p>
              <p className="font-mono" style={{ color: '#ccc' }}>استخدم بيانات المستخدم من النظام</p>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  // ===== الواجهة الرئيسية =====
  return (
    <>
      <style>{`
        [data-state=active][role="tab"] {
          background-color: #f4ff1a !important;
          color: #1b1b1b !important;
        }
        [role="tabpanel"] {
          background-color:rgba(32, 31, 31, 0.88) !important;
        }
        input, textarea, select {
          background-color: #1b1b1b !important;
          border-color: #2a2a2a !important;
          color: #f4ff1a !important;
        }
        input::placeholder, textarea::placeholder {
          color: #888 !important;
          opacity: 0.5;
        }
      `}</style>
      <div className="min-h-screen" style={{ backgroundColor: '#1b1b1b' }} dir="rtl">
      {/* Header */}
        <header className="border-b sticky top-0 z-50 backdrop-blur-xl" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold shadow-lg" style={{ backgroundColor: '#f4ff1a', color: '#1b1b1b' }}>
                C
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#f4ff1a' }}>لوحة تحكم Codio</h1>
                <p className="text-sm" style={{ color: '#888' }}>
                  {stats.totalRequests} طلب - {users.length} مستخدم - {stats.totalAds} إعلان
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={refreshData}
                disabled={isRefreshing}
                style={{ borderColor: '#2a2a2a', color: '#f4ff1a' }}
                className="hover:opacity-80"
              >
                <RefreshCw className={`w-4 h-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  localStorage.removeItem('admin_token');
                  setIsAuthenticated(false);
                }}
                style={{ color: '#f4ff1a' }}
                className="hover:opacity-80  hover:bg-red-600/20"
              >
                <LogOut className="w-5 h-5 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* إشعار عائم للعمليات */}
      {notification.visible && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2" style={{ zIndex: 9999 }}>
          <div className={`px-4 py-2 rounded shadow-lg ${notification.type === 'success' ? 'text-black' : 'text-white'}`} style={notification.type === 'success' ? { backgroundColor: '#f4ff1a' } : { backgroundColor: '#ff4444' }}>
            {notification.message}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin" style={{ color: '#f4ff1a' }} />
            <span className="mr-2" style={{ color: '#f4ff1a' }}>جاري تحميل البيانات...</span>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }} className="border">
              <TabsTrigger value="overview" className="gap-2" style={{ 
                color: '#888'
              }}>
                <LayoutDashboard className="w-4 h-4" />
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger value="companies" className="gap-2" style={{ 
                color: '#888'
              }}>
                <Building2 className="w-4 h-4" />
                الشركات ({businessRequests.length})
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2" style={{ 
                color: '#888'
              }}>
                <Users className="w-4 h-4" />
                المستخدمين ({users.length})
              </TabsTrigger>
              <TabsTrigger value="ads" className="gap-2" style={{ 
                color: '#888'
              }}>
                <Megaphone className="w-4 h-4" />
                الإعلانات ({advertisements.length})
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2" style={{ 
                color: '#888'
              }}>
                <Settings className="w-4 h-4" />
                الإعدادات
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 p-4 rounded-lg" style={{ backgroundColor: '#000000' }}>
              {/* Marketing Value Propositions */}
              

              {/* Statistics Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 border-2 transition-all hover:opacity-80" style={{ backgroundColor: '#1b1b1b', borderColor: '#f4ff1a40' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm" style={{ color: '#888' }}>إجمالي الطلبات</p>
                      <p className="text-3xl font-bold" style={{ color: '#f4ff1a' }}>{stats.totalRequests}</p>
                      <p className="text-sm mt-1" style={{ color: '#f4ff1a' }}>+{stats.newMessages} جديد</p>
                    </div>
                    <Building2 className="w-12 h-12" style={{ color: '#f4ff1a' }} />
                  </div>
                </Card>

                <Card className="p-6 border-2 transition-all hover:opacity-80" style={{ backgroundColor: '#1b1b1b', borderColor: '#f4ff1a40' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm" style={{ color: '#888' }}>الطلبات المكتملة</p>
                      <p className="text-3xl font-bold" style={{ color: '#f4ff1a' }}>{stats.completedRequests}</p>
                      <p className="text-sm mt-1" style={{ color: '#f4ff1a' }}>
                        {stats.totalRequests > 0 ? Math.round((stats.completedRequests / stats.totalRequests) * 100) : 0}% نجاح
                      </p>
                    </div>
                    <CheckCircle className="w-12 h-12" style={{ color: '#f4ff1a' }} />
                  </div>
                </Card>

                <Card className="p-6 border-2 transition-all hover:opacity-80" style={{ backgroundColor: '#1b1b1b', borderColor: '#f4ff1a40' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm" style={{ color: '#888' }}>المستخدمين النشطين</p>
                      <p className="text-3xl font-bold" style={{ color: '#f4ff1a' }}>{stats.activeUsers}</p>
                      <p className="text-sm mt-1" style={{ color: '#f4ff1a' }}>من إجمالي {users.length}</p>
                    </div>
                    <Users className="w-12 h-12" style={{ color: '#f4ff1a' }} />
                  </div>
                </Card>

                <Card className="p-6 border-2 transition-all hover:opacity-80" style={{ backgroundColor: '#1b1b1b', borderColor: '#f4ff1a40' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm" style={{ color: '#888' }}>الإعلانات النشطة</p>
                      <p className="text-3xl font-bold" style={{ color: '#f4ff1a' }}>{stats.activeAds}</p>
                      <p className="text-sm mt-1" style={{ color: '#f4ff1a' }}>من إجمالي {stats.totalAds}</p>
                    </div>
                    <Megaphone className="w-12 h-12" style={{ color: '#f4ff1a' }} />
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold" style={{ color: '#f4ff1a' }}>الطلبات الأخيرة</h2>
                    <Badge variant="outline" style={{ color: '#f4ff1a', borderColor: '#2a2a2a' }}>
                      {businessRequests.length} طلب
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {businessRequests.slice(0, 5).map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 rounded-lg border" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f4ff1a20' }}>
                            <Building2 className="w-5 h-5" style={{ color: '#f4ff1a' }} />
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: '#f4ff1a' }}>{request.companyName}</p>
                            <p className="text-sm" style={{ color: '#888' }}>{request.contactPerson}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(request.status)} border`} style={getStatusStyle(request.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(request.status)}
                              {request.status}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {businessRequests.length === 0 && (
                      <div className="text-center py-8" style={{ color: '#888' }}>
                        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>لا توجد طلبات حتى الآن</p>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-6" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold" style={{ color: '#f4ff1a' }}>الإعلانات النشطة</h2>
                    <Badge variant="outline" style={{ color: '#f4ff1a', borderColor: '#2a2a2a' }}>
                      {advertisements.length} إعلان
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {advertisements.slice(0, 5).map((ad) => (
                      <div key={ad.id} className="flex items-center justify-between p-4 rounded-lg border" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f4ff1a20' }}>
                            <Megaphone className="w-5 h-5" style={{ color: '#f4ff1a' }} />
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: '#f4ff1a' }}>{ad.title}</p>
                            <p className="text-sm" style={{ color: '#888' }}>{ad.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge style={ad.status === AD_STATUS.ACTIVE ? { backgroundColor: '#f4ff1a20', color: '#f4ff1a' } : { backgroundColor: '#ff444420', color: '#ff4444' }}>
                            {ad.status === AD_STATUS.ACTIVE ? 'نشط' : 'غير نشط'}
                          </Badge>
                          <p className="text-xs" style={{ color: '#666' }}>{ad.impressions} مشاهدة</p>
                        </div>
                      </div>
                    ))}
                    {advertisements.length === 0 && (
                      <div className="text-center py-8" style={{ color: '#888' }}>
                        <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>لا توجد إعلانات حتى الآن</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Companies Tab */}
            <TabsContent value="companies" className="space-y-6 p-4 rounded-lg" style={{ backgroundColor: '#000000' }}>
              {/* Header with Add Button */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold" style={{ color: '#f4ff1a' }}>إدارة الشركات</h2>
                  <p className="mt-2" style={{ color: '#888' }}>إدارة طلبات الشركات وعروض التسويق</p>
                </div>
                <Button 
                  onClick={() => setShowCompanyForm(true)}
                  style={{ backgroundColor: '#f4ff1a', color: '#1b1b1b' }}
                  className="hover:opacity-90"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة شركة جديدة
                </Button>
              </div>

              {/* Search and Filter */}
              <Card className="p-4" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#888' }} />
                    <Input
                      placeholder="ابحث عن شركة، شخص، بريد إلكتروني أو هاتف..."
                      value={companiesSearchTerm}
                      onChange={(e) => setCompaniesSearchTerm(e.target.value)}
                      className="pr-10"
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      aria-label="تصفية حسب الحالة"
                      value={companiesFilterStatus}
                      onChange={(e) => setCompaniesFilterStatus(e.target.value)}
                      className="px-4 py-2 rounded-md"
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    >
                      <option value="all">جميع الحالات</option>
                      <option value={REQUEST_STATUS.NEW}>جديد</option>
                      <option value={REQUEST_STATUS.REVIEW}>قيد المراجعة</option>
                      <option value={REQUEST_STATUS.COMPLETED}>مكتمل</option>
                      <option value={REQUEST_STATUS.REJECTED}>مرفوض</option>
                    </select>
                    <Button 
                      variant="outline" 
                      onClick={exportCompanies}
                      style={{ borderColor: '#2a2a2a', color: '#f4ff1a' }}
                      className="hover:opacity-80"
                      disabled={filteredRequests.length === 0}
                    >
                      <Download className="w-4 h-4 ml-2" />
                      تصدير ({filteredRequests.length})
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold" style={{ color: '#f4ff1a' }}>قائمة الشركات</h3>
                  <div className="flex items-center gap-2" style={{ color: '#888' }}>
                    <span>عرض {filteredRequests.length} من {businessRequests.length}</span>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b" style={{ borderColor: '#2a2a2a' }}>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>اسم الشركة</th>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>الشخص المسؤول</th>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>نوع النشاط</th>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>المدينة</th>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>الحالة</th>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>التاريخ</th>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((request) => (
                        <tr key={request.id} className="border-b hover:opacity-80" style={{ borderColor: '#2a2a2a' }}>
                          <td className="p-4 font-medium" style={{ color: '#f4ff1a' }}>{request.companyName}</td>
                          <td className="p-4" style={{ color: '#ccc' }}>
                            <div>
                              <p>{request.contactPerson}</p>
                              <p className="text-sm" style={{ color: '#888' }}>{request.position}</p>
                            </div>
                          </td>
                          <td className="p-4" style={{ color: '#ccc' }}>{request.businessType}</td>
                          <td className="p-4" style={{ color: '#ccc' }}>{request.city}</td>
                          <td className="p-4">
                            <Badge className={`${getStatusColor(request.status)} border`} style={getStatusStyle(request.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(request.status)}
                                {request.status}
                              </span>
                            </Badge>
                          </td>
                          <td className="p-4" style={{ color: '#ccc' }}>
                            <div>
                              <p>{request.date}</p>
                              <p className="text-sm" style={{ color: '#888' }}>{request.time}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedRequest(request)}
                                style={{ borderColor: '#f4ff1a40', color: '#f4ff1a' }}
                                className="hover:opacity-80"
                              >
                                <Eye className="w-4 h-4 ml-1" />
                                عرض
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingCompany(request)}
                                style={{ borderColor: '#f4ff1a40', color: '#f4ff1a' }}
                                className="hover:opacity-80"
                              >
                                <Edit className="w-4 h-4 ml-1" />
                                تعديل
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => deleteRequest(request.id)}
                                style={{ borderColor: '#ff444440', color: '#ff4444' }}
                                className="hover:opacity-80"
                              >
                                <Trash2 className="w-4 h-4 ml-1" />
                                حذف
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredRequests.length === 0 && (
                        <tr>
                          <td colSpan="7" className="p-8 text-center" style={{ color: '#888' }}>
                            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>لا توجد طلبات تطابق معايير البحث</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6 p-4 rounded-lg" style={{ backgroundColor: '#000000' }}>
              {/* Header with Add Button */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold" style={{ color: '#f4ff1a' }}>إدارة المستخدمين</h2>
                  <p className="mt-2" style={{ color: '#888' }}>إدارة حسابات المستخدمين والفريق</p>
                </div>
                <Button 
                  onClick={() => setEditingUser({})}
                  style={{ backgroundColor: '#f4ff1a', color: '#1b1b1b' }}
                  className="hover:opacity-90"
                >
                  <UserPlus className="w-4 h-4 ml-2" />
                  إضافة مستخدم جديد
                </Button>
              </div>

              {/* Search and Filter */}
              <Card className="p-4" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#888' }} />
                    <Input
                      placeholder="ابحث عن مستخدم بالاسم، البريد الإلكتروني أو الدور..."
                      value={usersSearchTerm}
                      onChange={(e) => setUsersSearchTerm(e.target.value)}
                      className="pr-10"
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={exportUsers}
                      style={{ borderColor: '#2a2a2a', color: '#f4ff1a' }}
                      className="hover:opacity-80"
                      disabled={users.length === 0}
                    >
                      <Download className="w-4 h-4 ml-2" />
                      تصدير ({users.length})
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold" style={{ color: '#f4ff1a' }}>قائمة المستخدمين</h3>
                  <div className="flex items-center gap-2" style={{ color: '#888' }}>
                    <span>عرض {filteredUsers.length} من {users.length}</span>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b" style={{ borderColor: '#2a2a2a' }}>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>المستخدم</th>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>البريد الإلكتروني</th>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>الهاتف</th>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>الدور</th>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>القسم</th>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>الحالة</th>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>تاريخ الانضمام</th>
                        <th className="text-right p-4 font-semibold" style={{ color: '#f4ff1a' }}>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:opacity-80" style={{ borderColor: '#2a2a2a' }}>
                          <td className="p-4 font-medium" style={{ color: '#f4ff1a' }}>{user.name}</td>
                          <td className="p-4" style={{ color: '#ccc' }}>{user.email}</td>
                          <td className="p-4" style={{ color: '#ccc' }} dir="ltr">{user.phone}</td>
                          <td className="p-4" style={{ color: '#ccc' }}>{user.role}</td>
                          <td className="p-4" style={{ color: '#ccc' }}>{user.department}</td>
                          <td className="p-4">
                            <Badge style={user.status === 'نشط' ? { backgroundColor: '#f4ff1a20', color: '#f4ff1a' } : { backgroundColor: '#ff444420', color: '#ff4444' }}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4" style={{ color: '#ccc' }}>{user.joinDate}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingUser(user)}
                                style={{ borderColor: '#f4ff1a40', color: '#f4ff1a' }}
                                className="hover:opacity-80"
                              >
                                <Edit className="w-4 h-4 ml-1" />
                                تعديل
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => deleteUser(user.id)}
                                style={{ borderColor: '#ff444440', color: '#ff4444' }}
                                className="hover:opacity-80"
                              >
                                <Trash2 className="w-4 h-4 ml-1" />
                                حذف
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan="8" className="p-8 text-center" style={{ color: '#888' }}>
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>لا توجد مستخدمين تطابق معايير البحث</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Ads Tab */}
            <TabsContent value="ads" className="space-y-6 p-4 rounded-lg" style={{ backgroundColor: '#000000' }}>
              {/* Header with Add Button */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold" style={{ color: '#f4ff1a' }}>إدارة الإعلانات</h2>
                  <p className="mt-2" style={{ color: '#888' }}>إدارة الصور الإعلانية وعروض التسويق</p>
                </div>
                <Button 
                  onClick={() => setShowAdForm(true)}
                  style={{ backgroundColor: '#f4ff1a', color: '#1b1b1b' }}
                  className="hover:opacity-90"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة إعلان جديد
                </Button>
              </div>

              {/* Search and Filter */}
              <Card className="p-4" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#888' }} />
                    <Input
                      placeholder="ابحث عن إعلان بالعنوان أو الوصف..."
                      value={adsSearchTerm}
                      onChange={(e) => setAdsSearchTerm(e.target.value)}
                      className="pr-10"
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      aria-label="تصفية الإعلانات حسب الحالة"
                      value={adsFilterStatus}
                      onChange={(e) => setAdsFilterStatus(e.target.value)}
                      className="px-4 py-2 rounded-md"
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    >
                      <option value="all">جميع الحالات</option>
                      <option value={AD_STATUS.ACTIVE}>نشط</option>
                      <option value={AD_STATUS.INACTIVE}>غير نشط</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Ads Statistics */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="p-6 border-2" style={{ backgroundColor: '#1b1b1b', borderColor: '#f4ff1a40' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm" style={{ color: '#888' }}>إجمالي الإعلانات</p>
                      <p className="text-3xl font-bold" style={{ color: '#f4ff1a' }}>{advertisements.length}</p>
                    </div>
                    <Megaphone className="w-12 h-12" style={{ color: '#f4ff1a' }} />
                  </div>
                </Card>

                <Card className="p-6 border-2" style={{ backgroundColor: '#1b1b1b', borderColor: '#f4ff1a40' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm" style={{ color: '#888' }}>الإعلانات النشطة</p>
                      <p className="text-3xl font-bold" style={{ color: '#f4ff1a' }}>{advertisements.filter(a => a.status === AD_STATUS.ACTIVE).length}</p>
                    </div>
                    <CheckCircle className="w-12 h-12" style={{ color: '#f4ff1a' }} />
                  </div>
                </Card>

                <Card className="p-6 border-2" style={{ backgroundColor: '#1b1b1b', borderColor: '#f4ff1a40' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm" style={{ color: '#888' }}>إجمالي المشاهدات</p>
                      <p className="text-3xl font-bold" style={{ color: '#f4ff1a' }}>
                        {advertisements.reduce((sum, ad) => sum + (ad.impressions || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <Eye className="w-12 h-12" style={{ color: '#f4ff1a' }} />
                  </div>
                </Card>

                <Card className="p-6 border-2" style={{ backgroundColor: '#1b1b1b', borderColor: '#f4ff1a40' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm" style={{ color: '#888' }}>إجمالي النقرات</p>
                      <p className="text-3xl font-bold" style={{ color: '#f4ff1a' }}>
                        {advertisements.reduce((sum, ad) => sum + (ad.clicks || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className="w-12 h-12" style={{ color: '#f4ff1a' }} />
                  </div>
                </Card>
              </div>

              {/* Ads Grid */}
              <Card className="p-6" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold" style={{ color: '#f4ff1a' }}>قائمة الإعلانات</h3>
                  <div className="flex items-center gap-2" style={{ color: '#888' }}>
                    <span>عرض {filteredAds.length} من {advertisements.length}</span>
                  </div>
                </div>

                {filteredAds.length === 0 ? (
                  <div className="text-center py-12">
                    <Megaphone className="w-16 h-16 mx-auto mb-4" style={{ color: '#888' }} />
                    <p className="text-lg" style={{ color: '#888' }}>لا توجد إعلانات</p>
                    <Button 
                      onClick={() => setShowAdForm(true)}
                      className="mt-4"
                      style={{ backgroundColor: '#f4ff1a', color: '#1b1b1b' }}
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة أول إعلان
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAds.map((ad) => (
                      <Card key={ad.id} className="overflow-hidden transition-all hover:opacity-80" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
                        <div className="relative">
                          <img 
                            src={ad.image} 
                            alt={ad.title}
                            className="w-full h-48 object-cover bg-gray-900"
                            onError={(e) => {
                              const imgElement = e.target as HTMLImageElement;
                              console.error('❌ Image failed to load:', {
                                attemptedUrl: ad.image,
                                imagePath: ad.image_path,
                                adId: ad.id,
                                adTitle: ad.title
                              });
                              imgElement.src = 'https://via.placeholder.com/400x200?text=' + encodeURIComponent('صورة غير متاحة');
                              imgElement.style.opacity = '0.5';
                            }}
                            onLoad={() => console.log('✅ Image loaded successfully:', ad.image)}
                          />
                          <div className="absolute top-2 left-2">
                            <Badge style={ad.status === AD_STATUS.ACTIVE ? { backgroundColor: '#f4ff1a', color: '#1b1b1b' } : { backgroundColor: '#ff4444', color: '#fff' }}>
                              {ad.status === AD_STATUS.ACTIVE ? 'نشط' : 'غير نشط'}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-lg mb-2" style={{ color: '#f4ff1a' }}>{ad.title}</h4>
                          <p className="text-sm mb-4" style={{ color: '#888' }}>{ad.description}</p>
                          
                          <div className="flex justify-between text-xs mb-4" style={{ color: '#666' }}>
                            <div>
                              <span className="block">تاريخ البدء:</span>
                              <span style={{ color: '#ccc' }}>{ad.startDate}</span>
                            </div>
                            {ad.endDate && (
                              <div>
                                <span className="block">تاريخ الانتهاء:</span>
                                <span style={{ color: '#ccc' }}>{ad.endDate}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between text-xs mb-4" style={{ color: '#666' }}>
                            <div>
                              <span className="block">المشاهدات:</span>
                              <span style={{ color: '#ccc' }}>{ad.impressions || 0}</span>
                            </div>
                            <div>
                              <span className="block">النقرات:</span>
                              <span style={{ color: '#ccc' }}>{ad.clicks || 0}</span>
                            </div>
                            <div>
                              <span className="block">معدل النقر:</span>
                              <span style={{ color: '#ccc' }}>
                                {ad.impressions ? ((ad.clicks || 0) / ad.impressions * 100).toFixed(1) : 0}%
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1"
                              style={{ borderColor: '#f4ff1a40', color: '#f4ff1a' }}
                              onClick={() => window.open(ad.targetUrl, '_blank')}
                            >
                              معاينة
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              style={{ borderColor: '#f4ff1a40', color: '#f4ff1a' }}
                              onClick={() => {
                                const updatedAd = {...ad, status: ad.status === AD_STATUS.ACTIVE ? AD_STATUS.INACTIVE : AD_STATUS.ACTIVE};
                                updateAdvertisement(updatedAd);
                              }}
                            >
                              {ad.status === AD_STATUS.ACTIVE ? 'إيقاف' : 'تفعيل'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              style={{ borderColor: '#ff444440', color: '#ff4444' }}
                              onClick={() => deleteAdvertisement(ad.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 p-4 rounded-lg" style={{ backgroundColor: '#000000' }}>
              <Card className="p-6" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#f4ff1a' }}>إعدادات النظام</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1b1b1b' }}>
                    <div>
                      <p className="font-medium" style={{ color: '#f4ff1a' }}>عدد الطلبات المخزنة</p>
                      <p className="text-sm" style={{ color: '#888' }}>إجمالي طلبات الشركات في النظام</p>
                    </div>
                    <Badge variant="secondary" style={{ backgroundColor: '#f4ff1a20', color: '#f4ff1a', borderColor: '#2a2a2a' }}>{businessRequests.length} طلب</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1b1b1b' }}>
                    <div>
                      <p className="font-medium" style={{ color: '#f4ff1a' }}>عدد المستخدمين</p>
                      <p className="text-sm" style={{ color: '#888' }}>إجمالي المستخدمين في النظام</p>
                    </div>
                    <Badge variant="secondary" style={{ backgroundColor: '#f4ff1a20', color: '#f4ff1a', borderColor: '#2a2a2a' }}>{users.length} مستخدم</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1b1b1b' }}>
                    <div>
                      <p className="font-medium" style={{ color: '#f4ff1a' }}>عدد الإعلانات</p>
                      <p className="text-sm" style={{ color: '#888' }}>إجمالي الإعلانات في النظام</p>
                    </div>
                    <Badge variant="secondary" style={{ backgroundColor: '#f4ff1a20', color: '#f4ff1a', borderColor: '#2a2a2a' }}>{advertisements.length} إعلان</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1b1b1b' }}>
                    <div>
                      <p className="font-medium" style={{ color: '#f4ff1a' }}>مسح البيانات</p>
                      <p className="text-sm" style={{ color: '#888' }}>حذف جميع طلبات الشركات والمستخدمين والإعلانات</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={clearAllData}
                      style={{ backgroundColor: '#ff4444', color: '#fff' }}
                      disabled={businessRequests.length === 0 && users.length === 0 && advertisements.length === 0}
                    >
                      مسح الكل
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Company Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedRequest(null)}>
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }} onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#f4ff1a' }}>تفاصيل الطلب #{selectedRequest.id}</h2>
                <Button variant="ghost" onClick={() => setSelectedRequest(null)} style={{ color: '#f4ff1a' }} className="hover:opacity-80">
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>اسم الشركة</Label>
                    <p className="font-semibold text-lg" style={{ color: '#f4ff1a' }}>{selectedRequest.companyName}</p>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>الحالة</Label>
                    <Badge className={`${getStatusColor(selectedRequest.status)} border w-fit`} style={getStatusStyle(selectedRequest.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(selectedRequest.status)}
                        {selectedRequest.status}
                      </span>
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>الشخص المسؤول</Label>
                    <p style={{ color: '#ccc' }}>{selectedRequest.contactPerson}</p>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>المنصب</Label>
                    <p style={{ color: '#ccc' }}>{selectedRequest.position}</p>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>البريد الإلكتروني</Label>
                    <p style={{ color: '#ccc' }}>{selectedRequest.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>رقم الهاتف</Label>
                    <p style={{ color: '#ccc' }} dir="ltr">{selectedRequest.phone}</p>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>رقم الواتساب</Label>
                    <p style={{ color: '#ccc' }} dir="ltr">{selectedRequest.whatsapp}</p>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>نوع النشاط</Label>
                    <p style={{ color: '#ccc' }}>{selectedRequest.businessType}</p>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>عدد الفروع</Label>
                    <p style={{ color: '#ccc' }}>{selectedRequest.numberOfBranches}</p>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>المدينة</Label>
                    <p style={{ color: '#ccc' }}>{selectedRequest.city}</p>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>تاريخ الطلب</Label>
                    <p style={{ color: '#ccc' }}>{selectedRequest.date} - {selectedRequest.time}</p>
                  </div>
                </div>

                {selectedRequest.notes && selectedRequest.notes !== 'لا توجد ملاحظات' && (
                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>ملاحظات العميل</Label>
                    <p className="p-3 rounded-lg" style={{ color: '#ccc', backgroundColor: '#1b1b1b' }}>{selectedRequest.notes}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t" style={{ borderColor: '#2a2a2a' }}>
                  <Button
                    onClick={() => handleStatusChange(selectedRequest.id, REQUEST_STATUS.REVIEW)}
                    className="flex-1 border"
                    style={{ backgroundColor: '#f4ff1a20', color: '#f4ff1a', borderColor: '#f4ff1a40' }}
                  >
                    قيد المراجعة
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedRequest.id, REQUEST_STATUS.COMPLETED)}
                    className="flex-1 border"
                    style={{ backgroundColor: '#f4ff1a20', color: '#f4ff1a', borderColor: '#f4ff1a40' }}
                  >
                    قبول
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedRequest.id, REQUEST_STATUS.REJECTED)}
                    className="flex-1 border"
                    style={{ backgroundColor: '#ff444420', color: '#ff4444', borderColor: '#ff444440' }}
                  >
                    رفض
                  </Button>
                  <Button
                    onClick={() => deleteRequest(selectedRequest.id)}
                    className="border"
                    style={{ backgroundColor: '#ff444420', color: '#ff4444', borderColor: '#ff444440' }}
                    variant="outline"
                  >
                    حذف
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Company Modal */}
      {showCompanyForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCompanyForm(false)}>
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }} onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#f4ff1a' }}>إضافة شركة جديدة</h2>
                <Button variant="ghost" onClick={() => setShowCompanyForm(false)} style={{ color: '#f4ff1a' }} className="hover:opacity-80">
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>اسم الشركة *</Label>
                    <Input
                      placeholder="أدخل اسم الشركة"
                      value={newCompany.company_name}
                      onChange={(e) => setNewCompany({...newCompany, company_name: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>الشخص المسؤول *</Label>
                    <Input
                      placeholder="اسم الشخص المسؤول"
                      value={newCompany.contact_person}
                      onChange={(e) => setNewCompany({...newCompany, contact_person: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>البريد الإلكتروني *</Label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={newCompany.email}
                      onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>رقم الهاتف *</Label>
                    <Input
                      placeholder="+966500000000"
                      value={newCompany.phone}
                      onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>نوع النشاط</Label>
                    <Input
                      placeholder="نوع نشاط الشركة"
                      value={newCompany.business_type}
                      onChange={(e) => setNewCompany({...newCompany, business_type: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>المدينة</Label>
                    <Input
                      placeholder="المدينة"
                      value={newCompany.city}
                      onChange={(e) => setNewCompany({...newCompany, city: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>المنصب</Label>
                    <Input
                      placeholder="المنصب"
                      value={newCompany.position}
                      onChange={(e) => setNewCompany({...newCompany, position: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>عدد الفروع</Label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={newCompany.number_of_branches}
                      onChange={(e) => setNewCompany({...newCompany, number_of_branches: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>
                </div>

                {/* Marketing Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold" style={{ color: '#f4ff1a' }}>ميزات التسويق</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 mt-1" style={{ color: '#f4ff1a' }} />
                        <div>
                          <h4 className="font-semibold" style={{ color: '#f4ff1a' }}>تكلفة فعالة</h4>
                          <p className="text-sm mt-1" style={{ color: '#888' }}>
                            نتائج قوية بتكلفة تنافسية أوفر من التسويق التقليدي
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }}>
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 mt-1" style={{ color: '#f4ff1a' }} />
                        <div>
                          <h4 className="font-semibold" style={{ color: '#f4ff1a' }}>بناء العلامة التجارية</h4>
                          <p className="text-sm mt-1" style={{ color: '#888' }}>
                            عزز ظهورك وثقة العملاء بك
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Promotional Images */}
                <div className="space-y-4">
                  <Label style={{ color: '#888' }}>الصور الإعلانية</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newCompany.promotional_images.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Promotional ${index}`} className="w-full h-24 object-cover rounded-lg" />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 left-1 w-6 h-6 p-0"
                          onClick={() => {
                            const newImages = newCompany.promotional_images.filter((_, i) => i !== index);
                            setNewCompany({...newCompany, promotional_images: newImages});
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    <label className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors h-24" style={{ borderColor: '#2a2a2a' }}>
                      <Upload className="w-8 h-8 mb-2" style={{ color: '#888' }} />
                      <span className="text-sm" style={{ color: '#888' }}>رفع صورة</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files);
                          if (files.length > 0) {
                            setIsLoading(true);
                            
                            // عرض preview مؤقت
                            const previewUrls = files.map(file => URL.createObjectURL(file));
                          setNewCompany({
                            ...newCompany, 
                              promotional_images: [...newCompany.promotional_images, ...previewUrls]
                            });
                            
                            // رفع الصور للخادم
                            try {
                              const uploadedImages = await Promise.all(
                                files.map(async (file) => {
                                  const response = await apiService.uploadFile(file);
                                  return response.path || response.url || response.data?.path || response.data?.url;
                                })
                              );
                              
                              // استبدال preview URLs بالـ paths الحقيقية
                              const currentImages = newCompany.promotional_images.filter(img => 
                                !previewUrls.includes(img)
                              );
                              setNewCompany({
                                ...newCompany, 
                                promotional_images: [...currentImages, ...uploadedImages]
                              });
                              showNotification('تم رفع الصور بنجاح', 'success');
                            } catch (error) {
                              console.error('Error uploading images:', error);
                              showNotification(error?.message || 'فشل رفع الصور', 'error');
                              // إزالة preview URLs في حالة الفشل
                              const currentImages = newCompany.promotional_images.filter(img => 
                                !previewUrls.includes(img)
                              );
                              setNewCompany({
                                ...newCompany, 
                                promotional_images: currentImages
                              });
                            } finally {
                              setIsLoading(false);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Team Members */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label style={{ color: '#888' }}>أعضاء الفريق</Label>
                    <Button
                      size="sm"
                      onClick={() => {
                        const newTeam = [...newCompany.team_members, {name: '', position: '', image: ''}];
                        setNewCompany({...newCompany, team_members: newTeam});
                      }}
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة عضو
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {newCompany.team_members.map((member, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#1b1b1b' }}>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <Input
                            placeholder="اسم العضو"
                            value={member.name}
                            onChange={(e) => {
                              const newTeam = [...newCompany.team_members];
                              newTeam[index].name = e.target.value;
                              setNewCompany({...newCompany, team_members: newTeam});
                            }}
                            style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                          />
                          <Input
                            placeholder="المنصب"
                            value={member.position}
                            onChange={(e) => {
                              const newTeam = [...newCompany.team_members];
                              newTeam[index].position = e.target.value;
                              setNewCompany({...newCompany, team_members: newTeam});
                            }}
                            style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            const newTeam = newCompany.team_members.filter((_, i) => i !== index);
                            setNewCompany({...newCompany, team_members: newTeam});
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t" style={{ borderColor: '#2a2a2a' }}>
                  <Button
                    onClick={addCompany}
                    className="flex-1"
                    style={{ backgroundColor: '#f4ff1a', color: '#1b1b1b' }}
                    disabled={!newCompany.company_name || !newCompany.contact_person || !newCompany.email || !newCompany.phone}
                  >
                    إضافة الشركة
                  </Button>
                  <Button
                    onClick={() => setShowCompanyForm(false)}
                    style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    variant="outline"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Ad Modal */}
      {showAdForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAdForm(false)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }} onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#f4ff1a' }}>إضافة إعلان جديد</h2>
                <Button variant="ghost" onClick={() => setShowAdForm(false)} style={{ color: '#f4ff1a' }} className="hover:opacity-80">
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>عنوان الإعلان *</Label>
                    <Input
                      placeholder="أدخل عنوان الإعلان"
                      value={newAd.title}
                      onChange={(e) => setNewAd({...newAd, title: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>وصف الإعلان</Label>
                    <Textarea
                      placeholder="أدخل وصف الإعلان"
                      value={newAd.description}
                      onChange={(e) => setNewAd({...newAd, description: e.target.value})}
                      className="min-h-[100px]"
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>رابط الوجهة</Label>
                    <Input
                      placeholder="https://example.com"
                      value={newAd.target_url}
                      onChange={(e) => setNewAd({...newAd, target_url: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label style={{ color: '#888' }}>تاريخ البدء</Label>
                      <Input
                        type="date"
                        value={newAd.start_date}
                        onChange={(e) => setNewAd({...newAd, start_date: e.target.value})}
                        style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label style={{ color: '#888' }}>تاريخ الانتهاء (اختياري)</Label>
                      <Input
                        type="date"
                        value={newAd.end_date}
                        onChange={(e) => setNewAd({...newAd, end_date: e.target.value})}
                        style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>صورة الإعلان *</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center" style={{ borderColor: '#2a2a2a' }}>
                      {newAd.image_path ? (
                        <div className="relative">
                          <img src={newAd.image_path} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 left-2"
                            style={{ backgroundColor: '#ff4444', color: '#fff' }}
                            onClick={() => setNewAd({...newAd, image_path: null})}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: '#888' }} />
                          <p className="mb-2" style={{ color: '#888' }}>انقر لرفع صورة الإعلان</p>
                          <p className="text-sm" style={{ color: '#666' }}>الحجم الموصى به: 400x200 بكسل</p>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setIsLoading(true);
                                // عرض preview مؤقت
                                const previewUrl = URL.createObjectURL(file);
                                setNewAd(prev => ({...prev, image_path: previewUrl}));
                                
                                // رفع الصورة للخادم
                                try {
                                  const response = await apiService.uploadFile(file);
                                  console.log('Upload response:', response);
                                  const imagePath = response.path || response.url || response.data?.path || response.data?.url || response.file;
                                  
                                  if (!imagePath) {
                                    console.warn('No image path in upload response:', response);
                                    throw new Error('لم يتم استلام مسار الصورة من الخادم');
                                  }
                                  
                                  console.log('Setting image path to:', imagePath);
                                  setNewAd(prev => ({...prev, image_path: imagePath}));
                                  showNotification('تم رفع الصورة بنجاح', 'success');
                                } catch (error) {
                                  console.error('Error uploading image:', error);
                                  showNotification(error?.message || 'فشل رفع الصورة', 'error');
                                  setNewAd(prev => ({...prev, image_path: null}));
                                } finally {
                                  setIsLoading(false);
                                }
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>حالة الإعلان</Label>
                    <select
                      aria-label="حالة الإعلان"
                      value={newAd.status}
                      onChange={(e) => setNewAd({...newAd, status: e.target.value})}
                      className="w-full px-4 py-2 rounded-md"
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    >
                      <option value={AD_STATUS.ACTIVE}>نشط</option>
                      <option value={AD_STATUS.INACTIVE}>غير نشط</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t" style={{ borderColor: '#2a2a2a' }}>
                  <Button
                    onClick={addAdvertisement}
                    className="flex-1"
                    style={{ backgroundColor: '#f4ff1a', color: '#1b1b1b' }}
                    disabled={!newAd.title || !newAd.image_path || isLoading}
                  >
                    {isLoading ? 'جاري الرفع...' : 'إضافة الإعلان'}
                  </Button>
                  <Button
                    onClick={() => setShowAdForm(false)}
                    style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    variant="outline"
                    disabled={isLoading}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Company Modal */}
      {editingCompany && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditingCompany(null)}>
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }} onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#f4ff1a' }}>تعديل بيانات الشركة</h2>
                <Button variant="ghost" onClick={() => setEditingCompany(null)} style={{ color: '#f4ff1a' }} className="hover:opacity-80">
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>اسم الشركة</Label>
                    <Input
                      value={editingCompany.companyName}
                      onChange={(e) => setEditingCompany({...editingCompany, companyName: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>الشخص المسؤول</Label>
                    <Input
                      value={editingCompany.contactPerson}
                      onChange={(e) => setEditingCompany({...editingCompany, contactPerson: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>البريد الإلكتروني</Label>
                    <Input
                      value={editingCompany.email}
                      onChange={(e) => setEditingCompany({...editingCompany, email: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>رقم الهاتف</Label>
                    <Input
                      value={editingCompany.phone}
                      onChange={(e) => setEditingCompany({...editingCompany, phone: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>نوع النشاط</Label>
                    <Input
                      value={editingCompany.businessType}
                      onChange={(e) => setEditingCompany({...editingCompany, businessType: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>المدينة</Label>
                    <Input
                      value={editingCompany.city}
                      onChange={(e) => setEditingCompany({...editingCompany, city: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label style={{ color: '#888' }}>الصور الإعلانية</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {editingCompany.promotionalImages?.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Promotional ${index}`} className="w-full h-24 object-cover rounded-lg" />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 left-1 w-6 h-6 p-0"
                          onClick={() => {
                            const newImages = [...editingCompany.promotionalImages];
                            newImages.splice(index, 1);
                            setEditingCompany({...editingCompany, promotionalImages: newImages});
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    <label className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors h-24" style={{ borderColor: '#2a2a2a' }}>
                      <Upload className="w-8 h-8 mb-2" style={{ color: '#888' }} />
                      <span className="text-sm" style={{ color: '#888' }}>رفع صورة</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files);
                          if (files.length > 0) {
                            setIsLoading(true);
                            
                            // عرض preview مؤقت
                            const previewUrls = files.map(file => URL.createObjectURL(file));
                          setEditingCompany({
                            ...editingCompany, 
                              promotionalImages: [...(editingCompany.promotionalImages || []), ...previewUrls]
                            });
                            
                            // رفع الصور للخادم
                            try {
                              const uploadedImages = await Promise.all(
                                files.map(async (file) => {
                                  const response = await apiService.uploadFile(file);
                                  return response.path || response.url || response.data?.path || response.data?.url;
                                })
                              );
                              
                              // استبدال preview URLs بالـ paths الحقيقية
                              const currentImages = (editingCompany.promotionalImages || []).filter(img => 
                                !previewUrls.includes(img)
                              );
                              setEditingCompany({
                                ...editingCompany, 
                                promotionalImages: [...currentImages, ...uploadedImages]
                              });
                              showNotification('تم رفع الصور بنجاح', 'success');
                            } catch (error) {
                              console.error('Error uploading images:', error);
                              showNotification(error?.message || 'فشل رفع الصور', 'error');
                              // إزالة preview URLs في حالة الفشل
                              const currentImages = (editingCompany.promotionalImages || []).filter(img => 
                                !previewUrls.includes(img)
                              );
                              setEditingCompany({
                                ...editingCompany, 
                                promotionalImages: currentImages
                              });
                            } finally {
                              setIsLoading(false);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label style={{ color: '#888' }}>أعضاء الفريق</Label>
                    <Button
                      size="sm"
                      onClick={() => {
                        const newTeam = [...(editingCompany.teamMembers || []), {name: '', position: '', image: ''}];
                        setEditingCompany({...editingCompany, teamMembers: newTeam});
                      }}
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة عضو
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {editingCompany.teamMembers?.map((member, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <Input
                            placeholder="اسم العضو"
                            value={member.name}
                            onChange={(e) => {
                              const newTeam = [...editingCompany.teamMembers];
                              newTeam[index].name = e.target.value;
                              setEditingCompany({...editingCompany, teamMembers: newTeam});
                            }}
                            style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                          />
                          <Input
                            placeholder="المنصب"
                            value={member.position}
                            onChange={(e) => {
                              const newTeam = [...editingCompany.teamMembers];
                              newTeam[index].position = e.target.value;
                              setEditingCompany({...editingCompany, teamMembers: newTeam});
                            }}
                            style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            const newTeam = editingCompany.teamMembers.filter((_, i) => i !== index);
                            setEditingCompany({...editingCompany, teamMembers: newTeam});
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t" style={{ borderColor: '#2a2a2a' }}>
                  <Button
                    onClick={() => updateCompany(editingCompany)}
                    className="flex-1"
                    style={{ backgroundColor: '#f4ff1a', color: '#1b1b1b' }}
                  >
                    حفظ التغييرات
                  </Button>
                  <Button
                    onClick={() => setEditingCompany(null)}
                    style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    variant="outline"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditingUser(null)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a' }} onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#f4ff1a' }}>
                  {editingUser.id ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}
                </h2>
                <Button variant="ghost" onClick={() => setEditingUser(null)} style={{ color: '#f4ff1a' }} className="hover:opacity-80">
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>اسم المستخدم</Label>
                    <Input
                      value={editingUser.name || ''}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>البريد الإلكتروني</Label>
                    <Input
                      value={editingUser.email || ''}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>رقم الهاتف</Label>
                    <Input
                      value={editingUser.phone || ''}
                      onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>الدور</Label>
                    <select
                      aria-label="دور المستخدم"
                      value={editingUser.role || ''}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                      className="w-full px-4 py-2 rounded-md"
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    >
                      <option value="">اختر الدور</option>
                      <option value="مدير">مدير</option>
                      <option value="مصمم">مصمم</option>
                      <option value="مطور">مطور</option>
                      <option value="مسوق">مسوق</option>
                      <option value="دعم فني">دعم فني</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>القسم</Label>
                    <Input
                      value={editingUser.department || ''}
                      onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#888' }}>الحالة</Label>
                    <select
                      aria-label="حالة المستخدم"
                      value={editingUser.status || 'نشط'}
                      onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                      className="w-full px-4 py-2 rounded-md"
                      style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    >
                      <option value="نشط">نشط</option>
                      <option value="غير نشط">غير نشط</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label style={{ color: '#888' }}>صورة الملف الشخصي</Label>
                  <div className="flex items-center gap-4">
                    {editingUser.profileImage && (
                      <img src={editingUser.profileImage} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                    )}
                    <label className="border-2 border-dashed rounded-lg px-4 py-2 cursor-pointer transition-colors" style={{ borderColor: '#2a2a2a' }}>
                      <span style={{ color: '#888' }}>رفع صورة</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            // عرض preview مؤقت
                            const previewUrl = URL.createObjectURL(file);
                            setEditingUser({...editingUser, profileImage: previewUrl});
                            
                            // رفع الصورة للخادم
                            try {
                              const response = await apiService.uploadFile(file);
                              const imagePath = response.path || response.url || response.data?.path || response.data?.url;
                              setEditingUser({...editingUser, profileImage: imagePath});
                              showNotification('تم رفع الصورة بنجاح', 'success');
                            } catch (error) {
                              console.error('Error uploading image:', error);
                              showNotification(error?.message || 'فشل رفع الصورة', 'error');
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t" style={{ borderColor: '#2a2a2a' }}>
                  <Button
                    onClick={() => editingUser.id ? updateUser(editingUser) : addUser(editingUser)}
                    className="flex-1"
                    style={{ backgroundColor: '#f4ff1a', color: '#1b1b1b' }}
                  >
                    {editingUser.id ? 'حفظ التغييرات' : 'إضافة مستخدم'}
                  </Button>
                  <Button
                    onClick={() => setEditingUser(null)}
                    style={{ backgroundColor: '#1b1b1b', borderColor: '#2a2a2a', color: '#f4ff1a' }}
                    variant="outline"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
    </>
  );
}
