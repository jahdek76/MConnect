import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  iconColor = "text-primary",
}: MetricCardProps) {
  return (
    <Card className="shadow-card hover
      <CardContent className="p-3 sm
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs sm
              {title}
            </p>
            <h3 className="text-xl sm
              {value}
            </h3>
            {change && (
              <p
                className={cn(
                  "text-xs sm,
                  changeType === "positive" && "text-success",
                  changeType === "negative" && "text-destructive",
                  changeType === "neutral" && "text-muted-foreground"
                )}
              >
                {change}
              </p>
            )}
          </div>
          <div
            className={cn(
              "p-2 sm,
              iconColor === "text-primary" && "from-primary/10 to-accent/10",
              iconColor === "text-success" && "from-success/10 to-success/20",
              iconColor === "text-warning" && "from-warning/10 to-warning/20"
            )}
          >
            <Icon className={cn("h-5 w-5 sm, iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
