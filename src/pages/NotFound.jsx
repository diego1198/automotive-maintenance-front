import React from 'react';
import EmptyState from '../components/common/EmptyState';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <EmptyState message="Página no encontrada" />
  </div>
);

export default NotFound;
