import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Student } from '../models/Student';
import { User, Calendar, BookOpen, Star, Hash, Save, X } from 'lucide-react';

interface StudentFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  onCancel?: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      id: '',
      name: '',
      dob: '',
      className: '',
      gpa: 0
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          {initialData ? 'Cập nhật sinh viên' : 'Thêm sinh viên mới'}
        </h2>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Hash className="w-4 h-4 text-slate-400" /> Mã sinh viên
          </label>
          <input
            {...register('id', { required: 'Vui lòng nhập mã SV' })}
            disabled={!!initialData}
            placeholder="VD: B20DCCN001"
            className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${
              errors.id ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            } ${initialData ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`}
          />
          {errors.id && <p className="text-xs text-red-500 mt-1">{errors.id.message as string}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" /> Họ và tên
          </label>
          <input
            {...register('name', { required: 'Vui lòng nhập họ tên' })}
            placeholder="VD: Nguyễn Văn A"
            className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${
              errors.name ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message as string}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" /> Ngày sinh
          </label>
          <input
            {...register('dob', { required: 'Vui lòng chọn ngày sinh' })}
            type="date"
            className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${
              errors.dob ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }`}
          />
          {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob.message as string}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-400" /> Lớp học
          </label>
          <input
            {...register('className', { required: 'Vui lòng nhập lớp' })}
            placeholder="VD: D20CQCN01-B"
            className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${
              errors.className ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }`}
          />
          {errors.className && <p className="text-xs text-red-500 mt-1">{errors.className.message as string}</p>}
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Star className="w-4 h-4 text-slate-400" /> Điểm GPA
          </label>
          <input
            {...register('gpa', { 
              required: 'Vui lòng nhập GPA',
              min: { value: 0, message: 'GPA thấp nhất là 0' },
              max: { value: 4, message: 'GPA cao nhất là 4.0' },
              valueAsNumber: true
            })}
            type="number"
            step="0.1"
            placeholder="0.0 - 4.0"
            className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${
              errors.gpa ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }`}
          />
          {errors.gpa && <p className="text-xs text-red-500 mt-1">{errors.gpa.message as string}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {initialData ? 'Lưu thay đổi' : 'Thêm sinh viên'}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};
