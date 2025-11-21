
import React from 'react';
import { Admission, FeeItem } from '../types';

interface FeeReceiptProps {
    admission: Admission;
    receiptRef: React.RefObject<HTMLDivElement>;
}

export const FeeReceipt: React.FC<FeeReceiptProps> = ({ admission, receiptRef }) => {
    const totalAmount = admission.feeChecklist.reduce((sum, item) => sum + (item.paid ? item.amount : 0), 0);
    const pendingAmount = admission.feeChecklist.reduce((sum, item) => sum + (!item.paid ? item.amount : 0), 0);

    return (
        <div ref={receiptRef} className="p-8 font-sans text-black bg-white">
            <div className="text-center border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold">Noor-ul-Masajid Education System</h1>
                <p className="text-lg">Tanzim-ul-Madaris Admission Fee Receipt</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4">
                <div><strong className="font-semibold">Receipt No:</strong> {admission.id}</div>
                <div><strong className="font-semibold">Date:</strong> {new Date().toLocaleDateString()}</div>
                <div><strong className="font-semibold">Student Name:</strong> {admission.fullName}</div>
                <div><strong className="font-semibold">Father's Name:</strong> {admission.fatherName}</div>
                <div><strong className="font-semibold">Class/Level:</strong> {admission.classLevel}</div>
                <div><strong className="font-semibold">Exam Category:</strong> {admission.examCategory}</div>
                {admission.studentPhone && <div><strong className="font-semibold">Student Phone:</strong> {admission.studentPhone}</div>}
                {admission.parentPhone && <div><strong className="font-semibold">Parent Phone:</strong> {admission.parentPhone}</div>}
            </div>
            <div className="mt-8">
                <table className="w-full border-collapse border border-black">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-black p-2 text-left">Fee Item</th>
                            <th className="border border-black p-2 text-right">Amount (PKR)</th>
                            <th className="border border-black p-2 text-center">Status</th>
                            <th className="border border-black p-2 text-center">Payment Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admission.feeChecklist.map((item: FeeItem) => (
                            <tr key={item.id}>
                                <td className="border border-black p-2">{item.name}</td>
                                <td className="border border-black p-2 text-right">{item.amount.toLocaleString()}</td>
                                <td className="border border-black p-2 text-center">{item.paid ? 'Paid' : 'Pending'}</td>
                                <td className="border border-black p-2 text-center">{item.dateOfPayment || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold">
                            <td className="border border-black p-2 text-right">Total Paid</td>
                            <td className="border border-black p-2 text-right">{totalAmount.toLocaleString()}</td>
                            <td colSpan={2} className="border border-black p-2 text-right"></td>
                        </tr>
                        <tr className="font-bold">
                            <td className="border border-black p-2 text-right">Total Pending</td>
                            <td className="border border-black p-2 text-right">{pendingAmount.toLocaleString()}</td>
                            <td colSpan={2} className="border border-black p-2 text-right"></td>
                        </tr>
                        <tr className="font-bold bg-gray-100">
                            <td className="border border-black p-2 text-right">Grand Total</td>
                            <td className="border border-black p-2 text-right">{(totalAmount + pendingAmount).toLocaleString()}</td>
                            <td colSpan={2} className="border border-black p-2 text-right"></td>
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
