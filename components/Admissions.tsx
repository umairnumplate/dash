
import React, { useState } from 'react';
import { Admission } from '../types';
import { FilePlus, List, DollarSign } from 'lucide-react';
import { AdmissionForm } from './AdmissionForm';
import { AdmissionList } from './AdmissionList';
import { AdmissionFees } from './AdmissionFees';
import { FeeReceipt } from './FeeReceipt'; // Import for type safety, though rendered by form/fees

type AdmissionSubPage = 'Form' | 'List' | 'Fees';

const initialAdmissions: Admission[] = [
    {
        id: 1,
        photoUrl: 'https://picsum.photos/seed/admission1/200',
        fullName: 'Aisha Khan',
        fatherName: 'Dr. Zafar Khan',
        dob: '2008-01-20',
        cnic: '35202-9876543-1',
        studentPhone: '923011122334',
        parentPhone: '923011122335',
        address: 'House 5, Street 10, Garden Town, Lahore',
        classLevel: 'Mutawassitah', // Updated class name
        examCategory: 'Annual',
        previousAcademicDetails: 'Completed Primary Hifz from XYZ Madrasah.',
        teacherInCharge: 'Maulana Ahmed Ali',
        admissionDate: '2024-03-01',
        feeChecklist: [
            { id: 'adm_fee', name: 'Admission Fee', amount: 5000, paid: true, dateOfPayment: '2024-03-01', verified: true },
            { id: 'exam_fee', name: 'Examination Fee', amount: 2500, paid: true, dateOfPayment: '2024-03-01', verified: true },
            { id: 'reg_fee', name: 'Registration Fee', amount: 1000, paid: false, verified: false },
            { id: 'form_proc_fee', name: 'Form Processing Fee', amount: 500, paid: true, dateOfPayment: '2024-03-01', verified: true },
        ],
        admissionStatus: 'Confirmed',
        receiptImage: null,
    },
    {
        id: 2,
        photoUrl: 'https://picsum.photos/seed/admission2/200',
        fullName: 'Usama Tariq',
        fatherName: 'Tariq Mehmood',
        dob: '2007-06-15',
        cnic: '35202-8765432-1',
        studentPhone: '923022233445',
        parentPhone: '923022233446',
        address: 'Flat 12, Block A, Green Towers, Karachi',
        classLevel: 'Ama Awwal', // Updated class name
        examCategory: 'Annual',
        previousAcademicDetails: 'Completed Darja Awwal from Jamia Zia-ul-Quran.',
        teacherInCharge: 'Ustadh Bilal Hussain',
        admissionDate: '2024-03-10',
        feeChecklist: [
            { id: 'adm_fee', name: 'Admission Fee', amount: 5000, paid: true, dateOfPayment: '2024-03-10', verified: true },
            { id: 'exam_fee', name: 'Examination Fee', amount: 2500, paid: false, verified: false },
            { id: 'reg_fee', name: 'Registration Fee', amount: 1000, paid: false, verified: false },
            { id: 'form_proc_fee', name: 'Form Processing Fee', amount: 500, paid: false, verified: false },
        ],
        admissionStatus: 'Pending Review',
        receiptImage: null,
    }
];

export const Admissions: React.FC = () => {
    const [currentSubPage, setCurrentSubPage] = useState<AdmissionSubPage>('List');
    const [allAdmissions, setAllAdmissions] = useState<Admission[]>(initialAdmissions);
    const [admissionToView, setAdmissionToView] = useState<Admission | null>(null);

    const handleAddAdmission = (newAdmission: Admission) => {
        setAllAdmissions(prev => [newAdmission, ...prev]);
        setCurrentSubPage('List'); // Go to list after adding
    };

    const handleUpdateAdmission = (updatedAdmission: Admission) => {
        setAllAdmissions(prev => prev.map(adm => adm.id === updatedAdmission.id ? updatedAdmission : adm));
        if (admissionToView && admissionToView.id === updatedAdmission.id) {
            setAdmissionToView(updatedAdmission); // Update if currently viewing
        }
    };

    const renderSubPage = () => {
        if (admissionToView) {
            // Placeholder for a detailed view/edit component for a single admission
            // For now, we'll just show its JSON. In a real app, this would be a dedicated component.
            return (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <button onClick={() => setAdmissionToView(null)} className="text-primary-600 dark:text-primary-400 hover:underline mb-4">
                        &larr; Back to Admissions List
                    </button>
                    <h3 className="text-xl font-bold mb-4">Admission Details for {admissionToView.fullName}</h3>
                    <pre className="whitespace-pre-wrap text-sm dark:text-gray-300">
                        {JSON.stringify(admissionToView, null, 2)}
                    </pre>
                     <div className="mt-4">
                        <h4 className="font-semibold mb-2">Generate/Print Receipt:</h4>
                         <FeeReceipt admission={admissionToView} receiptRef={React.useRef<HTMLDivElement>(null)}/>
                     </div>
                </div>
            );
        }

        switch (currentSubPage) {
            case 'Form':
                return <AdmissionForm onAddAdmission={handleAddAdmission} />;
            case 'List':
                return <AdmissionList admissions={allAdmissions} onViewDetails={setAdmissionToView} />;
            case 'Fees':
                return <AdmissionFees admissions={allAdmissions} onUpdateAdmission={handleUpdateAdmission} />;
            default:
                return <AdmissionList admissions={allAdmissions} onViewDetails={setAdmissionToView} />;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Tanzim-ul-Madaris Admissions – Noor-ul-Masajid</h2>
            
            <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-md flex space-x-2">
                <TabButton
                    label="Admission Form"
                    icon={FilePlus}
                    isActive={currentSubPage === 'Form'}
                    onClick={() => {setCurrentSubPage('Form'); setAdmissionToView(null);}}
                />
                <TabButton
                    label="Admission List"
                    icon={List}
                    isActive={currentSubPage === 'List'}
                    onClick={() => {setCurrentSubPage('List'); setAdmissionToView(null);}}
                />
                <TabButton
                    label="Admission Fees"
                    icon={DollarSign}
                    isActive={currentSubPage === 'Fees'}
                    onClick={() => {setCurrentSubPage('Fees'); setAdmissionToView(null);}}
                />
            </div>

            <div className="mt-6">
                {renderSubPage()}
            </div>
        </div>
    );
};

interface TabButtonProps {
    label: string;
    icon: React.ElementType;
    isActive: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
            ${isActive
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
    >
        <Icon className="mr-2 h-4 w-4" />
        {label}
    </button>
);