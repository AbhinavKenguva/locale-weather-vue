const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="glass-card rounded-2xl p-8 flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-white/80 text-lg">Loading weather data...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;