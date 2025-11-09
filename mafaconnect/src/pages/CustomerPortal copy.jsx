import *"react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Search, TrendingUp, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import mafaLogo from "@/assets/mafa-logo.png";

export default function CustomerPortal() {
  const [phone, setPhone] = React.useState("");
  const [searchedPhone, setSearchedPhone] = React.useState("");

  const { data: customer } = useQuery({
    queryKey, searchedPhone],
    queryFn) => {
      if (!searchedPhone) return null;
      const { data } = await supabase
        .from("customers")
        .select("*")
        .eq("phone", searchedPhone)
        .single();
      return data;
    },
    enabled: !!searchedPhone,
  });

  const { data: loyaltyAccount } = useQuery({
    queryKey, customer?.id],
    queryFn) => {
      if (!customer?.id) return null;
      const { data } = await supabase
        .from("loyalty_accounts")
        .select("*")
        .eq("customer_id", customer.id)
        .single();
      return data;
    },
    enabled: !!customer?.id,
  });

  const { data: transactions } = useQuery({
    queryKey, loyaltyAccount?.id],
    queryFn) => {
      if (!loyaltyAccount?.id) return [];
      const { data } = await supabase
        .from("loyalty_transactions")
        .select("*")
        .eq("loyalty_account_id", loyaltyAccount.id)
        .order("created_at", { ascending)
        .limit(10);
      return data || [];
    },
    enabled: !!loyaltyAccount?.id,
  });

  const { data: rewards } = useQuery({
    queryKey,
    queryFn) => {
      const { data } = await supabase
        .from("rewards")
        .select("*")
        .eq("active", true);
      return data || [];
    },
  });

  const handleSearch = () => {
    setSearchedPhone(phone);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src={mafaLogo} alt="MAFA Logo" className="h-8 w-8" />
            <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MAFA Connect
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="gap-2">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 md
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Customer Loyalty Portal
            </h1>
            <p className="text-muted-foreground">Check your points and rewards</p>
          </div>

          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find Your Account
              </CardTitle>
              <CardDescription>Enter your phone number to view your loyalty details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>Search</Button>
              </div>
            </CardContent>
          </Card>

          {customer && (
            <>
              <Card className="mb-8 shadow-lg border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-6 w-6 text-primary" />
                    {customer.name}
                  </CardTitle>
                  <CardDescription>{customer.email || customer.phone}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">Points Balance</p>
                          <p className="text-3xl font-bold">{loyaltyAccount?.points_balance || 0}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Award className="h-8 w-8 mx-auto mb-2 text-accent" />
                          <p className="text-sm text-muted-foreground">Current Tier</p>
                          <Badge className="mt-2" variant="secondary">
                            {loyaltyAccount?.tier || "Silver"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Available Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md
                    {rewards?.map((reward) => (
                      <Card key={reward.id} className="hover
                        <CardContent className="pt-6">
                          <h3 className="font-semibold mb-2">{reward.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{reward.points_cost} points</Badge>
                            <Badge variant={reward.reward_type === 'discount' ? 'default' : 'secondary'}>
                              {reward.reward_type}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {transactions?.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{transaction.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={transaction.points > 0 ? "default" : "secondary"}>
                          {transaction.points > 0 ? "+" : ""}{transaction.points} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
