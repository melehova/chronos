import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import React, { useCallback, useState, useMemo } from 'react'
import Select from 'react-select';
import * as capitalize from '../utils/capitalize.js'
import moment from 'moment'
import events from '../resources/events'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './Calendar.css'
import 'moment-timezone' // or 'moment-timezone/builds/moment-timezone-with-data[-datarange].js'. See their docs

// Set the IANA time zone you want to use
// moment.tz.setDefault('America/Chicago')

const localizer = momentLocalizer(moment)
const DnDBigCalendar = withDragAndDrop(BigCalendar)

const Calendar = (props) => {

    const [myEvents, setMyEvents] = useState(events)
    const [chosenView, setView] = useState(Views.WORK_WEEK)

    const viewOptions = Object.values(Views).map(el => ({ value: el, label: el.split('_').join(' ').capitalize() }))

    const onView = useCallback((newView) => setView(newView), [setView])

    const moveEvent = useCallback(
        ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
            const { allDay } = event
            if (!allDay && droppedOnAllDaySlot) {
                event.allDay = true
            }

            setMyEvents((prev) => {
                const existing = prev.find((ev) => ev.id === event.id) ?? {}
                const filtered = prev.filter((ev) => ev.id !== event.id)
                return [...filtered, { ...existing, start, end, allDay }]
            })
        },
        [setMyEvents]
    )

    const resizeEvent = useCallback(
        ({ event, start, end }) => {
            setMyEvents((prev) => {
                const existing = prev.find((ev) => ev.id === event.id) ?? {}
                const filtered = prev.filter((ev) => ev.id !== event.id)
                return [...filtered, { ...existing, start, end }]
            })
        },
        [setMyEvents]
    )

    const handleSelectSlot = useCallback(
        ({ start, end }) => {
            const title = window.prompt('New Event name')
            if (title) {
                setMyEvents((prev) => [...prev, { start, end, title }])
            }
        },
        [setMyEvents]
    )

    const handleSelectEvent = useCallback(
        (event) => window.alert(event.title),
        []
    )

    const { defaultDate, scrollToTime } = useMemo(
        () => ({
            defaultDate: new Date(),
            scrollToTime: new Date(1970, 1, 1, 6),
        }),
        []
    )
    console.log(Views)

    const selectStyles = {
        option: (provided, state) => ({
            ...provided,
            background: 'white',
            color: 'black',
            textAlign: 'start',
            ':hover': {
                background: '#f5f5f5',
            }
        }),
        indicatorSeparator : (pr, st) => ({
            display: 'none',
        }),
        menu: (pr, st) => ({
            ...pr,
            width: 'max-content',
        }),
        singleValue: (pr, st) => ({
            ...pr,
            fontWeight: 500,
        }),
    }
    return (
        <div className="Calendar">
            <Select
                styles={selectStyles}
                className="view-select"
                classNamePrefix="select"
                defaultValue={viewOptions.find(v => v.value === chosenView)}
                isClearable={false}
                isSearchable={false}
                name="view"
                options={viewOptions}
                onChange={(view) => setView(view.value)}
            />
            <DnDBigCalendar
                defaultDate={defaultDate}
                localizer={localizer}
                events={myEvents}
                view={chosenView}
                views={Object.values(Views)}
                onView={onView}
                startAccessor="start"
                endAccessor="end"
                // draggableAccessor={(event) => true}
                onEventDrop={moveEvent}
                onEventResize={resizeEvent}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                scrollToTime={scrollToTime}
                popup
                resizable
            />
        </div>
    )
}

export default Calendar