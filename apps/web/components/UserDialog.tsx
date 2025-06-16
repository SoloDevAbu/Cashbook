'use client';

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropDownMenu";

export function UserDialog() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.push('/login');
      }
    });
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium hover:bg-primary/90 transition-colors"
        >
          {user.firstName[0]}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-medium">
            {user.firstName[0]}
          </div>
          <div>
            <p className="font-medium text-sm">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex justify-center bg-red-500 focus:bg-red-400 text-white font-semibold cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 