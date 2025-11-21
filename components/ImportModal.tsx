
import React, { useState } from 'react';
import { X, FileUp, Download, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ColumnMapping, ImportResult } from '../types';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: any[]) => void;
    templateColumns: { header: string; key: string; required?: boolean }[];
    title: string;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport, templateColumns, title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
    const [dataPreview, setDataPreview] = useState<any[]>([]);
    const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>(
        templateColumns.map(col => ({ excelColumn: '', appField: col.key, required: col.required || false }))
    );
    const [importResult, setImportResult] = useState<ImportResult | null>(null);

    React.useEffect(() => {
        if (!isOpen) {
            setFile(null);
            setExcelHeaders([]);
            setDataPreview([]);
            setColumnMappings(templateColumns.map(col => ({ excelColumn: '', appField: col.key, required: col.required || false })));
            setImportResult(null);
        }
    }, [isOpen, templateColumns]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        if (selectedFile) {
            readExcel(selectedFile);
        } else {
            setExcelHeaders([]);
            setDataPreview([]);
        }
    };

    const readExcel = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const bufferArray = e.target?.result;
            const wb = XLSX.read(bufferArray, { type: 'buffer' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

            if (data.length > 0) {
                const headers = data[0] as string[];
                setExcelHeaders(headers);
                setDataPreview(data.slice(1)); // First row is headers
                
                // Auto-map columns
                setColumnMappings(prev => prev.map(mapping => {
                    const matchedHeader = headers.find(h => h.toLowerCase() === mapping.appField.toLowerCase());
                    return matchedHeader ? { ...mapping, excelColumn: matchedHeader } : mapping;
                }));
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleColumnMappingChange = (index: number, excelCol: string) => {
        setColumnMappings(prev => prev.map((mapping, i) => 
            i === index ? { ...mapping, excelColumn: excelCol } : mapping
        ));
    };

    const processImport = () => {
        if (!file || dataPreview.length === 0) {
            alert('Please upload a file and ensure it has data.');
            return;
        }

        const jsonData = XLSX.utils.sheet_to_json(XLSX.read(file, { type: 'buffer' }).Sheets[XLSX.read(file, { type: 'buffer' }).SheetNames[0]]);
        
        const finalData: any[] = [];
        const errors: { row: number; message: string }[] = [];

        jsonData.forEach((row: any, rowIndex: number) => {
            const processedRow: any = {};
            let rowHasError = false;

            columnMappings.forEach(mapping => {
                const excelColValue = row[mapping.excelColumn];

                if (mapping.required && (excelColValue === undefined || excelColValue === null || String(excelColValue).trim() === '')) {
                    errors.push({ row: rowIndex + 2, message: `Required field '${mapping.appField}' is missing.` }); // +2 for 0-indexed data and header row
                    rowHasError = true;
                }
                
                // Basic type transformation for numbers and booleans
                let transformedValue = excelColValue;
                if (typeof excelColValue === 'string') {
                    if (mapping.appField.toLowerCase().includes('phone')) {
                         transformedValue = String(excelColValue).replace(/\D/g, ''); // Clean phone numbers
                         if (!transformedValue.startsWith('92') && transformedValue.length === 10) {
                            transformedValue = '92' + transformedValue; // Prepend 92 if 10 digits and no 92
                         }
                    } else if (mapping.appField.toLowerCase().includes('amount') || mapping.appField.toLowerCase().includes('id') || mapping.appField.toLowerCase().includes('year')) {
                        transformedValue = Number(excelColValue);
                        if (isNaN(transformedValue)) transformedValue = excelColValue; // Keep original if not a number
                    } else if (mapping.appField.toLowerCase().includes('paid') || mapping.appField.toLowerCase().includes('verified')) {
                        transformedValue = String(excelColValue).toLowerCase() === 'true' || String(excelColValue).toLowerCase() === 'yes' || String(excelColValue) === '1';
                    }
                }

                processedRow[mapping.appField] = transformedValue;
            });

            if (!rowHasError) {
                finalData.push(processedRow);
            }
        });

        if (errors.length > 0) {
            setImportResult({
                totalRows: jsonData.length,
                newRecordsAdded: 0,
                recordsUpdated: 0,
                errors: errors,
            });
            alert('Import failed due to validation errors. Check summary.');
            return;
        }

        onImport(finalData); // Pass processed data to the parent component
        setImportResult({
            totalRows: jsonData.length,
            newRecordsAdded: finalData.length, // Assuming all are new for simplicity, can be refined
            recordsUpdated: 0, // Can be refined if update logic is implemented
            errors: [],
        });
    };

    const downloadTemplate = () => {
        const headers = templateColumns.map(col => col.header);
        const ws = XLSX.utils.aoa_to_sheet([headers]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, `${title.replace(/\s/g, '_')}_Template.xlsx`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    {/* Step 1: Upload File */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold flex items-center"><FileUp className="mr-2"/> 1. Upload Excel File</h3>
                        <label htmlFor="file-upload" className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                            <input id="file-upload" type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} className="hidden" />
                            <FileUp className="w-6 h-6 mr-3 text-gray-400"/>
                            <span className="text-gray-500 dark:text-gray-400">{file ? file.name : 'Drag & drop your Excel file here, or click to browse'}</span>
                        </label>
                        <button onClick={downloadTemplate} className="text-primary-600 dark:text-primary-400 hover:underline flex items-center text-sm mt-2">
                            <Download className="w-4 h-4 mr-1"/> Download Template
                        </button>
                    </div>

                    {/* Step 2: Column Mapping */}
                    {file && excelHeaders.length > 0 && (
                        <div className="space-y-2 pt-4 border-t dark:border-gray-700">
                            <h3 className="text-lg font-semibold flex items-center"><CheckCircle className="mr-2"/> 2. Map Columns</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {columnMappings.map((mapping, index) => (
                                    <div key={mapping.appField} className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {mapping.appField} {mapping.required && <span className="text-red-500">*</span>}
                                        </label>
                                        <select
                                            value={mapping.excelColumn}
                                            onChange={(e) => handleColumnMappingChange(index, e.target.value)}
                                            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="">-- Select Excel Column --</option>
                                            {excelHeaders.map(header => (
                                                <option key={header} value={header}>{header}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Please ensure all required fields (marked with <span className="text-red-500">*</span>) are mapped.
                            </p>
                        </div>
                    )}

                    {/* Step 3: Preview Data (Optional) */}
                    {dataPreview.length > 0 && (
                        <div className="space-y-2 pt-4 border-t dark:border-gray-700">
                            <h3 className="text-lg font-semibold flex items-center"><AlertTriangle className="mr-2"/> 3. Data Preview (First 5 rows)</h3>
                            <div className="overflow-x-auto max-h-48 rounded-lg border dark:border-gray-700">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            {excelHeaders.map(header => (
                                                <th key={header} scope="col" className="px-3 py-2">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataPreview.slice(0, 5).map((row, rowIndex) => (
                                            <tr key={rowIndex} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                                {excelHeaders.map(header => (
                                                    <td key={header} className="px-3 py-2">{String(row[header] || '')}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Import Summary */}
                    {importResult && (
                        <div className="space-y-2 pt-4 border-t dark:border-gray-700">
                            <h3 className="text-lg font-semibold flex items-center">Import Summary</h3>
                            <p className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/> Total Rows Processed: {importResult.totalRows}</p>
                            <p className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/> New Records Added: {importResult.newRecordsAdded}</p>
                            <p className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/> Records Updated: {importResult.recordsUpdated}</p>
                            {importResult.errors.length > 0 && (
                                <div className="text-red-600 dark:text-red-400">
                                    <p className="flex items-center font-semibold"><XCircle className="w-4 h-4 mr-2"/> Errors ({importResult.errors.length}):</p>
                                    <ul className="list-disc list-inside text-sm mt-1 max-h-24 overflow-y-auto">
                                        {importResult.errors.map((error, index) => (
                                            <li key={index}>Row {error.row}: {error.message}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-6 border-t dark:border-gray-700 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</button>
                        <button 
                            type="button" 
                            onClick={processImport} 
                            disabled={!file || columnMappings.some(m => m.required && !m.excelColumn)}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Process Import
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};