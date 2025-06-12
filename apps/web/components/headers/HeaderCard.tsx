import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import type { Header, HeaderStatus } from "@cashbook/utils";
// import { Pencil } from "lucide-react";

interface HeaderCardProps {
  header: Header;
  // onEdit: () => void;
  onStatusChange: (status: HeaderStatus) => void;
}

export function HeaderCard({ header, onStatusChange }: HeaderCardProps) {
  return (
    <Card className="border border-gray-400">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{header.name}</CardTitle>
        {/* <Button variant="secondary" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button> */}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{header.details}</p>
          <Switch
            checked={header.status === "ACTIVE"}
            onCheckedChange={(checked: boolean) =>
              onStatusChange(checked ? "ACTIVE" : "NOT_ACTIVE")
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
