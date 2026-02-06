import React, { useState, useMemo } from 'react';
import { Student } from './models/Student';
import { StudentForm } from './components/StudentForm';
import { StudentTable } from './components/StudentTable';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Search, Plus, GraduationCap, LayoutDashboard, Users, Settings } from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Mock initial data
const INITIAL_STUDENTS = [
  new Student('B20DCCN001', 'Nguyễn Văn Anh', '2002-05-15', 'D20CQCN01-B', 3.8),
  new Student('B20DCCN002', 'Lê Thị Bình', '2002-08-22', 'D20CQCN01-B', 3.4),
  new Student('B20DCCN003', 'Trần Văn Chung', '2002-01-10', 'D20CQCN02-N', 2.9),
];

export default function App() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.className.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const handleAddOrUpdate = (data: any) => {
    if (editingStudent) {
      // Update existing student using the class method requirement
      const updatedStudents = students.map(s => {
        if (s.id === data.id) {
          // In a real React app we'd create a new object, 
          // but to satisfy "methods to update info", we update the instance
          // then set state with a copy to trigger re-render
          s.updateInfo(data.name, data.dob, data.className, data.gpa);
          return new Student(s.id, s.name, s.dob, s.className, s.gpa);
        }
        return s;
      });
      setStudents(updatedStudents);
      toast.success(`Đã cập nhật thông tin sinh viên ${data.name}`);
    } else {
      // Add new student
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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar - Desktop Only */}
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
        
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest font-bold">Hệ thống quản lý</p>
            <p className="text-sm font-medium text-white">Phiên bản v1.0.2</p>
          </div>
        </div>
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
          <div className="max-w-6xl mx-auto space-y-8">
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
                  Hệ thống lưu trữ và quản lý thông tin sinh viên tập trung, hiện đại và bảo mật.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* List Section */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    Danh sách sinh viên
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

              {/* Form Section / Stats Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                {isFormOpen ? (
                  <div className="sticky top-24">
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
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <h3 className="font-bold text-slate-800 mb-4">Thống kê nhanh</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">Tổng sinh viên</span>
                          <span className="font-bold text-slate-800">{students.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">GPA Trung bình</span>
                          <span className="font-bold text-blue-600">
                            {(students.reduce((acc, curr) => acc + curr.gpa, 0) / (students.length || 1)).toFixed(2)}
                          </span>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Mục tiêu hoàn thành</span>
                            <span>100%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[100%]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setIsFormOpen(true)}
                      className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all flex flex-col items-center gap-2 group"
                    >
                      <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-sm">Thêm bản ghi mới</span>
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
