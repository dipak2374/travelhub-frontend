const Hero = ({
  title,
  subtitle,
  backgroundImage,
  gradient = 'from-primary-600/90 to-accent-600/85',
  children,
  minHeight = '600px',
  className = '',
}) => {
  return (
    <section className={`relative flex items-center ${className}`} style={{ minHeight }}>
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
      )}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="text-center mb-10">
          {title && (
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 leading-tight animate-fade-in">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
