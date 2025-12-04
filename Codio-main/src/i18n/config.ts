import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      // Navigation
      home: 'الرئيسية',
      forUsers: 'للمستخدمين',
      forBusiness: 'للشركات',
      contact: 'تواصل معنا',

      // Choice Page
      choiceTitle: 'مرحباً بك في',
      choiceSubtitle: 'اختر نوع زيارتك لنقدم لك أفضل تجربة',
      asUser: 'كمستخدم عادي',
      asBusiness: 'كشركة أو متجر',
      userDescription: 'احصل على أكواد خصم حصرية من آلاف المتاجر والمطاعم',
      businessDescription: 'انضم لشبكتنا وسوق منتجاتك لآلاف المستخدمين',

      // User Page
      userHeroTitle: 'اكتشف عالماً من الخصومات',
      userHeroSubtitle: 'آلاف أكواد الخصم والعروض الحصرية في متناول يدك',
      downloadApp: 'التطبيق تحت التطوير',
      learnMore: 'اعرف المزيد',
      howItWorksSub: 'أربع خطوات بسيطة للبدء في التوفير',
      howItWorks: 'كيف يعمل Codio؟',

      step1Title: 'حمّل التطبيق',
      step1Desc: 'قم بتنزيل تطبيق Codio مجاناً من متجر التطبيقات بضغطة واحدة.',

      step2Title: 'تصفح العروض',
      step2Desc: 'استكشف آلاف العروض الجاهزة للاستعمال من أشهر المتاجر.',

      step3Title: 'احصل على الخصم',
      step3Desc: 'انسخ الكود واستمتع بالتوفير الفوري بدون أي تعقيد.',

      step4Title: 'ابدأ التوفير',
      step4Desc: 'احفظ عروضك المفضلة وتابع مدخراتك لحظة بلحظة.',

      whyChooseUs: 'لماذا تختار Codio؟',

      benefit1: 'توفير مضمون',
      benefit1Desc: 'وفر حتى 70% على مشترياتك اليومية من مختلف المجالات.',

      benefit2: 'سهل الاستخدام',
      benefit2Desc: 'تصميم بسيط وسريع يتيح لك الوصول للكود في ثوانٍ.',

      benefit3: 'محدث دائماً',
      benefit3Desc: 'العروض تتجدد لحظياً لتضمن حصولك على أحدث الخصومات.',

      benefit4: 'آمن وموثوق',
      benefit4Desc: 'كل العروض يتم مراجعتها والتأكد من فعاليتها.',

      // Popularity
      partnersLabel: 'شريك تجاري',
      dealsLabel: 'عرض وكود نشط',
      usersLabel: 'مستخدم',
      savingsLabel: 'توفير للعملاء',

      // Features
      featuresTitle: 'لماذا Codio؟',
      feature1Title: 'آلاف العروض والخصومات',
      feature1Desc: 'احصل على أكواد خصم جاهزة ومحدثة يومياً من مئات المتاجر.',

      feature2Title: 'كن أول من يصل!',
      feature2Desc: 'أحدث العروض تصلك فوراً قبل أي شخص آخر.',

      feature3Title: 'تابع المتاجر المفضلة',
      feature3Desc: 'احصل على إشعارات فورية عند نزول أي عرض جديد.',

      feature4Title: 'اكتشف عروض تناسبك',
      feature4Desc: 'اقتراحات ذكية مبنية على تفضيلاتك والمحتوى الذي تزوره.',

      feature5Title: 'عروض قريبة منك',
      feature5Desc: 'اعرض الخصومات على الخريطة واكتشف أفضل العروض حولك.',

      // Business Page
      businessHeroTitle: 'انضم لشبكة Codio',
      businessHeroSubtitle: 'سوّق لمنتجاتك بسهولة وحقق نتائج ملموسة.',
      partnerWithUs: 'شارك معنا',
      whyPartner: 'لماذا الشراكة مع Codio؟',

      businessFeature1Title: 'وصول لآلاف العملاء المحتملين',
      businessFeature1Desc: 'اعرض منتجاتك لشريحة كبيرة من المستخدمين المهتمين.',

      businessFeature2Title: 'تحليلات دقيقة',
      businessFeature2Desc: 'معلومات تفصيلية عن تفاعل العملاء مع عروضك.',

      businessFeature3Title: 'إدارة مرنة وسهلة',
      businessFeature3Desc: 'أضف، عدل، واحذف عروضك خلال ثوانٍ فقط.',

      businessFeature4Title: 'دعم فني متواصل',
      businessFeature4Desc: 'فريق دعم جاهز لمساعدتك في أي وقت.',

      businessFeature5Title: 'تسويق مستهدف',
      businessFeature5Desc: 'استهداف دقيق حسب الاهتمامات والموقع الجغرافي.',

      businessFeature6Title: 'تكلفة فعالة',
      businessFeature6Desc: 'نتائج قوية بتكلفة تنافسية أوفر من التسويق التقليدي.',

      partnerBenefits: 'مزايا الشراكة',
      benefit1Business: 'زيادة المبيعات',
      benefit1BusinessDesc: 'اجذب عملاء جدد بسهولة وزد من معدل التحويل.',

      benefit2Business: 'بناء العلامة التجارية',
      benefit2BusinessDesc: 'عزز ظهورك وثقة العملاء بك.',

      benefit3Business: 'تقارير شاملة',
      benefit3BusinessDesc: 'شاهد أداء حملاتك خطوة بخطوة.',

      // Business Form
      formTitle: 'سجل شركتك الآن',
      formSubtitle: 'املأ بياناتك وسنتواصل معك في أسرع وقت.',
      personalInfo: 'بيانات المسؤول',
      companyInfo: 'بيانات الشركة',
      contactInfo: 'معلومات التواصل',
      socialMedia: 'حسابات التواصل الاجتماعي',

      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      position: 'المنصب الوظيفي',
      nationalId: 'رقم الهوية الوطنية',
      dateOfBirth: 'تاريخ الميلاد',
      companyName: 'اسم الشركة/المتجر',
      companyNameEn: 'اسم الشركة بالإنجليزية',
      companyType: 'نوع النشاط التجاري',
      commercialRegistration: 'رقم السجل التجاري',
      taxNumber: 'الرقم الضريبي',
      establishmentYear: 'سنة التأسيس',
      employeeCount: 'عدد الموظفين',
      branches: 'عدد الفروع',
      city: 'المدينة',
      district: 'الحي',
      street: 'الشارع',
      buildingNumber: 'رقم المبنى',
      postalCode: 'الرمز البريدي',
      phone: 'رقم الهاتف',
      whatsapp: 'رقم الواتساب',
      email: 'البريد الإلكتروني',
      website: 'الموقع الإلكتروني',
      instagram: 'حساب الانستغرام',
      facebook: 'حساب الفيسبوك',
      twitter: 'حساب تويتر (X)',
      linkedin: 'حساب لينكد إن',
      tiktok: 'حساب تيك توك',
      snapchat: 'حساب سناب شات',
      Telegram: 'حساب تيليجرام',
      message: 'رسالة أو ملاحظات إضافية',
      agreeToTerms: 'أوافق على الشروط والأحكام',
      submit: 'إرسال الطلب',
      submitting: 'جاري الإرسال...',
      required: 'مطلوب',

      // Footer
      followUs: 'تابعنا',
      allRightsReserved: 'جميع الحقوق محفوظة',
      privacyPolicy: 'سياسة الخصوصية',
      termsOfService: 'شروط الاستخدام',
    },
  },

  // ---------------- ENGLISH ----------------
  en: {
    translation: {
      // Navigation
      home: 'Home',
      forUsers: 'For Users',
      forBusiness: 'For Business',
      contact: 'Contact Us',

      // Choice Page
      choiceTitle: 'Welcome to Codio',
      choiceSubtitle: 'Choose your visit type for the best experience',
      asUser: 'As a User',
      asBusiness: 'As a Business',
      userDescription: 'Get exclusive discount codes from thousands of stores and restaurants',
      businessDescription: 'Join our network and market your products to thousands of users',

      // User Page
      userHeroTitle: 'Discover a World of Discounts',
      userHeroSubtitle: 'Thousands of discount codes and exclusive offers at your fingertips',
      downloadApp: 'Download App Now',
      learnMore: 'Learn More',
      howItWorks: 'How It Works?',
      
      step1Title: 'Download the App',
      step1Desc: 'Get Codio for free from any app store in seconds.',

      step2Title: 'Browse Offers',
      step2Desc: 'Explore thousands of discounts categorized and ready to use.',

      step3Title: 'Get the Discount',
      step3Desc: 'Copy the code and enjoy instant savings with zero hassle.',

      step4Title: 'Start Saving',
      step4Desc: 'Save your favorite offers and track your total savings easily.',

      whyChooseUs: 'Why Choose Codio?',

      benefit1: 'Guaranteed Savings',
      benefit1Desc: 'Save up to 70% on everyday purchases.',

      benefit2: 'Easy to Use',
      benefit2Desc: 'A fast and smooth interface designed for everyone.',

      benefit3: 'Always Updated',
      benefit3Desc: 'New verified offers added every day.',

      benefit4: 'Safe & Reliable',
      benefit4Desc: 'All offers are checked and guaranteed to work.',

      // Features
      featuresTitle: 'Why Codio?',
      feature1Title: 'Thousands of Exclusive Offers',
      feature1Desc: 'Access discount codes from hundreds of brands updated daily.',

      feature2Title: 'Be the First to Get Deals',
      feature2Desc: 'Instantly get notified when new offers drop.',

      feature3Title: 'Follow Your Favorite Stores',
      feature3Desc: 'Get alerts the moment your followed store posts an offer.',

      feature4Title: 'Personalized Suggestions',
      feature4Desc: 'Smart recommendations based on your interests.',

      feature5Title: 'Nearby Deals',
      feature5Desc: 'Discover offers around you using the integrated map.',

      // Business Page
      businessHeroTitle: 'Join Codio Network',
      businessHeroSubtitle: 'Promote your products and reach high-intent customers.',
      partnerWithUs: 'Partner With Us',
      whyPartner: 'Why Partner with Codio?',

      businessFeature1Title: 'Reach Thousands of Potential Customers',
      businessFeature1Desc: 'Expose your brand to a large audience actively seeking deals.',

      businessFeature2Title: 'Advanced Analytics',
      businessFeature2Desc: 'Track engagement, clicks, and conversion rates.',

      businessFeature3Title: 'Flexible Management',
      businessFeature3Desc: 'Easily add or edit offers with no complications.',

      businessFeature4Title: '24/7 Technical Support',
      businessFeature4Desc: 'Our team is ready to help anytime.',

      businessFeature5Title: 'Targeted Marketing',
      businessFeature5Desc: 'Reach the right audience based on behaviors and location.',

      businessFeature6Title: 'Cost-Effective',
      businessFeature6Desc: 'Affordable plans with guaranteed ROI.',

      partnerBenefits: 'Partnership Benefits',

      benefit1Business: 'Increase Sales',
      benefit1BusinessDesc: 'Attract new customers and boost conversions.',

      benefit2Business: 'Build Your Brand',
      benefit2BusinessDesc: 'Enhance your image and customer trust.',

      benefit3Business: 'Detailed Reports',
      benefit3BusinessDesc: 'Understand your performance with clear insights.',

      // Business Form
      formTitle: 'Register Your Business',
      formSubtitle: 'Fill the form and we’ll reach out shortly.',
      personalInfo: 'Contact Person Information',
      companyInfo: 'Company Information',
      contactInfo: 'Contact Information',
      socialMedia: 'Social Media Accounts',

      firstName: 'First Name',
      lastName: 'Last Name',
      position: 'Job Title',
      nationalId: 'National ID Number',
      dateOfBirth: 'Date of Birth',
      companyName: 'Company/Store Name',
      companyNameEn: 'Company Name in English',
      companyType: 'Business Type',
      commercialRegistration: 'Commercial Registration Number',
      taxNumber: 'Tax Number',
      establishmentYear: 'Establishment Year',
      employeeCount: 'Number of Employees',
      branches: 'Number of Branches',
      city: 'City',
      district: 'District',
      street: 'Street',
      buildingNumber: 'Building Number',
      postalCode: 'Postal Code',
      phone: 'Phone Number',
      whatsapp: 'WhatsApp Number',
      email: 'Email',
      website: 'Website',
      instagram: 'Instagram',
      facebook: 'Facebook',
      twitter: 'Twitter (X)',
      linkedin: 'LinkedIn',
      tiktok: 'TikTok',
      snapchat: 'Snapchat',
      Telegram: 'Telegram',
      message: 'Additional Message or Notes',
      agreeToTerms: 'I agree to the terms and conditions',
      submit: 'Submit',
      submitting: 'Submitting...',
      required: 'Required',

      // Footer
      followUs: 'Follow Us',
      allRightsReserved: 'All Rights Reserved',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar',
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
});

export default i18n;
