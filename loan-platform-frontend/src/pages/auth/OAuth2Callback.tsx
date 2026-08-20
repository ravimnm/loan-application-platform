import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '../../api/authApi';
import { storage } from '../../utils/storage';

export const OAuth2Callback: React.FC = () => {

  const navigate = useNavigate();

  useEffect(() => {

    const completeLogin = async () => {

      const params =
        new URLSearchParams(
          window.location.search
        );

      const token =
        params.get('token');

      if (!token) {
        navigate('/login?oauth2=failed', {
          replace: true,
        });
        return;
      }

      try {

        storage.setToken(token);

        const response =
            await authApi.me();

        storage.setUser({
          id: response.userId,
          email: response.email,
          role: response.role,
        });

        navigate('/app', {
          replace: true,
        });

      } catch {

        storage.clear();

        navigate('/login?oauth2=failed', {
          replace: true,
        });
      }
    };

    void completeLogin();

  }, [navigate]);

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h2>Signing you in...</h2>
        <p>Completing Google authentication.</p>
      </section>
    </main>
  );
};