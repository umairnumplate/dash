
export enum Section {
    Hifz = "Hifz-ul-Quran",
    Dars = "Dars-e-Nizami",
}

export enum AttendanceStatus {
    Present = "Present",
    Absent = "Absent",
    Leave = "Leave",
}

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

export interface AdmissionData {
    photo?: File;
    fullName: string;
    fatherName: string;
    dob: string;
    cnic: string;
    parentPhone: string;
    address: string;
    classLevel: string;
    examCategory: string;
    feeSubmitted: boolean;
    receiptImage?: File;
}
