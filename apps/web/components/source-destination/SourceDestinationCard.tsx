import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SourceDestination } from "@cashbook/utils";
import { Button } from "@/components/ui/Button";
import { Pencil } from "lucide-react";

interface SourceDestinationCardProps {
  entity: SourceDestination;
  onEdit: () => void;
}

export function SourceDestinationCard({ entity, onEdit }: SourceDestinationCardProps) {
  return (
    <Card className="border border-gray-400">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{entity.name}</CardTitle>
        <Button variant="secondary" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
            {entity.gst && (
                <div className="text-sm">
                    <span className="font-medium">GST Number: </span>
                    {entity.gst}
                </div>
            )}
            {entity.pan && (
                <div className="text-sm">
                    <span className="font-medium">PAN: </span>
                    {entity.pan}
                </div>
            )}
            {entity.nationalId && (
                <div className="text-sm">
                    <span className="font-medium">AADHAR Number: </span>
                    {entity.nationalId}
                </div>
            )}
            {entity.address && (
                <div className="text-sm">
                    <span className="font-medium">Address: </span>
                    {entity.address}
                </div>
            )}
            {entity.state && (
                <div className="text-sm">
                    <span className="font-medium">State: </span>
                    {entity.state}
                </div>
            )}
            {entity.pin && (
                <div className="text-sm">
                    <span className="font-medium">PIN: </span>
                    {entity.pin}
                </div>
            )}
            {entity.country && (
                <div className="text-sm">
                    <span className="font-medium">Country: </span>
                    {entity.country}
                </div>
            )}
            {entity.details && (
                <div className="text-sm">
                    <span className="font-medium">Details: </span>
                    {entity.details}
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
