
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { Plus, Clock, Star, Grid, Layout, Image, File } from "lucide-react";
import { useDesign } from "@/contexts/DesignContext";

const Dashboard = () => {
  const { recentDesigns } = useDesign();
  const [activeTab, setActiveTab] = useState("recent");

  // Design dimensions presets
  const designPresets = [
    { name: "Instagram Post", width: 1080, height: 1080, icon: <Image size={24} /> },
    { name: "Facebook Post", width: 1200, height: 630, icon: <Image size={24} /> },
    { name: "Twitter Post", width: 1600, height: 900, icon: <Image size={24} /> },
    { name: "Presentation", width: 1920, height: 1080, icon: <Layout size={24} /> },
    { name: "Custom Size", width: 0, height: 0, icon: <Grid size={24} /> },
  ];

  // Template categories
  const categories = [
    "Social Media",
    "Presentations",
    "Print",
    "Documents",
    "Marketing",
    "Education",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Create new</h2>
              
              <div className="space-y-3">
                {designPresets.map((preset) => (
                  <Link
                    key={preset.name}
                    to={
                      preset.name === "Custom Size"
                        ? "/editor"
                        : `/editor?width=${preset.width}&height=${preset.height}`
                    }
                    className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-brand-light rounded-md flex items-center justify-center text-brand-purple mr-3">
                      {preset.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{preset.name}</h3>
                      {preset.width > 0 && (
                        <p className="text-xs text-gray-500">
                          {preset.width} × {preset.height}px
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/templates?category=${category}`}
                    className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <span>{category}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Your Designs</h1>
              <Button className="bg-brand-purple hover:bg-brand-dark" asChild>
                <Link to="/editor">
                  <Plus className="mr-1 h-4 w-4" /> Create New
                </Link>
              </Button>
            </div>
            
            <Tabs defaultValue="recent" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="recent">
                  <Clock className="mr-1 h-4 w-4" /> Recent
                </TabsTrigger>
                <TabsTrigger value="favorites">
                  <Star className="mr-1 h-4 w-4" /> Favorites
                </TabsTrigger>
                <TabsTrigger value="all">
                  <File className="mr-1 h-4 w-4" /> All Designs
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="mt-0">
                {recentDesigns.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentDesigns.map((design) => (
                      <Card key={design.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                        <Link to={`/editor/${design.id}`}>
                          <div className="relative aspect-video bg-gray-100 overflow-hidden">
                            <div 
                              className="w-full h-full" 
                              style={{ 
                                backgroundColor: design.backgroundColor,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                                color: "#666"
                              }}
                            >
                              {/* In a real app, we would display a thumbnail here */}
                              {design.name}
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all"></div>
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-medium truncate">{design.name}</h3>
                            <p className="text-xs text-gray-500">
                              Last edited {new Date(design.updatedAt).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No recent designs found</p>
                    <Button className="bg-brand-purple hover:bg-brand-dark" asChild>
                      <Link to="/editor">
                        <Plus className="mr-1 h-4 w-4" /> Create Your First Design
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="favorites" className="mt-0">
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No favorite designs yet</p>
                  <Button variant="outline" asChild>
                    <Link to="/templates">Browse Templates</Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="all" className="mt-0">
                {recentDesigns.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentDesigns.map((design) => (
                      <Card key={design.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                        <Link to={`/editor/${design.id}`}>
                          <div className="relative aspect-video bg-gray-100 overflow-hidden">
                            <div 
                              className="w-full h-full" 
                              style={{ 
                                backgroundColor: design.backgroundColor,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                                color: "#666"
                              }}
                            >
                              {design.name}
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all"></div>
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-medium truncate">{design.name}</h3>
                            <p className="text-xs text-gray-500">
                              {design.width} × {design.height}px
                            </p>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No designs found</p>
                    <Button className="bg-brand-purple hover:bg-brand-dark" asChild>
                      <Link to="/editor">
                        <Plus className="mr-1 h-4 w-4" /> Create Your First Design
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
