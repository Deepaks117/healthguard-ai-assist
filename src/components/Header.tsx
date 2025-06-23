
import { Shield, User, LogOut, FileText, BookOpen, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useAuditLogger } from '@/hooks/useAuditLogger';

export const Header = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { logAction } = useAuditLogger();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      logAction({
        action: 'logout',
        details: { timestamp: new Date().toISOString() }
      });
      
      await signOut();
      toast({
        title: 'Signed out successfully',
        description: 'You have been logged out of HealthGuard360.',
      });
    } catch (error) {
      toast({
        title: 'Sign out failed',
        description: 'An error occurred while signing out.',
        variant: 'destructive',
      });
    }
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Shield },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/training', label: 'Training', icon: BookOpen },
    { path: '/audit', label: 'Audit Trail', icon: ClipboardCheck },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-[#003366]" />
            <h1 className="text-2xl font-bold text-[#003366]">HealthGuard360</h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                  location.pathname === path
                    ? 'bg-[#003366] text-white'
                    : 'text-gray-700 hover:text-[#003366] hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Welcome back, {user?.email}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
