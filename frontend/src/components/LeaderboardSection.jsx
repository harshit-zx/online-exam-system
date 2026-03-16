import { Trophy } from "lucide-react";

const LeaderboardSection = ({ leaderboard, loading }) => {
  return (
    <div className="bg-slate-900 rounded-4xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-3 bg-indigo-500/20 rounded-xl">
          <Trophy className="text-amber-400" size={24} />
        </div>
        <h2 className="text-2xl font-black text-white">
          Global Top Performers
        </h2>
      </div>

      <div className="space-y-4 relative z-10">
        {loading ? (
          <div className="text-indigo-300 text-center py-10 animate-pulse font-bold">
            Fetching leaderboard...
          </div>
        ) : leaderboard.length > 0 ? (
          leaderboard.map((u, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                    i === 0
                      ? "bg-amber-400 text-amber-900"
                      : i === 1
                        ? "bg-slate-300 text-slate-800"
                        : i === 2
                          ? "bg-amber-700/80 text-white"
                          : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-white leading-tight">{u.name}</p>
                  <p className="text-xs font-medium text-slate-400 line-clamp-1">
                    {u.exam}
                  </p>
                </div>
              </div>
              <span className="font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-lg">
                {u.percent}%
              </span>
            </div>
          ))
        ) : (
          <div className="text-slate-400 text-center py-10 font-medium">
            No results recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardSection;