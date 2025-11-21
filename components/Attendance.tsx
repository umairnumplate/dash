
import React, { useState } from 'react';
// Import AttendanceMap from types.ts
import { Section, Student, AttendanceStatus, DARS_E_NIZAMI_CLASSES, HIFZ_CLASSES, AttendanceMap } from '../types'; // Import DARS_E_NIZAMI_CLASSES, HIFZ_CLASSES, and AttendanceMap
import { Download, Calendar, Users, BarChart, FileUp } from 'lucide-react';
import { ImportModal } from './ImportModal'; // Corrected import path
import * as XLSX from 'xlsx'; // Import xlsx library

// Helper to generate mock students for a given set of classes
const generateMockStudents = (classNames: string[], sectionPrefix: string, startId: number, countPerClass: number) => {
    let students: Omit<Student, 'section' | 'dob' | 'cnic' | 'phone' | 'parentPhone' | 'address' | 'admissionDate' | 'photoUrl'>[] = [];
    classNames.forEach((className, classIndex) => {
        for (let i = 0; i < countPerClass; i++) {
            const id = startId + (classIndex * countPerClass) + i + 1;
            students.push({
                id: id,
                name: `${className} Student ${i + 1}`,
                fatherName: `Parent ${id}`,
                class: className,
                rollNumber: `${sectionPrefix}-${(classIndex + 1)}${String(i + 1).padStart(2, '0')}`
            });
        }
    });
    return students;
};

// Generate all mock students for Hifz and Dars-e-Nizami
const mockStudents: Omit<Student, 'section' | 'dob' | 'cnic' | 'phone' | 'parentPhone' | 'address' | 'admissionDate' | 'photoUrl'>[] = [
    ...generateMockStudents(HIFZ_CLASSES, 'H', 1, 15), // 15 students per Hifz class
    ...generateMockStudents(DARS_E_NIZAMI_CLASSES, 'D', 1000, 10), // 10 students per Dars-e-Nizami class
];

// Combine all classes for the dropdown
const classes = [...HIFZ_CLASSES, ...DARS_E_NIZAMI_CLASSES];

export const Attendance: React.FC = () => {
    const [selectedClass, setSelectedClass] = useState(classes[0]);
    // Use AttendanceMap type for the attendance state
    const [attendance, setAttendance] = useState<AttendanceMap>({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
    const [isImportModalOpen, setIsImportModalOpen] = useState(false); // State for import modal

    const studentsInClass = mockStudents.filter(s => s.class === selectedClass);

    React.useEffect(() => {
        // Initialize attendance for the selected class
        // Use AttendanceMap type for initialAttendance
        const initialAttendance: AttendanceMap = {};
        studentsInClass.forEach(student => {
            initialAttendance[student.id] = AttendanceStatus.Present;
        });
        setAttendance(initialAttendance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedClass, selectedDate]); // Added selectedDate to dependency array

    const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const markAll = (status: AttendanceStatus.Present | AttendanceStatus.Absent) => {
        // Use AttendanceMap type for newAttendance
        const newAttendance: AttendanceMap = {};
        studentsInClass.forEach(student => {
            newAttendance[student.id] = status;
        });
        setAttendance(newAttendance);
    };

    // Explicitly type the summary object
    const summary: { present: number; absent: number; leave: number } = Object.values(attendance).reduce((acc, status) => {
        if (status === AttendanceStatus.Present) acc.present++;
        else if (status === AttendanceStatus.Absent) acc.absent++;
        else acc.leave++;
        return acc;
    }, { present: 0, absent: 0, leave: 0 }); // Initialize with correct type

    const handleImportAttendance = (importedData: any[]) => {
        // Use AttendanceMap type for newAttendanceRecords
        const newAttendanceRecords: AttendanceMap = {};
        importedData.forEach((row) => {
            const student = mockStudents.find(s => s.rollNumber === row['Roll Number']);
            if (student && row['Status']) {
                const status = row['Status'] as AttendanceStatus;
                if (Object.values(AttendanceStatus).includes(status)) {
                    newAttendanceRecords[student.id] = status;
                }
            }
        });
        setAttendance(prev => ({ ...prev, ...newAttendanceRecords }));
        setIsImportModalOpen(false);
    };

    const exportToExcel = () => {
        const dataToExport = studentsInClass.map(student => ({
            'Date': selectedDate,
            'Class': student.class,
            'Roll Number': student.rollNumber,
            'Student Name': student.name,
            'Status': attendance[student.id] || AttendanceStatus.Absent, // Default to Absent if not marked
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Attendance_${selectedClass}_${selectedDate}`);
        XLSX.writeFile(wb, `Noor-ul-Masajid_Attendance_${selectedClass}_${selectedDate}.xlsx`);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Take Attendance</h2>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => markAll(AttendanceStatus.Present)} className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">All Present</button>
                    <button onClick={() => markAll(AttendanceStatus.Absent)} className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">All Absent</button>
                    <button onClick={() => setIsImportModalOpen(true)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                        <FileUp className="w-4 h-4 mr-2"/> Import
                    </button>
                    <button onClick={exportToExcel} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center">
                        <Download className="w-4 h-4 mr-2"/> Export
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                 <div className="flex justify-around p-4 mb-4 border-b dark:border-gray-700">
                    <div className="text-center"><p className="text-2xl font-bold text-green-500">{summary.present}</p><p className="text-sm text-gray-500">Present</p></div>
                    <div className="text-center"><p className="text-2xl font-bold text-red-500">{summary.absent}</p><p className="text-sm text-gray-500">Absent</p></div>
                    <div className="text-center"><p className="text-2xl font-bold text-yellow-500">{summary.leave}</p><p className="text-sm text-gray-500">Leave</p></div>
                    <div className="text-center"><p className="text-2xl font-bold">{studentsInClass.length}</p><p className="text-sm text-gray-500">Total</p></div>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Roll #</th>
                                <th className="px-6 py-3">Student Name</th>
                                <th className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsInClass.map(student => (
                                <tr key={student.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{student.rollNumber}</td>
                                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{student.name}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex justify-center space-x-1">
                                            {[AttendanceStatus.Present, AttendanceStatus.Absent, AttendanceStatus.Leave].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusChange(student.id, status)}
                                                    className={`w-1/3 py-1.5 text-xs font-semibold rounded-md transition-colors
                                                        ${attendance[student.id] === status ? 
                                                            (status === AttendanceStatus.Present ? 'bg-green-500 text-white' : 
                                                            status === AttendanceStatus.Absent ? 'bg-red-500 text-white' : 
                                                            'bg-yellow-500 text-white') : 
                                                            'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'}`}
                                                >
                                                    {status.charAt(0)}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
                 <div className="mt-6 flex justify-end">
                    <button className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700">Save Attendance</button>
                 </div>
            </div>
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImportAttendance}
                templateColumns={[
                    { header: 'Roll Number', key: 'Roll Number' },
                    { header: 'Status', key: 'Status' }, // Expected values: Present, Absent, Leave
                ]}
                title="Import Attendance"
            />
        </div>
    );
};