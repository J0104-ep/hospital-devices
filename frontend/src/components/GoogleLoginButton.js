import React, { useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function GoogleLoginButton({ onLoginSuccess }) {
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: '815972207565-etag6mup0ekbg4crmfvpauqejb00936e.apps.googleusercontent.com', // ⚙️ Coloca esto en .env.local si lo deseas
        callback: handleCredentialResponse,
        ux_mode: 'popup'
      });

      google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large' }
      );
    } else {
      console.warn('⚠️ Google API no está disponible. Asegúrate de incluir el script en index.html');
    }
  }, []);

  async function handleCredentialResponse(response) {
    const idToken = response.credential;
    try {
      console.log('🔑 Enviando token de Google al backend...');
      const res = await fetch(`${API_BASE_URL}/auth/google`, { // ✅ corregido: solo una /api
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al iniciar sesión con Google');
      }

      const data = await res.json();

      // ✅ Guarda token y usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (onLoginSuccess) onLoginSuccess(data.user);
      console.log('✅ Login con Google exitoso');

    } catch (err) {
      console.error('❌ Error en login con Google:', err);
      if (err.message.includes('Failed to fetch')) {
        alert('No se puede conectar con el servidor. Verifica que el backend esté activo.');
      } else {
        alert('Error al iniciar sesión: ' + err.message);
      }
    }
  }

  return <div id="googleSignInDiv"></div>;
}
