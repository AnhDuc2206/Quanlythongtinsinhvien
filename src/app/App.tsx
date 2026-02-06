import React, { useState, useMemo, useEffect } from 'react';
import { Student } from './models/Student';
import { StudentForm } from './components/StudentForm';
import { StudentTable } from './components/StudentTable';
import { StudentStats } from './components/StudentStats';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { exportToExcel, exportToPDF } from './utils/exportUtils';
import { 
  Search, 
  Plus, 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileSpreadsheet, 
  FileText,
  Download
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Mock initial data
const INITIAL_STUDENTS_DATA = [
  { id: 'B20DCCN001', name: 'Nguyễn Văn Anh', dob: '2002-05-15', className: 'D20CQCN01-B', gpa: 3.8 },
  { id: 'B20DCCN002', name: 'Lê Thị Bình', dob: '2002-08-22', className: 'D20CQCN01-B', gpa: 3.4 },
  { id: 'B20DCCN003', name: 'Trần Văn Chung', dob: '2002-01-10', className: 'D20CQCN02-N', gpa: 2.9 },
  { id: 'B20DCCN004', name: 'Phạm Minh Đức', dob: '2002-11-30', className: 'D20CQCN02-N', gpa: 3.1 },
  { id: 'B20DCCN005', name: 'Hoàng Thu Hà', dob: '2002-03-25', className: 'D20CQCN01-B', gpa: 3.9 },
];

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('edu_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStudents(parsed.map((s: any) => new Student(s.id, s.name, s.dob, s.className, s.gpa)));
      } catch (e) {
        console.error('Failed to parse saved students', e);
        setStudents(INITIAL_STUDENTS_DATA.map(s => new Student(s.id, s.name, s.dob, s.className, s.gpa)));
      }
    } else {
      setStudents(INITIAL_STUDENTS_DATA.map(s => new Student(s.id, s.name, s.dob, s.className, s.gpa)));
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('edu_students', JSON.stringify(students.map(s => s.toObject())));
    }
  }, [students, isLoaded]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.className.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const handleAddOrUpdate = (data: any) => {
    if (editingStudent) {
      const updatedStudents = students.map(s => {
        if (s.id === data.id) {
          s.updateInfo(data.name, data.dob, data.className, data.gpa);
          return new Student(s.id, s.name, s.dob, s.className, s.gpa);
        }
        return s;
      });
      setStudents(updatedStudents);
      toast.success(`Đã cập nhật thông tin sinh viên ${data.name}`);
    } else {
      if (students.some(s => s.id === data.id)) {
        toast.error('Mã sinh viên đã tồn tại!');
        return;
      }
      const newStudent = new Student(data.id, data.name, data.dob, data.className, data.gpa);
      setStudents([...students, newStudent]);
      toast.success(`Đã thêm sinh viên ${data.name}`);
    }
    
    setIsFormOpen(false);
    setEditingStudent(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      setStudents(students.filter(s => s.id !== id));
      toast.info('Đã xóa sinh viên khỏi danh sách');
    }
  };

  const handleEdit = (studentData: any) => {
    const student = students.find(s => s.id === studentData.id);
    if (student) {
      setEditingStudent(student);
      setIsFormOpen(true);
    }
  };

  const handleExportExcel = () => {
    exportToExcel(students);
    toast.success('Đã xuất file Excel thành công');
  };

  const handleExportPDF = () => {
    exportToPDF(students);
    toast.success('Đã xuất file PDF thành công');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 flex-col text-slate-300">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-500 p-2 rounded-lg">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">EduManage</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Tổng quan</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Sinh viên</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Cài đặt</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tên, mã SV, lớp..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 border rounded-lg outline-none transition-all text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 ml-4">
            <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-2">
              <button 
                onClick={handleExportExcel}
                className="p-2 hover:bg-white rounded-md transition-all text-slate-600 hover:text-green-600 flex items-center gap-1.5"
                title="Xuất Excel"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="text-xs font-medium">Excel</span>
              </button>
              <div className="w-px h-4 bg-slate-300 mx-1"></div>
              <button 
                onClick={handleExportPDF}
                className="p-2 hover:bg-white rounded-md transition-all text-slate-600 hover:text-red-600 flex items-center gap-1.5"
                title="Xuất PDF"
              >
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium">PDF</span>
              </button>
            </div>

            <button 
              onClick={() => {
                setEditingStudent(null);
                setIsFormOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm sinh viên</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Banner Section */}
            <div className="relative h-48 rounded-2xl overflow-hidden shadow-md group">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1700710972099-b3dab5fdd694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwdW5pdmVyc2l0eSUyMHN0dWRlbnRzJTIwY2FtcHVzfGVufDF8fHx8MTc3MDM0MTUyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Banner"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent flex flex-col justify-center px-10">
                <h1 className="text-3xl font-bold text-white mb-2">Quản lý Sinh viên</h1>
                <p className="text-slate-200 text-lg max-w-md">
                  Phân tích dữ liệu học thuật và quản lý hồ sơ sinh viên hiệu quả.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800">Thống kê & Phân tích</h2>
              <StudentStats students={students} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* List Section */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    Danh sách chi tiết
                    <span className="bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                      {filteredStudents.length}
                    </span>
                  </h2>
                </div>
                
                <StudentTable 
                  students={filteredStudents} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>

              {/* Form Section */}
              <div className="lg:col-span-4 space-y-6">
                {isFormOpen ? (
                  <div className="sticky top-24 animate-in fade-in slide-in-from-right-4 duration-300">
                    <StudentForm 
                      onSubmit={handleAddOrUpdate} 
                      initialData={editingStudent ? editingStudent.toObject() : null}
                      onCancel={() => {
                        setIsFormOpen(false);
                        setEditingStudent(null);
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-6 sticky top-24">
                    <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
                      <Download className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10" />
                      <h3 className="font-bold mb-2">Xuất dữ liệu ngay</h3>
                      <p className="text-blue-100 text-sm mb-4">Lưu lại toàn bộ danh sách sinh viên dưới định dạng Excel hoặc PDF để báo cáo.</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleExportExcel}
                          className="flex-1 bg-white text-blue-600 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                        >
                          <FileSpreadsheet className="w-4 h-4" /> Excel
                        </button>
                        <button 
                          onClick={handleExportPDF}
                          className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-400 transition-colors flex items-center justify-center gap-1"
                        >
                          <FileText className="w-4 h-4" /> PDF
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setIsFormOpen(true)}
                      className="w-full py-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all flex flex-col items-center gap-2 group"
                    >
                      <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                      <span className="font-bold">Thêm sinh viên mới</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
