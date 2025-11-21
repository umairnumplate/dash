

import React, { useState, useRef } from 'react';
import { Admission, FeeItem, AdmissionStatus, DARS_E_NIZAMI_CLASSES } from '../types'; // Import DARS_E_NIZAMI_CLASSES
import { User, Phone, Home, FileText, Camera, Upload, Printer, DollarSign, Calendar, MessageCircle, Info } from 'lucide-react';
import ReactToPrint from 'react-to-print';
import { FeeReceipt } from './FeeReceipt';
import { InputField } from './common/InputField';
import { SelectField } from './common/SelectField';

interface AdmissionFormProps {
    onAddAdmission: (newAdmission: Admission) => void;
}

const initialFeeChecklist: FeeItem[] = [
    { id: 'adm_fee', name: 'Admission Fee', amount: 5000, paid: false, verified: false },
    { id: 'exam_fee', name: 'Examination Fee', amount: 2500, paid: false, verified: false },
    { id: 'reg_fee', name: 'Registration Fee', amount: 1000, paid: false, verified: false },
    { id: 'form_proc_fee', name: 'Form Processing Fee', amount: 500, paid: false, verified: false },
    // { id: 'late_fee', name: 'Late Fee', amount: 0, paid: false, verified: false }, // Can be added dynamically
    // { id: 'doc_ver_fee', name: 'Documents Verification Fee', amount: 700, paid: false, verified: false },
    // { id: 'other_fee', name: 'Other Fee', amount: 0, paid: false, verified: false },
];

const mockTeachers = [
    { id: 't1', name: 'Maulana Ahmed Ali' },
    { id: 't2', name: 'Ustadh Bilal Hussain' },
    { id: 't3', name: 'Mufti Usman Ghani' },
];

