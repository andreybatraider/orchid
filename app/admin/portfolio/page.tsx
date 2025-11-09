'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

interface Video {
  Id: number;
  Name: string;
  description: string;
  linkyt: string;
  bglink: string;
}

export default function AdminPortfolio() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    Name: '',
    description: '',
    linkyt: '',
    bglink: '',
  });

  useEffect(() => {
    // Проверка auth теперь в layout
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/portfolio');
      if (response.ok) {
        const data = await response.json();
        setVideos(data.list || []);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/admin/portfolio';
      const method = editingVideo ? 'PUT' : 'POST';
      const body = editingVideo
        ? { ...formData, Id: editingVideo.Id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingVideo(null);
        setFormData({ Name: '', description: '', linkyt: '', bglink: '' });
        fetchVideos();
      } else {
        const errorData = await response.json();
        alert('Ошибка при сохранении: ' + (errorData.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Failed to save video:', error);
      alert('Ошибка при сохранении');
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      Name: video.Name || '',
      description: video.description || '',
      linkyt: video.linkyt || '',
      bglink: video.bglink || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить это видео?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/portfolio?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchVideos();
      } else {
        alert('Ошибка при удалении');
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
      alert('Ошибка при удалении');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVideo(null);
    setFormData({ Name: '', description: '', linkyt: '', bglink: '' });
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
        <h1 className="text-3xl font-bold text-white">Управление портфолио</h1>
        <Button
          color="primary"
          className="bg-[#FF2F71]"
          onClick={() => {
            setShowForm(true);
            setEditingVideo(null);
            setFormData({ Name: '', description: '', linkyt: '', bglink: '' });
          }}
        >
          Добавить видео
        </Button>
      </div>

        {showForm && (
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingVideo ? 'Редактировать видео' : 'Добавить видео'}
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
                label="Описание"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                variant="bordered"
                isRequired
              />
              <Input
                label="Ссылка на YouTube"
                value={formData.linkyt}
                onChange={(e) => setFormData({ ...formData, linkyt: e.target.value })}
                variant="bordered"
                isRequired
              />
              <Input
                label="Ссылка на обложку"
                value={formData.bglink}
                onChange={(e) => setFormData({ ...formData, bglink: e.target.value })}
                variant="bordered"
              />
              <div className="flex gap-4">
                <Button type="submit" color="primary" className="bg-[#FF2F71]">
                  {editingVideo ? 'Сохранить' : 'Добавить'}
                </Button>
                <Button type="button" variant="flat" onClick={handleCancel}>
                  Отмена
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.Id}
              className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg"
            >
              <div className="mb-4">
                {video.bglink && (
                  <img
                    src={video.bglink}
                    alt={video.Name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-white mb-2">{video.Name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {video.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onClick={() => handleEdit(video)}
                >
                  Редактировать
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  onClick={() => handleDelete(video.Id)}
                >
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>

        {videos.length === 0 && !loading && (
          <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-lg text-center">
            <p className="text-gray-400">Нет видео в портфолио</p>
          </div>
        )}
    </div>
  );
}

