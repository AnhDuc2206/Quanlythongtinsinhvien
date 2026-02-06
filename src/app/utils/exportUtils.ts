import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Student } from '../models/Student';

export const exportToExcel = (students: Student[]) => {
  const data = students.map(s => ({
    'Mã SV': s.id,
    'Họ và tên': s.name,
    'Ngày sinh': s.dob,
    'Lớp': s.className,
    'GPA': s.gpa
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách sinh viên');
  XLSX.writeFile(workbook, 'Danh_sach_sinh_vien.xlsx');
};

export const exportToPDF = (students: Student[]) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text('DANH SACH SINH VIEN', 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);

  const tableColumn = ["Ma SV", "Ho va ten", "Ngay sinh", "Lop", "GPA"];
  const tableRows = students.map(s => [
    s.id,
    s.name,
    s.dob,
    s.className,
    s.gpa.toString()
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 }
  });

  doc.save('Danh_sach_sinh_vien.pdf');
};
