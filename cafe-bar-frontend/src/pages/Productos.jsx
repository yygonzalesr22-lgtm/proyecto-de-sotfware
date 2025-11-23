import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import Alert from '../components/ui/Alert';

export default function Productos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: '', precio: 0, categoria_id: '' });

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/productos');
      setData(res);
    } catch (err) {
      setError(err.body?.msg || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  function openCreate() { setForm({ id: null, nombre: '', precio: 0, categoria_id: '' }); setShowForm(true); }
  function openEdit(row) { setForm(row); setShowForm(true); }

  async function handleSave() {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio'); return; }
    setError(null);
    try {
      if (form.id) {
        await apiClient.put(`/productos/${form.id}`, { nombre: form.nombre, precio: form.precio, categoria_id: form.categoria_id });
      } else {
        await apiClient.post('/productos', { nombre: form.nombre, precio: form.precio, categoria_id: form.categoria_id });
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.body?.msg || err.message);
    }
  }

  async function handleDelete(row) {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await apiClient.del(`/productos/${row.id}`);
      fetchData();
    } catch (err) {
      setError(err.body?.msg || err.message);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🍽️ Productos</h1>
        <p className="text-gray-600">Gestiona el catálogo de productos</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium">
            + Nuevo Producto
          </button>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando productos...</div>
        ) : (
          <Table
            columns={[
              { key: 'id', title: 'ID' },
              { key: 'nombre', title: 'Nombre' },
              { key: 'precio', title: 'Precio ($)' }
            ]}
            data={data}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {showForm && (
        <Modal title={form.id ? '✏️ Editar Producto' : '➕ Nuevo Producto'} onClose={() => setShowForm(false)}>
          <FormField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={(v) => setForm(s => ({ ...s, nombre: v }))}
            placeholder="Ej: Café Americano..."
          />
          <FormField
            label="Precio"
            type="number"
            value={form.precio}
            onChange={(v) => setForm(s => ({ ...s, precio: Number(v) }))}
            placeholder="0.00"
          />
          <FormField
            label="Categoría ID (opcional)"
            value={form.categoria_id}
            onChange={(v) => setForm(s => ({ ...s, categoria_id: v }))}
            placeholder="ID de la categoría"
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
