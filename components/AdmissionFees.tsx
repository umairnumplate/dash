

import React, { useState, useRef } from 'react';
import { Admission, FeeItem, AdmissionStatus, DARS_E_NIZAMI_CLASSES, HIFZ_CLASSES } from '../types'; // Import DARS_E_NIZAMI_CLASSES and HIFZ_CLASSES
import { Download, Search, Filter, Printer, CheckCircle, Upload, MessageCircle, DollarSign, Edit, FileUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import ReactToPrint from 'react-to-print';
import { FeeReceipt } from './FeeReceipt';
import { WhatsAppButton } from './common/WhatsAppButton';
import { ImportModal } from './ImportModal'; // Corrected import path


interface AdmissionFeesProps {
    admissions: Admission[];
    onUpdateAdmission: (updatedAdmission: Admission) => void;
}

export const AdmissionFees: React.FC<AdmissionFeesProps> = ({ admissions, onUpdateAdmission }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('All');
    const [filterFeeStatus, setFilterFeeStatus] = useState('All');
    const [filterPaymentDate, setFilterPaymentDate] = useState(''); // New state for payment date filter
    const [filterRemarkKeyword, setFilterRemarkKeyword] = useState(''); // New state for remark keyword filter
    const [selectedAdmissionForReceipt, setSelectedAdmissionForReceipt] = useState<Admission | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false); // State for import modal


    const receiptRef = useRef<HTMLDivElement>(null);
    const { useReactToPrint } = (ReactToPrint as any).default || ReactToPrint; // Correct way to use ReactToPrint with CDN import
    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
        onAfterPrint: () => setSelectedAdmissionForReceipt(null)
    });

    const classes = Array.from(new Set(admissions.map(a => a.classLevel))).sort();
    const allClassOptions = ['All', ...HIFZ_CLASSES, ...DARS_E_NIZAMI_CLASSES]; // Combine Hifz and Dars classes


    const filteredAdmissions = admissions.filter(admission => {
        const matchesSearch = admission.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              admission.fatherName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = filterClass === 'All' || admission.classLevel === filterClass;
        
        const totalFee = admission.feeChecklist.reduce((sum, item) => sum + item.amount, 0);
        const paidFee = admission.feeChecklist.reduce((sum, item) => sum + (item.paid ? item.amount : 0), 0);
        const currentFeeStatus = paidFee === totalFee ? 'Paid' : (paidFee > 0 ? 'Partial' : 'Pending');
        const matchesFeeStatus = filterFeeStatus === 'All' || currentFeeStatus === filterFeeStatus;

        // New filters: Payment Date and Remarks
        const matchesPaymentDate = filterPaymentDate === '' || admission.feeChecklist.some(
            item => item.dateOfPayment === filterPaymentDate && item.paid
        );
        const matchesRemarkKeyword = filterRemarkKeyword === '' || admission.feeChecklist.some(
            item => item.remarks?.toLowerCase().includes(filterRemarkKeyword.toLowerCase())
        );

        return matchesSearch && matchesClass && matchesFeeStatus && matchesPaymentDate && matchesRemarkKeyword;
    });

    const totalCollected = filteredAdmissions.reduce((sum, adm) => 
        sum + adm.feeChecklist.reduce((itemSum, item) => itemSum + (item.paid ? item.amount : 0), 0), 0
    );
    const totalPending = filteredAdmissions.reduce((sum, adm) => 
        sum + adm.feeChecklist.reduce((itemSum, item) => itemSum + (!item.paid ? item.amount : 0), 0), 0
    );

    const handleFeeItemUpdate = (admissionId: number, feeItemId: string, field: keyof FeeItem, value: any) => {
        const admissionToUpdate = admissions.find(adm => adm.id === admissionId);
        if (admissionToUpdate) {
            const updatedFeeChecklist = admissionToUpdate.feeChecklist.map(item =>
                item.id === feeItemId ? { ...item, [field]: value } : item
            );
            onUpdateAdmission({ ...admissionToUpdate, feeChecklist: updatedFeeChecklist });
        }
    };

    const handleMarkAllPaid = (admissionId: number) => {
        const admissionToUpdate = admissions.find(adm => adm.id === admissionId);
        if (admissionToUpdate) {
            const updatedFeeChecklist = admissionToUpdate.feeChecklist.map(item => ({
                ...item,
                paid: true,
                dateOfPayment: item.dateOfPayment || new Date().toISOString().substring(0, 10)
            }));
            onUpdateAdmission({ ...admissionToUpdate, feeChecklist: updatedFeeChecklist });
        }
    };

    const handleGenerateReceipt = (admission: Admission) => {
        setSelectedAdmissionForReceipt(admission);
        setTimeout(() => {
            handlePrint();
        }, 100);
    };

    const handleImportFeeUpdates = (importedData: any[]) => {
        importedData.forEach(row => {
            const admissionId = Number(row['Admission ID']);
            const feeItemName = row['Fee Item'];
            const paidStatus = String(row['Paid']).toLowerCase() === 'yes';
            const paymentDate = row['Payment Date'];
            const remarks = row['Remarks'];

            const admissionToUpdate = admissions.find(adm => adm.id === admissionId);
            if (admissionToUpdate) {
                const updatedFeeChecklist = admissionToUpdate.feeChecklist.map(item => {
                    if (item.name === feeItemName) {
                        return {
                            ...item,
                            paid: paidStatus,
                            dateOfPayment: paymentDate || item.dateOfPayment,
                            remarks: remarks || item.remarks,
                            // Assume verified if paid via import, or add a 'Verified' column
                            verified: paidStatus || item.verified,
                        };
                    }
                    return item;
                });
                onUpdateAdmission({ ...admissionToUpdate, feeChecklist: updatedFeeChecklist });
            }
        });
        setIsImportModalOpen(false);
    };

    const exportFeeDataToExcel = () => {
        const dataToExport = filteredAdmissions.flatMap(admission => {
            return admission.feeChecklist.map(item => ({
                'Admission ID': admission.id,
                'Student Name': admission.fullName,
                'Father Name': admission.fatherName,
                'Class Level': admission.classLevel,
                'Fee Item': item.name,
                'Amount (PKR)': item.amount,
                'Paid': item.paid ? 'Yes' : 'No',
                'Payment Date': item.dateOfPayment || 'N/A',
                'Verified': item.verified ? 'Yes' : 'No',
                'Remarks': item.remarks || '',
            }));
        });

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Admission_Fees_Report");
        XLSX.writeFile(wb, "Noor-ul-Masajid_Admission_Fees_Report.xlsx");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Admission Fees Section</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Collected</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">PKR {totalCollected.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Pending</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">PKR {totalPending.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Admissions</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{filteredAdmissions.length}</p>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col md:flex-row flex-wrap items-center justify-between gap-4">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                    <input 
                        type="text"
                        placeholder="Search student name..."
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
                        value={filterFeeStatus}
                        onChange={e => setFilterFeeStatus(e.target.value)}
                        className="p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="All">All Fee Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Pending">Pending</option>
                    </select>
                    <input
                        type="date"
                        value={filterPaymentDate}
                        onChange={e => setFilterPaymentDate(e.target.value)}
                        className="p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Filter by Payment Date"
                        title="Filter by Payment Date"
                    />
                    <input
                        type="text"
                        value={filterRemarkKeyword}
                        onChange={e => setFilterRemarkKeyword(e.target.value)}
                        className="p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Search remarks"
                        title="Search remarks"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button onClick={() => setIsImportModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center w-full md:w-auto justify-center">
                        <FileUp className="w-4 h-4 mr-2"/> Import
                    </button>
                    <button onClick={exportFeeDataToExcel} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center w-full md:w-auto justify-center">
                        <Download className="w-4 h-4 mr-2"/> Export Fee Data
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
                                <th scope="col" className="px-6 py-3">Fee Status</th>
                                <th scope="col" className="px-6 py-3">Total / Paid (PKR)</th>
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
                                return (
                                    <tr key={admission.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {admission.fullName} <br/>
                                            <span className="text-xs text-gray-400">{admission.fatherName}</span>
                                        </th>
                                        <td className="px-6 py-4">{admission.classLevel}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${feeColor}`}>
                                                {feeStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{totalFee.toLocaleString()} / {paidFee.toLocaleString()}</td>
                                        <td className="px-6 py-4 flex items-center space-x-2">
                                            <button 
                                                onClick={() => handleGenerateReceipt(admission)}
                                                className="text-primary-600 dark:text-primary-400 hover:underline flex items-center text-sm"
                                                title="Generate/Print Receipt"
                                            >
                                                <Printer className="w-4 h-4 mr-1"/>
                                            </button>
                                            <button 
                                                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm"
                                                title="Edit Fee Details"
                                            >
                                                <Edit className="w-4 h-4 mr-1"/>
                                            </button>
                                            <WhatsAppButton phoneNumber={admission.parentPhone} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredAdmissions.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No fee records found matching your criteria.
                    </div>
                )}
            </div>

            {/* Detailed Fee Checklist View/Edit (Modal or Expandable Row - for now, simpler inline edit) */}
            {/* Hidden component for printing */}
            <div style={{ display: 'none' }}>
                {selectedAdmissionForReceipt && <FeeReceipt admission={selectedAdmissionForReceipt} receiptRef={receiptRef} />}
            </div>
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImportFeeUpdates}
                templateColumns={[
                    { header: 'Admission ID', key: 'Admission ID' },
                    { header: 'Fee Item', key: 'Fee Item' },
                    { header: 'Paid', key: 'Paid' }, // Expected: Yes/No
                    { header: 'Payment Date', key: 'Payment Date', required: false },
                    { header: 'Remarks', key: 'Remarks', required: false },
                ]}
                title="Import Fee Updates"
            />
        </div>
    );
};