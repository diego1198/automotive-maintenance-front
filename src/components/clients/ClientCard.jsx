import React from 'react';
import Card from '../common/Card';

const ClientCard = ({ client }) => (
  <Card className="mb-2">
    <div className="flex flex-col gap-1">
      <span className="font-bold text-primary text-lg">{client.name}</span>
      <span className="text-secondary text-sm">{client.email}</span>
      <span className="text-secondary text-sm">{client.phone}</span>
      {client.address && <span className="text-secondary text-sm">{client.address}</span>}
    </div>
  </Card>
);

export default ClientCard;
