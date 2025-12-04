import React, { useRef, useState, useEffect } from "react";
import { FaLinkedin, FaShareAlt, FaUser, FaSpinner } from "react-icons/fa";

interface TeamMember {
  id: number;
  name: string;
  specialty: string;
  image: string;
  position?: string;
  email?: string;
}

const Team = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // دالة جلب البيانات من API
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching team members from API...');
      
      // استخدام الـ API المفتوح
      const response = await fetch('/api/team-members', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success && Array.isArray(data.data)) {
        const formattedMembers = data.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          specialty: user.specialty || user.team_role || 'عضو فريق',
          image: user.image || user.profile_image || '',
          position: user.position || user.department,
          email: user.email,
        })).filter((member: TeamMember) => 
          member.name && member.name.trim() !== ''
        );
        
        setTeamMembers(formattedMembers);
        console.log('Formatted members:', formattedMembers);
      } else if (Array.isArray(data)) {
        // إذا كانت البيانات تأتي مباشرة كمصفوفة
        const formattedMembers = data.map((user: any) => ({
          id: user.id,
          name: user.name,
          specialty: user.specialty || user.team_role || 'عضو فريق',
          image: user.image || user.profile_image || '',
          position: user.position || user.department,
          email: user.email,
        })).filter((member: TeamMember) => 
          member.name && member.name.trim() !== ''
        );
        
        setTeamMembers(formattedMembers);
      } else {
        throw new Error('Invalid data format from API');
      }

    } catch (err: any) {
      console.error('Error fetching team members:', err);
      setError(err.message || 'حدث خطأ في جلب بيانات الفريق');
      
      // بيانات افتراضية للاختبار
      setTeamMembers([
        {
          id: 1,
          name: "علي فيصل",
          specialty: "مصمم واجهة وتجربة المستخدم",
          image: "",
          position: "التصميم",
          email: "ali@example.com",
        },
        {
          id: 2,
          name: "ملك عامر",
          specialty: "مطور واجهة أمامية",
          image: "",
          position: "التطوير",
          email: "malak@example.com",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleScroll = () => {
    if (containerRef.current && teamMembers.length > 0) {
      const scrollLeft = containerRef.current.scrollLeft;
      const cardWidth = containerRef.current.offsetWidth;
      const index = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(index);
    }
  };

  const scrollToIndex = (index: number) => {
    if (containerRef.current && teamMembers.length > 0) {
      const cardWidth = containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const ref = containerRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      return () => ref.removeEventListener("scroll", handleScroll);
    }
  }, [teamMembers]);

  // دالة المشاركة
  const handleShare = (member: TeamMember) => {
    if (navigator.share) {
      navigator.share({
        title: `تعرف على ${member.name}`,
        text: `${member.name} - ${member.specialty}`,
        url: window.location.href,
      });
    } else {
      // نسخ الرابط إلى الحافظة
      navigator.clipboard.writeText(window.location.href);
      alert("تم نسخ الرابط إلى الحافظة!");
    }
  };

  // دالة إعادة المحاولة
  const handleRetry = () => {
    fetchTeamMembers();
  };

  if (loading) {
    return (
      <section className="w-full py-16 flex flex-col items-center justify-center px-6 lg:px-16 bg-[var(--background-hex)] text-white">
        <div className="flex flex-col items-center space-y-4">
          <FaSpinner className="text-4xl text-[var(--primary-hex)] animate-spin" />
          <p className="text-gray-300">جاري تحميل بيانات الفريق...</p>
          <button
            onClick={handleRetry}
            className="text-sm text-[var(--primary-hex)] hover:underline"
          >
            إعادة المحاولة
          </button>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-16 flex flex-col items-center justify-center px-6 lg:px-16 bg-[var(--background-hex)] text-white">
        <div className="flex flex-col items-center space-y-4 max-w-md text-center">
          <p className="text-red-400">خطأ: {error}</p>
          <p className="text-gray-300 text-sm">
            يتم عرض بيانات تجريبية. تأكد من:
            <br />
            1. تشغيل Laravel server
            <br />
            2. الـ route /api/team-members موجود
            <br />
            3. CORS مفعل
          </p>
          <button
            onClick={handleRetry}
            className="bg-[var(--primary-hex)] text-white px-6 py-2 rounded-lg hover:opacity-90 transition mt-4"
          >
            حاول مرة أخرى
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-[var(--background-hex)] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Header - فوق */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">تعرف على فريقنا</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            أعضاء فريقنا الموهوبون الذين يجعلون كل شيء ممكنًا.
            {teamMembers.length > 0 && ` (${teamMembers.length} أعضاء)`}
          </p>
        </div>

        {/* Carousel Cards - تحت */}
        <div className="w-full">
          {teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">لا يوجد أعضاء فريق متاحين حالياً</p>
              <button
                onClick={handleRetry}
                className="text-[var(--primary-hex)] hover:underline mt-2"
              >
                تحميل البيانات
              </button>
            </div>
          ) : (
            <>
              <div
                ref={containerRef}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 lg:gap-6 pb-4 hide-scrollbar"
              >
                {teamMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="relative justify-center items-center flex-shrink-0 w-full sm:w-72 lg:w-80 bg-[var(--card-hex)] rounded-xl shadow-lg transition-all duration-300 group snap-center hover:shadow-xl hover:scale-[1.03] overflow-hidden"
                  >
                    {/* Image Container */}
                    <div className="relative w-full h-72 bg-gradient-to-br from-[var(--muted-hex)] to-[var(--card-hex)] flex items-center justify-center overflow-hidden">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-400 to-gray-600';
                              fallback.innerHTML = '<svg class="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-400 to-gray-600">
                          <FaUser className="text-white text-7xl mb-2 opacity-60" />
                        </div>
                      )}

                      {/* Specialty Badge */}
                      <div className="absolute top-3 left-3 right-3 bg-[var(--primary-hex)] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 text-center shadow-lg opacity-0 group-hover:opacity-100 line-clamp-2">
                        {member.specialty}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 bg-[var(--card-hex)] border-t border-gray-700">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 text-right">
                          <p className="font-bold text-lg text-white truncate">{member.name}</p>
                          {member.position && (
                            <p className="text-xs text-gray-400 mt-1">{member.position}</p>
                          )}
                          {member.email && (
                            <p className="text-xs text-gray-500 truncate mt-2">{member.email}</p>
                          )}
                        </div>
                        <button 
                          onClick={() => handleShare(member)}
                          className="flex-shrink-0 text-[var(--primary-hex)] hover:text-[var(--accent-foreground-hex)] transition-all duration-300 p-2 rounded-full hover:bg-gray-800 active:scale-90"
                          title="مشاركة"
                        >
                          <FaShareAlt className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hide scrollbar */}
              <style>{`
                .hide-scrollbar {
                  scrollbar-width: none;
                  -ms-overflow-style: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {/* Dots Navigation - تظهر فقط إذا كان هناك أكثر من عضو */}
              {teamMembers.length > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  {teamMembers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToIndex(index)}
                      className={`transition-all duration-300 rounded-full ${
                        currentIndex === index
                          ? "bg-[var(--primary-hex)] w-8 h-2"
                          : "bg-gray-600 w-2 h-2 hover:bg-[var(--primary-hex)]"
                      }`}
                      aria-label={`عرض عضو ${index + 1}`}
                    ></button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Team;