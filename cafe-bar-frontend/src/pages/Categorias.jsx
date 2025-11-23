import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import Alert from '../components/ui/Alert';

export default function Categorias() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: '' });

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/categorias');
      setData(res);
    } catch (err) {
      setError(err.body?.msg || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  function openCreate() { setForm({ id: null, nombre: '' }); setShowForm(true); }
  function openEdit(row) { setForm(row); setShowForm(true); }

  async function handleSave() {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio'); return; }
    setError(null);
    try {
      if (form.id) {
        await apiClient.put(`/categorias/${form.id}`, { nombre: form.nombre });
      } else {
        await apiClient.post('/categorias', { nombre: form.nombre });
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.body?.msg || err.message);
    }
  }

  async function handleDelete(row) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await apiClient.del(`/categorias/${row.id}`);
      fetchData();
    } catch (err) {
      setError(err.body?.msg || err.message);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🗂️ Categorías</h1>
        <p className="text-gray-600">Gestiona las categorías de productos</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium">
            + Nueva Categoría
          </button>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando categorías...</div>
        ) : (
          <Table
            columns={[{ key: 'id', title: 'ID' }, { key: 'nombre', title: 'Nombre' }]}
            data={data}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {showForm && (
        <Modal title={form.id ? '✏️ Editar Categoría' : '➕ Nueva Categoría'} onClose={() => setShowForm(false)}>
          <FormField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={(v) => setForm((s) => ({ ...s, nombre: v }))}
            placeholder="Ej: Bebidas, Postres..."
          />
          <div className="flex justify-end space-x-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
              Cancelar
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
              Guardar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
