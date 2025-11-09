'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

interface Discipline {
  Id: number;
  Name: string;
  RegistrationLink: string;
}

export default function AdminDisciplines() {
  const router = useRouter();
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null);
  const [formData, setFormData] = useState({
    Name: '',
    RegistrationLink: '',
  });

  useEffect(() => {
    fetchDisciplines();
  }, []);

  const fetchDisciplines = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/disciplines');
      if (response.ok) {
        const data = await response.json();
        setDisciplines(data.list || []);
      }
    } catch (error) {
      console.error('Failed to fetch disciplines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: Partial<Discipline> & { Id?: number } = {
        Name: formData.Name,
        RegistrationLink: formData.RegistrationLink,
      };

      if (editingDiscipline) {
        body.Id = editingDiscipline.Id;
      }

      const response = await fetch(
        editingDiscipline ? '/api/admin/disciplines' : '/api/admin/disciplines',
        {
          method: editingDiscipline ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        setShowForm(false);
        setEditingDiscipline(null);
        setFormData({ Name: '', RegistrationLink: '' });
        fetchDisciplines();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Ошибка при сохранении дисциплины');
      }
    } catch (error) {
      console.error('Failed to save discipline:', error);
      alert('Ошибка при сохранении дисциплины');
    }
  };

  const handleEdit = (discipline: Discipline) => {
    setEditingDiscipline(discipline);
    setFormData({
      Name: discipline.Name,
      RegistrationLink: discipline.RegistrationLink,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту дисциплину?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/disciplines?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchDisciplines();
      } else {
        alert('Ошибка при удалении дисциплины');
      }
    } catch (error) {
      console.error('Failed to delete discipline:', error);
      alert('Ошибка при удалении дисциплины');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDiscipline(null);
    setFormData({ Name: '', RegistrationLink: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-white">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Управление дисциплинами</h1>
        <Button
          color="primary"
          className="bg-[#FF2F71]"
          onClick={() => {
            setShowForm(true);
            setEditingDiscipline(null);
            setFormData({ Name: '', RegistrationLink: '' });
          }}
        >
          Добавить дисциплину
        </Button>
      </div>

      {showForm && (
        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingDiscipline ? 'Редактировать дисциплину' : 'Добавить дисциплину'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Название дисциплины"
              placeholder="Например: Counter-Strike 2"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
              variant="bordered"
              isRequired
              classNames={{
                input: 'text-white',
                label: 'text-gray-300',
              }}
            />
            <Input
              label="Ссылка на регистрацию"
              placeholder="https://example.com/register"
              value={formData.RegistrationLink}
              onChange={(e) => setFormData({ ...formData, RegistrationLink: e.target.value })}
              variant="bordered"
              isRequired
              classNames={{
                input: 'text-white',
                label: 'text-gray-300',
              }}
            />
            <div className="flex gap-4">
              <Button
                type="submit"
                color="primary"
                className="bg-[#FF2F71] text-white"
              >
                {editingDiscipline ? 'Сохранить изменения' : 'Добавить'}
              </Button>
              <Button
                type="button"
                variant="flat"
                onClick={handleCancel}
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {disciplines.map((discipline) => (
          <div
            key={discipline.Id}
            className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-2">{discipline.Name}</h3>
            <p className="text-gray-400 text-sm mb-4 break-all">
              <span className="font-semibold">Ссылка:</span> {discipline.RegistrationLink}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                onClick={() => handleEdit(discipline)}
                className="flex-1"
              >
                Редактировать
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="flat"
                onClick={() => handleDelete(discipline.Id)}
                className="flex-1"
              >
                Удалить
              </Button>
            </div>
          </div>
        ))}
      </div>

      {disciplines.length === 0 && !loading && (
        <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-lg text-center">
          <p className="text-gray-400">Нет дисциплин</p>
        </div>
      )}
    </div>
  );
}

