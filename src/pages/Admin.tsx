import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profesional, CATEGORIAS } from '../types';
import { LogOut, Plus, Save, Trash2, TrendingUp } from 'lucide-react';

const ADMIN_PASSWORD = 'admin123';

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [professionals, setProfessionals] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfessional, setNewProfessional] = useState({
    nombre: '',
    categoria: '',
    zona: '',
    whatsapp: '',
    foto_url: '',
    descripcion: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadProfessionals();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const loadProfessionals = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profesionales')
      .select('*')
      .order('created_at', { ascending: false });
    setProfessionals(data || []);
    setLoading(false);
  };

  const handleAddProfessional = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('profesionales').insert([newProfessional]);

    if (error) {
      alert('Error al agregar profesional: ' + error.message);
    } else {
      setNewProfessional({
        nombre: '',
        categoria: '',
        zona: '',
        whatsapp: '',
        foto_url: '',
        descripcion: '',
      });
      setShowAddForm(false);
      loadProfessionals();
    }
  };

  const toggleVerified = async (id: string, currentValue: boolean) => {
    await supabase
      .from('profesionales')
      .update({ es_verificado: !currentValue })
      .eq('id', id);
    loadProfessionals();
  };

  const togglePremium = async (id: string, currentValue: boolean) => {
    await supabase
      .from('profesionales')
      .update({ es_premium: !currentValue })
      .eq('id', id);
    loadProfessionals();
  };

  const deleteProfessional = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este profesional?')) {
      await supabase.from('profesionales').delete().eq('id', id);
      loadProfessionals();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Panel de Administración
          </h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Profesionales Registrados</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar Profesional
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddProfessional} className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={newProfessional.nombre}
                  onChange={(e) =>
                    setNewProfessional({ ...newProfessional, nombre: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={newProfessional.categoria}
                  onChange={(e) =>
                    setNewProfessional({ ...newProfessional, categoria: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {CATEGORIAS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Zona"
                  value={newProfessional.zona}
                  onChange={(e) =>
                    setNewProfessional({ ...newProfessional, zona: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="WhatsApp (ej: 595981234567)"
                  value={newProfessional.whatsapp}
                  onChange={(e) =>
                    setNewProfessional({ ...newProfessional, whatsapp: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="url"
                  placeholder="URL de foto (opcional)"
                  value={newProfessional.foto_url}
                  onChange={(e) =>
                    setNewProfessional({ ...newProfessional, foto_url: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Descripción de servicios (opcional)"
                  value={newProfessional.descripcion}
                  onChange={(e) =>
                    setNewProfessional({ ...newProfessional, descripcion: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profesional
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zona
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Clics
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verificado
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Premium
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {professionals.map((prof) => (
                    <tr key={prof.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{prof.nombre}</div>
                        <div className="text-sm text-gray-500">{prof.whatsapp}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prof.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prof.zona}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                          {prof.clics_recibidos}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleVerified(prof.id, prof.es_verificado)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            prof.es_verificado ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              prof.es_verificado ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => togglePremium(prof.id, prof.es_premium)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            prof.es_premium ? 'bg-yellow-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              prof.es_premium ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => deleteProfessional(prof.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
