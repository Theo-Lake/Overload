"use client";

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import styles from './Scheduler.module.css';

export default function Scheduler() {
    const events = [
        { title: 'Lecture: Web Development', start: '2025-11-11T09:00:00', end: '2025-11-11T11:00:00' },
        { title: 'Tutorial: Database Systems', start: '2025-11-11T14:00:00', end: '2025-11-11T15:00:00' },
        { title: 'Lab: Networks', start: '2025-11-12T10:00:00', end: '2025-11-12T12:00:00' }
    ];

    return (
        <div className={styles.schedulerContainer}>
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={events}
                slotMinTime="08:00:00"
                slotMaxTime="19:00:00"
                allDaySlot={false}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay'
                }}
                height="auto"
                key="fullcalendar"
            />
        </div>
    );
}