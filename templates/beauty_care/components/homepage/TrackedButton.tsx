"use client";

import { cn } from "@/lib/utils";
import formbricks from "@formbricks/js";

interface TrackedButtonProps {
  children: React.ReactNode;
  className: string;
}

const TrackedButton = ({ children, className }: TrackedButtonProps) => {

  const handleButtonClick = async () => {
    try {
      await formbricks.track("sterlingsalon-button-test");
    } catch (error) {
      console.error("Error tracking button click:", error);
    }
  };

  return (
    <button
      onClick={handleButtonClick}
      id="sterlingsalon-button"
      className={cn(className, "sterling-salon-button")}
    >
      {children}
    </button>
  );
};

export default TrackedButton;
