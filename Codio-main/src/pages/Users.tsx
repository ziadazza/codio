import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Tag, GraduationCap, Heart, MapPin, Download, Sparkles, Smartphone, Search, CheckCircle2, TrendingUp, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import heroUserImg from '@/assets/hero-user.jpg';
import studentsImg from '@/assets/students-feature.jpg';
import followImg from '@/assets/follow-feature.jpg';
import mapImg from '@/assets/map-feature.jpg';
import StepsSection from '@/components/StepsSection';
import Popularity from '@/components/Popularity';
import Team from '@/components/Team';
import { FaGooglePlay, FaApple } from "react-icons/fa";
import WhyUs from '@/components/WhyUs';

const Users = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const howItWorksSteps = [
    {
      icon: Smartphone,
      title: t('step1Title'),
      description: t('step1Desc'),
      number: '1',
    },
    {
      icon: Search,
      title: t('step2Title'),
      description: t('step2Desc'),
      number: '2',
    },
    {
      icon: CheckCircle2,
      title: t('step3Title'),
      description: t('step3Desc'),
      number: '3',
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: t('benefit1'),
      description: t('benefit1Desc'),
    },
    {
      icon: Zap,
      title: t('benefit2'),
      description: t('benefit2Desc'),
    },
    {
      icon: Shield,
      title: t('benefit3'),
      description: t('benefit3Desc'),
    },
    {
      icon: CheckCircle2,
      title: t('benefit4'),
      description: t('benefit4Desc'),
    },
  ];

  const features = [
    {
      icon: Tag,
      title: t('feature1Title'),
      description: t('feature1Desc'),
      image: heroUserImg,
    },
    {
      icon: GraduationCap,
      title: t('feature2Title'),
      description: t('feature2Desc'),
      image: studentsImg,
    },
    {
      icon: Heart,
      title: t('feature3Title'),
      description: t('feature3Desc'),
      image: followImg,
    },
    {
      icon: MapPin,
      title: t('feature4Title'),
      description: t('feature4Desc'),
      image: mapImg,
    },
  ];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroUserImg}
            alt="Hero"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>

        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-40 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles className="w-8 h-8 text-primary animate-glow-pulse" />
              <h1 className="text-3xl md:text-5xl font-bold text-foreground font-arabic">
                {t('userHeroTitle')}
              </h1>
              <Sparkles className="w-8 h-8 text-primary animate-glow-pulse" />
            </motion.div>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('userHeroSubtitle')}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 shadow-glow animate-glow-pulse"
              >
                <Download className="w-5 h-5 mr-2" />
                {t('downloadApp')}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* steps section */}
      <StepsSection />
      {/* popularity */}
      <Popularity />

      {/* Partnership Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-arabic">
              مزايا الشراكة
            </h2>
            <p className="text-xl text-muted-foreground">
              لماذا الشراكة مع Codio؟
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: TrendingUp,
                title: "نمو مستدام",
                description: "زيادة مبيعاتك وسعة وصولك إلى ملايين المستخدمين"
              },
              {
                icon: Shield,
                title: "أمان وموثوقية",
                description: "منصة آمنة وموثوقة توفر حماية كاملة لبيانات العملاء"
              },
              {
                icon: Zap,
                title: "تقنية متقدمة",
                description: "استخدم أحدث التقنيات والأدوات لتطوير عملك"
              },
              {
                icon: CheckCircle2,
                title: "دعم متواصل",
                description: "فريق متخصص يدعمك على مدار الساعة طوال الأسبوع"
              },
              {
                icon: Heart,
                title: "تجربة العملاء",
                description: "واجهة سهلة الاستخدام توفر تجربة رائعة للعملاء"
              },
              {
                icon: MapPin,
                title: "توسع عالمي",
                description: "وصول إلى أسواق عالمية وفرص استثمارية جديدة"
              },
              {
                icon: Download,
                title: "أدوات تسويقية",
                description: "استفد من أدوات تسويق قوية لزيادة انتشار عملك"
              },
              {
                icon: Sparkles,
                title: "مميزات حصرية",
                description: "احصل على امتيازات وميزات حصرية للشركاء المتميزين"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary transition-all duration-300 h-full hover:shadow-lg">
                  <benefit.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2 font-arabic">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground font-arabic">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <Team />

      {/* How It Works Section */}
      {/* <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-arabic">
              {t('howItWorks')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6 inline-block">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-glow mx-auto">
                    <step.icon className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xl">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3 font-arabic">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-arabic">
              {t('whyChooseUs')}
            </h2>
          </motion.div> */}

          {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary transition-all duration-300 h-full">
                  <benefit.icon className="w-10 h-10 text-primary mb-4" />
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

          {/* Features Grid */}

          {/* <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-arabic">
              {t('featuresTitle')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden bg-card hover:shadow-glow transition-all duration-300 group border-2 border-border hover:border-primary">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    <motion.div
                      className="absolute top-4 left-4 w-14 h-14 bg-primary rounded-xl flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="w-7 h-7 text-primary-foreground" />
                    </motion.div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-foreground mb-3 font-arabic">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>  */}

          <WhyUs />
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden flex flex-col justify-center items-center">
        {/* ---- Coming Soon div ---- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-primary text-primary-foreground 
                    font-bold px-6 py-1 rounded-md shadow-glow text-md w-20 h-6 text-center flex justify-center items-center mb-3"
        >
          قريبًا
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-arabic">
              {t("downloadApp")}
            </h2>

            <p className="text-xl text-muted-foreground mb-10">
              {t("userHeroSubtitle")}
            </p>

            {/* ---- Two Buttons ---- */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">

              {/* Google Play */}
              <Button
                size="lg"
                className="bg-primary text-primary-foreground 
                       font-bold text-lg px-10 py-6 flex items-center gap-3 hover:animate-glow-pulse transform hover:scale-105 transtion-all"
              >
                <FaGooglePlay className="w-6 h-6" />
                Google Play
              </Button>

              {/* Apple Store */}
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/80 
                       font-bold text-lg text-[var(--primary-hex)] px-10 py-6 hover:animate-glow-pulse flex items-center gap-3 border-2 border-[var(--primary-hex)] transform hover:scale-105 transtion-all"
              >
                <FaApple className="w-7 h-7 text-[var(--primary-hex)]" />
                App Store
              </Button>

            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Users;
