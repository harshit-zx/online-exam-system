const CategoriesSection = () => {
  const categories = [
    "Web Development",
    "Data Structures",
    "System Design",
    "Cyber Security",
    "Machine Learning",
    "DevOps",
    "Cloud Computing",
    "UI/UX",
  ];

  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8">
        Popular Categories
      </h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat, i) => (
          <span
            key={i}
            className="px-5 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;