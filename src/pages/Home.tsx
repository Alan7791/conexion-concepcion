import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profesional } from '../types';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { Loader2 } from 'lucide-react';

export function Home() {
  const [professionals, setProfessionals] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profesionales')
      .select('*')
      .order('es_premium', { ascending: false })
      .order('es_verificado', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading professionals:', error);
    } else {
      setProfessionals(data || []);
    }
    setLoading(false);
  };

  const filteredProfessionals = professionals.filter((prof) => {
    const matchesSearch =
      prof.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.zona.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === '' || prof.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">
            Conexión Concepción
          </h1>
          <p className="text-lg text-gray-600">
            Encuentra profesionales y servicios técnicos de confianza
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="mb-6">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Categorías</h3>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No se encontraron profesionales con estos criterios
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
