import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Plus, Keyboard, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  onSidebarToggle: (isOpen: boolean) => void;
}

export function Navbar({ onSidebarToggle }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { setIsModalVisible: setIsShortcutsOpen } = useKeyboardShortcuts();
  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    onSidebarToggle(newState);
  };

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-40">
      <div className="h-full px-3 sm:px-4 flex items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSidebarToggle}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <Link to="/" className="text-lg font-bold hidden sm:block tracking-tight">
            CodeCandy
          </Link>
        </div>

        {/* Center — search */}
        <div className="flex-1 max-w-xl hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search snippets..."
              className="pl-9 h-9 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') navigate(`/search?q=${e.currentTarget.value}`);
              }}
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => navigate('/search')}>
            <Search className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex gap-1.5 text-muted-foreground"
            onClick={() => setIsShortcutsOpen(true)}
          >
            <Keyboard className="w-4 h-4" />
            <span className="text-xs">Shortcuts</span>
          </Button>

          <Button size="sm" className="hidden sm:flex gap-1.5" onClick={() => navigate('/create')}>
            <Plus className="w-4 h-4" />
            New Snippet
          </Button>

          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => navigate('/create')}>
            <Plus className="w-5 h-5" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} referrerPolicy="no-referrer" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <p className="font-medium text-sm truncate">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    data-variant="destructive"
                    className="cursor-pointer"
                    onClick={signOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
