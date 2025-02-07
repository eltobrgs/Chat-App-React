interface FloatingButtonProps {
  onClick?: () => void;
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="fixed md:absolute bottom-5 right-5 bg-emerald-600 p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 z-20 group"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  );
} 