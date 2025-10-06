// KanbanCard.jsx
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import CustomAttributesList from './CustomAttributesList';

export default function KanbanCard({ contact, index, attrDisplayNames = {} }) {
  const thumbnail = contact.thumbnail || contact.avatar_url || contact.profile_picture_url;
  const phone = contact.phone_number || contact.telefone || contact.mobile;

  const openConversation = async () => {
    const base = window._env_?.REACT_APP_CHATWOOT_URL || process.env.REACT_APP_CHATWOOT_URL;
    const acc = window._env_?.REACT_APP_CHATWOOT_ACCOUNT_ID || process.env.REACT_APP_CHATWOOT_ACCOUNT_ID;
    const token = window._env_?.REACT_APP_CHATWOOT_TOKEN || process.env.REACT_APP_CHATWOOT_TOKEN;

    if (!base || !acc || !contact.id) {
      console.warn('Dados insuficientes para abrir Chatwoot:', { base, acc, id: contact.id });
      return;
    }

    try {
      // Se já existe conversation_id, abre direto
      if (contact.conversation_id) {
        window.open(`${base}/app/accounts/${acc}/conversations/${contact.conversation_id}`, '_blank');
        return;
      }

      // Busca a primeira conversa associada ao contato
      const url = `${base}/api/v1/accounts/${acc}/contacts/${contact.id}/conversations`;
      const res = await fetch(url, {
        headers: { api_access_token: token },
      });
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const convoId = data[0].id;
        window.open(`${base}/app/accounts/${acc}/conversations/${convoId}`, '_blank');
      } else {
        alert('Nenhuma conversa encontrada para este contato.');
      }
    } catch (err) {
      console.error('Erro ao buscar conversa:', err);
      alert('Erro ao abrir conversa no Chatwoot.');
    }
  };

  return (
    <Draggable draggableId={String(contact.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={openConversation}
          className={`bg-gray-100 p-3 rounded shadow cursor-pointer select-none transition hover:bg-blue-50 ${
            snapshot.isDragging ? 'bg-blue-200 shadow-lg' : ''
          }`}
          title="Abrir conversa no Chatwoot"
        >
          <div className="flex items-center gap-2">
            {thumbnail && (
              <img
                src={thumbnail}
                alt={contact.name}
                className="w-6 h-6 rounded-full object-cover"
                style={{ minWidth: 24, minHeight: 24 }}
              />
            )}
            <div className="font-medium">{contact.name}</div>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {phone && <span>{phone}</span>}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {contact.email && phone && <span className="mx-2">·</span>}
            {contact.email && <span>{contact.email}</span>}
          </div>
          {contact.custom_attributes && (
            <CustomAttributesList attributes={contact.custom_attributes} displayNames={attrDisplayNames} />
          )}
        </div>
      )}
    </Draggable>
  );
}
