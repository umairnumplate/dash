
import React, { useState } from 'react';
import { Phone, Book, FileText, MessageCircle, Download, Plus, Search, ChevronRight } from 'lucide-react';
import { Student, Section, HifzLog, ExamRecord } from '../types';

const mockStudents: Student[] = [
    { id: 1, name: 'Abdullah Ahmed', fatherName: 'Ahmed Ali', class: 'Hifz A', section: Section.Hifz, rollNumber: 'H-101', dob: '2010-05-15', cnic: '35202-1234567-1', phone: '923001234567', parentPhone: '923007654321', address: '123, Iqbal Town, Lahore', photoUrl: 'https://picsum.photos/seed/abdullah/200', admissionDate: '2022-01-10' },
    { id: 2, name: 'Bilal Khan', fatherName: 'Imran Khan', class: 'Hifz B', section: Section.Hifz, rollNumber: 'H-102', dob: '2011-02-20', cnic: '35202-2345678-2', phone: '923211234567', parentPhone: '923217654321', address: '456, Johar Town, Lahore', photoUrl: 'https://picsum.photos/seed/bilal/200', admissionDate: '2022-03-15' },
];

const mockHifzLogs: HifzLog[] = [
    { date: '2023-10-26', sabaq: 'Surah Al-Baqarah (1-10)', sabqi: 'Surah An-Nisa (20-25)', manzil: 'Juz 1' },
    { date: '2023-10-25', sabaq: 'Surah An-Nisa (171-176)', sabqi: 'Surah An-Nisa (15-19)', manzil: 'Juz 1' },
];

const mockExams: ExamRecord[] = [
    { studentId: 1, examName: 'Monthly Test (Oct)', subject: 'Juz 1-2', totalMarks: 100, obtainedMarks: 92, date: '2023-10-20' },
];

const WhatsAppButton: React.FC<{ phoneNumber: string }> = ({ phoneNumber }) => {
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    return (
        <a href={`https://wa.me/${formattedNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
            <MessageCircle className="w-4 h-4 mr-1" />
            WhatsApp
        </a>
    );
};

const StudentProfile: React.FC<{ student: Student; onBack: () => void }> = ({ student, onBack }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-fade-in">
             <button onClick={onBack} className="text-primary-600 dark:text-primary-400 hover:underline mb-4">
                &larr; Back to Student List
            </button>
            <div className="flex flex-col md:flex-row items-start md:space-x-6">
                <img src={student.photoUrl} alt={student.name} className="w-32 h-32 rounded-full object-cover border-4 border-primary-200 dark:border-primary-800" />
                <div className="mt-4 md:mt-0">
                    <h2 className="text-2xl font-bold">{student.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">Roll No: {student.rollNumber} | Class: {student.class}</p>
                    <div className="flex items-center space-x-4 mt-2">
                        <WhatsAppButton phoneNumber={student.phone} />
                        <WhatsAppButton phoneNumber={student.parentPhone} />
                    </div>
                </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Daily Tracking */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center"><Book className="mr-2 text-primary-500"/> Daily Hifz Tracking</h3>
                    <div className="space-y-2">
                        {mockHifzLogs.map(log => (
                            <div key={log.date} className="text-sm p-2 bg-white dark:bg-gray-800 rounded">
                                <p className="font-bold">{log.date}</p>
                                <p><strong>Sabaq:</strong> {log.sabaq}</p>
                                <p><strong>Sabqi:</strong> {log.sabqi}</p>
                                <p><strong>Manzil:</strong> {log.manzil}</p>
                            </div>
                        ))}
                    </div>
                     <button className="mt-4 w-full text-sm bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 flex items-center justify-center">
                        <Plus className="w-4 h-4 mr-1"/> Add New Log
                    </button>
                </div>

                {/* Exam Records */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center"><FileText className="mr-2 text-secondary-500"/> Exam Records</h3>
                    <div className="space-y-2">
                         {mockExams.map(exam => (
                            <div key={exam.examName} className="text-sm p-2 bg-white dark:bg-gray-800 rounded">
                                <p className="font-bold">{exam.examName} ({exam.date})</p>
                                <p><strong>Subject:</strong> {exam.subject}</p>
                                <p><strong>Score:</strong> {exam.obtainedMarks} / {exam.totalMarks}</p>
                            </div>
                        ))}
                    </div>
                     <button className="mt-4 w-full text-sm bg-secondary-500 text-white py-2 rounded-md hover:bg-secondary-600 flex items-center justify-center">
                        <Plus className="w-4 h-4 mr-1"/> Add Exam Record
                    </button>
                </div>
            </div>
        </div>
    );
};

export const HifzSection: React.FC = () => {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = mockStudents.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedStudent) {
        return <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold">Hifz-ul-Quran Students</h2>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                         <input 
                            type="text"
                            placeholder="Search by name or roll no..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                         />
                    </div>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center">
                        <Download className="w-4 h-4 mr-2"/> Export
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student Name</th>
                                <th scope="col" className="px-6 py-3">Class</th>
                                <th scope="col" className="px-6 py-3">Parent Contact</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                                        <img src={student.photoUrl} alt={student.name} className="w-10 h-10 rounded-full mr-3" />
                                        <div>
                                            <p>{student.name}</p>
                                            <p className="text-xs text-gray-400">{student.rollNumber}</p>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">{student.class}</td>
                                    <td className="px-6 py-4">
                                        <WhatsAppButton phoneNumber={student.parentPhone} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => setSelectedStudent(student)} className="font-medium text-primary-600 dark:text-primary-500 hover:underline flex items-center">
                                            View Details <ChevronRight size={16} className="ml-1"/>
                                        </button>
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
