

import React, { useState } from 'react';
import { X, User, Hash, Calendar, FileText, Phone, Camera, Plus } from 'lucide-react';
import { Student, Section, DARS_E_NIZAMI_CLASSES, HIFZ_CLASSES } from '../types'; // Import DARS_E_NIZAMI_CLASSES and HIFZ_CLASSES
import { InputField } from './common/InputField';

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddStudent: (student: Omit<Student, 'id' | 'photoUrl'> & { photoFile?: File }) => void; // Allow photoFile to be passed
    section: Section;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onAddStudent, section }) => {
    const getInitialState = () => ({
        name: '',
        fatherName: '',
        class: section === Section.Hifz ? HIFZ_CLASSES[0] : DARS_E_NIZAMI_CLASSES[0], // Default to first Hifz/Dars class
        rollNumber: '',
        dob: '',
        cnic: '',
        phone: '',
        parentPhone: '',
        address: '',
        admissionDate: new Date().toISOString().substring(0, 10),
    });
    
    const [formData, setFormData] = useState(getInitialState());
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null); // State to store the actual file

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);
            setPhotoPreview(previewUrl);
            setPhotoFile(file); // Store the file
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddStudent({ ...formData, section, photoFile }); // Pass the file
        // Reset form for next time
        setFormData(getInitialState());
        setPhotoPreview(null);
        setPhotoFile(null);
        onClose();
    };
    
    const handleClose = () => {
        setFormData(getInitialState());
        setPhotoPreview(null);
        setPhotoFile(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={handleClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h2 className="text-xl font-bold">Add New Student to {section}</h2>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex flex-col items-center space-y-2">
                         <div className="w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Student" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <Camera className="w-10 h-10 text-gray-400" />
                            )}
                        </div>
                        <label htmlFor="photo" className="cursor-pointer text-sm text-primary-600 hover:underline">
                            Upload Photo
                        </label>
                        <input id="photo" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} icon={User} required />
                        <InputField label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleInputChange} icon={User} required />
                        <div>
                             <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
                             <select name="class" id="class" value={formData.class} onChange={handleInputChange} required className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                {section === Section.Hifz ? (
                                    <>
                                        {HIFZ_CLASSES.map(hifzClass => (
                                            <option key={hifzClass} value={hifzClass}>{hifzClass}</option>
                                        ))}
                                    </>
                                ) : (
                                     <>
                                        {DARS_E_NIZAMI_CLASSES.map(darsClass => (
                                            <option key={darsClass} value={darsClass}>{darsClass}</option>
                                        ))}
                                     </>
                                )}
                             </select>
                        </div>
                        <InputField label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} icon={Hash} required />
                        <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} required />
                        <InputField label="CNIC / B-Form" name="cnic" value={formData.cnic} onChange={handleInputChange} icon={FileText} required />
                        <InputField label="Student Phone" name="phone" value={formData.phone} onChange={handleInputChange} icon={Phone} placeholder="923xxxxxxxxx" />
                        <InputField label="Parent Phone" name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} icon={Phone} placeholder="923xxxxxxxxx" required />
                        <InputField label="Admission Date" name="admissionDate" type="date" value={formData.admissionDate} onChange={handleInputChange} required />
                    </div>
                     <div>
                        <InputField label="Address" name="address" value={formData.address} onChange={handleInputChange} textarea rows={3} required />
                     </div>
                     <div className="pt-4 flex justify-end">
                        <button type="button" onClick={handleClose} className="px-4 py-2 mr-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center">
                            <Plus size={18} className="mr-1" />
                            Add Student
                        </button>
                     </div>
                </form>
            </div>
        </div>
    );
};