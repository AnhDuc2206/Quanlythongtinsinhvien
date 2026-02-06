import React from 'react';
import { Edit2, Trash2, GraduationCap } from 'lucide-react';

interface StudentTableProps {
  students: any[];
  onEdit: (student: any) => void;
  onDelete: (id: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({ students, onEdit, onDelete }) => {
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-1">Danh sách trống</h3>
        <p className="text-slate-500">Chưa có sinh viên nào trong hệ thống. Hãy thêm mới ngay!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Mã SV</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Họ và tên</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Ngày sinh</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Lớp</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">GPA</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-800">{student.id}</td>
                <td className="px-6 py-4 text-slate-700">{student.name}</td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(student.dob).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md text-sm font-medium">
                    {student.className}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${
                    student.gpa >= 3.6 ? 'text-green-600' : 
                    student.gpa >= 3.2 ? 'text-blue-600' : 
                    student.gpa >= 2.5 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {student.gpa.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(student)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
