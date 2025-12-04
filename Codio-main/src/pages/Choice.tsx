import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Building2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Choice = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const choices = [
    {
      type: 'user',
      icon: User,
      title: t('asUser'),
      description: t('userDescription'),
      path: '/users',
      gradient: 'from-primary/20 to-primary/5',
    },
    {
      type: 'business',
      icon: Building2,
      title: t('asBusiness'),
      description: t('businessDescription'),
      path: '/business',
      gradient: 'from-accent/20 to-accent/5',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <div className="container max-w-6xl relative z-10">
        {/* Header */}
         <div className='flex justify-center items-center'>
          <h1 className="text-2xl text-center md:text-3xl font-bold text-foreground font-arabic">
            {t('choiceTitle')}
          </h1>
         </div>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center">
            <motion.div
              className="w-[220px] rounded-2xl flex items-center justify-center font-bold text-primary-foreground text-3xl"
            >
              <img src="favicon3.png" className='rounded-md mb-2' />
            </motion.div>
            {/* <Sparkles className="w-8 h-8 text-primary animate-glow-pulse" /> */}
          </div>
          <p className="text-lg text-muted-foreground mb-10">
            {t('choiceSubtitle')}
          </p>
        </motion.div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {choices.map((choice, index) => (
            <motion.div
              key={choice.type}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card
                className={`p-8 bg-gradient-to-br ${choice.gradient} border-2 border-border hover:border-primary transition-all duration-300 cursor-pointer group relative overflow-hidden`}
                onClick={() => navigate(choice.path)}
              >
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                <div className="relative z-10">
                  <motion.div
                    className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-glow transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <choice.icon className="w-10 h-10 text-primary-foreground" />
                  </motion.div>

                  <h2 className="text-3xl font-bold text-foreground mb-4 font-arabic">
                    {choice.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    {choice.description}
                  </p>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg group-hover:shadow-glow transition-all duration-300"
                    size="lg"
                  >
                    {t('learnMore')}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="pt-10 flex justify-center items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            dir="rtl"
            className="bg-primary-foreground text-primary font-bold px-6 py-1 rounded-md shadow-glow 
               text-md text-center flex justify-center items-center gap-2 mb-3 w-fit 
               animate-glow-pulse border-2 border-[var(--primary-hex)] transform 
               hover:scale-105 transition-all"
          >
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            قريباً على App Store و Google Play للموبايل
            
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Choice;
