
import React, { useState, useEffect, useCallback } from 'react';
import { Home, BookOpen, UserCheck, FilePlus, Users, MessageSquare, Send, BarChart2, Moon, Sun, Menu, X, GraduationCap } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { HifzSection } from './components/HifzSection';
import { DarsNizamiSection } from './components/DarsNizamiSection';
import { Attendance } from './components/Attendance';
import { Admissions } from './components/Admissions';
import { Graduates } from './components/Graduates';
import { Messaging } from './components/Messaging';
import { Reports } from './components/Reports';
import { Login } from './components/Login';

type Page = 'Login' | 'Dashboard' | 'Hifz' | 'Dars-e-Nizami' | 'Attendance' | 'Admissions' | 'Graduates' | 'Messaging' | 'Reports';

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('Login');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('theme') === 'dark' || 
           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        setIsDarkMode(!isDarkMode);
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        setPage('Dashboard');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setPage('Login');
    };

    const renderPage = useCallback(() => {
        switch (page) {
            case 'Dashboard': return <Dashboard />;
            case 'Hifz': return <HifzSection />;
            case 'Dars-e-Nizami': return <DarsNizamiSection />;
            case 'Attendance': return <Attendance />;
            case 'Admissions': return <Admissions />;
            case 'Graduates': return <Graduates />;
            case 'Messaging': return <Messaging />;
            case 'Reports': return <Reports />;
            default: return <Dashboard />;
        }
    }, [page]);
    
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    const navItems = [
        { name: 'Dashboard', icon: Home, page: 'Dashboard' as Page },
        { name: 'Hifz-ul-Quran', icon: BookOpen, page: 'Hifz' as Page },
        { name: 'Dars-e-Nizami', icon: GraduationCap, page: 'Dars-e-Nizami' as Page },
        { name: 'Attendance', icon: UserCheck, page: 'Attendance' as Page },
        { name: 'Admissions', icon: FilePlus, page: 'Admissions' as Page },
        { name: 'Graduates', icon: Users, page: 'Graduates' as Page },
        { name: 'Messaging', icon: MessageSquare, page: 'Messaging' as Page },
        { name: 'Reports', icon: Send, page: 'Reports' as Page },
    ];
    
    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h1 className="text-xl font-bold text-primary-700 dark:text-primary-300">Noor-ul-Masajid</h1>
                 <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400">
                    <X size={24} />
                </button>
            </div>
            <nav className="flex-1 p-2 space-y-1">
                {navItems.map(item => (
                    <button
                        key={item.name}
                        onClick={() => { setPage(item.page); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                            page === item.page
                                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                 <button onClick={handleLogout} className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors">
                    Logout
                 </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* Sidebar for large screens */}
            <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg">
                <SidebarContent />
            </aside>
            
            {/* Sidebar for mobile screens (drawer) */}
            <div className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
                 <aside className="relative w-64 h-full bg-white dark:bg-gray-800 shadow-xl">
                    <SidebarContent />
                 </aside>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                     <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500 dark:text-gray-400">
                        <Menu size={24} />
                    </button>
                    <h2 className="text-xl font-semibold">{page.replace('-', ' ')}</h2>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            {isDarkMode ? <Sun /> : <Moon />}
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default App;
