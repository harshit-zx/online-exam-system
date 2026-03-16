import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Quote, Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "University Professor",
      text: "ExamPro completely transformed our digital examinations. The anti-cheat features are incredible.",
    },
    {
      name: "Rahul Mehta",
      role: "Bootcamp Student",
      text: "The UI is super clean and distraction-free. Getting my certificate immediately as a PDF felt highly rewarding.",
    },
    {
      name: "Michael Lee",
      role: "HR Recruiter",
      text: "We use ExamPro to evaluate developer candidates. The instant analytics save our team dozens of hours.",
    },
    {
      name: "Emily Chen",
      role: "IT Instructor",
      text: "The reliability of the timers and the auto-submission features give me total peace of mind during high-stakes finals.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-black text-slate-900">
            Loved by Admins & Students
          </h3>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="pb-14"
        >
          {testimonials.map((t, idx) => (
            <SwiperSlide key={idx} className="h-auto">
              <div className="bg-white h-full p-8 rounded-4xl shadow-sm border border-slate-100 relative hover:-translate-y-2 transition-transform duration-300 cursor-grab active:cursor-grabbing">
                <Quote
                  className="absolute top-6 right-8 text-indigo-50"
                  size={60}
                />
                <div className="flex text-amber-400 mb-6 relative z-10">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                </div>
                <p className="text-slate-600 font-medium mb-8 relative z-10 text-lg leading-relaxed">
                  "{t.text}"
                </p>
                <div className="mt-auto relative z-10">
                  <h5 className="font-black text-slate-900">{t.name}</h5>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                    {t.role}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialsSection;