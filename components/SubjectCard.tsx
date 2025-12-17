import Link from "next/link";

const SubjectCard = ({ emoji, name, details, color, link = "#" }: any) => {
  // Dynamic Tailwind class for the top border color
  const borderColor = `border-${color}-500`;

  return (
    // Changed background to bg-gray-800
    <Link
      href={link}
      className={`flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-800 rounded-2xl shadow-md border-t-4 ${borderColor} 
                       hover:shadow-lg hover:-translate-y-1 transition duration-300 ease-in-out`}
    >
      <div className="text-5xl sm:text-6xl mb-3">{emoji}</div>
      {/* Changed text color to light gray/white */}
      <h3 className="text-lg font-semibold text-gray-100 text-center">
        {name}
      </h3>
      <p className="text-xs text-gray-400 text-center mt-1">{details}</p>
    </Link>
  );
};

export default SubjectCard;
