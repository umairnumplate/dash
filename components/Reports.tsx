
import React, { useState } from 'react';
import { Send, User, FileText, BarChart3, Paperclip, MessageCircle } from 'lucide-react';
import { Student, Section } from '../types';

const mockStudents: Pick<Student, 'id' | 'name' | 'class' | 'parentPhone'>[] = [
    { id: 1, name: 'Abdullah Ahmed', class: 'Hifz A', parentPhone: '923007654321' },
    { id: 2, name: 'Bilal Khan', class: 'Hifz B', parentPhone: '923217654321' },
    { id: 101, name: 'Usman Ghani', class: 'Darja Awwal', parentPhone: '923337654321' },
    { id: 102, name: 'Ali Raza', class: 'Darja Saani', parentPhone: '923137654321' },
];

const reportTypes = [
    { id: 'attendance', name: 'Attendance Report', icon: User },
    { id: 'exam', name: 'Exam Result Report', icon: FileText },
    { id: 'performance', name: 'Hifz Performance Report', icon: BarChart3 },
];

export const Reports: React.FC = () => {
    const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
    const [selectedReportType, setSelectedReportType] = useState(reportTypes[0].id);
    const [customMessage, setCustomMessage] = useState('');
    const [attachmentName, setAttachmentName] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachmentName(e.target.files[0].name);
        }
    };
    
    const handleSendReport = () => {
        if (!selectedStudentId) {
            alert('Please select a student.');
            return;
        }
        const student = mockStudents.find(s => s.id === selectedStudentId);
        const report = reportTypes.find(r => r.id === selectedReportType);
        
        if (student && report) {
            let message = `Assalam-o-Alaikum,\n\nPlease find the ${report.name} for your child, ${student.name} (Class: ${student.class}).`;
            if (customMessage) {
                message += `\n\nTeacher's Note:\n${customMessage}`;
            }
             message += `\n\nRegards,\nNoor-ul-Masajid Education System`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${student.parentPhone.replace(/\D/g, '')}?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Student Report Sending System</h2>
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6">
                
                {/* Step 1: Select Student */}
                <div>
                    <label className="text-lg font-semibold flex items-center mb-2">
                        <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                        Select Student
                    </label>
                    <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                        className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    >
                        <option value="">-- Choose a student --</option>
                        {mockStudents.map(s => (
                            <option key={s.id} value={s.id}>{s.name} - {s.class}</option>
                        ))}
                    </select>
                </div>
                
                {/* Step 2: Select Report Type */}
                <div>
                    <label className="text-lg font-semibold flex items-center mb-2">
                         <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                        Select Report Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {reportTypes.map(report => (
                            <button
                                key={report.id}
                                onClick={() => setSelectedReportType(report.id)}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all ${
                                    selectedReportType === report.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50' : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                <report.icon className={`w-8 h-8 ${selectedReportType === report.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'}`} />
                                <span className="text-sm font-medium">{report.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 3: Add Note & Attachment */}
                 <div>
                    <label className="text-lg font-semibold flex items-center mb-2">
                         <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                        Optional: Add Note & Attachment
                    </label>
                    <div className="space-y-4">
                        <textarea
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            rows={3}
                            placeholder="Add a custom message for the parent..."
                            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        />
                         <label htmlFor="attachment" className="w-full flex items-center justify-center p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Paperclip className="w-5 h-5 mr-2 text-gray-400"/>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{attachmentName || 'Attach File/Image (Optional)'}</span>
                            </label>
                        <input id="attachment" type="file" className="hidden" onChange={handleFileChange}/>
                    </div>
                 </div>

                <div className="pt-6 border-t dark:border-gray-700 flex justify-end">
                    <button onClick={handleSendReport} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center text-lg">
                        <MessageCircle className="w-5 h-5 mr-2"/>
                        Send Report to Parent's WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};
