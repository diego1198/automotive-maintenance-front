import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Button from '../common/Button';

/**
 * Modal para que el cliente califique un servicio de mantenimiento completado.
 * Props:
 *   - open: boolean
 *   - onClose: fn()
 *   - onSubmit: fn({ satisfactionScore, satisfactionComment })
 *   - loading: boolean
 *   - maintenanceSummary: string – texto descriptivo del servicio a calificar
 */
const SatisfactionSurveyModal = ({ open, onClose, onSubmit, loading, maintenanceSummary }) => {
  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (score === 0) return;
    onSubmit({ satisfactionScore: score, satisfactionComment: comment });
  };

  const labels = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star size={28} className="text-yellow-500 fill-yellow-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Califica tu experiencia</h2>
          {maintenanceSummary && (
            <p className="text-sm text-gray-500 mt-1">{maintenanceSummary}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Estrellas */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setScore(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
                >
                  <Star
                    size={40}
                    className={`transition-colors ${
                      star <= (hovered || score)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 fill-gray-100'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className={`text-sm font-semibold transition-colors ${
              (hovered || score) > 0 ? 'text-yellow-600' : 'text-gray-400'
            }`}>
              {labels[hovered || score] || 'Selecciona una calificación'}
            </span>
          </div>

          {/* Comentario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comentarios (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="¿Qué te pareció el servicio? ¿Tienes alguna sugerencia?"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-colors"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={score === 0 || loading}
            >
              {loading ? 'Enviando...' : 'Enviar calificación'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SatisfactionSurveyModal;
