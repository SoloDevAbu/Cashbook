import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tag } from "@cashbook/utils";
import { Button } from "@/components/ui/Button";
import { Pencil } from "lucide-react";

interface TagCardProps {
  tag: Tag;
  onEdit: () => void;
}

export function TagCard({ tag, onEdit }: TagCardProps) {
  return (
    <Card className="border border-gray-400">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{tag.name}</CardTitle>
        <Button variant="secondary" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{tag.details}</p>
        </div>
      </CardContent>
    </Card>
  );
}
