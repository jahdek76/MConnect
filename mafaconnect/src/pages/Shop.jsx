import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export default function Shop() {
  const { products, isLoading } = useProducts();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Real-time stock updates
  useEffect(() => {
    const channel = supabase.channel("products-changes").on("postgres_changes", { event, schema, table, () => {
      queryClient.invalidateQueries({ queryKey);
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  // Filter products by search query
  const filteredProducts = products?.filter(
    (product) =>
      product.active &&
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort products
  const sortedProducts = filteredProducts?.sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.sale_price - b.sale_price;
      case "price_high":
        return b.sale_price - a.sale_price;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="space-y-4 sm
      <div>
        <h1 className="text-2xl sm
        <p className="text-sm sm
          Browse our complete product catalog and add items to your cart
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[200px] h-11">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="price_low">Price (Low to High)</SelectItem>
            <SelectItem value="price_high">Price (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ){sortedProducts.length} product{sortedProducts.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm sm
        </div>
      )}
    </div>
  );
}
