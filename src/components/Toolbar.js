import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Navigate as navigate } from 'react-big-calendar'
import { Icon } from '@iconify/react';
import Select from 'react-select';

function ViewNamesGroup({ views: viewNames, view, messages, onView, styles }) {
    return (
        <Select
            options={viewNames.map((el) => ({ value: el, label: messages[el] }))}
            className="view-select"
            defaultValue={{ value: view, label: messages[view] }}
            isClearable={false}
            isSearchable={false}
            name="view"
            onChange={(view) => onView(view.value)}
            styles={styles}
        >
            {view}
        </Select>
    )
}
ViewNamesGroup.propTypes = {
    messages: PropTypes.object,
    onView: PropTypes.func,
    view: PropTypes.string,
    views: PropTypes.array,
}
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
    indicatorSeparator: (pr, st) => ({
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

export default function CustomToolbar({
    // date, // available, but not used here
    label,
    localizer: { messages },
    onNavigate,
    onView,
    view,
    views,
}) {
    return (
        <div className="rbc-toolbar">
            <span className={clsx('rbc-btn-group')}>
                <span
                    className='rbc-btn-control rbc-btn-today'
                    type="button"
                    onClick={() => onNavigate(navigate.TODAY)}
                    aria-label={messages.today}
                >
                    {messages.today}
                </span>
                <span
                    className='rbc-btn-control rbc-btn-prev'
                    type="button"
                    onClick={() => onNavigate(navigate.PREVIOUS)}
                    aria-label={messages.previous}
                >
                    <Icon icon="ic:round-arrow-back-ios-new" />
                </span>
                <span
                    className='rbc-btn-control rbc-btn-next'
                    type="button"
                    onClick={() => onNavigate(navigate.NEXT)}
                    aria-label={messages.next}
                >
                    <Icon icon="ic:round-arrow-forward-ios" />
                </span>
            </span>
            <span className="rbc-toolbar-label">{label}</span>
            <span className="rbc-btn-group">
                <ViewNamesGroup
                    styles={selectStyles}
                    view={view}
                    views={views}
                    messages={messages}
                    onView={onView}
                />
            </span>
        </div>
    )
}
CustomToolbar.propTypes = {
    date: PropTypes.instanceOf(Date),
    label: PropTypes.string,
    localizer: PropTypes.object,
    messages: PropTypes.object,
    onNavigate: PropTypes.func,
    onView: PropTypes.func,
    view: PropTypes.string,
    views: PropTypes.array,
}