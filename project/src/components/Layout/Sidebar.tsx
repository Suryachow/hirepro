import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home,
  Briefcase,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  BookOpen,
  Trophy,
  Clock,
  GitBranch,
  Target,
  Video,
  Code
} from 'lucide-react';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  // Student sidebar items - reordered as requested
  { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard', roles: ['student', 'admin', 'super-admin'] },
  { icon: <FileText className="h-5 w-5" />, label: 'Applications', path: '/dashboard/applications', roles: ['student'] },
  { icon: <Briefcase className="h-5 w-5" />, label: 'Jobs', path: '/dashboard/jobs', roles: ['student'] },
  { icon: <BookOpen className="h-5 w-5" />, label: 'Assessments', path: '/dashboard/assessments', roles: ['student'] },
  { icon: <Calendar className="h-5 w-5" />, label: 'Interviews', path: '/dashboard/interviews', roles: ['student'] },
  { icon: <GitBranch className="h-5 w-5" />, label: 'Pipeline', path: '/dashboard/student-pipeline', roles: ['student'] },
  { icon: <Trophy className="h-5 w-5" />, label: 'Coding Challenges', path: '/dashboard/challenges', roles: ['student'] },
  { icon: <Code className="h-5 w-5" />, label: 'Practice', path: '/dashboard/practice', roles: ['student'] },
  { icon: <Target className="h-5 w-5" />, label: 'Interview Preparation', path: '/dashboard/interview-preparation', roles: ['student'] },
  { icon: <Video className="h-5 w-5" />, label: 'Mock Interviews', path: '/dashboard/mock-interviews', roles: ['student'] },
  { icon: <Briefcase className="h-5 w-5" />, label: 'Job Postings', path: '/dashboard/job-postings', roles: ['admin'] },
  { icon: <Users className="h-5 w-5" />, label: 'Candidates', path: '/dashboard/candidates', roles: ['admin'] },
  { icon: <Clock className="h-5 w-5" />, label: 'Pipeline', path: '/dashboard/pipeline', roles: ['admin'] },
  { icon: <BarChart3 className="h-5 w-5" />, label: 'Analytics', path: '/dashboard/analytics', roles: ['admin', 'super-admin'] },
  { icon: <Users className="h-5 w-5" />, label: 'Admin Management', path: '/admin-management', roles: ['super-admin'] },
  { icon: <Settings className="h-5 w-5" />, label: 'Global Settings', path: '/settings', roles: ['super-admin'] },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [activeItem, setActiveItem] = React.useState('/dashboard');

  const filteredItems = sidebarItems.filter(item => {
    const isAllowed = user?.role && item.roles.includes(user.role);
    console.log(`Item ${item.label} allowed for ${user?.role}:`, isAllowed);
    return isAllowed;
  });

  console.log('Filtered sidebar items:', filteredItems);

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen">
      <div className="p-6">
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                console.log('Navigating to:', item.path);
                setActiveItem(item.path);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeItem === item.path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;