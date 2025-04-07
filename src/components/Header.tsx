
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MoveRight,
  ChevronDown,
  Home,
  Layout,
  Image,
  Grid,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDesign } from "@/contexts/DesignContext";

const Header = () => {
  const location = useLocation();
  const { currentDesign, saveDesign } = useDesign();
  const [searchQuery, setSearchQuery] = useState("");

  const isEditor = location.pathname.startsWith("/editor");

  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-black flex items-center">
              <h1 className="bg-black text-white !text-xl p-1 px-2 rounded mr-0">
                D
              </h1>
              esignih
            </h1>
          </Link>

          {!isEditor && (
            <nav className="hidden md:flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    Templates
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem>
                    <Grid className="mr-2 h-4 w-4" />
                    All Templates
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Image className="mr-2 h-4 w-4" />
                    Social Media
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Layout className="mr-2 h-4 w-4" />
                    Presentations
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="sm" asChild>
                <Link to="/templates">Explore</Link>
              </Button>
            </nav>
          )}
        </div>

        {isEditor ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate max-w-[200px]">
              {currentDesign?.name || "Untitled Design"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveDesign()}
              disabled={!currentDesign}
            >
              Save
            </Button>
          </div>
        ) : (
          <div className="relative hidden md:block w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-purple"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {!isEditor && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">Dashboard</Link>
            </Button>
            <Button size="sm" className="bg-brand-purple hover:bg-brand-dark" asChild>
              <Link to="/editor">
                Create Design <MoveRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
