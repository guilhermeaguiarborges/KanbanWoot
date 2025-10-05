// KanbanCard.jsx
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import CustomAttributesList from './CustomAttributesList';

/**
 * @param {{
 *  contact: { id: number | string, name: string, email?: string },
 *  index: number,
 *  attrDisplayNames?: Record<string, string>
 * }} props
 */
export default function KanbanCard({ contact, index, attrDisplayNames = {} }) {
  // Suporte para thumbnail e telefone
  const thumbnail = contact.thumbnail || contact.avatar_url || contact.profile_picture_url;
  const phone = contact.phone_number || contact.telefone || contact.mobile;

  // 👉 Função para abrir o contato no Chatwoot
  const openInChatwoot = () => {
    const base = window._env_?.REACT_APP_CHATWOOT_URL || process.env.REACT_APP_CHATWOOT_URL;
    const acc = window._env_?.REACT_APP_CHATWOOT_ACCOUNT_ID || process.env.REACT_APP_CHATWOOT_ACCOUNT_ID;

    if (!base || !acc || !contact.id) {
      console.warn("Dados insuficientes para abrir Chatwoot:", { base, acc, id: contact.id });
      return;
    }

    // Abre em nova aba o contato correspondente
    window.open(`${base}/app/accounts/${acc}/contacts/${contact.id}`, "_blank");
  };

  return (
    <Draggable draggableId={String(contact.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={openInChatwoot} // 👈 adiciona clique
          className={`bg-gray-100 p-3 rounded shadow cursor-pointer select-none transition hover:bg-blue-50 ${
            snapshot.isDragging ? 'bg-blue-200 shadow-lg' : ''
          }`}
          title="Abrir contato no Chatwoot"
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
          {/* Mostra atributos customizados usando componente separado */}
          {contact.custom_attributes && (
            <CustomAttributesList attributes={contact.custom_attributes} displayNames={attrDisplayNames} />
          )}
        </div>
      )}
    </Draggable>
  );
}
