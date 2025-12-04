import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// تعريف واجهة البيانات المتوافقة مع الـ BusinessRequestController
interface BusinessFormData {
  // الحقول الأساسية من الـ validation
  company_name: string;
  contact_person: string; // سيكون دمج الاسم الأول والأخير
  email: string;
  phone: string;
  business_type?: string;
  city?: string;
  position?: string;
  number_of_branches?: number;
  status?: string;
  
  // الحقول الإضافية
  notes?: string;
  whatsapp?: string;
  company_name_en?: string;
  establishment_year?: number;
  employee_count?: string;
  district?: string;
  street?: string;
  building_number?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  telegram?: string;
  linkedin?: string;
  tiktok?: string;
  snapchat?: string;
  cost_effectiveness?: string;
  brand_building?: string;
  marketing_results?: string;
  
  // الحقول المطلوبة للنموذج
  first_name: string;
  last_name: string;
  agreedToTerms: boolean;
  message?: string;
}

const BusinessForm = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // حالة النموذج
  const [formData, setFormData] = useState<Partial<BusinessFormData>>({
    first_name: '',
    last_name: '',
    company_name: '',
    email: '',
    phone: '',
    business_type: '',
    employee_count: '',
    city: '',
    agreedToTerms: false,
  });

  // تحديث حقول النموذج
  const handleInputChange = (field: keyof BusinessFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // دالة لدمج الاسم الأول والأخير في contact_person
  const getContactPerson = () => {
    return `${formData.first_name || ''} ${formData.last_name || ''}`.trim();
  };

  // إرسال البيانات إلى Laravel API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يجب الموافقة على الشروط والأحكام' : 'You must agree to terms and conditions',
        variant: 'destructive',
      });
      return;
    }

    // التحقق من الحقول المطلوبة الأساسية
    if (!formData.first_name || !formData.last_name || !formData.company_name || !formData.email || !formData.phone) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    // التحقق من صحة رقم الهاتف
    const phoneRegex = /^(\+?966|0)[1-9]\d{8}$/;
    if (!phoneRegex.test(formData.phone?.replace(/\s/g, '') || '')) {
      toast({
        title: isRTL ? 'خطأ في الإرسال' : 'Submission Error',
        description: isRTL ? 'رقم الهاتف غير صحيح' : 'Invalid phone number',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // تحضير البيانات للإرسال حسب توقعات الـ Controller
      const payload = {
        company_name: formData.company_name,
        contact_person: getContactPerson(), // دمج الاسم الأول والأخير
        email: formData.email,
        phone: formData.phone,
        business_type: formData.business_type || formData.company_type,
        city: formData.city,
        position: formData.position,
        number_of_branches: formData.number_of_branches || formData.branches,
        
        // الحقول الإضافية
        notes: formData.message || 'لا توجد ملاحظات',
        whatsapp: formData.whatsapp || formData.phone,
        company_name_en: formData.company_name_en,
        establishment_year: formData.establishment_year,
        employee_count: formData.employee_count,
        district: formData.district,
        street: formData.street,
        building_number: formData.building_number,
        website: formData.website,
        instagram: formData.instagram,
        facebook: formData.facebook,
        telegram: formData.telegram,
        linkedin: formData.linkedin,
        tiktok: formData.tiktok,
        snapchat: formData.snapchat,
        cost_effectiveness: formData.cost_effectiveness,
        brand_building: formData.brand_building,
        marketing_results: formData.marketing_results,
        
        // الـ status سيتم تعيينه افتراضيًا في الـ Controller
      };

      // إرسال الطلب إلى Laravel API
      const response = await fetch('/api/business-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': i18n.language,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // معالجة أخطاء الـ validation
        if (data.errors) {
          const errorMessages = Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || `Submission failed with status ${response.status}`);
      }

      // عرض رسالة النجاح
      toast({
        title: isRTL ? 'تم إرسال الطلب بنجاح' : 'Request Submitted Successfully',
        description: isRTL
          ? `تم تسجيل طلبك بنجاح. رقم الطلب: ${data.data?.id || 'غير متاح'}. سنتواصل معك قريباً`
          : `Your request has been registered successfully. Request ID: ${data.data?.id || 'N/A'}. We will contact you soon.`,
      });

      // إعادة تعيين النموذج
      setFormData({
        first_name: '',
        last_name: '',
        company_name: '',
        email: '',
        phone: '',
        business_type: '',
        employee_count: '',
        city: '',
        agreedToTerms: false,
      });
      setAgreedToTerms(false);
      
      // إعادة تعيين النموذج HTML
      const form = e.currentTarget;
      form.reset();

    } catch (error: unknown) {
      const err = error as Error;
      console.error('Form submission error:', err);
      
      let errorMessage = err.message || 
        (isRTL 
          ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' 
          : 'An error occurred while submitting. Please try again.'
        );
      
      // تحسين عرض رسائل الخطأ - فقط إذا كانت من الخادم
      if (errorMessage.includes('phone')) {
        errorMessage = isRTL ? 'رقم الهاتف غير صحيح' : 'Invalid phone number';
      } else if (errorMessage.includes('company_name')) {
        errorMessage = isRTL ? 'اسم الشركة مطلوب' : 'Company name is required';
      }
      
      toast({
        title: isRTL ? 'خطأ في الإرسال' : 'Submission Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground border-b border-primary pb-2">
            {t('personalInfo')}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name">{t('firstName')} *</Label>
              <Input
                id="first_name"
                required
                value={formData.first_name || ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="bg-background border-border"
                placeholder={t('firstName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">{t('lastName')} *</Label>
              <Input
                id="last_name"
                required
                value={formData.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="bg-background border-border"
                placeholder={t('lastName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">{t('position')}</Label>
              <Input
                id="position"
                value={formData.position || ''}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="bg-background border-border"
                placeholder={t('position')}
              />
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground border-b border-primary pb-2">
            {t('companyInfo')}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company_name">{t('companyName')} *</Label>
              <Input
                id="company_name"
                required
                value={formData.company_name || ''}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className="bg-background border-border"
                placeholder={t('companyName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name_en">{t('companyNameEn')}</Label>
              <Input
                id="company_name_en"
                value={formData.company_name_en || ''}
                onChange={(e) => handleInputChange('company_name_en', e.target.value)}
                className="bg-background border-border"
                placeholder="Company Name in English"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_type">{t('companyType')} *</Label>
              <Select 
                required
                value={formData.business_type || ''}
                onValueChange={(value) => handleInputChange('business_type', value)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder={t('companyType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">متجر تجزئة / Retail Store</SelectItem>
                  <SelectItem value="restaurant">مطعم / Restaurant</SelectItem>
                  <SelectItem value="cafe">كوفي / Cafe</SelectItem>
                  <SelectItem value="services">خدمات / Services</SelectItem>
                  <SelectItem value="ecommerce">تجارة إلكترونية / E-commerce</SelectItem>
                  <SelectItem value="other">أخرى / Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="establishment_year">{t('establishmentYear')}</Label>
              <Input
                id="establishment_year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.establishment_year || ''}
                onChange={(e) => handleInputChange('establishment_year', parseInt(e.target.value) || undefined)}
                className="bg-background border-border"
                placeholder="2020"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee_count">{t('employeeCount')}</Label>
              <Select 
                value={formData.employee_count || ''}
                onValueChange={(value) => handleInputChange('employee_count', value)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder={t('employeeCount')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10</SelectItem>
                  <SelectItem value="11-50">11-50</SelectItem>
                  <SelectItem value="51-200">51-200</SelectItem>
                  <SelectItem value="201-500">201-500</SelectItem>
                  <SelectItem value="500+">500+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="number_of_branches">{t('branches')}</Label>
              <Input
                id="number_of_branches"
                type="number"
                min="1"
                value={formData.number_of_branches || ''}
                onChange={(e) => handleInputChange('number_of_branches', parseInt(e.target.value) || undefined)}
                className="bg-background border-border"
                placeholder="1"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground border-b border-primary pb-2">
            {t('contactInfo')}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">{t('city')}</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="bg-background border-border"
                placeholder={t('city')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">{t('district')}</Label>
              <Input
                id="district"
                value={formData.district || ''}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="bg-background border-border"
                placeholder={t('district')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">{t('street')}</Label>
              <Input
                id="street"
                value={formData.street || ''}
                onChange={(e) => handleInputChange('street', e.target.value)}
                className="bg-background border-border"
                placeholder={t('street')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="building_number">{t('buildingNumber')}</Label>
              <Input
                id="building_number"
                value={formData.building_number || ''}
                onChange={(e) => handleInputChange('building_number', e.target.value)}
                className="bg-background border-border"
                placeholder="1234"
              />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">{t('phone')} *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-background border-border"
                placeholder="+966501234567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">{t('whatsapp')}</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp || ''}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className="bg-background border-border"
                placeholder="+966501234567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')} *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-background border-border"
                placeholder="company@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">{t('website')}</Label>
              <Input
                id="website"
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="bg-background border-border"
                placeholder="https://www.example.com"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground border-b border-primary pb-2">
            {t('socialMedia')}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="instagram">{t('instagram')}</Label>
              <Input
                id="instagram"
                value={formData.instagram || ''}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                className="bg-background border-border"
                placeholder="@username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">{t('facebook')}</Label>
              <Input
                id="facebook"
                value={formData.facebook || ''}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
                className="bg-background border-border"
                placeholder="facebook.com/page"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telegram">{t('Telegram')}</Label>
              <Input
                id="telegram"
                value={formData.telegram || ''}
                onChange={(e) => handleInputChange('telegram', e.target.value)}
                className="bg-background border-border"
                placeholder="@username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">{t('linkedin')}</Label>
              <Input
                id="linkedin"
                value={formData.linkedin || ''}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                className="bg-background border-border"
                placeholder="linkedin.com/company/name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiktok">{t('tiktok')}</Label>
              <Input
                id="tiktok"
                value={formData.tiktok || ''}
                onChange={(e) => handleInputChange('tiktok', e.target.value)}
                className="bg-background border-border"
                placeholder="@username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="snapchat">{t('snapchat')}</Label>
              <Input
                id="snapchat"
                value={formData.snapchat || ''}
                onChange={(e) => handleInputChange('snapchat', e.target.value)}
                className="bg-background border-border"
                placeholder="@username"
              />
            </div>
          </div>
        </div>

        {/* Additional Message */}
        <div className="space-y-2">
          <Label htmlFor="message">{t('message')}</Label>
          <Textarea
            id="message"
            rows={4}
            value={formData.message || ''}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className="bg-background border-border resize-none"
            placeholder={t('message')}
          />
        </div>

        {/* Terms Agreement */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          />
          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {t('agreeToTerms')} *
          </Label>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !agreedToTerms}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 shadow-glow"
        >
          <Send className="w-5 h-5 mr-2" />
          {isSubmitting ? t('submitting') : t('submit')}
        </Button>
      </form>
    </div>
  );
};

export default BusinessForm;