import *"react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingBag, FileText, Gift, Award } from "lucide-react";
import { format } from "date-fns";
import { useKYCStatus } from "@/hooks/useKYC";
import { KYCStatusCard } from "@/components/KYCStatusCard";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { data: kycStatus } = useKYCStatus();

  // Fetch customer profile
  const { data: profile } = useQuery({
    queryKey, user?.id],
    queryFn) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch loyalty account
  const { data: loyaltyAccount } = useQuery({
    queryKey, user?.id],
    queryFn) => {
      const { data, error } = await supabase
        .from("loyalty_accounts")
        .select("*")
        .eq("customer_id", user?.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch recent orders
  const { data: recentOrders, isLoading: loadingOrders } = useQuery({
    queryKey, user?.id],
    queryFn) => {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .eq("customer_id", user?.id)
        .order("created_at", { ascending)
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch pending invoices
  const { data: pendingInvoices } = useQuery({
    queryKey, user?.id],
    queryFn) => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("customer_id", user?.id)
        .in("status", ["draft", "sent"])
        .order("created_at", { ascending);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Calculate stats
  const { data: orderStats } = useQuery({
    queryKey, user?.id],
    queryFn) => {
      const { data, error } = await supabase
        .from("sales")
        .select("total_amount, created_at")
        .eq("customer_id", user?.id);
      if (error) throw error;

      const now = new Date();
      const thisMonth = data?.filter(sale => {
        const saleDate = new Date(sale.created_at);
        return saleDate.getMonth() === now.getMonth() && 
               saleDate.getFullYear() === now.getFullYear();
      }) || [];

      const totalSpent = data?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
      const monthlySpent = thisMonth.reduce((sum, sale) => sum + Number(sale.total_amount), 0);

      return {
        totalOrders: data?.length || 0,
        monthlyOrders: thisMonth.length,
        totalSpent,
        monthlySpent,
      };
    },
    enabled: !!user?.id,
  });

  if (loadingOrders) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm
      <div>
        <h1 className="text-2xl sm, {profile?.full_name || "Customer"}!</h1>
        <p className="text-sm sm
      </div>

      {kycStatus && (
        <KYCStatusCard
          kycStatus={kycStatus.kyc_status}
          customerType={kycStatus.customer_type}
          kycNotes={kycStatus.kyc_notes}
        />
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              {orderStats?.monthlyOrders || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loyaltyAccount?.points_balance || 0}</div>
            <p className="text-xs text-muted-foreground">Available to redeem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Tier</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loyaltyAccount?.tier || "Silver"}</div>
            <p className="text-xs text-muted-foreground">Member status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your latest purchases</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₦{Number(order.total_amount).toLocaleString()}</p>
                    <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
