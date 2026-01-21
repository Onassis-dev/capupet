import { useState } from "react";
import { Input } from "@/components/ui/input";
import { EyeOff, Eye } from "lucide-react";

interface props {
  field: any;
  placeholder?: string;
}

const PasswordInput = ({ field, placeholder }: props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        {...field}
        className="pr-8"
        placeholder={placeholder}
      />
      <i
        className="select-none  cursor-pointer absolute top-1/2 -translate-y-1/2 right-2"
        onClick={handleClick}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 opacity-70" />
        ) : (
          <Eye className="h-4 w-4 opacity-70" />
        )}
      </i>
    </div>
  );
};

export default PasswordInput;
