export class Student {
  id: string;
  name: string;
  dob: string;
  className: string;
  gpa: number;

  constructor(id: string, name: string, dob: string, className: string, gpa: number) {
    this.id = id;
    this.name = name;
    this.dob = dob;
    this.className = className;
    this.gpa = gpa;
  }

  updateInfo(name: string, dob: string, className: string, gpa: number) {
    this.name = name;
    this.dob = dob;
    this.className = className;
    this.gpa = gpa;
  }

  // Helper to get a plain object for React state
  toObject() {
    return {
      id: this.id,
      name: this.name,
      dob: this.dob,
      className: this.className,
      gpa: this.gpa,
    };
  }
}
