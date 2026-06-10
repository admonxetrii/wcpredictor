"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import React from "react";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loadingText?: string;
}

export function SubmitButton({ children, loadingText = "Submitting...", className, disabled, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      disabled={pending || disabled}
      className={`flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none transition-all ${className || ""}`}
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
