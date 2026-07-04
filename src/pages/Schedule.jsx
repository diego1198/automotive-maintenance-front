import React, { useState } from 'react';
import Calendar from '../components/schedule/Calendar';
import TimeSlotPicker from '../components/schedule/TimeSlotPicker';
import ScheduleForm from '../components/schedule/ScheduleForm';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import { getWorkshops } from '../api/endpoints/workshops';
import { getAvailableSchedules } from '../api/endpoints/schedules';
import EmptyState from '../components/common/EmptyState';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Cargar talleres y horarios desde la API

  const { data: workshops, isLoading: loadingWorkshops } = useQuery({
    queryKey: ['workshops'],
    queryFn: getWorkshops,
  });

  // Selección de taller
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  // Cargar horarios disponibles para el taller y fecha seleccionados
  const { data: slots, isLoading: loadingSlots } = useQuery({
    queryKey: ['slots', selectedWorkshop, selectedDate],
    queryFn: () => selectedWorkshop ? getAvailableSchedules(selectedWorkshop, selectedDate.toISOString().slice(0, 10)) : [],
    enabled: !!selectedWorkshop,
  });

  return (
    <div>
      <Card className="mb-4">
        <h2 className="text-lg font-bold text-primary mb-2">Selecciona taller</h2>
        {loadingWorkshops ? <LoadingSpinner /> : (
          <select
            className="w-full mb-2 px-3 py-2 border rounded-lg"
            value={selectedWorkshop || ''}
            onChange={e => setSelectedWorkshop(e.target.value)}
          >
            <option value="">Selecciona taller</option>
            {Array.isArray(workshops?.data) && workshops.data.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        )}
        <h2 className="text-lg font-bold text-primary mb-2">Calendario</h2>
        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </Card>
      <Card className="mb-4">
        <h2 className="text-lg font-bold text-primary mb-2">Horarios disponibles</h2>
        {loadingSlots ? <LoadingSpinner /> : (
          <TimeSlotPicker slots={slots ?? []} selected={selectedSlot} onSelect={setSelectedSlot} />
        )}
      </Card>
      <Button variant="primary" onClick={() => setModalOpen(true)} disabled={!selectedWorkshop || !selectedSlot}>Crear cita</Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva cita">
        <ScheduleForm
          defaultValues={{ date: selectedDate, startTime: selectedSlot, endTime: '' }}
          onSubmit={() => {}}
          loading={false}
          workshops={workshops ?? []}
        />
      </Modal>
    </div>
  );
};

export default Schedule;
