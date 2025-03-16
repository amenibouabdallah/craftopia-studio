
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDesign } from "@/contexts/DesignContext";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useUser } from "@/contexts/UserContext";
import { 
  Search,
  PlusCircle,
  MoreVertical,
  Clock,
  ShoppingBag,
  HeartIcon,
  Edit,
  Trash2,
  Share2,
  Download,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

const MyDesigns = () => {
  const navigate = useNavigate();
  const { recentDesigns, setCurrentDesign } = useDesign();
  const { userListings, userPurchases } = useMarketplace();
  const { isAuthenticated } = useUser();
  
  const [searchQuery, setSearchQuery] = useState("");
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    toast.error("Please log in to view your designs");
    return null;
  }
  
  // Filter designs based on search query
  const filteredDesigns = recentDesigns.filter(design => 
    design.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredListings = userListings.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPurchases = userPurchases.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleEdit = (design) => {
    setCurrentDesign(design);
    navigate(`/editor/${design.id}`);
  };
  
  const handleDelete = (design) => {
    toast.success(`${design.name} deleted`);
  };
  
  const handleDuplicate = (design) => {
    toast.success(`${design.name} duplicated`);
  };
  
  const handleSell = (design) => {
    navigate(`/sell-design/${design.id}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Designs</h1>
            <p className="text-gray-600">Manage your designs and marketplace listings</p>
          </div>
          
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search designs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button asChild>
              <Link to="/editor">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Design
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="designs" className="space-y-6">
          <TabsList className="mb-2">
            <TabsTrigger value="designs" className="flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              My Designs
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center">
              <ShoppingBag className="h-4 w-4 mr-2" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex items-center">
              <HeartIcon className="h-4 w-4 mr-2" />
              Purchased
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="designs">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredDesigns.length > 0 ? (
                filteredDesigns.map((design) => (
                  <Card key={design.id} className="group relative">
                    <div 
                      className="aspect-video bg-gray-100 relative overflow-hidden cursor-pointer"
                      onClick={() => handleEdit(design)}
                    >
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ 
                          backgroundColor: design.backgroundColor,
                          backgroundImage: design.thumbnail ? `url(${design.thumbnail})` : 'none',
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <Button 
                          variant="secondary" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(design);
                          }}
                        >
                          Edit Design
                        </Button>
                      </div>
                    </div>
                    
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg truncate">{design.name}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(design)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(design)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSell(design)}>
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              Sell on Marketplace
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-500"
                              onClick={() => handleDelete(design)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    
                    <CardFooter className="p-4 pt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Edited {new Date(design.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-xl font-semibold mb-2">No designs yet</h3>
                  <p className="text-gray-500 mb-6">
                    Start creating your first design now!
                  </p>
                  <Button asChild>
                    <Link to="/editor">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create New Design
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="listings">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredListings.length > 0 ? (
                filteredListings.map((item) => (
                  <Card key={item.id} className="group relative">
                    <Link to={`/marketplace/${item.id}`} className="block">
                      <div className="aspect-video bg-gray-100 relative overflow-hidden">
                        <img
                          src={item.thumbnail || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-lg truncate">{item.title}</CardTitle>
                        <CardDescription>${item.price.toFixed(2)}</CardDescription>
                      </CardHeader>
                      
                      <CardFooter className="p-4 pt-2 flex justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          <span>{item.purchasesCount} sales</span>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Listing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Listing
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    </Link>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🛍️</div>
                  <h3 className="text-xl font-semibold mb-2">No marketplace listings</h3>
                  <p className="text-gray-500 mb-6">
                    Start selling your designs in the marketplace!
                  </p>
                  <Button asChild>
                    <Link to="/my-designs">
                      Sell a Design
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="purchases">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((item) => (
                  <Card key={item.id} className="group relative">
                    <Link to={`/marketplace/${item.id}`} className="block">
                      <div className="aspect-video bg-gray-100 relative overflow-hidden">
                        <img
                          src={item.thumbnail || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-lg truncate">{item.title}</CardTitle>
                        <CardDescription>by {item.sellerName}</CardDescription>
                      </CardHeader>
                      
                      <CardFooter className="p-4 pt-2 flex justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Purchased {new Date().toLocaleDateString()}</span>
                        </div>
                        
                        <Button size="sm" asChild>
                          <Link to={`/editor/${item.designId}`}>
                            Edit
                          </Link>
                        </Button>
                      </CardFooter>
                    </Link>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold mb-2">No purchased designs</h3>
                  <p className="text-gray-500 mb-6">
                    Browse the marketplace to find amazing designs!
                  </p>
                  <Button asChild>
                    <Link to="/marketplace">
                      Browse Marketplace
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyDesigns;
