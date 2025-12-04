import React, { useEffect, useState } from "react";
import { FaUsers, FaDownload, FaTags, FaShoppingCart } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface StatsData {
  partners: number;
  deals: number;
  users: number;
  savings: number;
}

const Popularity = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<StatsData>({
    partners: 0,
    deals: 0,
    users: 0,
    savings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats/public");
        const data = await response.json();
        if (data.success && data.data) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    return num.toString();
  };

  return (
    <section className="w-full py-16 bg-[var(--primary-hex)] text-black">
      <div className="max-w-6xl mx-auto px-12">

        <div className="flex justify-between items-center gap-4 lg:gap-8 flex-wrap md:flex-nowrap">

          {/* الشركاء */}
          <div className="flex flex-col items-center gap-3 min-w-[120px]">
            {/* <FaUsers className="text-4xl" /> */}
            <h3 className="text-4xl font-bold">{loading ? "-" : stats.partners}+</h3>
            <p className="text-sm opacity-80">{t("stats.partnersLabel")}</p>
          </div>

          {/* العروض */}
          <div className="flex flex-col items-center gap-3 min-w-[120px]">
            {/* <FaDownload className="text-4xl" /> */}
            <h3 className="text-4xl font-bold">{loading ? "-" : stats.deals}+</h3>
            <p className="text-sm opacity-80">{t("stats.dealsLabel")}</p>
          </div>

          {/* المستخدمون/الإعلانات */}
          <div className="flex flex-col items-center gap-3 min-w-[120px]">
            {/* <FaTags className="text-4xl" /> */}
            <h3 className="text-4xl font-bold">{loading ? "-" : stats.users}+</h3>
            <p className="text-sm opacity-80">{t("stats.usersLabel")}</p>
          </div>

          {/* الزيارات */}
          <div className="flex flex-col items-center gap-3 min-w-[120px]">
            {/* <FaShoppingCart className="text-4xl" /> */}
            <h3 className="text-4xl font-bold">{loading ? "-" : formatNumber(stats.savings)}</h3>
            <p className="text-sm opacity-80">{t("stats.savingsLabel")}</p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Popularity;
