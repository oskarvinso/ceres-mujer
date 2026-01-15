
export interface HealthRecord {
  date: string;
  weight: number;
  systolic: number;
  diastolic: number;
  heartRate: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'nutricion' | 'ropa' | 'salud' | 'libros';
  image: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: 'yoga' | 'ejercicio' | 'cocina' | 'recreativo';
  duration: string;
  instructor: string;
  thumbnail: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}
