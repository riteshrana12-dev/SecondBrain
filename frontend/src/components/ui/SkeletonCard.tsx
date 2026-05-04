const SkeletonCard = () => {
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 w-full border border-gray-200 flex flex-col gap-3 animate-pulse">
      {/* header */}
      <div className="flex items-start justify-between gap-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-5 bg-gray-200 rounded-full w-16 shrink-0" />
      </div>

      {/* content placeholder */}
      <div className="h-32 bg-gray-200 rounded-lg w-full" />

      {/* notes */}
      <div className="flex flex-col gap-1.5">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
      </div>

      {/* tags */}
      <div className="flex gap-1.5">
        <div className="h-5 bg-gray-200 rounded-full w-12" />
        <div className="h-5 bg-gray-200 rounded-full w-16" />
        <div className="h-5 bg-gray-200 rounded-full w-10" />
      </div>

      {/* buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <div className="flex-1 h-7 bg-gray-200 rounded-lg" />
        <div className="flex-1 h-7 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default SkeletonCard;
