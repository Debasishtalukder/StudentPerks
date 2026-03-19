import React from "react";

interface LogoImageProps {
  domain: string;
  name?: string;
  className?: string;
}

const getFallbackColor = (name: string) => {
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const LogoImage: React.FC<LogoImageProps> = ({ domain, name, className }) => {
  const [logoSource, setLogoSource] = React.useState<string>(`https://logo.clearbit.com/${domain}?size=128`);
  const [fallbackIndex, setFallbackIndex] = React.useState(0);
  const [logoError, setLogoError] = React.useState(false);

  const handleLogoError = () => {
    const fallbacks = [
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      `https://ui-avatars.com/api/?name=${name || domain}&background=random&color=fff&size=128`
    ];
    
    if (fallbackIndex < fallbacks.length) {
      setLogoSource(fallbacks[fallbackIndex]);
      setFallbackIndex(prev => prev + 1);
    } else {
      setLogoError(true);
    }
  };

  if (logoError) {
    return (
      <div 
        className={`flex items-center justify-center text-white font-bold rounded-lg ${className}`}
        style={{ backgroundColor: getFallbackColor(name || domain) }}
      >
        {(name || domain).charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img 
      src={logoSource} 
      alt={name || domain} 
      className={`object-contain ${className}`} 
      referrerPolicy="no-referrer"
      onError={handleLogoError}
    />
  );
};

export default LogoImage;
