import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, BarChart, Settings, Send, TrendingUp, Shield, HeadphonesIcon, Target, Zap, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import heroBusinessImg from '@/assets/hero-business.jpg';
import Team from '@/components/Team';
import BusinessForm from '@/components/BusinessForm';

const Business = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const features = [
    {
      icon: Users,
      title: t('businessFeature1Title'),
      description: t('businessFeature1Desc'),
    },
    {
      icon: BarChart,
      title: t('businessFeature2Title'),
      description: t('businessFeature2Desc'),
    },
    {
      icon: Settings,
      title: t('businessFeature3Title'),
      description: t('businessFeature3Desc'),
    },
    {
      icon: HeadphonesIcon,
      title: t('businessFeature4Title'),
      description: t('businessFeature4Desc'),
    },
    {
      icon: Target,
      title: t('businessFeature5Title'),
      description: t('businessFeature5Desc'),
    },
    {
      icon: DollarSign,
      title: t('businessFeature6Title'),
      description: t('businessFeature6Desc'),
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: t('benefit1Business'),
      description: t('benefit1BusinessDesc'),
    },
    {
      icon: Shield,
      title: t('benefit2Business'),
      description: t('benefit2BusinessDesc'),
    },
    {
      icon: Zap,
      title: t('benefit3Business'),
      description: t('benefit3BusinessDesc'),
    },
  ];

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

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: isRTL ? 'تم إرسال الطلب بنجاح' : 'Request Submitted Successfully',
      description: isRTL
        ? 'سنتواصل معك قريباً عبر البريد الإلكتروني أو الواتساب'
        : 'We will contact you soon via email or WhatsApp',
    });

    setIsSubmitting(false);
    e.currentTarget.reset();
    setAgreedToTerms(false);
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBusinessImg}
            alt="Business Hero"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-arabic">
              {t('businessHeroTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t('businessHeroSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>


      {/* Why Partner Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-arabic">
              {t('whyPartner')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 bg-card hover:shadow-glow transition-all duration-300 group border-2 border-border hover:border-primary h-full">
                  <motion.div
                    className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 font-arabic">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Benefits Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center font-arabic">
              {t('partnerBenefits')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary transition-all duration-300">
                    <benefit.icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          
          {/* team section */}
          <Team />

          {/* Registration Form */}
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 md:p-12 bg-gradient-card border-2 border-border">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-arabic">
                  {t('formTitle')}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {t('formSubtitle')}
                </p>
              </div>

            <BusinessForm />


            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Business;
