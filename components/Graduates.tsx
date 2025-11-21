
import React, { useState } from 'react';
import { Section, Graduate } from '../types';
import { Download, Upload, Search, Award } from 'lucide-react';

const mockGraduates: Graduate[] = [
    { id: 1, studentName: 'Hassan Ali', section: Section.Hifz, completionYear: 2022, certificateUrl: '#' },
    { id: 2, studentName: 'Zainab Fatima', section: Section.Dars, completionYear: 2021 },
    { id: 3, studentName: 'Fahad Iqbal', section: Section.Hifz, completionYear: 2023, certificateUrl: '#' },
    { id: 4, studentName: 'Ayesha Noor', section: Section.Dars, completionYear: 2023 },
];

export const Graduates: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSection, setFilterSection] = useState<'All' | Section>('All');

    const filteredGraduates = mockGraduates.filter(g => 
        (g.studentName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterSection === 'All' || g.section === filterSection)
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Pass-Graduate Students</h2>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                        <input 
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <select
                        value={filterSection}
                        onChange={e => setFilterSection(e.target.value as 'All' | Section)}
                        className="p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="All">All Sections</option>
                        <option value={Section.Hifz}>Hifz-ul-Quran</option>
                        <option value={Section.Dars}>Dars-e-Nizami</option>
                    </select>
                </div>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center w-full md:w-auto justify-center">
                    <Download className="w-4 h-4 mr-2"/> Export List
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student Name</th>
                                <th scope="col" className="px-6 py-3">Section</th>
                                <th scope="col" className="px-6 py-3">Completion Year</th>
                                <th scope="col" className="px-6 py-3">Certificate/Ijazah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGraduates.map((grad) => (
                                <tr key={grad.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                                        <Award className={`w-5 h-5 mr-3 ${grad.section === Section.Hifz ? 'text-primary-500' : 'text-secondary-500'}`}/>
                                        {grad.studentName}
                                    </th>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${grad.section === Section.Hifz ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200'}`}>
                                          {grad.section}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{grad.completionYear}</td>
                                    <td className="px-6 py-4">
                                        {grad.certificateUrl ? (
                                            <a href={grad.certificateUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 dark:text-primary-500 hover:underline">
                                                View Certificate
                                            </a>
                                        ) : (
                                            <button className="text-sm flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                                                <Upload className="w-4 h-4 mr-1"/> Upload
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};
