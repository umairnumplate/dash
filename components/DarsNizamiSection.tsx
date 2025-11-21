
import React, { useState } from 'react';
import { Phone, Book, FileText, MessageCircle, Download, Plus, Search, ChevronRight, Edit3, FileUp } from 'lucide-react';
import { Student, Section, ExamRecord, DARS_E_NIZAMI_CLASSES } from '../types'; // Import DARS_E_NIZAMI_CLASSES
import { AddStudentModal } from './AddStudentModal';
import { WhatsAppButton } from './common/WhatsAppButton';
import { ImportModal } from './ImportModal'; // Corrected import path
import * as XLSX from 'xlsx'; // Import xlsx library

const initialStudents: Student[] = [
    { id: 101, name: 'Usman Ghani', fatherName: 'Abdul Ghani', class: 'Mutawassitah', section: Section.Dars, rollNumber: 'D-201', dob: '2006-08-10', cnic: '35202-3456789-3', phone: '923331234567', parentPhone: '923337654321', address: '789, Gulberg, Lahore', photoUrl: 'https://picsum.photos/seed/usman/200', admissionDate: '2022-04-01' },
    { id: 102, name: 'Ali Raza', fatherName: 'Raza Mehmood', class: 'Khasa Awwal', section: Section.Dars, rollNumber: 'D-202', dob: '2005-03-25', cnic: '35202-4567890-4', phone: '923131234567', parentPhone: '923137654321', address: '101, Model Town, Lahore', photoUrl: 'https://picsum.photos/seed/ali/200', admissionDate: '2022-04-05' },
];

const mockExams: ExamRecord[] = [
    { studentId: 101, examName: 'Mid-Term Exam', subject: 'Nahw', totalMarks: 100, obtainedMarks: 85, date: '2023-10-15' },
    { studentId: 101, examName: 'Mid-Term Exam', subject: 'Sarf', totalMarks: 100, obtainedMarks: 88, date: '2023-10-16' },
];

const teacherNotes = "Usman shows great potential in Fiqh but needs to focus more on his handwriting and presentation in assignments.";

