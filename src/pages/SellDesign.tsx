
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDesign } from "@/contexts/DesignContext";
import { useMarketplace, MarketplaceCategory } from "@/contexts/MarketplaceContext";
import { useUser } from "@/contexts/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

// Form schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(500),
  price: z.coerce.number().min(0.99, "Price must be at least $0.99").max(999.99),
  category: z.string(),
  tags: z.string(),
  featured: z.boolean().default(false),
});

const SellDesign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentDesign, recentDesigns } = useDesign();
  const { publishDesign, categories } = useMarketplace();
  const { isDesigner, isAuthenticated } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Find the design to sell
  const design = id ? 
    recentDesigns.find(design => design.id === id) : 
    currentDesign;
  
  // Redirect if no design or not authenticated or not a designer
  if (!design || !isAuthenticated) {
    navigate("/");
    toast.error("You need to be logged in to sell designs");
    return null;
  }
  
  if (!isDesigner) {
    navigate("/");
    toast.error("Only designers can sell designs");
    return null;
  }
  
  // Setup form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: design.name,
      description: "",
      price: 9.99,
      category: "templates",
      tags: "",
      featured: false,
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Convert comma-separated tags to array
    const tags = values.tags.split(",").map(tag => tag.trim()).filter(Boolean);
    
    publishDesign(design, {
      title: values.title,
      description: values.description,
      price: values.price,
      category: values.category as MarketplaceCategory,
      tags,
      thumbnail: design.thumbnail || "",
      featured: values.featured,
    });
    
    toast.success("Design published to marketplace!");
    setIsSubmitting(false);
    navigate("/marketplace");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Sell Your Design</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Listing Details</CardTitle>
                <CardDescription>
                  Provide information about your design to potential buyers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter a catchy title..." {...field} />
                          </FormControl>
                          <FormDescription>
                            This will be the main title of your listing.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your design in detail..." 
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Explain what makes your design special and how it can be used.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormDescription>
                              Set a competitive price.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.filter(category => category !== "all").map((category) => (
                                  <SelectItem 
                                    key={category} 
                                    value={category}
                                    className="capitalize"
                                  >
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose the best category for your design.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="social media, business, modern, etc..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Enter tags separated by commas to help buyers find your design.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Publishing..." : "Publish to Marketplace"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  How your design will appear in the marketplace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-4">
                  <img
                    src={design.thumbnail || "/placeholder.svg"}
                    alt={design.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold">
                    {form.watch("title") || "Design Title"}
                  </h3>
                  <p className="text-sm text-gray-500">Your Designer Name</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-bold">
                    ${form.watch("price") ? Number(form.watch("price")).toFixed(2) : "9.99"}
                  </span>
                  <Button size="sm" disabled>Buy Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Guidelines</CardTitle>
              <CardDescription>
                Please follow these guidelines to ensure your listing is approved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Ensure you have the rights to sell this design.</li>
                <li>• Provide accurate and detailed descriptions.</li>
                <li>• Set fair and competitive prices.</li>
                <li>• Use appropriate tags to help your design get discovered.</li>
                <li>• Respond promptly to buyer questions and support requests.</li>
                <li>• Don't include external links or contact information in your listing.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellDesign;