export const AdmissionForm: React.FC<AdmissionFormProps> = ({ onAddAdmission }) => {
    const [formData, setFormData] = useState<Omit<Admission, 'id' | 'photoUrl' | 'feeChecklist' | 'admissionStatus' | 'receiptImage'>>({
        fullName: '',
        fatherName: '',
        dob: '',
        cnic: '',
        studentPhone: '',
        parentPhone: '',
        address: '',
        classLevel: DARS_E_NIZAMI_CLASSES[0], // Default to first Dars class
        examCategory: '',
        previousAcademicDetails: '',
        teacherInCharge: '',
        admissionDate: new Date().toISOString().substring(0, 10),
    });
    const [feeChecklist, setFeeChecklist] = useState<FeeItem[]>(initialFeeChecklist);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [studentPhotoFile, setStudentPhotoFile] = useState<File | null>(null);
    const [receiptImageFile, setReceiptImageFile] = useState<File | null>(null);
    const [generatedReceipt, setGeneratedReceipt] = useState<Admission | null>(null); // For printing
    
    const receiptRef = useRef<HTMLDivElement>(null);
    
    // Correct way to use ReactToPrint with CDN import
    const { useReactToPrint } = (ReactToPrint as any).default || ReactToPrint;

    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
        onAfterPrint: () => {
             // Reset form after printing if needed
            setFormData({
                fullName: '', fatherName: '', dob: '', cnic: '', studentPhone: '', parentPhone: '', address: '',
                classLevel: DARS_E_NIZAMI_CLASSES[0], examCategory: '', previousAcademicDetails: '', teacherInCharge: '', admissionDate: new Date().toISOString().substring(0, 10),
            });
            setFeeChecklist(initialFeeChecklist);
            setPhotoPreview(null);
            setStudentPhotoFile(null);
            setReceiptImageFile(null);
            setGeneratedReceipt(null);
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'receiptImage') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (field === 'photo') {
                setStudentPhotoFile(file);
                setPhotoPreview(URL.createObjectURL(file));
            } else {
                setReceiptImageFile(file);
            }
        }
    };

    const handleFeeItemChange = (id: string, field: keyof FeeItem, value: any) => {
        setFeeChecklist(prev => 
            prev.map(item => item.id === id ? { ...item, [field]: value } : item)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simulate file upload to get a URL/base64 string
        let photoUrl: string | null = null;
        if (studentPhotoFile) {
            photoUrl = URL.createObjectURL(studentPhotoFile); // In a real app, this would be a backend upload
        }
        let receiptImageUrl: string | null = null;
        if (receiptImageFile) {
            receiptImageUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(receiptImageFile);
            });
        }

        const newAdmission: Admission = {
            id: Date.now(), // Simple unique ID
            ...formData,
            photoUrl: photoUrl,
            feeChecklist: feeChecklist,
            admissionStatus: 'Pending Review', // Default status
            receiptImage: receiptImageUrl,
        };
        
        onAddAdmission(newAdmission);
        setGeneratedReceipt(newAdmission); // Set for printing

        alert('Admission Submitted Successfully!');
        
        // Trigger print for the newly submitted admission
        // Use a small delay to ensure the state updates and the receiptRef is properly populated
        setTimeout(() => {
            handlePrint();
        }, 100);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Tanzim-ul-Madaris Admission Form</h2>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Photo Upload */}
                    <div className="md:col-span-1 flex flex-col items-center">
                        <div className="w-40 h-40 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Student" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <Camera className="w-16 h-16 text-gray-400" />
                            )}
                        </div>
                        <label htmlFor="photo" className="cursor-pointer mt-2 text-sm text-primary-600 hover:underline">
                            Upload Student Photo
                        </label>
                        <input id="photo" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} />
                    </div>

                    {/* Personal Details */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} icon={User} required />
                        <InputField label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleInputChange} icon={User} required />
                        <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} required />
                        <InputField label="CNIC / B-Form" name="cnic" value={formData.cnic} onChange={handleInputChange} icon={FileText} required />
                        <InputField label="Student Phone (WhatsApp)" name="studentPhone" value={formData.studentPhone} onChange={handleInputChange} icon={Phone} placeholder="923xxxxxxxxx" />
                        <InputField label="Parent Phone (WhatsApp)" name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} icon={Phone} placeholder="923xxxxxxxxx" required />
                        <InputField label="Admission Date" name="admissionDate" type="date" value={formData.admissionDate} onChange={handleInputChange} required />
                    </div>
                </div>
                 <div>
                    <InputField label="Home Address" name="address" value={formData.address} onChange={handleInputChange} icon={Home} required />
                 </div>
                <div className="pt-6 border-t dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Previous Academic Details</label>
                    <textarea
                        name="previousAcademicDetails"
                        value={formData.previousAcademicDetails}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Mention previous Madrasah, last class, etc."
                    ></textarea>
                </div>
                

                {/* Academic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t dark:border-gray-700">
                    <SelectField
                        label="Class/Level"
                        name="classLevel"
                        value={formData.classLevel}
                        onChange={handleInputChange}
                        required
                        options={[
                            { value: '', label: 'Select Class' },
                            ...DARS_E_NIZAMI_CLASSES.map(darsClass => ({ value: darsClass, label: darsClass }))
                        ]}
                    />
                    <SelectField
                        label="Exam Category"
                        name="examCategory"
                        value={formData.examCategory}
                        onChange={handleInputChange}
                        required
                        options={[
                            { value: '', label: 'Select Category' },
                            { value: 'Annual', label: 'Annual' },
                            { value: 'Supplementary', label: 'Supplementary' },
                            { value: 'Special', label: 'Special' },
                        ]}
                    />
                    <SelectField
                        label="Teacher-in-Charge"
                        name="teacherInCharge"
                        value={formData.teacherInCharge}
                        onChange={handleInputChange}
                        required
                        options={[
                            { value: '', label: 'Select Teacher' },
                            ...mockTeachers.map(t => ({ value: t.name, label: t.name }))
                        ]}
                    />
                </div>

                {/* Fee Checklist */}
                <div className="pt-6 border-t dark:border-gray-700 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center text-primary-700 dark:text-primary-300">
                        <DollarSign className="w-5 h-5 mr-2" /> Fee Checklist
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-3 py-2">Item</th>
                                    <th scope="col" className="px-3 py-2 text-right">Amount (PKR)</th>
                                    <th scope="col" className="px-3 py-2 text-center">Paid</th>
                                    <th scope="col" className="px-3 py-2">Payment Date</th>
                                    <th scope="col" className="px-3 py-2">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeChecklist.map(item => (
                                    <tr key={item.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">{item.name}</td>
                                        <td className="px-3 py-2 text-right">
                                            <input
                                                type="number"
                                                value={item.amount}
                                                onChange={(e) => handleFeeItemChange(item.id, 'amount', Number(e.target.value))}
                                                className="w-24 p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={item.paid}
                                                onChange={(e) => handleFeeItemChange(item.id, 'paid', e.target.checked)}
                                                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="date"
                                                value={item.dateOfPayment || ''}
                                                onChange={(e) => handleFeeItemChange(item.id, 'dateOfPayment', e.target.value)}
                                                disabled={!item.paid}
                                                className="w-32 p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-900"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="text"
                                                value={item.remarks || ''}
                                                onChange={(e) => handleFeeItemChange(item.id, 'remarks', e.target.value)}
                                                className="w-full p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                                placeholder="Remarks (optional)"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="pt-6 border-t dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
                    <label htmlFor="receiptImage" className="flex items-center cursor-pointer text-sm font-medium text-primary-600 hover:underline px-4 py-2 border border-primary-600 rounded-lg justify-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Receipt Proof
                    </label>
                    <input id="receiptImage" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'receiptImage')} />

                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 flex items-center justify-center">
                        <Printer className="w-5 h-5 mr-2" />
                        Submit & Print Receipt
                    </button>
                </div>
            </form>

            {/* Hidden component for printing */}
            <div style={{ display: 'none' }}>
                {generatedReceipt && <FeeReceipt admission={generatedReceipt} receiptRef={receiptRef} />}
            </div>
        </div>
    );
};