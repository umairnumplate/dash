
import React from 'react';
import { Users, BookOpen, CheckCircle, BarChart, UserPlus, GraduationCap } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    </div>
);

const attendanceData = [
  { name: 'Hifz A', present: 45, absent: 5 },
  { name: 'Hifz B', present: 48, absent: 2 },
  { name: 'Dars 1', present: 30, absent: 3 },
  { name: 'Dars 2', present: 28, absent: 1 },
  { name: 'Dars 3', present: 32, absent: 4 },
];

export const Dashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Students" value="320" icon={Users} color="bg-blue-500" />
                <StatCard title="Hifz Students" value="150" icon={BookOpen} color="bg-primary-500" />
                <StatCard title="Dars-e-Nizami" value="170" icon={GraduationCap} color="bg-secondary-500" />
                <StatCard title="Today's Attendance" value="95%" icon={CheckCircle} color="bg-green-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Class-wise Attendance Today</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <RechartsBarChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(30,41,59,0.9)',
                                        borderColor: '#334155'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="present" fill="#22c55e" name="Present" />
                                <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <div className="space-y-3">
                         <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <UserPlus className="h-5 w-5 mr-3 text-primary-500"/>
                            <span>New Admission</span>
                         </a>
                         <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <BarChart className="h-5 w-5 mr-3 text-secondary-500"/>
                            <span>View Exam Results</span>
                         </a>
                         <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <BookOpen className="h-5 w-5 mr-3 text-blue-500"/>
                            <span>Daily Sabaq Report</span>
                         </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
