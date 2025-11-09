'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

interface Tournament {
  Id: number;
  Name: string;
  Price: number | null;
  Date: string;
  Game: string;
  Comands: number | null;
}

interface Discipline {
  Id: number;
  Name: string;
  RegistrationLink: string;
}

export default function AdminPortfolio() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [formData, setFormData] = useState({
    Name: '',
    Price: '',
    Date: '',
    Game: '',
    Comands: '',
  });

  useEffect(() => {
    // Проверка auth теперь в layout
    fetchTournaments();
    fetchDisciplines();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/tournaments');
      if (response.ok) {
        const data = await response.json();
        setTournaments(data.list || []);
      }
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisciplines = async () => {
    try {
      const response = await fetch('/api/admin/disciplines');
      if (response.ok) {
        const data = await response.json();
        setDisciplines(data.list || []);
      }
    } catch (error) {
      console.error('Failed to fetch disciplines:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: Partial<Tournament> & { Id?: number } = {
        Name: formData.Name,
        Price: formData.Price ? parseFloat(formData.Price) : null,
        Date: formData.Date,
        Game: formData.Game,
        Comands: formData.Comands ? parseInt(formData.Comands) : null,
      };

      if (editingTournament) {
        body.Id = editingTournament.Id;
      }

      const response = await fetch('/api/admin/tournaments', {
        method: editingTournament ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingTournament(null);
        setFormData({ Name: '', Price: '', Date: '', Game: '', Comands: '' });
        fetchTournaments();
      } else {
        const errorData = await response.json();
        alert('Ошибка при сохранении: ' + (errorData.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Failed to save tournament:', error);
      alert('Ошибка при сохранении');
    }
  };

  const handleEdit = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setFormData({
      Name: tournament.Name || '',
      Price: tournament.Price?.toString() || '',
      Date: tournament.Date || '',
      Game: tournament.Game || '',
      Comands: tournament.Comands?.toString() || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот турнир?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tournaments?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTournaments();
      } else {
        const errorData = await response.json();
        alert('Ошибка при удалении: ' + (errorData.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Failed to delete tournament:', error);
      alert('Ошибка при удалении');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTournament(null);
    setFormData({ Name: '', Price: '', Date: '', Game: '', Comands: '' });
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
        <h1 className="text-3xl font-bold text-white">Управление архивом турниров</h1>
        <Button
          color="primary"
          className="bg-[#FF2F71]"
          onClick={() => {
            setShowForm(true);
            setEditingTournament(null);
            setFormData({ Name: '', Price: '', Date: '', Game: '', Comands: '' });
            fetchDisciplines(); // Обновляем список дисциплин перед показом формы
          }}
        >
          Добавить турнир
        </Button>
      </div>

      {showForm && (
        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingTournament ? 'Редактировать турнир' : 'Добавить турнир'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Название"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
              variant="bordered"
              isRequired
            />
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Дисциплина *</label>
              <select
                value={formData.Game}
                onChange={(e) => setFormData({ ...formData, Game: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              >
                <option value="">Выберите дисциплину</option>
                {disciplines.map((discipline) => (
                  <option key={discipline.Id} value={discipline.Name}>
                    {discipline.Name}
                  </option>
                ))}
              </select>
              {disciplines.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Нет дисциплин. <a href="/admin/disciplines" className="text-pink-400 hover:underline">Добавить дисциплину</a>
                </p>
              )}
            </div>
            <Input
              label="Дата (YYYY-MM-DD)"
              type="date"
              value={formData.Date}
              onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
              variant="bordered"
              isRequired
            />
            <Input
              label="Призовой фонд (руб.)"
              type="number"
              value={formData.Price}
              onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
              variant="bordered"
            />
            <Input
              label="Количество команд"
              type="number"
              value={formData.Comands}
              onChange={(e) => setFormData({ ...formData, Comands: e.target.value })}
              variant="bordered"
            />
            <div className="flex gap-4">
              <Button type="submit" color="primary" className="bg-[#FF2F71]">
                {editingTournament ? 'Сохранить' : 'Добавить'}
              </Button>
              <Button type="button" variant="flat" onClick={handleCancel}>
                Отмена
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div
            key={tournament.Id}
            className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-2">{tournament.Name}</h3>
            <div className="space-y-2 mb-4">
              <p className="text-gray-400">
                <span className="font-semibold">Дисциплина:</span> {tournament.Game}
              </p>
              <p className="text-gray-400">
                <span className="font-semibold">Дата:</span>{' '}
                {tournament.Date
                  ? new Date(tournament.Date).toLocaleDateString('ru-RU')
                  : 'Не указана'}
              </p>
              <p className="text-gray-400">
                <span className="font-semibold">Призовой фонд:</span>{' '}
                {tournament.Price
                  ? `${tournament.Price.toLocaleString('ru-RU')} ₽`
                  : 'Не указан'}
              </p>
              <p className="text-gray-400">
                <span className="font-semibold">Команд:</span>{' '}
                {tournament.Comands || 0}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                color="primary"
                onClick={() => {
                  handleEdit(tournament);
                  fetchDisciplines(); // Обновляем список дисциплин перед редактированием
                }}
              >
                Редактировать
              </Button>
              <Button
                size="sm"
                variant="flat"
                color="danger"
                onClick={() => handleDelete(tournament.Id)}
              >
                Удалить
              </Button>
            </div>
          </div>
        ))}
      </div>

      {tournaments.length === 0 && !loading && (
        <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-lg text-center">
          <p className="text-gray-400">Нет турниров в архиве</p>
        </div>
      )}
    </div>
  );
}
