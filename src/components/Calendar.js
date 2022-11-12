import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import CustomToolbar from './Toolbar.js';
import PropTypes from 'prop-types'
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

const Event = ({ event }) => {
    return (
        <span>
            <strong>{event.title}</strong>
            {event.desc && ':  ' + event.desc}
        </span>
    )
}
Event.propTypes = {
    event: PropTypes.object,
}
// to hide selected event 'modal' if click outside of it 
function useOnClickOutside(ref, handler) {
    useEffect(
        () => {
            const listener = (event) => {
                // Do nothing if clicking ref's element or descendent elements
                if (!ref.current || ref.current.contains(event.target)) {
                    return;
                }
                handler(event);
            };
            document.addEventListener("mousedown", listener);
            document.addEventListener("touchstart", listener);
            return () => {
                document.removeEventListener("mousedown", listener);
                document.removeEventListener("touchstart", listener);
            };
        },
        [ref, handler]
    );
}


// const MyOtherNestedComponent = () => <div>NESTED COMPONENT</div>

// const MyCustomHeader = ({ label }) => (
//     <div>
//         CUSTOM HEADER:
//         <div>{label}</div>
//         <MyOtherNestedComponent />
//     </div>
// )
// MyCustomHeader.propTypes = {
//     label: PropTypes.string.isRequired,
// }

const Calendar = ({ dayLayoutAlgorithm = 'overlap'
}) => {
    const [myEvents, setMyEvents] = useState(events)
    const [chosenView, setView] = useState(Views.WORK_WEEK)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [selectedPosition, setSelectedPosition] = useState({ left: 0, right: 0, top: 0, bottom: 0 })

    const ref = useRef();
    useOnClickOutside(ref, () => setSelectedEvent(null));

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
        (event, e) => {
            console.log(event, e)
            const pos = e.target.getBoundingClientRect()
            const left = Math.abs(pos.x - 500) + 'px'
            setSelectedPosition({
                left: left,
                top: `${pos.y}px`
            })
            return setSelectedEvent(event)
        },
        []
    )

    const { components, defaultDate, scrollToTime } = useMemo(
        () => ({
            components: {
                event: Event,
                toolbar: CustomToolbar,
                // day: { header: MyCustomHeader },
                // week: { header: MyCustomHeader },
                // month: { header: MyCustomHeader },
            },
            defaultDate: new Date(),
            scrollToTime: new Date(1970, 1, 1, 6),
        }),
        []
    )

    return (
        <div className="Calendar">
            {selectedEvent &&
                <div id='selected-event'
                    style={selectedPosition}
                    className='col-4'
                    ref={ref}>
                    {selectedEvent.title}
                </div>}
            <DnDBigCalendar
                className='col-12'
                dayLayoutAlgorithm={dayLayoutAlgorithm}
                defaultDate={defaultDate}
                components={components}
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
                // toolbar={false}
                popup
                resizable
            />
        </div>
    )
}

Calendar.propTypes = {
    dayLayoutAlgorithm: PropTypes.string,
}

export default Calendar