import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { usePermissions } from '../lib/auth';
import { DOMAIN_REGISTRY, getDomainsByCategory, getAllCategories, getCategoryLabel } from '../lib/domainRegistry';
import { ChevronDown, ChevronRight } from 'lucide-react';

export function DynamicSidebar() {
  const router = useRouter();
  const { getAllowedDomains, user } = usePermissions();
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set(['core']));
  
  const allowedDomains = getAllowedDomains();
  const categories = getAllCategories();

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  return (
    <nav className="w-64 bg-white shadow-lg h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">🌿</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Admin Portal</h2>
            <p className="text-xs text-gray-500">Business Management</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {categories.map((category: string) => {
          const categoryDomains = getDomainsByCategory(category).filter((d: any) => allowedDomains.includes(d.name));
          
          if (categoryDomains.length === 0) return null;
          
          const isExpanded = expandedCategories.has(category);
          
          return (
            <div key={category} className="mb-4">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>{getCategoryLabel(category)}</span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {isExpanded && (
                <ul className="ml-4 mt-2 space-y-1">
                  {categoryDomains.map(({ label, icon: Icon, route }: any) => {
                    const domain = allowedDomains.find((d: string) => DOMAIN_REGISTRY[d]?.route === route);
                    const isActive = router.pathname === route;
                    
                    return (
                      <li key={route}>
                        <Link href={route}>
                          <a className={`
                            flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
                            ${isActive 
                              ? 'bg-emerald-100 text-emerald-700 font-medium shadow-sm' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            }
                          `}>
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{label}</span>
                          </a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      
      {/* User Info at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </nav>
  );
}