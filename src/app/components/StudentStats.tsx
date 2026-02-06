import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Student } from '../models/Student';

interface StudentStatsProps {
  students: Student[];
}

export const StudentStats: React.FC<StudentStatsProps> = ({ students }) => {
  // GPA Trung bình theo lớp
  const classStats = React.useMemo(() => {
    const groups: Record<string, { totalGpa: number; count: number }> = {};
    students.forEach(s => {
      if (!groups[s.className]) {
        groups[s.className] = { totalGpa: 0, count: 0 };
      }
      groups[s.className].totalGpa += s.gpa;
      groups[s.className].count += 1;
    });

    return Object.entries(groups).map(([name, data]) => ({
      name,
      avgGpa: parseFloat((data.totalGpa / data.count).toFixed(2)),
      count: data.count
    }));
  }, [students]);

  // Phân loại học lực
  const rankStats = React.useMemo(() => {
    const ranks = [
      { name: 'Xuất sắc (>= 3.6)', value: 0, color: '#10b981' },
      { name: 'Giỏi (3.2 - 3.59)', value: 0, color: '#3b82f6' },
      { name: 'Khá (2.5 - 3.19)', value: 0, color: '#f59e0b' },
      { name: 'Trung bình (< 2.5)', value: 0, color: '#ef4444' },
    ];

    students.forEach(s => {
      if (s.gpa >= 3.6) ranks[0].value++;
      else if (s.gpa >= 3.2) ranks[1].value++;
      else if (s.gpa >= 2.5) ranks[2].value++;
      else ranks[3].value++;
    });

    return ranks.filter(r => r.value > 0);
  }, [students]);

  if (students.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">GPA Trung bình theo lớp</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis domain={[0, 4]} axisLine={false} tickLine={false} fontSize={12} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="avgGpa" radius={[4, 4, 0, 0]}>
                {classStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Phân loại học lực</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rankStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {rankStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {rankStats.map((rank, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: rank.color }} />
                <span className="text-xs text-slate-600">{rank.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
