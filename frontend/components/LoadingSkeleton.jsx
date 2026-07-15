export default function LoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-5 mt-8 max-w-6xl mx-auto px-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass rounded-2xl p-6 animate-pulse space-y-3">
          <div className="h-3 w-16 bg-white/10 rounded" />
          <div className="h-6 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
          <div className="h-16 bg-white/5 rounded" />
          <div className="h-10 bg-white/5 rounded" />
        </div>
      ))}
    </div>
  );
}