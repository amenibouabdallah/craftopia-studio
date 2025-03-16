
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useMarketplace, MarketplaceCategory } from "@/contexts/MarketplaceContext";
import { Search, Filter, Star, TrendingUp, Clock, Heart, ShoppingCart } from "lucide-react";

const Marketplace = () => {
  const { 
    marketplaceItems, 
    featuredItems, 
    categories, 
    getMarketplaceItemsByCategory, 
    searchMarketplace,
    purchaseDesign
  } = useMarketplace();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>("all");
  const [sortBy, setSortBy] = useState<"popular" | "latest" | "price-low" | "price-high">("popular");
  
  // Filter and sort items
  let displayedItems = selectedCategory === "all" 
    ? marketplaceItems 
    : getMarketplaceItemsByCategory(selectedCategory);
  
  if (searchQuery.trim()) {
    displayedItems = searchMarketplace(searchQuery);
  }
  
  // Sort items
  switch (sortBy) {
    case "popular":
      displayedItems = [...displayedItems].sort((a, b) => b.purchasesCount - a.purchasesCount);
      break;
    case "latest":
      displayedItems = [...displayedItems].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case "price-low":
      displayedItems = [...displayedItems].sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      displayedItems = [...displayedItems].sort((a, b) => b.price - a.price);
      break;
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled via state
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-gray-600">Discover and purchase premium designs</p>
          </div>
          
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <div className="relative flex-1 mr-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search designs..."
                className="pl-10 w-full md:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>
        
        {/* Featured Items */}
        {!searchQuery && selectedCategory === "all" && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Featured Designs
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {featuredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute top-2 right-2 bg-brand-purple">Featured</Badge>
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <p className="text-sm text-gray-500">by {item.sellerName}</p>
                  </CardHeader>
                  <CardFooter className="p-4 pt-2 flex justify-between items-center">
                    <span className="font-bold">${item.price.toFixed(2)}</span>
                    <Button
                      size="sm"
                      onClick={() => purchaseDesign(item.id)}
                    >
                      Buy Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Categories and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Tabs
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value as MarketplaceCategory)}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-7">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          <div className="flex items-center ml-auto gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              className="bg-white border border-gray-200 rounded-md px-3 py-1 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="popular">Most Popular</option>
              <option value="latest">Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedItems.length > 0 ? (
            displayedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden group">
                <Link to={`/marketplace/${item.id}`} className="block">
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {item.featured && (
                      <Badge className="absolute top-2 right-2 bg-brand-purple">Featured</Badge>
                    )}
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <p className="text-sm text-gray-500">by {item.sellerName}</p>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 pb-0">
                    <div className="flex items-center text-sm text-gray-500 gap-4">
                      <span className="flex items-center">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {item.purchasesCount}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Link>
                <CardFooter className="p-4 pt-2 flex justify-between items-center">
                  <span className="font-bold">${item.price.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => purchaseDesign(item.id)}
                    >
                      Buy Now
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No designs found</h3>
              <p className="text-gray-500 mb-6">
                We couldn't find any designs matching your criteria.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}>
                View All Designs
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
