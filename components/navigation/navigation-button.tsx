import { cn } from "@/lib/utils";

interface NavButtonProps {
  isSelected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
}

export const NavButton: React.FC<NavButtonProps> = ({
  isSelected,
  onClick,
  icon,
  label,
  ariaLabel,
}) => {
  const buttonClasses =
    "hidden md:flex items-center text-left transition text-sm rounded-lg hover:text-[#308d46] ml-5";

  return (
    <div className="h-12 flex flex-row">
      <div
        className={cn(
          "hidden md:flex items-center border-r-4 rounded-e-sm border-transparent",
          isSelected && "border-[#308d46]"
        )}
      />
      <button
        className={cn(buttonClasses, isSelected && "text-[#308d46]")}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </button>
    </div>
  );
};
