

import React, { useState } from 'react';
import { Admission, AdmissionStatus, DARS_E_NIZAMI_CLASSES, HIFZ_CLASSES } from '../types'; // Import DARS_E_NIZAMI_CLASSES and HIFZ_CLASSES
import { Search, Filter, Download, MessageCircle, ChevronRight, UserPlus, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

interface AdmissionListProps {
    admissions: Admission[];
    onViewDetails: (admission: Admission) => void;
}

const WhatsAppButton: React.FC<{ phoneNumber: string }> = ({ phoneNumber }) => {
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    if (!formattedNumber) return null; // Don't render if no number
    return (
        <a href={`https://wa.me/${formattedNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
            <MessageCircle className="w-4 h-4 mr-1" />
            WhatsApp
        </a>
    );
};

export const AdmissionList: React.FC<AdmissionListProps> = ({ admissions, onViewDetails }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    const classes = Array.from(new Set(admissions.map(a => a.classLevel))).sort();
    const allClassOptions = ['All', ...HIFZ_CLASSES, ...DARS_E_NIZAMI_CLASSES]; // Combine Hifz and Dars classes
    const statuses = Array.from(new Set(admissions.map(a => a.admissionStatus))).sort();

    const filteredAdmissions = admissions.filter(admission => {
        const matchesSearch = admission.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              admission.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              admission.cnic.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = filterClass === 'All' || admission.classLevel === filterClass;
        const matchesStatus = filterStatus === 'All' || admission.admissionStatus === filterStatus;
        return matchesSearch && matchesClass && matchesStatus;
    });

    const exportToExcel = () => {
        const dataToExport = filteredAdmissions.map(admission => {
            const totalFee = admission.feeChecklist.reduce((sum, item) => sum + item.amount, 0);
            const paidFee = admission.feeChecklist.reduce((sum, item) => sum + (item.paid ? item.amount : 0), 0);
            const feeStatus = paidFee === totalFee ? 'Paid' : (paidFee > 0 ? 'Partial' : 'Pending');

            return {
                'Admission ID': admission.id,
                'Student Name': admission.fullName,
                'Father Name': admission.fatherName,
                'Class Level': admission.classLevel,
                'CNIC/B-Form': admission.cnic,
                'Student Phone': admission.studentPhone,
                'Parent Phone': admission.parentPhone,
                'Admission Date': admission.admissionDate,
                'Admission Status': admission.admissionStatus,
                'Fee Status': feeStatus,
                'Total Fee (PKR)': totalFee,
                'Paid Fee (PKR)': paidFee,
                'Teacher In-Charge': admission.teacherInCharge,
            };
        });

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Admission_List");
        XLSX.writeFile(wb, "Noor-ul-Masajid_Admission_List.xlsx");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Admission Applications List</h2>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col md:flex-row flex-wrap items-center justify-between gap-4">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                    <input 
                        type="text"
                        placeholder="Search by name, CNIC..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <select
                        value={filterClass}
                        onChange={e => setFilterClass(e.target.value)}
                        className="p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {allClassOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="All">All Statuses</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <button onClick={exportToExcel} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center w-full md:w-auto justify-center">
                    <Download className="w-4 h-4 mr-2"/> Export to Excel
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student Name</th>
                                <th scope="col" className="px-6 py-3">Class/Level</th>
                                <th scope="col" className="px-6 py-3">Admission Status</th>
                                <th scope="col" className="px-6 py-3">Fee Status</th>
                                <th scope="col" className="px-6 py-3">Contact</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdmissions.map((admission) => {
                                const totalFee = admission.feeChecklist.reduce((sum, item) => sum + item.amount, 0);
                                const paidFee = admission.feeChecklist.reduce((sum, item) => sum + (item.paid ? item.amount : 0), 0);
                                const feeStatus = paidFee === totalFee ? 'Paid' : (paidFee > 0 ? 'Partial' : 'Pending');
                                const feeColor = feeStatus === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                 feeStatus === 'Partial' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                                 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                                const admissionStatusColor = admission.admissionStatus === 'Confirmed' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' :
                                                             admission.admissionStatus === 'Pending Review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                             'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';

                                return (
                                    <tr key={admission.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                                            {admission.photoUrl && <img src={admission.photoUrl} alt={admission.fullName} className="w-10 h-10 rounded-full object-cover mr-3" />}
                                            <div>
                                                <p>{admission.fullName}</p>
                                                <p className="text-xs text-gray-400">{admission.fatherName}</p>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">{admission.classLevel}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${admissionStatusColor}`}>
                                                {admission.admissionStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                             <span className={`px-2 py-1 text-xs font-medium rounded-full ${feeColor}`}>
                                                {feeStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <WhatsAppButton phoneNumber={admission.parentPhone} />
                                            {admission.studentPhone && <WhatsAppButton phoneNumber={admission.studentPhone} />}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => onViewDetails(admission)} className="font-medium text-primary-600 dark:text-primary-500 hover:underline flex items-center">
                                                View Details <ChevronRight size={16} className="ml-1"/>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredAdmissions.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No admissions found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
};