import { useAuthContext } from '../hooks/useAuthContext';
import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import Swal from 'sweetalert2';

// Tipos
interface AvatarProps {
  url?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  onAvatarClick: () => void;
  isLoading?: boolean;
}

interface UserDropdownProps {
  fullName: string;
  email: string;
  onLogout: () => Promise<void>;
  onEdit: () => void;
}

// Componente Avatar
const Avatar = ({ url, name, size = 'md', onAvatarClick, isLoading }: AvatarProps) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const getInitial = () => name.charAt(0).toUpperCase();

  return (
    <div 
      onClick={onAvatarClick}
      className="relative group cursor-pointer"
    >
      {url ? (
        <div className={`relative ${sizes[size]}`}>
          <img 
            src={url}
            alt={`Avatar de ${name}`}
            className={`${sizes[size]} rounded-full border border-gray-200 object-cover bg-white`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10B981&color=fff&size=128`;
            }}
          />
          <div className="absolute inset-0 rounded-full hover:bg-black hover:bg-opacity-30 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      ) : (
        <div className={`${sizes[size]} rounded-full border border-gray-200 bg-emerald-600 flex items-center justify-center text-white font-semibold group-hover:bg-emerald-700 transition-colors`}>
          {getInitial()}
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

// Componente UserDropdown
const UserDropdown = ({ fullName, email, onLogout, onEdit }: UserDropdownProps) => {
  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-50 animate-fade-in-down">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">{fullName}</h3>
        <p className="text-sm text-gray-500 mt-1">{email}</p>
      </div>
      <div className="p-2 space-y-1">
        <button 
          onClick={onEdit}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar nome
        </button>
        <button 
          onClick={onLogout}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair da conta
        </button>
      </div>
    </div>
  );
};

// Componente Principal
export default function InfoUsuario() {
  const { user, setUser } = useAuthContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validação do arquivo
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        throw new Error('Apenas imagens JPG e PNG são permitidas');
      }
      if (file.size > 1024 * 1024) {
        throw new Error('A imagem deve ter no máximo 1MB');
      }

      setUploading(true);

      // Mostra loading
      await Swal.fire({
        title: 'Enviando imagem...',
        html: 'Por favor, aguarde enquanto processamos sua imagem',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Upload da nova imagem
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;

      // Remove imagem antiga
      if (user?.avatar_url) {
        const oldFileName = user.avatar_url.split('/').pop()?.split('?')[0];
        if (oldFileName) {
          await supabase.storage.from('avatars').remove([oldFileName]);
        }
      }

      // Upload
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '0',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Obtém URL pública
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const cdnUrl = `${data.publicUrl}?t=${Date.now()}`;

      // Atualiza perfil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: cdnUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Atualiza estado
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profile) {
        setUser(profile);
      }

      // Sucesso
      await Swal.close();
      await Swal.fire({
        title: 'Sucesso!',
        text: 'Sua foto foi atualizada',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        position: 'top-end',
        toast: true
      });

    } catch (error) {
      await Swal.close();
      await Swal.fire({
        title: 'Erro',
        text: error instanceof Error ? error.message : 'Erro ao atualizar foto',
        icon: 'error',
        timer: 3000,
        position: 'top-end',
        toast: true
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEditName = async () => {
    try {
      const { value: newName, isConfirmed } = await Swal.fire({
        title: 'Editar nome',
        input: 'text',
        inputLabel: 'Seu nome',
        inputValue: user?.full_name || '',
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#25D366',
        cancelButtonColor: '#d33',
        inputValidator: (value) => {
          if (!value) {
            return 'O nome não pode ficar vazio';
          }
          if (value.length < 3) {
            return 'O nome deve ter pelo menos 3 caracteres';
          }
          if (value.length > 50) {
            return 'O nome deve ter no máximo 50 caracteres';
          }
          return null;
        }
      });

      // Se o usuário cancelou ou fechou o modal
      if (!isConfirmed || !newName || newName === user?.full_name) {
        return;
      }

      // Mostra loading
      Swal.showLoading();

      // Atualiza o nome no banco
      const { error: updateError, data: updatedProfile } = await supabase
        .from('profiles')
        .update({ full_name: newName })
        .eq('id', user?.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Atualiza o estado local com o perfil retornado
      if (updatedProfile) {
        setUser(updatedProfile);
        setShowDropdown(false);

        // Mostra sucesso
        await Swal.fire({
          title: 'Sucesso!',
          text: 'Seu nome foi atualizado',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });
      }
    } catch (error) {
      await Swal.fire({
        title: 'Erro',
        text: error instanceof Error ? error.message : 'Erro ao atualizar nome',
        icon: 'error',
        timer: 3000,
        position: 'top-end',
        toast: true
      });
    }
  };

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: 'Tem certeza que deseja sair?',
        text: 'Você será desconectado da sua conta',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, sair',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#25D366',
        cancelButtonColor: '#d33'
      });

      if (result.isConfirmed) {
        // Limpa todos os tokens do localStorage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-')) {
            localStorage.removeItem(key);
          }
        });

        // Limpa a sessão do navegador
        sessionStorage.clear();

        // Faz o signOut do Supabase
        await supabase.auth.signOut();

        // Atualiza a página para forçar o redirecionamento
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      
      // Mostra mensagem de erro
      await Swal.fire({
        title: 'Erro ao sair',
        text: 'Não foi possível fazer logout. Tente novamente.',
        icon: 'error',
        timer: 3000,
        position: 'top-end',
        toast: true
      });
    }
  };

  if (!user) return null;

  return (
    <div className="p-2.5 bg-[#075E54] flex items-center justify-between rounded-t-lg">
      <div className="flex items-center gap-3 flex-1">
        <Avatar 
          url={user.avatar_url}
          name={user.full_name}
          onAvatarClick={handleAvatarClick}
          isLoading={uploading}
        />
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex-1">
          <h2 className="text-white font-semibold">{user.full_name}</h2>
          <p className="text-emerald-100 text-sm">Online</p>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-[#054c44] rounded-full transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-white transform transition-transform duration-200 ${showDropdown ? 'rotate-90' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {showDropdown && (
            <UserDropdown 
              fullName={user.full_name}
              email={user.email}
              onLogout={handleLogout}
              onEdit={handleEditName}
            />
          )}
        </div>
      </div>
    </div>
  );
} 