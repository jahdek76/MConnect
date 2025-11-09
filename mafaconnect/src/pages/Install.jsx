import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Smartphone, Download, ShoppingBag, TrendingUp, Award } from "lucide-react";

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [isInstallable, setIsInstallable] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background p-4">
      <div className="container max-w-2xl mx-auto py-6 sm:py-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-3">
            <Smartphone className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-1">Install MAFA Connect</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Get the app-like experience on your mobile device
          </p>
        </div>

        {/* Install Card */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Download className="h-5 w-5" />
              Quick Installation
            </CardTitle>
            <CardDescription className="text-sm">
              Install MAFA Connect and enjoy a native app experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isInstallable ? (
              <Button
                onClick={handleInstall}
                size="lg"
                className="w-full h-11 sm:h-12 flex items-center justify-center"
              >
                <Download className="mr-2 h-5 w-5" />
                Install Now
              </Button>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold text-sm sm:text-base mb-2">
                    On iPhone (Safari):
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-muted-foreground">
                    <li>Tap the Share button (square with arrow up)</li>
                    <li>Scroll down and tap "Add to Home Screen"</li>
                    <li>Tap "Add" in the top right corner</li>
                  </ol>
                </div>

                <div className="p-3 sm:p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold text-sm sm:text-base mb-2">
                    On Android:
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-muted-foreground">
                    <li>Tap the three dots menu (⋮) in the browser</li>
                    <li>Tap "Add to Home screen" or "Install app"</li>
                    <li>Tap "Add" or "Install"</li>
                  </ol>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card>
            <CardContent className="flex items-start gap-3 pt-4 sm:pt-6 px-4 pb-4">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base mb-1">
                  Shop Anywhere
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Browse products and place orders on the go
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-3 pt-4 sm:pt-6 px-4 pb-4">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base mb-1">
                  Track Orders
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Real-time updates on your order status
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-3 pt-4 sm:pt-6 px-4 pb-4">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base mb-1">
                  Earn Rewards
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Get loyalty points with every purchase
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="h-10 sm:h-11"
          >
            Skip for Now
          </Button>
        </div>
      </div>
    </div>
  );
}
