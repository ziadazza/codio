import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const StepsSection = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      number: "1",
      heading: t("step1Title"),
      text: t("step1Desc"),
    },
    {
      number: "2",
      heading: t("step2Title"),
      text: t("step2Desc"),
    },
    {
      number: "3",
      heading: t("step3Title"),
      text: t("step3Desc"),
    },
    {
      number: "4",
      heading: t("step4Title"),
      text: t("step4Desc"),
    }
  ];

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % steps.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // forced RTL
  const dir = "rtl";

  return (
    <section className="w-full py-16 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col items-center lg:px-6 bg-[var(--accent-foreground-hex)]">

        <h2 className="text-4xl font-bold mb-2 text-center" data-aos="fade-up">
            {t("howItWorks")}
        </h2>
        <p className="text-md font-bold mb-4 text-center text-white/40" data-aos="fade-up">
            {t("howItWorksSub")}
        </p>

        {/* Steps Wrapper */}
        <div
          className={`relative flex flex-col md:flex-row-reverse items-center justify-center lg:gap-10 lg:px-6 p-2`}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center relative m-4 p-4 md:p-8 rounded-2xl w-full md:w-64 lg:w-72"
              data-aos="zoom-in"
            >
              {/* Animated Circle */}
              <motion.div
                animate={{
                  scale: current === index ? [1, 1.25, 1] : 1,
                  boxShadow:
                    current === index
                      ? [
                        "0 0 0px var(--primary-hex)",
                        "0 0 20px var(--primary-hex)",
                        "0 0 0px var(--primary-hex)",
                      ]
                      : "0 0 0px var(--primary-hex)",
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                  repeat: current === index ? Infinity : 0,
                }}
                className="w-20 h-20 rounded-2xl bg-[var(--primary-hex)] text-black flex items-center justify-center text-3xl font-bold shadow-xl"
              >
                {step.number}
              </motion.div>

              {/* Heading */}
              <h4 className="text-2xl mt-4 max-w-[180px] text-[var(--primary-hex)] dark:text-gray-100">
                {step.heading}
              </h4>

              {/* Description */}
              <p className="text-sm mt-1 max-w-[180px] text-gray-300 dark:text-gray-300">
                {step.text}
              </p>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div
                  className={`hidden lg:block text-[var(--primary-hex)] absolute top-1/2 -translate-y-1/2 text-3xl right-[-50px] rtl`}
                >
                  <FaArrowRight />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
