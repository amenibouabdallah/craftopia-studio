
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { useDesign } from "@/contexts/DesignContext";
import { Download } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser, isAuthenticated, logout } = useUser();
  const { recentDesigns } = useDesign();
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateUser({ name, email, bio });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulating password update
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Password updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleDownloadDesign = (design: any) => {
    try {
      // Create a JSON string from the design object
      const designJson = JSON.stringify(design, null, 2);
      
      // Create a blob from the JSON string
      const blob = new Blob([designJson], { type: "application/json" });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = `${design.name || "design"}-${design.id}.json`;
      
      // Append the link to the body
      document.body.appendChild(link);
      
      // Click the link to trigger the download
      link.click();
      
      // Remove the link from the body
      document.body.removeChild(link);
      
      // Release the URL object
      URL.revokeObjectURL(url);
      
      toast.success(`Design "${design.name}" downloaded successfully`);
    } catch (error) {
      console.error("Error downloading design:", error);
      toast.error("Failed to download design");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>User Info</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-brand-purple text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              <h3 className="font-medium text-lg">{currentUser?.name || "User"}</h3>
              <p className="text-sm text-gray-500">{currentUser?.email || "user@example.com"}</p>
              <p className="text-sm mt-2">
                {currentUser?.role === "admin" ? "Administrator" : currentUser?.role === "designer" ? "Designer" : "Customer"}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              Log Out
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile Settings</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="designs">My Designs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Update your profile information
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileUpdate}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordUpdate}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="designs">
              <Card>
                <CardHeader>
                  <CardTitle>My Designs</CardTitle>
                  <CardDescription>
                    View and download your designs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentDesigns && recentDesigns.length > 0 ? (
                    <div className="space-y-4">
                      {recentDesigns.map((design) => (
                        <div key={design.id} className="flex items-center justify-between p-4 border rounded-md">
                          <div>
                            <h3 className="font-medium">{design.name || "Untitled Design"}</h3>
                            <p className="text-sm text-gray-500">
                              Created: {design.createdAt ? new Date(design.createdAt).toLocaleDateString() : "Unknown"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/editor/${design.id}`)}>
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDownloadDesign(design)}
                              className="flex items-center gap-1"
                            >
                              <Download size={16} />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You don't have any designs yet</p>
                      <Button onClick={() => navigate("/editor")}>
                        Create a Design
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {currentUser?.role === "designer" && (
            <Card>
              <CardHeader>
                <CardTitle>Designer Settings</CardTitle>
                <CardDescription>
                  Manage your designer profile and listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  As a designer, you can create and sell your designs on the marketplace.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/my-designs")}
                    className="w-full"
                  >
                    My Designs
                  </Button>
                  <Button
                    onClick={() => navigate("/marketplace?filter=mine")}
                    className="w-full"
                  >
                    My Listings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
