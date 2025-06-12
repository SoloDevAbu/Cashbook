import { ChangeEvent } from "react";

interface TextareaProps {
  id?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
}

export function Textarea({ id, value, onChange, className = "", rows = 3 }: TextareaProps) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-transparent sm:text-sm sm:leading-6 ${className}`}
    />
  );
} 