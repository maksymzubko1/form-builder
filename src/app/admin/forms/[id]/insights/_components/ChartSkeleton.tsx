export function ChartSkeleton() {
  return (
    <div className="w-full h-[250px] flex items-center justify-center bg-card rounded-xl animate-pulse">
      <div className="w-16 h-16 rounded-full border-4 border-primary border-b-transparent animate-spin" />
    </div>
  );
}
