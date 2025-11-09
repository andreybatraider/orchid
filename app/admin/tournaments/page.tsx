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

export default function AdminTournaments() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
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
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchTournaments();
    }
  }, [authenticated]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth');
      const data = await response.json();
      if (data.authenticated) {
        setAuthenticated(true);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      router.push('/admin');
    }
  };

  const fetchTournaments = async () => {
    try {
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
        alert('Ошибка при удалении');
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Загрузка...</p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Управление турнирами</h1>
          <div className="flex gap-4">
            <Button
              as="a"
              href="/admin/dashboard"
              variant="flat"
              color="default"
            >
              Назад
            </Button>
            <Button
              color="primary"
              className="bg-[#FF2F71]"
              onClick={() => {
                setShowForm(true);
                setEditingTournament(null);
                setFormData({ Name: '', Price: '', Date: '', Game: '', Comands: '' });
              }}
            >
              Добавить турнир
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
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
              <Input
                label="Дисциплина"
                value={formData.Game}
                onChange={(e) => setFormData({ ...formData, Game: e.target.value })}
                variant="bordered"
                isRequired
              />
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
              className="bg-gray-800 p-6 rounded-lg border border-gray-700"
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
                  onClick={() => handleEdit(tournament)}
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
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <p className="text-gray-400">Нет турниров</p>
          </div>
        )}
      </div>
    </div>
  );
}

