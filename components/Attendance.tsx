import React, { useState } from 'react';
import { Section, Student, AttendanceStatus } from '../types';
import { Download, Calendar, Users, BarChart } from 'lucide-react';

// FIX: Added missing 'fatherName' property to mock student data to match the Omit<Student, ...> type.
const mockStudents: Omit<Student, 'section' | 'dob' | 'cnic' | 'phone' | 'parentPhone' | 'address' | 'admissionDate' | 'photoUrl'>[] = [
    ...Array.from({ length: 15 }, (_, i) => ({ id: i + 1, name: `Abdullah Ahmed ${i+1}`, fatherName: `Ahmed Ali ${i+1}`, class: 'Hifz A', rollNumber: `H-10${i+1}` })),
    ...Array.from({ length: 15 }, (_, i) => ({ id: i + 101, name: `Usman Ghani ${i+1}`, fatherName: `Ghani Khan ${i+1}`, class: 'Darja Awwal', rollNumber: `D-20${i+1}` })),
];

type AttendanceMap = { [studentId: number]: AttendanceStatus };

const classes = ['Hifz A', 'Hifz B', 'Darja Awwal', 'Darja Saani'];

export const Attendance: React.FC = () => {
    const [selectedClass, setSelectedClass] = useState(classes[0]);
    const [attendance, setAttendance] = useState<AttendanceMap>({});

    const studentsInClass = mockStudents.filter(s => s.class === selectedClass);

    React.useEffect(() => {
        // Initialize attendance for the selected class
        const initialAttendance: AttendanceMap = {};
        studentsInClass.forEach(student => {
            initialAttendance[student.id] = AttendanceStatus.Present;
        });
        setAttendance(initialAttendance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedClass]);

    const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const markAll = (status: AttendanceStatus.Present | AttendanceStatus.Absent) => {
        const newAttendance: AttendanceMap = {};
        studentsInClass.forEach(student => {
            newAttendance[student.id] = status;
        });
        setAttendance(newAttendance);
    };

    const summary = Object.values(attendance).reduce((acc, status) => {
        if (status === AttendanceStatus.Present) acc.present++;
        else if (status === AttendanceStatus.Absent) acc.absent++;
        else acc.leave++;
        return acc;
    }, { present: 0, absent: 0, leave: 0 });

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
                        defaultValue={new Date().toISOString().substring(0, 10)}
                        className="p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => markAll(AttendanceStatus.Present)} className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">All Present</button>
                    <button onClick={() => markAll(AttendanceStatus.Absent)} className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">All Absent</button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center">
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
        </div>
    );
};
