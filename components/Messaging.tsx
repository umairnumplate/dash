
import React, { useState } from 'react';
import { MessageSquare, Users, BookOpen, Send, FileUp, GraduationCap } from 'lucide-react';

const classes = ['All Students', 'Hifz - All', 'Hifz A', 'Hifz B', 'Dars-e-Nizami - All', 'Darja Awwal', 'Darja Saani'];

export const Messaging: React.FC = () => {
    const [message, setMessage] = useState('');
    const [selectedClass, setSelectedClass] = useState(classes[0]);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };
    
    const handleSend = () => {
        if (!message) {
            alert('Please enter a message to send.');
            return;
        }
        // This is a simulation. In a real app, this would trigger a backend process.
        alert(`Simulating sending message to ${selectedClass}:\n\n"${message}"\n\n(Imported file: ${fileName || 'None'})`);
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Bulk Messaging</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Message Composer */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <MessageSquare className="mr-2 text-primary-500" />
                            Compose Message
                        </h3>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={8}
                            placeholder="Type your message here..."
                            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    {/* Audience & Sending */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <Users className="mr-2 text-secondary-500" />
                            Select Audience
                        </h3>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {classes.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        
                        <div className="pt-4 border-t dark:border-gray-700">
                             <h3 className="text-lg font-semibold flex items-center mb-2">
                                <FileUp className="mr-2 text-gray-500" />
                                Import from Excel
                            </h3>
                            <label htmlFor="excel-import" className="w-full flex items-center justify-center p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                <FileUp className="w-5 h-5 mr-2 text-gray-400"/>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{fileName || 'Click to upload numbers'}</span>
                            </label>
                            <input id="excel-import" type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileChange}/>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t dark:border-gray-700 flex justify-end">
                    <button onClick={handleSend} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center">
                        <Send className="w-4 h-4 mr-2"/>
                        Send via WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};
