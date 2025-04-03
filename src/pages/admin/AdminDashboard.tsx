import { useState } from "react";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  Search,
  CheckCircle,
  XCircle,
  Edit,
  Trash,
  Star,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// Mock data for analytics
const salesData = [
  { date: "2025-03-01", sales: 400 },
  { date: "2025-03-02", sales: 300 },
  { date: "2025-03-03", sales: 500 },
  { date: "2025-03-04", sales: 700 },
  { date: "2025-03-05", sales: 600 },
];

const userGrowthData = [
  { month: "Jan", users: 200 },
  { month: "Feb", users: 300 },
  { month: "Mar", users: 500 },
  { month: "Apr", users: 700 },
  { month: "May", users: 600 },
];

const AdminDashboard = () => {
  const { isAdmin: userIsAdmin, users, updateUserRole, getAllUsers } = useUser();
  const { marketplaceItems, updateListing, removeFromMarketplace } = useMarketplace();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const isAdmin = true; // Temporary override for testing
  
  // Redirect non-admin users
  if (!isAdmin) {
    navigate("/");
    toast.error("You don't have permission to access this page");
    return null;
  }
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter marketplace items based on search query
  const filteredItems = marketplaceItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleRoleChange = (userId: string, role: "admin" | "designer" | "customer") => {
    updateUserRole(userId, role);
    toast.success(`User role updated to ${role}`);
  };
  
  const handleFeatureItem = (itemId: string, featured: boolean) => {
    updateListing(itemId, { featured });
    toast.success(featured ? "Item featured" : "Item unfeatured");
  };
  
  const handleRemoveItem = (itemId: string) => {
    if (confirm("Are you sure you want to remove this item from the marketplace?")) {
      removeFromMarketplace(itemId);
      toast.success("Item removed from marketplace");
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="users">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <ShoppingBag size={16} />
              <span>Marketplace</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, roles, and permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={user.role}
                            onValueChange={(value: "admin" | "designer" | "customer") => 
                              handleRoleChange(user.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="designer">Designer</SelectItem>
                              <SelectItem value="customer">Customer</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>
                          {user.isVerified ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle size={16} className="mr-1" /> Verified
                            </span>
                          ) : (
                            <span className="flex items-center text-amber-600">
                              <XCircle size={16} className="mr-1" /> Pending
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="ghost">
                              <Edit size={16} />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-red-500">
                              <Trash size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="marketplace" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Management</CardTitle>
                <CardDescription>
                  Manage listings, review submissions, and monitor sales.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Purchases</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.sellerName}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.purchasesCount}</TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant={item.featured ? "default" : "outline"}
                            onClick={() => handleFeatureItem(item.id, !item.featured)}
                          >
                            <Star size={16} className={item.featured ? "fill-current" : ""} />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => navigate(`/marketplace/${item.id}`)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-red-500"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                  <CardDescription>User growth over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{users.length}</div>
                  <div className="text-sm text-green-600 mt-2">+12% from last month</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Total Sales</CardTitle>
                  <CardDescription>Revenue from marketplace</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">$12,450</div>
                  <div className="text-sm text-green-600 mt-2">+8% from last month</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Active Users</CardTitle>
                  <CardDescription>Currently online</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">24</div>
                  <div className="text-sm text-green-600 mt-2">+15% from last hour</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sales Analytics Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                  <CardDescription>
                    Sales trends over the past week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>
                    Monthly user growth over the past year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="users" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>
                  Configure global platform settings and defaults
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Marketplace Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Platform Fee (%)</span>
                      <Input type="number" className="w-24" defaultValue="10" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Minimum Price ($)</span>
                      <Input type="number" className="w-24" defaultValue="1.99" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Require Approval for Listings</span>
                      <Button variant="outline">Enabled</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">User Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Allow New Registrations</span>
                      <Button variant="outline">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Default User Role</span>
                      <Select defaultValue="customer">
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="designer">Designer</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
