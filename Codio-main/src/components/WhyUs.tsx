import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Layers, Zap, SearchCheck, Sparkle } from 'lucide-react';
import { Card } from '@/components/ui/card';

import heroUserImg from '@/assets/hero-user.jpg';
import studentsImg from '@/assets/hero-user.jpg';
import followImg from '@/assets/hero-user.jpg';
import mapImg from '@/assets/hero-user.jpg';

const WhyUs = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Layers, title: t("feature1Title"), description: t("feature1Desc"), image: heroUserImg },
    { icon: Zap, title: t("feature2Title"), description: t("feature2Desc"), image: studentsImg },
    { icon: SearchCheck, title: t("feature3Title"), description: t("feature3Desc"), image: followImg },
    { icon: Sparkle, title: t("feature4Title"), description: t("feature4Desc"), image: mapImg },
  ];

  return (
    <div className="w-full py-12 px-4 md:px-8 bg-background">
      {/* Title */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-foreground font-arabic">
          {t("featuresTitle")}
        </h2>
      </motion.div>

      {/* Flex Container */}
      <div className="flex flex-wrap justify-center items-stretch gap-8 lg:gap-10 mx-auto w-full">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="flex-shrink-0"
          >
            <Card
              className="
                relative overflow-hidden p-0 rounded-3xl
                border-2 border-white/10
                bg-[var(--accent-foreground-hex)]
                cursor-pointer group
                transition-all duration-300
                hover:scale-[1.02] hover:shadow-md hover:shadow-[var(--primary-hex)]
                w-[420px] md:w-[500px] h-[350px]
              "
            >
              {/* Hover Gradient Glow */}
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 opacity-70 blur-md"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Image */}
              <div className="relative w-full h-52 overflow-hidden rounded-t-3xl">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                />
              </div>

              {/* Icon + Text */}
              <div className="p-6 flex gap-4 items-start relative z-10">
                <div className="rounded-sm bg-primary flex items-center justify-center shadow-md">
                  <feature.icon className="text-primary-foreground p-1 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-arabic text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WhyUs;
