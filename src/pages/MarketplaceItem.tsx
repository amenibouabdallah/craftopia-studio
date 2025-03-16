
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useUser } from "@/contexts/UserContext";
import { ShoppingCart, Heart, Share2, ArrowLeft, Star, Clock, Eye, Check } from "lucide-react";
import { toast } from "sonner";

const MarketplaceItem = () => {
  const { id } = useParams();
  const { marketplaceItems, purchaseDesign } = useMarketplace();
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  const item = marketplaceItems.find(item => item.id === id);
  
  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Item Not Found</h1>
          <p className="text-gray-500 mb-8">The item you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const handlePurchase = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    purchaseDesign(item.id);
    toast.success("Design purchased successfully!");
    setIsLoading(false);
  };
  
  const relatedItems = marketplaceItems
    .filter(relatedItem => 
      relatedItem.id !== item.id && 
      relatedItem.category === item.category
    )
    .slice(0, 4);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container py-8">
        <Link 
          to="/marketplace" 
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-brand-purple mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left: Preview */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="aspect-[4/3] bg-gray-100 relative">
              <img
                src={item.thumbnail || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-contain"
              />
              {item.featured && (
                <Badge className="absolute top-4 right-4 bg-brand-purple px-3 py-1">
                  <Star className="h-3 w-3 mr-1 fill-current" /> Featured
                </Badge>
              )}
            </div>
            
            <div className="p-4 flex justify-between">
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <span className="flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {item.purchasesCount} sales
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button size="icon" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right: Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
            <Link 
              to={`/profile/${item.sellerId}`}
              className="text-brand-purple hover:underline mb-4 block"
            >
              by {item.sellerName}
            </Link>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-3xl font-bold">${item.price.toFixed(2)}</div>
              <Button 
                size="lg" 
                className="px-8"
                onClick={handlePurchase}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">Processing...</span>
                ) : (
                  <span className="flex items-center">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Buy Now
                  </span>
                )}
              </Button>
            </div>
            
            <Tabs defaultValue="description" className="mb-6">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="license">License</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="text-gray-700">
                <p className="mb-4">{item.description}</p>
                <p>This is a premium design template that can be customized to fit your brand.</p>
              </TabsContent>
              
              <TabsContent value="details">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                    <span>High-resolution design (4K compatible)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                    <span>Fully editable in DesignHub</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                    <span>All layers and elements included</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                    <span>Commercial use allowed</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                    <span>Free updates and support</span>
                  </li>
                </ul>
              </TabsContent>
              
              <TabsContent value="license">
                <div className="text-gray-700">
                  <h3 className="font-bold mb-2">Standard License</h3>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Use in a single end product</li>
                    <li>Use by you or one client</li>
                    <li>Commercial use allowed</li>
                    <li>Cannot be redistributed or resold</li>
                  </ul>
                  
                  <p className="text-sm text-gray-500">
                    For extended licenses or custom requirements, please contact the seller.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Related Designs</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {relatedItems.map((relatedItem) => (
                <Link 
                  key={relatedItem.id} 
                  to={`/marketplace/${relatedItem.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md group"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img
                      src={relatedItem.thumbnail || "/placeholder.svg"}
                      alt={relatedItem.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 group-hover:text-brand-purple">
                      {relatedItem.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">by {relatedItem.sellerName}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">${relatedItem.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {relatedItem.purchasesCount}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceItem;