const StudentProfile: React.FC<{ student: Student; onBack: () => void }> = ({ student, onBack }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-fade-in">
             <button onClick={onBack} className="text-primary-600 dark:text-primary-400 hover:underline mb-4">
                &larr; Back to Student List
            </button>
            <div className="flex flex-col md:flex-row items-start md:space-x-6">
                <img src={student.photoUrl} alt={student.name} className="w-32 h-32 rounded-full object-cover border-4 border-secondary-200 dark:border-secondary-800" />
                <div className="mt-4 md:mt-0">
                    <h2 className="text-2xl font-bold">{student.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">Roll No: {student.rollNumber} | Class: {student.class}</p>
                    <div className="flex items-center space-x-4 mt-2">
                        <WhatsAppButton phoneNumber={student.phone} label="Student WhatsApp" />
                        <WhatsAppButton phoneNumber={student.parentPhone} label="Parent WhatsApp" />
                    </div>
                </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Exam Records */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center"><FileText className="mr-2 text-secondary-500"/> Exam Records</h3>
                    <div className="space-y-2">
                        {mockExams.map(exam => (
                           <div key={`${exam.examName}-${exam.subject}`} className="text-sm p-2 bg-white dark:bg-gray-800 rounded">
                               <p className="font-bold">{exam.examName} ({exam.date})</p>
                               <p><strong>Subject:</strong> {exam.subject}</p>
                               <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 my-1">
                                  <div className="bg-secondary-500 h-2.5 rounded-full" style={{ width: `${(exam.obtainedMarks / exam.totalMarks) * 100}%` }}></div>
                               </div>
                               <p className="text-right font-semibold">{exam.obtainedMarks} / {exam.totalMarks}</p>
                           </div>
                       ))}
                    </div>
                    <button className="mt-4 w-full text-sm bg-secondary-500 text-white py-2 rounded-md hover:bg-secondary-600 flex items-center justify-center">
                        <Plus className="w-4 h-4 mr-1"/> Add Exam Record
                    </button>
                </div>
                
                {/* Teacher Notes */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center"><Edit3 className="mr-2 text-primary-500"/> Teacher Notes</h3>
                    <p className="text-sm p-3 bg-white dark:bg-gray-800 rounded italic text-gray-600 dark:text-gray-300">
                        "{teacherNotes}"
                    </p>
                    <button className="mt-4 w-full text-sm bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 flex items-center justify-center">
                        <Plus className="w-4 h-4 mr-1"/> Add/Edit Note
                    </button>
                </div>
            </div>
        </div>
    );
};

export const DarsNizamiSection: React.FC = () => {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false); // State for import modal

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleAddStudent = (newStudentData: Omit<Student, 'id' | 'photoUrl'> & { photoFile?: File }) => {
        const newStudent: Student = {
            ...newStudentData,
            id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 101,
            photoUrl: newStudentData.photoFile ? URL.createObjectURL(newStudentData.photoFile) : `https://picsum.photos/seed/${Date.now()}/200`,
        };
        setStudents(prevStudents => [newStudent, ...prevStudents]);
    };

    const handleImportStudents = (importedData: any[]) => {
        const newStudents: Student[] = importedData.map((row, index) => ({
            id: students.length + index + 1, // Simple ID generation
            name: row['Student Name'] || `Unknown Student ${index + 1}`,
            fatherName: row['Father Name'] || 'N/A',
            class: row['Class'] || DARS_E_NIZAMI_CLASSES[0],
            section: Section.Dars,
            rollNumber: row['Roll Number'] || `D-${students.length + index + 1}`,
            dob: row['Date of Birth'] || '2000-01-01',
            cnic: row['CNIC/B-Form'] || 'N/A',
            phone: row['Student Phone'] || 'N/A',
            parentPhone: row['Parent Phone'] || 'N/A',
            address: row['Address'] || 'N/A',
            photoUrl: row['Photo URL'] || `https://picsum.photos/seed/${Date.now() + index}/200`,
            admissionDate: row['Admission Date'] || new Date().toISOString().substring(0, 10),
        }));
        setStudents(prevStudents => [...newStudents, ...prevStudents]);
        setIsImportModalOpen(false);
    };

    const exportToExcel = () => {
        const dataToExport = students.map(student => ({
            'Student ID': student.id,
            'Student Name': student.name,
            'Father Name': student.fatherName,
            'Class': student.class,
            'Section': student.section,
            'Roll Number': student.rollNumber,
            'Date of Birth': student.dob,
            'CNIC/B-Form': student.cnic,
            'Student Phone': student.phone,
            'Parent Phone': student.parentPhone,
            'Address': student.address,
            'Admission Date': student.admissionDate,
            'Photo URL': student.photoUrl,
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Dars_e_Nizami_Students");
        XLSX.writeFile(wb, "Noor-ul-Masajid_Dars_e_Nizami_Students.xlsx");
    };


    if (selectedStudent) {
        return <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold">Dars-e-Nizami Students</h2>
                 <div className="flex items-center gap-2 w-full md:w-auto">
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
                    <button onClick={exportToExcel} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center">
                        <Download className="w-4 h-4 mr-2"/> Export
                    </button>
                    <button onClick={() => setIsImportModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                        <FileUp className="w-4 h-4 mr-2"/> Import
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                        <Plus className="w-4 h-4 mr-2"/> Add Student
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
            <AddStudentModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddStudent={handleAddStudent}
                section={Section.Dars}
            />
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImportStudents}
                templateColumns={[
                    { header: 'Student Name', key: 'Student Name' },
                    { header: 'Father Name', key: 'Father Name' },
                    { header: 'Class', key: 'Class' },
                    { header: 'Roll Number', key: 'Roll Number' },
                    { header: 'Date of Birth', key: 'Date of Birth' },
                    { header: 'CNIC/B-Form', key: 'CNIC/B-Form' },
                    { header: 'Student Phone', key: 'Student Phone' },
                    { header: 'Parent Phone', key: 'Parent Phone' },
                    { header: 'Address', key: 'Address' },
                    { header: 'Admission Date', key: 'Admission Date' },
                ]}
                title="Import Dars-e-Nizami Students"
            />
        </div>
    );
};