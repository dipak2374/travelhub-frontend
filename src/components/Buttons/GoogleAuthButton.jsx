import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const GoogleAuthButton = ({ onSuccess, label = 'Continue with Google', className = '' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const handleCredentialResponse = async (response) => {
      if (!response?.credential) return;
      try {
        await onSuccess?.(response);
      } catch (error) {
        toast.error('Google sign-in failed');
      }
    };

    window.__handleGoogleCredential = handleCredentialResponse;

    if (!clientId) {
      mount.innerHTML = '<p class="text-sm text-gray-500">Google sign-in is not configured yet.</p>';
      return undefined;
    }

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !mount) return;
      if (!window.__googleAuthButtonInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => window.__handleGoogleCredential(response),
        });
        window.__googleAuthButtonInitialized = true;
      }
      window.google.accounts.id.renderButton(mount, {
        theme: 'outline',
        size: 'large',
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return undefined;
    }

    if (!document.getElementById('gsi-script')) {
      const script = document.createElement('script');
      script.id = 'gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = renderGoogleButton;
      document.head.appendChild(script);
    } else {
      const existingScript = document.getElementById('gsi-script');
      existingScript?.addEventListener('load', renderGoogleButton);
    }

    return () => {
      if (window.__handleGoogleCredential === handleCredentialResponse) {
        window.__handleGoogleCredential = null;
      }
      if (mount) {
        mount.innerHTML = '';
      }
    };
  }, [onSuccess]);

  return (
    <div className={`w-full ${className}`}>
      <div ref={mountRef} className="flex justify-center" aria-label={label} />
    </div>
  );
};

export default GoogleAuthButton;
