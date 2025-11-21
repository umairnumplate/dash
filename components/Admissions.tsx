import React, { useState, useRef } from 'react';
import { AdmissionData } from '../types';
import { User, Phone, Home, FileText, Camera, Upload, Printer } from 'lucide-react';
import ReactToPrint from 'react-to-print';

const FeeReceipt: React.FC<{ data: AdmissionData, receiptRef: React.RefObject<HTMLDivElement> }> = ({ data, receiptRef }) => {
    return (
        <div ref={receiptRef} className="p-8 font-sans text-black bg-white">
            <div className="text-center border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold">Noor-ul-Masajid Education System</h1>
                <p className="text-lg">Tanzim-ul-Madaris Admission Fee Receipt</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4">
                <div><strong className="font-semibold">Receipt No:</strong> {Math.floor(1000 + Math.random() * 9000)}</div>
                <div><strong className="font-semibold">Date:</strong> {new Date().toLocaleDateString()}</div>
                <div><strong className="font-semibold">Student Name:</strong> {data.fullName}</div>
                <div><strong className="font-semibold">Father's Name:</strong> {data.fatherName}</div>
                <div><strong className="font-semibold">Class/Level:</strong> {data.classLevel}</div>
                <div><strong className="font-semibold">Exam Category:</strong> {data.examCategory}</div>
            </div>
            <div className="mt-8">
                <table className="w-full border-collapse border border-black">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-black p-2 text-left">Description</th>
                            <th className="border border-black p-2 text-right">Amount (PKR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black p-2">Admission Fee</td>
                            <td className="border border-black p-2 text-right">5,000.00</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-2">Exam Fee</td>
                            <td className="border border-black p-2 text-right">2,500.00</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr className="font-bold">
                            <td className="border border-black p-2 text-right">Total</td>
                            <td className="border border-black p-2 text-right">7,500.00</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="mt-12 text-center text-sm">
                <p>This is a computer-generated receipt and does not require a signature.</p>
                <p>&copy; Noor-ul-Masajid Education System</p>
            </div>
        </div>
    );
};


export const Admissions: React.FC = () => {
    const [formData, setFormData] = useState<AdmissionData>({
        fullName: '', fatherName: '', dob: '', cnic: '', parentPhone: '', address: '', classLevel: '', examCategory: '', feeSubmitted: false,
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const receiptRef = useRef<HTMLDivElement>(null);
    
    const handlePrint = ReactToPrint.useReactToPrint({
        content: () => receiptRef.current,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'receiptImage') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, [field]: file }));
            if (field === 'photo') {
                setPhotoPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Admission Data:', formData);
        alert('Admission Submitted Successfully!');
        if(formData.feeSubmitted){
            handlePrint();
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Tanzim-ul-Madaris Admissions</h2>
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
                            Upload Photo
                        </label>
                        <input id="photo" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} />
                    </div>

                    {/* Personal Details */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} icon={User} required />
                        <InputField label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleInputChange} icon={User} required />
                        <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} required />
                        <InputField label="CNIC / B-Form" name="cnic" value={formData.cnic} onChange={handleInputChange} icon={FileText} required />
                        <InputField label="Parent's Phone" name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} icon={Phone} required />
                        <InputField label="Home Address" name="address" value={formData.address} onChange={handleInputChange} icon={Home} required />
                    </div>
                </div>

                {/* Academic & Fee Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t dark:border-gray-700">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class/Level</label>
                        <select name="classLevel" value={formData.classLevel} onChange={handleInputChange} required className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                            <option value="">Select Class</option>
                            <option>Darja Awwal</option>
                            <option>Darja Saani</option>
                            <option>Darja Salisa</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Category</label>
                        <select name="examCategory" value={formData.examCategory} onChange={handleInputChange} required className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                            <option value="">Select Category</option>
                            <option>Annual</option>
                            <option>Supplementary</option>
                        </select>
                    </div>
                     <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center">
                            <input
                                id="feeSubmitted"
                                name="feeSubmitted"
                                type="checkbox"
                                checked={formData.feeSubmitted}
                                onChange={e => setFormData(p => ({...p, feeSubmitted: e.target.checked}))}
                                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label htmlFor="feeSubmitted" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                                Fees Submitted
                            </label>
                        </div>
                        {formData.feeSubmitted && (
                             <div className="pl-6">
                                <label htmlFor="receiptImage" className="flex items-center cursor-pointer text-sm text-primary-600 hover:underline">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Image of Receipt
                                </label>
                                <input id="receiptImage" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'receiptImage')} />
                             </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t dark:border-gray-700">
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700">
                        Submit Admission & Print Receipt
                    </button>
                </div>
            </form>
            <div style={{ display: 'none' }}>
                <FeeReceipt data={formData} receiptRef={receiptRef} />
            </div>
        </div>
    );
};

const InputField: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon?: React.ElementType, type?: string, required?: boolean }> = 
({ label, name, value, onChange, icon: Icon, type = 'text', required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
        </div>
    </div>
);