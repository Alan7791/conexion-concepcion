import { CATEGORIAS } from '../types';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange('')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === ''
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        Todas
      </button>
      {CATEGORIAS.map((categoria) => (
        <button
          key={categoria}
          onClick={() => onCategoryChange(categoria)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === categoria
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {categoria}
        </button>
      ))}
    </div>
  );
}
