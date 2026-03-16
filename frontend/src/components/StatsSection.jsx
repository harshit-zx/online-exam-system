// ✅ FIXED: Removed the curly braces around CountUp!
import CountUp from "react-countup"; 
import { Users, ShieldCheck, BarChart3, Award } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      label: "Active Students",
      value: 10000,
      suffix: "+",
    },
    {
      icon: ShieldCheck,
      label: "Exams Conducted",
      value: 2000,
      suffix: "+",
    },
    {
      icon: BarChart3,
      label: "Average Pass Rate",
      value: 98,
      suffix: "%",
    },
    {
      icon: Award,
      label: "Partner Institutions",
      value: 150,
      suffix: "+",
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col items-center group">
            <s.icon
              className="text-indigo-500 mb-3 group-hover:scale-110 transition-transform duration-300"
              size={28}
            />
            <h3 className="text-3xl md:text-4xl font-black text-slate-900">
              <CountUp end={s.value} duration={2.5} />
              {s.suffix}
            </h3>
            <p className="text-slate-500 font-medium text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;