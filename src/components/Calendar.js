import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import CustomToolbar from './Toolbar.js';
import PropTypes from 'prop-types'
import Event from './Event.js';
import moment from 'moment'
import events from '../resources/events'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './Calendar.css'
import 'moment-timezone' // or 'moment-timezone/builds/moment-timezone-with-data[-datarange].js'. See their docs

// Set the IANA time zone you want to use
moment.tz.setDefault('Europe/Kyiv')
// moment.tz.setDefault('America/Cancun')


const localizer = momentLocalizer(moment)
const DnDBigCalendar = withDragAndDrop(BigCalendar)




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

const Calendar = ({ dayLayoutAlgorithm = 'no-overlap'
}) => {
    const [myEvents, setMyEvents] = useState(events)
    const [chosenView, setView] = useState(Views.WORK_WEEK)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [selectedPosition, setSelectedPosition] = useState({ left: 0, right: 0, top: 0, bottom: 0 })

    const ref = useRef();
    useOnClickOutside(ref, () => {
        setSelectedEvent(null)
    });

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
            // console.log(event, (event.end - event.start) / (1000 * 3600 * 24))
            const pos = e.target.getBoundingClientRect()
            const left = Math.abs(pos.x - 500) + 'px'
            const top = pos.y + pos.height + 5 + 'px'
            setSelectedPosition({
                left: left,
                top: top,
                zIndex: 15,
            })
            return setSelectedEvent(event)
        },
        []
    )

    const eventPropGetter = useCallback(
        (event, start, end, isSelected) => ({
            ...((event.allDay || (event.end - event.start) / (1000 * 3600 * 24) === 1) && {
                className: 'allday',
                // style: {
                //     background: 'yellow',
                // }
            }),
            ...((localizer.diff(start, localizer.ceil(end, 'day'), 'day') < 1) && {
                style: {
                    background: 'transparent',
                }
            }),
            ...(((event.end - event.start) / (1000 * 3600 * 24) === 1) && {
                style: {
                    background: event.color,
                }
            }),
            // event
            // ...(isSelected && {
            //     style: {
            //         backgroundColor: '#fff',
            //     },
            // }),
            // ...(moment(start).hour() < 12 && {
            //     className: 'powderBlue',
            // }),
            // ...(event.title.includes('Meeting') && {
            //     className: 'darkGreen',
            // }),
        }),
        []
    )

    // function evWr(event) {
    //     return <div>{event.title}</div>
    // }
    const { components, defaultDate, scrollToTime } = useMemo(
        () => ({
            components: {
                // event: Event.Week,
                toolbar: CustomToolbar,
                // week: {
                //     event: Event.Week
                // }
                month: {
                    event: Event.Month
                }
                // eventWrapper: EventWrapper,
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
                    className='col-4'
                    ref={ref}
                    style={selectedPosition}>
                    {selectedEvent.title} {selectedEvent.start.toLocaleString()} {selectedEvent.end.toLocaleString()}
                </div>}
            <DnDBigCalendar
                className='col-12'
                components={components}
                dayLayoutAlgorithm={dayLayoutAlgorithm}
                defaultDate={defaultDate}
                // draggableAccessor="isDraggable"
                draggableAccessor={(event) => true}
                // resizebleAccessor={(event) => true}
                endAccessor="end"
                eventPropGetter={eventPropGetter}
                events={myEvents}
                localizer={localizer}
                onEventDrop={moveEvent}
                onEventResize={resizeEvent}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                onView={onView}
                popup
                resizable
                scrollToTime={scrollToTime}
                selectable
                showMultiDayTimes
                startAccessor="start"
                // toolbar={false}
                view={chosenView}
                views={Object.values(Views)}
            />
        </div>
    )
}

Calendar.propTypes = {
    dayLayoutAlgorithm: PropTypes.string,
}

export default Calendar