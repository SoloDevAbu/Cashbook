// import { TransactionAccountType } from '@cashbook/db';
import { Account, formatDate } from '@cashbook/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/DropDownMenu';

interface AccountCardProps {
  account: Account;
  onEdit: () => void;
  onStatusChange: (status: Account['status']) => void;
}

export function AccountCard({
  account,
  onEdit,
  onStatusChange,
}: AccountCardProps) {
  const statusColors: Record<Account['status'], string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    FROZEN: 'bg-blue-100 text-blue-800',
    CLOSED: 'bg-red-100 text-red-800',
  };

  const typeLabel = account.type.split('_').map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');

  const statusOptions = [
    { value: 'ACTIVE' as const, label: 'Active' },
    { value: 'FROZEN' as const, label: 'Frozen' },
    { value: 'CLOSED' as const, label: 'Closed' },
  ];

  return (
    <div className="border border-gray-400 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
          <p className="text-sm text-gray-600">{typeLabel}</p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[account.status]}`}
              >
                {account.status.charAt(0) + account.status.slice(1).toLowerCase()}
              </span>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-400 hover:text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                  </svg>
                </button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent align="end" className=" shadow shadow-gray-500">
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">Change Status</div>
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onStatusChange(option.value)}
                  className={`flex items-center gap-2 px-2 py-2 text-sm ${
                    option.value === account.status 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={`px-2 py-1 rounded-full ${statusColors[option.value]}`}>
                    {option.label}
                  </span>
                  {option.value === account.status && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 ml-auto"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button onClick={onEdit} className="text-gray-400 hover:text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
          </button>
        </div>
      </div>

      {account.accountNumber && (
        <div className="text-sm">
          <span className="font-medium">Account Number: </span>
          {account.accountNumber}
        </div>
      )}

      {account.details && (
        <div className="text-sm">
          <span className="font-medium">Details: </span>
          {account.details}
        </div>
      )}

      {account.upiLinks && account.upiLinks.length > 0 && (
        <div className="text-sm">
          <span className="font-medium">Links: </span>
          <div className="mt-1 space-y-1">
            {account.upiLinks.map((link, index) => (
              <div key={index} className="text-gray-600">
                {link}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="text-sm text-gray-500">Added on {formatDate(account.createdAt)}</div>
    </div>
  );
}
