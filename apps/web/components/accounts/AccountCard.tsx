// import { TransactionAccountType } from '@cashbook/db';
import { Account, formatDate } from '@cashbook/utils';

interface AccountCardProps {
  account: Account;
  onEdit: () => void;
  onStatusChange: (status: Account['status']) => void;
}

export function AccountCard({
  account,
  onEdit,
}: AccountCardProps) {
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    FROZEN: 'bg-blue-100 text-blue-800',
    CLOSED: 'bg-red-100 text-red-800',
  };

  const typeLabel = account.type.split('_').map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');

  return (
    <div className="border border-gray-400 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
          <p className="text-sm text-gray-600">{typeLabel}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[account.status]}`}
          >
            {account.status.charAt(0) + account.status.slice(1).toLowerCase()}
          </span>
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
