
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDesign } from "@/contexts/DesignContext";
import { Stage, Layer, Rect, Text, Transformer, Image } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { 
  Type, 
  Square, 
  Image as ImageIcon, 
  Palette, 
  Layers, 
  Download, 
  Share2, 
  Grid, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline
} from "lucide-react";
import { toast } from "sonner";

// Helper function to create a new design
const createEmptyDesign = (width: number, height: number, name: string = "Untitled Design") => {
  return {
    id: `design-${Date.now()}`,
    name,
    width,
    height,
    elements: [],
    backgroundColor: "#ffffff",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const Editor = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    currentDesign, 
    setCurrentDesign, 
    recentDesigns, 
    selectedElement,
    setSelectedElement,
    updateElement,
    addElement,
    removeElement,
    saveDesign 
  } = useDesign();
  
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const [scale, setScale] = useState(1);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [images, setImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Load design
  useEffect(() => {
    if (id) {
      // Find the design in recent designs
      const design = recentDesigns.find(design => design.id === id);
      if (design) {
        setCurrentDesign(design);
      } else {
        // Design not found, redirect to dashboard
        navigate('/');
        toast.error("Design not found");
      }
    } else {
      // Create a new design
      const width = Number(searchParams.get('width')) || 1080;
      const height = Number(searchParams.get('height')) || 1080;
      const newDesign = createEmptyDesign(width, height);
      setCurrentDesign(newDesign);
    }

    // Clean up on unmount
    return () => {
      setSelectedElement(null);
    };
  }, [id, searchParams, recentDesigns, setCurrentDesign, navigate, setSelectedElement]);

  // Handle transformer updates
  useEffect(() => {
    if (!selectedElement || !transformerRef.current || !currentDesign) return;

    // Find the selected node
    const nodes = transformerRef.current.getStage().findOne(`#${selectedElement}`);
    
    if (nodes) {
      // Attach transformer to the selected node
      transformerRef.current.nodes([nodes]);
      transformerRef.current.getLayer().batchDraw();
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedElement, currentDesign]);

  // Calculate stage size for centering the design
  useEffect(() => {
    if (!currentDesign) return;

    const containerWidth = window.innerWidth - 300; // Sidebar width
    const containerHeight = window.innerHeight - 70; // Header height

    const scaleX = containerWidth / currentDesign.width;
    const scaleY = containerHeight / currentDesign.height;
    const newScale = Math.min(scaleX, scaleY, 1) * 0.9; // 90% of the container

    setScale(newScale);
    setStageSize({
      width: containerWidth,
      height: containerHeight,
    });
  }, [currentDesign]);

  // Preload images
  useEffect(() => {
    if (!currentDesign) return;

    const imageElements = currentDesign.elements.filter(el => el.type === 'image' && el.src);
    
    imageElements.forEach(el => {
      if (el.src && !images.has(el.src)) {
        const img = new window.Image();
        img.src = el.src;
        img.onload = () => {
          setImages(prev => new Map(prev).set(el.src!, img));
        };
      }
    });
  }, [currentDesign, images]);

  // Handle element selection
  const handleElementSelect = (id: string) => {
    setSelectedElement(id);
  };

  // Handle drag end
  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
    updateElement(id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  // Handle transform end
  const handleTransformEnd = (e: KonvaEventObject<Event>, id: string) => {
    const node = e.target;
    updateElement(id, {
      x: node.x(),
      y: node.y(),
      width: node.width() * node.scaleX(),
      height: node.height() * node.scaleY(),
      rotation: node.rotation(),
    });
    
    // Reset scale to prevent cumulative scaling
    node.scaleX(1);
    node.scaleY(1);
  };

  // Handle stage click to deselect
  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedElement(null);
    }
  };

  // Add different types of elements
  const addTextElement = () => {
    if (!currentDesign) return;
    
    addElement({
      type: 'text',
      x: currentDesign.width / 2,
      y: currentDesign.height / 2,
      width: 200,
      height: 50,
      rotation: 0,
      content: 'Add your text here',
      fill: '#333333',
      fontSize: 20,
      fontFamily: 'Arial',
    });
  };

  const addShapeElement = (shapeType: "rect" | "circle") => {
    if (!currentDesign) return;
    
    addElement({
      type: 'shape',
      x: currentDesign.width / 2,
      y: currentDesign.height / 2,
      width: 100,
      height: shapeType === 'circle' ? 100 : 80,
      rotation: 0,
      fill: '#8B5CF6',
      stroke: '',
      strokeWidth: 0,
      shapeType,
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target || !currentDesign) return;
      
      const img = new window.Image();
      img.src = event.target.result as string;
      
      img.onload = () => {
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        
        // Set a reasonable size based on the design dimensions
        const maxWidth = currentDesign.width * 0.5;
        const maxHeight = currentDesign.height * 0.5;
        
        let width = maxWidth;
        let height = width / aspectRatio;
        
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
        
        addElement({
          type: 'image',
          x: currentDesign.width / 2,
          y: currentDesign.height / 2,
          width,
          height,
          rotation: 0,
          src: img.src,
        });
        
        setImages(prev => new Map(prev).set(img.src, img));
      };
    };
    
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset the input
  };

  // Handle background color change
  const handleBackgroundChange = (color: string) => {
    if (!currentDesign) return;
    
    setCurrentDesign({
      ...currentDesign,
      backgroundColor: color,
      updatedAt: new Date(),
    });
  };

  // Render the current design
  const renderElements = () => {
    if (!currentDesign) return null;
    
    return currentDesign.elements.map(element => {
      const isSelected = selectedElement === element.id;
      
      switch (element.type) {
        case 'text':
          return (
            <Text
              key={element.id}
              id={element.id}
              x={element.x}
              y={element.y}
              width={element.width}
              height={element.height}
              text={element.content}
              fill={element.fill}
              fontSize={element.fontSize}
              fontFamily={element.fontFamily}
              draggable
              rotation={element.rotation}
              onClick={() => handleElementSelect(element.id)}
              onTap={() => handleElementSelect(element.id)}
              onDragEnd={(e) => handleDragEnd(e, element.id)}
              onTransformEnd={(e) => handleTransformEnd(e, element.id)}
            />
          );
          
        case 'shape':
          if (element.shapeType === 'rect') {
            return (
              <Rect
                key={element.id}
                id={element.id}
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                fill={element.fill}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                draggable
                rotation={element.rotation}
                onClick={() => handleElementSelect(element.id)}
                onTap={() => handleElementSelect(element.id)}
                onDragEnd={(e) => handleDragEnd(e, element.id)}
                onTransformEnd={(e) => handleTransformEnd(e, element.id)}
              />
            );
          } else if (element.shapeType === 'circle') {
            return (
              <Rect
                key={element.id}
                id={element.id}
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                fill={element.fill}
                cornerRadius={element.width / 2}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                draggable
                rotation={element.rotation}
                onClick={() => handleElementSelect(element.id)}
                onTap={() => handleElementSelect(element.id)}
                onDragEnd={(e) => handleDragEnd(e, element.id)}
                onTransformEnd={(e) => handleTransformEnd(e, element.id)}
              />
            );
          }
          return null;
          
        case 'image':
          const imageObj = element.src ? images.get(element.src) : undefined;
          if (!imageObj) return null;
          
          return (
            <Image
              key={element.id}
              id={element.id}
              x={element.x}
              y={element.y}
              width={element.width}
              height={element.height}
              image={imageObj}
              draggable
              rotation={element.rotation}
              onClick={() => handleElementSelect(element.id)}
              onTap={() => handleElementSelect(element.id)}
              onDragEnd={(e) => handleDragEnd(e, element.id)}
              onTransformEnd={(e) => handleTransformEnd(e, element.id)}
            />
          );
          
        default:
          return null;
      }
    });
  };

  // Properties panel based on selected element
  const renderPropertiesPanel = () => {
    if (!currentDesign || !selectedElement) {
      return (
        <div className="p-4">
          <p className="text-sm text-gray-500">No element selected</p>
        </div>
      );
    }
    
    const element = currentDesign.elements.find(el => el.id === selectedElement);
    if (!element) return null;
    
    switch (element.type) {
      case 'text':
        return (
          <div className="p-4 space-y-4">
            <h3 className="font-semibold">Text Properties</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Text Content</label>
              <textarea
                className="w-full p-2 border rounded-md"
                value={element.content}
                onChange={(e) => updateElement(element.id, { content: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Font Size</label>
              <div className="flex">
                <input
                  type="range"
                  min="8"
                  max="72"
                  value={element.fontSize}
                  onChange={(e) => updateElement(element.id, { fontSize: Number(e.target.value) })}
                  className="w-full"
                />
                <span className="ml-2 text-sm">{element.fontSize}px</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Text Color</label>
              <div className="flex gap-2">
                {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-md border border-gray-300"
                    style={{ backgroundColor: color }}
                    onClick={() => updateElement(element.id, { fill: color })}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Text Alignment</label>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => updateElement(element.id, { align: 'left' })}
                >
                  <AlignLeft size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => updateElement(element.id, { align: 'center' })}
                >
                  <AlignCenter size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => updateElement(element.id, { align: 'right' })}
                >
                  <AlignRight size={16} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Style</label>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    // Toggle bold would require more complex handling in a real app
                    toast.info("Bold toggled");
                  }}
                >
                  <Bold size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    toast.info("Italic toggled");
                  }}
                >
                  <Italic size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    toast.info("Underline toggled");
                  }}
                >
                  <Underline size={16} />
                </Button>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={() => removeElement(element.id)}
              className="w-full"
            >
              Delete Element
            </Button>
          </div>
        );
        
      case 'shape':
        return (
          <div className="p-4 space-y-4">
            <h3 className="font-semibold">Shape Properties</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Fill Color</label>
              <div className="flex gap-2">
                {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-md border border-gray-300"
                    style={{ backgroundColor: color }}
                    onClick={() => updateElement(element.id, { fill: color })}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Stroke Color</label>
              <div className="flex gap-2">
                {['', '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'].map((color, index) => (
                  <button
                    key={color || 'none'}
                    className={`w-6 h-6 rounded-md ${color ? 'border border-gray-300' : 'bg-gray-200 flex items-center justify-center'}`}
                    style={{ backgroundColor: color || 'transparent' }}
                    onClick={() => updateElement(element.id, { 
                      stroke: color, 
                      strokeWidth: color ? 2 : 0 
                    })}
                  >
                    {!color && <span className="text-xs text-red-500">/</span>}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Stroke Width</label>
              <div className="flex">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={element.strokeWidth || 0}
                  onChange={(e) => updateElement(element.id, { strokeWidth: Number(e.target.value) })}
                  className="w-full"
                  disabled={!element.stroke}
                />
                <span className="ml-2 text-sm">{element.strokeWidth || 0}px</span>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={() => removeElement(element.id)}
              className="w-full"
            >
              Delete Element
            </Button>
          </div>
        );
        
      case 'image':
        return (
          <div className="p-4 space-y-4">
            <h3 className="font-semibold">Image Properties</h3>
            
            <div className="text-center">
              <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden mb-3">
                {element.src && (
                  <img
                    src={element.src}
                    alt="Selected"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              
              <input
                type="file"
                id="replace-image"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('replace-image')?.click()}
                className="w-full"
              >
                Replace Image
              </Button>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={() => removeElement(element.id)}
              className="w-full"
            >
              Delete Element
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!currentDesign) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
          <Button variant="ghost" size="icon" onClick={addTextElement}>
            <Type size={20} />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={() => addShapeElement('rect')}>
            <Square size={20} />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={() => addShapeElement('circle')}>
            <div className="rounded-full w-5 h-5 border-2 border-current"></div>
          </Button>
          
          <label>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Button variant="ghost" size="icon" asChild>
              <div><ImageIcon size={20} /></div>
            </Button>
          </label>
          
          <Button variant="ghost" size="icon">
            <Palette size={20} />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Layers size={20} />
          </Button>
          
          <div className="flex-1"></div>
          
          <Button variant="ghost" size="icon" onClick={() => saveDesign()}>
            <Download size={20} />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Share2 size={20} />
          </Button>
        </div>
        
        {/* Center - Canvas */}
        <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center">
          <div 
            className="canvas-container"
            style={{
              width: currentDesign.width * scale,
              height: currentDesign.height * scale,
            }}
          >
            <Stage
              ref={stageRef}
              width={currentDesign.width}
              height={currentDesign.height}
              scaleX={scale}
              scaleY={scale}
              onClick={handleStageClick}
              onTap={handleStageClick}
            >
              <Layer>
                {/* Background */}
                <Rect
                  x={0}
                  y={0}
                  width={currentDesign.width}
                  height={currentDesign.height}
                  fill={currentDesign.backgroundColor}
                />
                
                {/* Grid (optional) */}
                {Array(Math.floor(currentDesign.width / 50)).fill(0).map((_, i) => (
                  <Rect
                    key={`grid-v-${i}`}
                    x={i * 50}
                    y={0}
                    width={1}
                    height={currentDesign.height}
                    fill="#dddddd"
                    opacity={0.5}
                  />
                ))}
                {Array(Math.floor(currentDesign.height / 50)).fill(0).map((_, i) => (
                  <Rect
                    key={`grid-h-${i}`}
                    x={0}
                    y={i * 50}
                    width={currentDesign.width}
                    height={1}
                    fill="#dddddd"
                    opacity={0.5}
                  />
                ))}
                
                {/* Design Elements */}
                {renderElements()}
                
                {/* Transformer */}
                <Transformer
                  ref={transformerRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    // Limit the minimum size of the box
                    if (newBox.width < 10 || newBox.height < 10) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              </Layer>
            </Stage>
          </div>
        </div>
        
        {/* Right Sidebar - Properties */}
        <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
          <Tabs defaultValue="properties">
            <TabsList className="w-full">
              <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
              <TabsTrigger value="design" className="flex-1">Design</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="focus-visible:outline-none">
              {renderPropertiesPanel()}
            </TabsContent>
            
            <TabsContent value="design" className="focus-visible:outline-none">
              <div className="p-4 space-y-4">
                <h3 className="font-semibold">Canvas Size</h3>
                <div className="flex gap-2">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Width</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md text-sm"
                      value={currentDesign.width}
                      onChange={(e) => {
                        const width = Math.max(100, Math.min(4000, Number(e.target.value)));
                        setCurrentDesign({
                          ...currentDesign,
                          width,
                          updatedAt: new Date(),
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Height</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md text-sm"
                      value={currentDesign.height}
                      onChange={(e) => {
                        const height = Math.max(100, Math.min(4000, Number(e.target.value)));
                        setCurrentDesign({
                          ...currentDesign,
                          height,
                          updatedAt: new Date(),
                        });
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Background Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['#FFFFFF', '#F5F5F5', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-md border border-gray-300"
                        style={{ backgroundColor: color }}
                        onClick={() => handleBackgroundChange(color)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    className="w-full bg-brand-purple hover:bg-brand-dark"
                    onClick={() => {
                      saveDesign();
                      toast.success("Design saved successfully!");
                    }}
                  >
                    Save Design
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Editor;
