import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AccessControl() {
  const [roles, setRoles] = useState([]);
  const [access, setAccess] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const navigate = useNavigate();

  // Загружаем роли, доступы и формируем список страниц из БД
  const fetchAccessData = () => {
    axios.get('http://localhost:3001/api/access-control', { withCredentials: true })
      .then(res => {
        setRoles(res.data.roles);
        setAccess(res.data.access);
        // Формируем уникальный список страниц из access
        const uniquePages = Array.from(new Set(res.data.access.map(a => a.page)));
        setPages(uniquePages);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAccessData();
  }, []);

  const getAllowed = (roleId, page) => {
    const found = access.find(a => a.roleId === roleId && a.page === page);
    return found ? found.allowed : false;
  };

  const handleChange = (roleId, page, allowed) => {
    axios.put('http://localhost:3001/api/access-control', { roleId, page, allowed }, { withCredentials: true })
      .then(() => {
        // После изменения доступа обновляем данные, чтобы отразить возможные новые страницы
        fetchAccessData();
      });
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 24 }}>
      <button className="back-button" onClick={() => navigate('/admin')} style={{ marginBottom: 20 }}>
        Вернуться назад
      </button>
      <h2>Управление правами доступа</h2>
      <div className="access-table-wrapper">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Страница</th>
              {roles.map(role => (
                <th key={role.roleId} style={{ border: '1px solid #ddd', padding: 8 }}>{role.roleName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pages.map(page => (
              <tr key={page}>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{page}</td>
                {roles.map(role => (
                  <td key={role.roleId} style={{ border: '1px solid #ddd', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={!!getAllowed(role.roleId, page)}
                      onChange={e => handleChange(role.roleId, page, e.target.checked)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
