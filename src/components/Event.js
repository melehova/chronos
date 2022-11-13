import PropTypes from 'prop-types'
import { Fragment } from 'react'
import moment from 'moment'
import { momentLocalizer } from 'react-big-calendar'

const localizer = momentLocalizer(moment)

const Event = {
    Day: ({ event }) => {
        return (
            <span></span>
        )
    },
    Month: ({ event }) => {
        const { start, allDay, title, end, color, isAllDay } = event
        const duration = localizer.diff(start, localizer.ceil(end, 'day'), 'day')
        const startStr = start.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: 'numeric',
        }) || null
        const endStr = end.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: 'numeric',
        }) || null
        return (
            <Fragment>
                {(duration < 1)
                    ? <span>
                        <div className='color-point d-inline-block' style={{ backgroundColor: color }}></div>
                        <span> {title}</span>
                    </span>
                    : <Fragment>
                        {(duration === 1 || isAllDay || allDay)
                            ? <span>{title}</span>
                            : <span>
                                <div title={`${startStr} - ${endStr}: ${title}`} className="rbc-event">
                                    <div className="rbc-addons-dnd-resizable">
                                        <span>
                                            {startStr &&
                                                <div className="rbc-event-label d-inline">{startStr} </div>
                                            }
                                            <div className="rbc-event-content d-inline">{title}</div>
                                        </span>
                                    </div>
                                </div>
                            </span>}
                    </Fragment>
                }

            </Fragment>
        )
    },
    Week: ({ event }) => {
        const { start, allDay, title, end, color, isAllDay } = event

        /*<span>
                            <div title={`${startStr} - ${endStr}: ${title}`} class="rbc-event">
                                <div class="rbc-addons-dnd-resizable">
                                    <div class="rbc-addons-dnd-resize-ns-anchor">
                                        <div class="rbc-addons-dnd-resize-ns-icon">
                                        </div>
                                    </div>
                                    <div class="rbc-event-label">{startStr} – {endStr}</div>
                                    <div class="rbc-event-content">{title}</div>
                                    <div class="rbc-addons-dnd-resize-ns-anchor">
                                        <div class="rbc-addons-dnd-resize-ns-icon">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </span> */
        return (
            <span className='allday'>
                {(allDay || isAllDay || localizer.diff(start, localizer.ceil(end, 'day'), 'day') === 1)
                    ? start.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        // dayPeriod: 'short'
                    })
                    : 'not all day'
                }
                <strong> {title}</strong>
                {/* {event.desc && ':  ' + event.desc} */}
                {/* {event.allDay || isAllDay ? '' : ''} */}
                {/* {event.allDay && isAllDay && 'allday'} */}
            </span>
        )
    }
}

Event.Week.propTypes = {
    event: PropTypes.object,
}

export default Event