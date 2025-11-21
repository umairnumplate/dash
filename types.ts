

export enum Section {
    Hifz = "Hifz-ul-Quran",
    Dars = "Dars-e-Nizami",
}

export enum AttendanceStatus {
    Present = "Present",
    Absent = "Absent",
    Leave = "Leave",
}

export const DARS_E_NIZAMI_CLASSES = [
    'Mutawassitah',
    'Ama Awwal',
    'Ama Dom',
    'Khasa Awwal',
    'Khasa Dom',
    'Aliyah Awwal',
    'Aliyah Dom',
    'Alamiyah Awwal',
    'Alamiyah Dom',
];

export const HIFZ_CLASSES = [
    'Hifz A',
    'Hifz B',
    'Hifz C',
];

export interface Student {
    id: number;
    name: string;
    fatherName: string;
    class: string;
    section: Section;
    rollNumber: string;
    dob: string;
    cnic: string;
    phone: string;
    parentPhone: string;
    address: string;
    photoUrl: string;
    admissionDate: string;
}

export interface HifzLog {
    date: string;
    sabaq: string; // e.g., "Al-Baqarah 1-5"
    sabqi: string; // e.g., "An-Nisa 20-25"
    manzil: string; // e.g., "Juz 1"
}

export interface AttendanceRecord {
    studentId: number;
    date: string;
    status: AttendanceStatus;
}

// New interface for AttendanceMap
export interface AttendanceMap {
    [studentId: number]: AttendanceStatus;
}

export interface ExamRecord {
    studentId: number;
    examName: string;
    subject: string;
    totalMarks: number;
    obtainedMarks: number;
    date: string;
}

export interface Teacher {
    id: number;
    name: string;
    phone: string;
    subject: string;
    section: Section;
}

export interface Graduate {
    id: number;
    studentName: string;
    section: Section;
    completionYear: number;
    certificateUrl?: string;
}

export interface FeeItem {
    id: string;
    name: string;
    amount: number;
    paid: boolean;
    dateOfPayment?: string;
    remarks?: string;
    verified: boolean;
}

export type AdmissionStatus = 'Pending Review' | 'Confirmed' | 'Rejected';

export interface Admission {
    id: number;
    photoUrl: string | null; // Base64 or URL
    fullName: string;
    fatherName: string;
    dob: string;
    cnic: string;
    studentPhone: string; // Renamed from 'phone' to avoid confusion with parentPhone
    parentPhone: string;
    address: string;
    classLevel: string;
    examCategory: string; // From original prompt
    previousAcademicDetails: string;
    teacherInCharge: string;
    admissionDate: string;
    feeChecklist: FeeItem[];
    admissionStatus: AdmissionStatus;
    receiptImage: string | null; // Base64 for uploaded receipt image
}

export type ColumnMapping = {
    excelColumn: string;
    appField: string;
    required: boolean;
    transform?: (value: any) => any; // Optional transformation function
};

export interface ImportResult {
    totalRows: number;
    newRecordsAdded: number;
    recordsUpdated: number;
    errors: { row: number; message: string }[];
}