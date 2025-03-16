
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { useDesign } from "@/contexts/DesignContext";
import { Badge } from "@/components/ui/badge";

const Templates = () => {
  const { recentDesigns } = useDesign();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Template categories
  const categories = [
    "All Templates",
    "Social Media",
    "Presentations",
    "Print",
    "Documents",
    "Marketing",
    "Education",
  ];

  const filteredTemplates = selectedCategory && selectedCategory !== "All Templates"
    ? recentDesigns.filter(design => design.name.includes(selectedCategory))
    : recentDesigns;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Templates</h1>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={selectedCategory === category ? "bg-brand-purple hover:bg-brand-dark" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="overflow-hidden group hover:shadow-md transition-shadow">
              <Link to={`/editor/${template.id}`}>
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <div 
                    className="w-full h-full" 
                    style={{ 
                      backgroundColor: template.backgroundColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      color: "#666"
                    }}
                  >
                    {template.name}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all"></div>
                  <Badge className="absolute top-2 right-2 bg-brand-purple">
                    {template.width}×{template.height}
                  </Badge>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium truncate">{template.name}</h3>
                  <p className="text-xs text-gray-500">
                    Template
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Templates;
