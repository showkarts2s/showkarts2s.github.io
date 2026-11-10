import { useState } from "react";
import type { ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type PasswordInputProps = ComponentProps<"input"> & {
  wrapperClassName?: string;
  visibilityLabel?: string;
};

function PasswordInput({
  className,
  wrapperClassName,
  visibilityLabel = "password",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const action = visible ? "Hide" : "Show";

  return (
    <div className={cn("relative", wrapperClassName)}>
      <Input type={visible ? "text" : "password"} className={cn("pr-10", className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="absolute right-1 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md border border-white/15 bg-[#171b2d] text-cyan-300 shadow-sm transition-colors hover:border-cyan-300/50 hover:bg-[#20263d] hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        aria-label={`${action} ${visibilityLabel}`}
        aria-pressed={visible}
        title={`${action} ${visibilityLabel}`}
      >
        {visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
      </button>
    </div>
  );
}

export { PasswordInput };
