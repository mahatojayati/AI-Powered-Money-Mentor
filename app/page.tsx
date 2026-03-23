'use client';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Calculator, 
  HeartPulse, 
  Users, 
  FileSearch,
  Menu,
  X
} from 'lucide-react';
import FIREPlanner from '@/components/FIREPlanner';
import TaxWizard from '@/components/TaxWizard';
import LifeEventAdvisor from '@/components/LifeEventAdvisor';
import MoneyHealthScore from '@/components/MoneyHealthScore';

export default function App() {
  const [activeTab, setActiveTab] = useState('health');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'health', name: 'Money Health Score', icon: HeartPulse },
    { id: 'fire', name: 'FIRE Path Planner', icon: TrendingUp },
    { id: 'tax', name: 'Tax Wizard', icon: Calculator },
    { id: 'life', name: 'Life Event Advisor', icon: LayoutDashboard },
    // { id: 'couple', name: "Couple's Planner", icon: Users },
    // { id: 'mf', name: 'MF Portfolio X-Ray', icon: FileSearch },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'health':
        return <MoneyHealthScore />;
      case 'fire':
        return <FIREPlanner />;
      case 'tax':
        return <TaxWizard />;
      case 'life':
        return <LifeEventAdvisor />;
      default:
        return <MoneyHealthScore />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">ET</span>
          </div>
          <span className="font-bold text-gray-900">Finance Mentor</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-gray-200 hidden lg:flex">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ET</span>
              </div>
              <span className="font-bold text-gray-900">Finance Mentor</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? 'text-indigo-600' : 'text-gray-400'
                      }`}
                    />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="bg-indigo-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-indigo-800">AI Powered</h4>
              <p className="mt-1 text-xs text-indigo-600">Your personal finance mentor, powered by Gemini.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 lg:pt-0">
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
