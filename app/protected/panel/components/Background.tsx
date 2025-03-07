// components/Background.tsx
const Background: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#E7F3FF] to-[#DCEEFF]">
        {/* Círculos SVG decorativos */}
        <svg
          className="absolute top-10 left-10 w-40 h-40 opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="50" fill="#B3D4FC" />
        </svg>
        <svg
          className="absolute bottom-20 right-20 w-60 h-60 opacity-30"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="50" fill="#A0C9F8" />
        </svg>
        <svg
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="50" fill="#94BFF4" />
        </svg>
  
        {/* Contenido */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  };
  
  export default Background;
  