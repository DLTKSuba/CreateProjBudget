import { useEffect, useId, useRef, useState } from 'react'
import { Badge } from '../components/harmony/Badge'
import type { BadgeVariant } from '../components/harmony/Badge'
import { Button } from '../components/harmony/Button'
import { Checkbox } from '../components/harmony/Checkbox'
import { Icon } from '../components/harmony/Icon'
import { Input } from '../components/harmony/Input'
import { ShellLayout } from '../components/harmony/ShellLayout'
import { Stepper } from '../components/harmony/Stepper'
import { Table } from '../components/harmony/Table'
import { Tooltip } from '../components/harmony/Tooltip'
import type { LeftSidebarSection } from '../components/harmony/LeftSidebar'
import type { RightSidebarSection } from '../components/harmony/RightSidebar'
import './ProjectUserFlowPage.css'

const LEFT_SECTIONS: LeftSidebarSection[] = [
  {
    items: [
      { icon: 'home', label: 'Home' },
      { icon: 'squares-plus', label: 'Applications' },
      { icon: 'star', label: 'Favorites' },
      { icon: 'queue-list', label: 'Recent items' },
    ],
  },
  {
    items: [
      { icon: 'magnifying-glass', label: 'Search' },
      { icon: 'squares-2x2', label: 'Workspace' },
      { icon: 'clipboard-document-list', label: 'Projects', active: true },
      { icon: 'cube', label: 'Inventory' },
      { icon: 'users', label: 'People' },
      { icon: 'clock', label: 'Time' },
      { icon: 'document-chart-bar', label: 'Reports' },
      { icon: 'cog-6-tooth', label: 'Settings' },
    ],
  },
]

const RIGHT_SECTIONS: RightSidebarSection[] = [
  {
    items: [
      {
        label: 'Dela AI',
        isCustom: true,
        customSrc: '/RS_DelaDefault.svg',
        customSrcActive: '/RS_Dela_Active.svg',
      },
      { icon: 'bell', label: 'Notifications' },
      { icon: 'arrow-up-tray', label: 'Upload' },
    ],
  },
  {
    items: [
      { icon: 'printer', label: 'Print' },
      { icon: 'calculator', label: 'Calculator' },
      {
        icon: 'history',
        label: 'History',
        panelTitle: 'Change History',
        panelIcon: 'history',
        panelContentId: 'change-history',
      },
    ],
  },
  {
    items: [
      { icon: 'mic-slash', label: 'Mute voice' },
      { icon: 'signal-slash', label: 'Disconnect' },
      { icon: 'command-line', label: 'Keyboard shortcuts' },
      { icon: 'question-mark-circle', label: 'Help' },
    ],
  },
]

const PROJECT_TABS = [
  'Modifications',
  'Revenue Information',
  'Proj Bill Info',
  'Def Rate Seq',
  'CQQS',
  'Total Cell',
  'Dir Cost Cell',
  'Burd Cost Cell',
  'Dir Hrs Cell',
  'Empl Hrs Cell',
  'VNDR Hrs Cell',
  'Cost Fee Ovrd',
  'Burd Fee Ovrd',
  'Multi Ovrd',
  'Deliverables',
  'User-Defined Info',
  'Proj Levels',
  'Org History',
  'Notes',
  'Proj Location',
  'Acct/Org Lines',
  'ACRN',
]

const CHANGE_HISTORY_GROUPS = [
  {
    date: 'Jun 30',
    entries: [
      {
        time: '8:20 AM',
        fields: '3 fields',
        expanded: true,
        changes: [
          { kind: 'Update', field: 'Status', from: 'In Review', to: 'Closed' },
          { kind: 'Update', field: 'Project Manager', from: 'Thomas Nguyen', to: 'Rajesh Khan' },
          {
            kind: 'Update',
            field: 'Description',
            from: '',
            to: 'Updated scope for Q4 production rollout and field deployment support for all integrations, including prototype validation, qualification testing, supplier coordination, technical documentation, and transition-to-production activities.',
          },
        ],
      },
    ],
  },
  { date: 'Jun 29', entries: [{ time: '9:00 AM', fields: '3 fields' }] },
  { date: 'Jun 27', entries: [{ time: '10:50 AM', fields: '4 fields' }] },
  {
    date: 'Jun 24',
    entries: [
      { time: '4:45 PM', fields: '1 field' },
      {
        time: '1:20 PM',
        fields: '5 fields',
        changes: [
          { kind: 'Update', field: 'Priority', from: 'Medium', to: 'High' },
          { kind: 'Update', field: 'Project Manager', from: 'Amelia Patel', to: 'Thomas Nguyen' },
          { kind: 'Update', field: 'Owning Organization', from: '1.02.10 Engineering', to: '1.02.30 Advanced Programs' },
          { kind: 'Update', field: 'Account Group', from: 'GOV', to: 'GOV-FED' },
          {
            kind: 'Update',
            field: 'Description',
            from: 'Provide comprehensive engineering documentation for all microservices, APIs, and SDKs, covering setup, configuration, and operational support for integration teams.',
            to: 'Updated engineering documentation coverage for microservices, APIs, and SDKs, including integration guides, deployment notes, and support procedures for field teams.',
          },
        ],
      },
      { time: '9:05 AM', fields: '2 fields' },
    ],
  },
  { date: 'Jun 22', entries: [{ time: '12:45 PM', fields: '3 fields' }] },
  { date: 'Jun 18', entries: [{ time: '8:30 AM', fields: '3 fields' }] },
  { date: 'Jun 15', entries: [{ time: '4:00 PM', fields: '2 fields' }] },
  { date: 'Jun 11', entries: [{ time: '10:15 AM', fields: '4 fields' }] },
  { date: 'Jun 8', entries: [{ time: '2:25 PM', fields: '2 fields' }] },
  { date: 'Jun 3', entries: [{ time: '9:40 AM', fields: '5 fields' }] },
  { date: 'May 30', entries: [{ time: '3:20 PM', fields: '1 field' }] },
] as const

type HistoryTableChange = {
  kind: string
  field: string
  from: string
  to: string
}

const HISTORY_CHANGE_TEMPLATES: HistoryTableChange[] = [
  { kind: 'Update', field: 'Project Manager', from: 'A. Patel', to: 'M. Rodriguez' },
  { kind: 'Update', field: 'Priority', from: 'Medium', to: 'High' },
  { kind: 'Update', field: 'Owning Organization', from: '1.02.10 Engineering', to: '1.02.30 Advanced Programs' },
  { kind: 'Update', field: 'Account Group', from: 'GOV', to: 'GOV-FED' },
  { kind: 'Update', field: 'Contract Value', from: '$1,850,000', to: '$2,125,000' },
  { kind: 'Update', field: 'Project Type', from: 'Fixed Price', to: 'Cost Plus Fixed Fee' },
  { kind: 'Update', field: 'Start Date', from: '06/01/2026', to: '06/15/2026' },
  { kind: 'Update', field: 'End Date', from: '12/31/2026', to: '03/31/2027' },
  { kind: 'Update', field: 'Billing Status', from: 'On Hold', to: 'Active' },
  { kind: 'Update', field: 'Customer', from: 'Applied Research Group', to: 'Applied Technologies Inc' },
]

const SEARCHABLE_FORM_FIELDS = Array.from(
  new Set([
    'Status',
    'Description',
    ...HISTORY_CHANGE_TEMPLATES.map((template) => template.field),
  ]),
).sort((left, right) => left.localeCompare(right))

function FieldSearchTypeahead({ onSelectField }: { onSelectField: (field: string) => void }) {
  const listboxId = useId().replace(/:/g, '-')
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const filteredFields = SEARCHABLE_FORM_FIELDS.filter((field) =>
    field.toLowerCase().includes(query.trim().toLowerCase()),
  )

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const selectField = (field: string) => {
    setQuery(field)
    setIsOpen(false)
    onSelectField(field)
  }

  return (
    <div className="change-history__typeahead" ref={rootRef}>
      <Input
        type="search"
        icon="magnifying-glass"
        placeholder="Search field name"
        aria-label="Search change history by field name"
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        role="combobox"
        trailing={
          <button
            type="button"
            className="change-history__typeahead-toggle"
            aria-label={isOpen ? 'Hide field list' : 'Show field list'}
            tabIndex={-1}
            onClick={() => setIsOpen((current) => !current)}
          >
            <Icon name="chevron-down" size="sm" />
          </button>
        }
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (!isOpen && (event.key === 'ArrowDown' || event.key === 'Enter')) {
            setIsOpen(true)
            return
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setActiveIndex((current) => Math.min(current + 1, Math.max(filteredFields.length - 1, 0)))
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setActiveIndex((current) => Math.max(current - 1, 0))
          } else if (event.key === 'Enter' && filteredFields[activeIndex]) {
            event.preventDefault()
            selectField(filteredFields[activeIndex])
          } else if (event.key === 'Escape') {
            setIsOpen(false)
          }
        }}
      />
      {isOpen && (
        <ul id={listboxId} className="change-history__typeahead-list" role="listbox">
          {filteredFields.length > 0 ? (
            filteredFields.map((field, index) => (
              <li key={field} role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  className={`change-history__typeahead-option${
                    index === activeIndex ? ' is-active' : ''
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectField(field)}
                >
                  {field}
                </button>
              </li>
            ))
          ) : (
            <li className="change-history__typeahead-empty" role="presentation">
              No matching fields
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

function buildHistoryChanges(entryId: string, fieldCount: number): HistoryTableChange[] {
  const startIndex = [...entryId].reduce((total, character) => total + character.charCodeAt(0), 0)
  return Array.from({ length: fieldCount }, (_, index) => {
    const template = HISTORY_CHANGE_TEMPLATES[(startIndex + index) % HISTORY_CHANGE_TEMPLATES.length]
    return { ...template }
  })
}

function historyKindBadgeVariant(kind: string): BadgeVariant {
  switch (kind) {
    case 'Update':
      return 'success'
    case 'Create':
      return 'info'
    case 'Delete':
      return 'error'
    default:
      return 'default'
  }
}

function HistoryKindBadge({ kind }: { kind: string }) {
  return (
    <Badge
      variant={historyKindBadgeVariant(kind)}
      size="small"
      className="change-history__kind-badge"
    >
      {kind}
    </Badge>
  )
}

function ClampedHistoryValue({ value }: { value: string }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = value.length > 55

  return (
    <div className="change-history__value">
      <span className={isLong && !expanded ? 'change-history__value-text--clamped' : ''}>
        {value}
      </span>
      {isLong && (
        <button
          type="button"
          className="change-history__value-more"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}

function V3ClampedDescriptionLine({
  value,
  emptyLabel,
}: {
  value: string
  emptyLabel: string
}) {
  const [expanded, setExpanded] = useState(false)
  const displayValue = value || emptyLabel
  const canExpand = Boolean(value) && value.length > 120

  if (!value) {
    return (
      <div className="change-history__v3-description-value">
        <p className="is-empty">{displayValue}</p>
      </div>
    )
  }

  const toggleButton = canExpand ? (
    <button
      type="button"
      className="change-history__v3-description-more"
      aria-expanded={expanded}
      onClick={() => setExpanded((current) => !current)}
    >
      {expanded ? 'Less' : 'more'}
    </button>
  ) : null

  return (
    <div className="change-history__v3-description-value">
      {!expanded && canExpand ? (
        <div className="change-history__v3-description-to is-clamped">
          <p className="is-clamped">{displayValue}</p>
          {toggleButton}
        </div>
      ) : (
        <div className="change-history__v3-description-to">
          <p>
            {displayValue}
            {toggleButton ? <> {toggleButton}</> : null}
          </p>
        </div>
      )}
    </div>
  )
}

function V3DescriptionComparison({
  from,
  to,
  showEmptyTransition = false,
}: {
  from: string
  to: string
  showEmptyTransition?: boolean
}) {
  const emptyFromLabel = showEmptyTransition ? 'Description is empty' : 'No description'

  return (
    <div className="change-history__v3-description">
      <div
        className={`change-history__v3-description-values${
          showEmptyTransition && !from ? ' change-history__v3-description-values--transition' : ''
        }`}
      >
        <V3ClampedDescriptionLine value={from} emptyLabel={emptyFromLabel} />
        <div className="change-history__v3-description-arrow" aria-hidden="true">
          <Icon name="arrow-right" size="xs" />
        </div>
        <V3ClampedDescriptionLine value={to} emptyLabel="No description" />
      </div>
    </div>
  )
}

type FieldHistoryRow = {
  date: string
  time: string
  value: string
  year: string
}

const FIELD_VALUE_HISTORY: Record<string, FieldHistoryRow[]> = {
  Status: [
    { date: 'Jun 30, 2026', time: '8:20 AM', value: 'Closed', year: '2026' },
    { date: 'Jun 11, 2026', time: '10:15 AM', value: 'In Review', year: '2026' },
    { date: 'May 12, 2026', time: '2:00 PM', value: 'On Hold', year: '2026' },
    { date: 'Jan 30, 2026', time: '9:40 AM', value: 'Active', year: '2026' },
    { date: 'Nov 3, 2025', time: '9:15 AM', value: 'Draft', year: '2025' },
  ],
  'Project Manager': [
    { date: 'Jun 30, 2026', time: '8:20 AM', value: 'Rajesh Khan', year: '2026' },
    { date: 'Jun 11, 2026', time: '10:15 AM', value: 'Thomas Nguyen', year: '2026' },
    { date: 'May 12, 2026', time: '2:00 PM', value: 'Amelia Patel', year: '2026' },
    { date: 'Jan 30, 2026', time: '9:40 AM', value: 'Jordan Lee', year: '2026' },
    { date: 'Nov 3, 2025', time: '9:15 AM', value: 'Casey Brooks', year: '2025' },
  ],
  Description: [
    {
      date: 'Jun 30, 2026',
      time: '8:20 AM',
      value: 'Updated scope for Q4 production rollout and field deployment support for all integrations.',
      year: '2026',
    },
    {
      date: 'Jun 24, 2026',
      time: '1:20 PM',
      value:
        'Updated engineering documentation coverage for microservices, APIs, and SDKs, including integration guides, deployment notes, and support procedures for field teams.',
      year: '2026',
    },
    {
      date: 'Jun 11, 2026',
      time: '10:15 AM',
      value:
        'Provide comprehensive engineering documentation for all microservices, APIs, and SDKs, covering setup, configuration, and operational support for integration teams.',
      year: '2026',
    },
    {
      date: 'May 12, 2026',
      time: '2:00 PM',
      value: 'Engineering documentation and platform integration support.',
      year: '2026',
    },
    {
      date: 'Jan 30, 2026',
      time: '9:40 AM',
      value: 'Initial project scope for reflector assembly support.',
      year: '2026',
    },
    {
      date: 'Nov 3, 2025',
      time: '9:15 AM',
      value: 'Initial project description.',
      year: '2025',
    },
  ],
}

function V3FieldValueHistory({
  field,
  onBack,
}: {
  field: string
  onBack: () => void
}) {
  const [yearFilter, setYearFilter] = useState('all')
  const rows = FIELD_VALUE_HISTORY[field] ?? [
    { date: 'Jun 30, 2026', time: '8:20 AM', value: 'Current value', year: '2026' },
    { date: 'Jan 30, 2026', time: '9:40 AM', value: 'Previous value', year: '2026' },
    { date: 'Nov 3, 2025', time: '9:15 AM', value: 'Original value', year: '2025' },
  ]
  const yearOptions = Array.from(new Set(rows.map((row) => row.year))).sort((a, b) => Number(b) - Number(a))
  const filteredRows =
    yearFilter === 'all' ? rows : rows.filter((row) => row.year === yearFilter)

  return (
    <div className="change-history__field-history">
      <div className="change-history__field-history-heading">
        <div className="change-history__field-history-title">
          <button type="button" onClick={onBack} aria-label="Back to change history">
            <Icon name="chevron-left" size="sm" />
          </button>
          <h3>{field}</h3>
        </div>
        <label className="change-history__field-history-filter">
          <span className="change-history__field-history-filter-label">Year</span>
          <select
            aria-label="Filter value history by year"
            value={yearFilter}
            onChange={(event) => setYearFilter(event.target.value)}
          >
            <option value="all">All</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="change-history__field-history-columns" aria-hidden="true">
        <strong>Date</strong>
        <strong>Value</strong>
      </div>
      <div className="change-history__field-history-rows">
        {filteredRows.map((row) => (
          <div key={`${row.date}-${row.time}`} className="change-history__field-history-row">
            <time>
              <strong>{row.date}</strong>
              <span>{row.time}</span>
            </time>
            <span>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const V3_SECOND_ENTRY = {
  time: '8:00 AM',
  fields: '3 fields',
  changes: [
    { kind: 'Update', field: 'Billing Status', from: 'On Hold', to: 'Active' },
    { kind: 'Update', field: 'Account Group', from: 'GOV', to: 'GOV-FED' },
    { kind: 'Update', field: 'Priority', from: 'Medium', to: 'High' },
  ],
} as const

type ProjectVersion = 'V1' | 'V2' | 'V3' | 'V4' | 'V5'

function ChangeHistoryPanel({ version }: { version: ProjectVersion }) {
  const historyGroups =
    version === 'V2' || version === 'V4' || version === 'V5'
      ? CHANGE_HISTORY_GROUPS.map((group) =>
          group.date === 'Jun 30'
            ? { ...group, entries: [...group.entries, V3_SECOND_ENTRY] }
            : group,
        )
      : CHANGE_HISTORY_GROUPS
  const [expandedDates, setExpandedDates] = useState<Set<string>>(() =>
    version === 'V2' ? new Set(['Jun 30']) : new Set(),
  )
  const [expandedEntryIds, setExpandedEntryIds] = useState<Set<string>>(() => {
    if (version === 'V1' || version === 'V2') {
      return new Set(['Jun 30-8:20 AM'])
    }
    return new Set()
  })
  const [selectedFieldHistory, setSelectedFieldHistory] = useState<string | null>(null)

  const toggleDate = (date: string, firstEntryId: string | null) => {
    setExpandedDates((current) => {
      const next = new Set(current)
      if (next.has(date)) {
        next.delete(date)
      } else {
        next.add(date)
        if (firstEntryId) {
          setExpandedEntryIds((entries) => {
            if (entries.has(firstEntryId)) return entries
            const nextEntries = new Set(entries)
            nextEntries.add(firstEntryId)
            return nextEntries
          })
        }
      }
      return next
    })
  }

  const toggleEntry = (entryId: string) => {
    setExpandedEntryIds((current) => {
      const next = new Set(current)
      if (next.has(entryId)) {
        next.delete(entryId)
      } else {
        next.add(entryId)
      }
      return next
    })
  }

  return (
    <div className={`change-history change-history--${version.toLowerCase()}`}>
      {(version === 'V2' || version === 'V3' || version === 'V4' || version === 'V5') && selectedFieldHistory ? (
        <V3FieldValueHistory
          field={selectedFieldHistory}
          onBack={() => setSelectedFieldHistory(null)}
        />
      ) : (
        <>
      <div className="change-history__search">
        {version === 'V2' || version === 'V4' || version === 'V5' ? (
          <FieldSearchTypeahead onSelectField={setSelectedFieldHistory} />
        ) : (
          <Input
            type="search"
            icon="magnifying-glass"
            placeholder="Search field name"
            aria-label="Search change history by field name"
          />
        )}
      </div>
      <div className="change-history__timeline">
        {historyGroups.map((group) => {
          const isDateExpanded = expandedDates.has(group.date)
          const firstEntryId = group.entries[0] ? `${group.date}-${group.entries[0].time}` : null
          const totalChanges = group.entries.reduce(
            (total, entry) => total + Number.parseInt(entry.fields, 10),
            0,
          )

          return (
          <section key={group.date} className="change-history__group" aria-labelledby={`history-${group.date.replace(' ', '-')}`}>
            {version === 'V2' ? (
              <button
                type="button"
                id={`history-${group.date.replace(' ', '-')}`}
                className="change-history__date-toggle"
                aria-expanded={isDateExpanded}
                onClick={() => toggleDate(group.date, firstEntryId)}
              >
                <span>
                  <strong>{group.date}</strong>
                </span>
                <span className="change-history__date-meta">
                  <span>
                    Changed {totalChanges} {totalChanges === 1 ? 'time' : 'times'}
                  </span>
                  <Icon
                    name={isDateExpanded ? 'chevron-down' : 'chevron-right'}
                    size="sm"
                    className="change-history__accordion-icon"
                  />
                </span>
              </button>
            ) : version === 'V4' || version === 'V5' ? (
              <div
                id={`history-${group.date.replace(' ', '-')}`}
                className="change-history__date-label"
              >
                <strong>{group.date}</strong>
              </div>
            ) : (
              <h3 id={`history-${group.date.replace(' ', '-')}`}>
                <span aria-hidden="true">•</span>
                {group.date}
              </h3>
            )}
            {(version !== 'V2' || isDateExpanded) && (
              <div className="change-history__entries">
              {group.entries.map((entry) => {
                const entryId = `${group.date}-${entry.time}`
                const isExpanded = expandedEntryIds.has(entryId)
                const changes = 'changes' in entry ? entry.changes : null
                const fieldCount = Number.parseInt(entry.fields, 10)
                const tableChanges = changes ?? buildHistoryChanges(entryId, fieldCount)

                return (
                  <div key={entryId} className="change-history__entry">
                    <button
                      type="button"
                      className="change-history__entry-summary"
                      aria-expanded={isExpanded}
                      aria-controls={`history-entry-${entryId.replace(/\s+/g, '-').replace(':', '-')}`}
                      onClick={() => toggleEntry(entryId)}
                    >
                      <time>{entry.time}</time>
                      <span className="change-history__entry-meta">
                        <span className="change-history__field-count">
                          {version === 'V2' || version === 'V4' || version === 'V5'
                            ? entry.fields.replace('fields', 'changes').replace('field', 'change')
                            : entry.fields}
                        </span>
                        {version === 'V3' && (
                          <Icon
                            name="arrows-pointing-out"
                            size="xs"
                            className="change-history__expand-icon"
                          />
                        )}
                        <Icon
                          name={
                            isExpanded
                              ? 'chevron-down'
                              : version === 'V2' || version === 'V4' || version === 'V5'
                                ? 'chevron-right'
                                : 'chevron-left'
                          }
                          size="sm"
                          className="change-history__accordion-icon"
                        />
                      </span>
                    </button>
                    {isExpanded && (
                      <div
                        id={`history-entry-${entryId.replace(/\s+/g, '-').replace(':', '-')}`}
                        className={`change-history__expanded${
                          version === 'V3' && group.date === 'Jun 29'
                            ? ' change-history__expanded--card-layout'
                            : ''
                        }`}
                      >
                        {version === 'V2' ||
                        version === 'V4' ||
                        version === 'V5' ||
                        (version === 'V3' && group.date === 'Jun 29') ? (
                          <>
                            <h4 className="change-history__v3-title">
                              <Icon name="clipboard-document-list" size="sm" />
                              Project Master
                            </h4>
                            <div className="change-history__v3-changes">
                              {tableChanges.map((change) => (
                                <div
                                  key={change.field}
                                  className={`change-history__v3-change${
                                    change.field === 'Description'
                                      ? ' change-history__v3-change--description'
                                      : ''
                                  }`}
                                >
                                  <div className="change-history__v3-change-heading">
                                    <strong>{change.field}</strong>
                                    <span>
                                      <HistoryKindBadge kind={change.kind} />
                                      <Tooltip text="View change history" position="top">
                                        <Button
                                          variant="outline"
                                          size="xs"
                                          icon="history"
                                          ariaLabel="View change history"
                                          onClick={() => setSelectedFieldHistory(change.field)}
                                        />
                                      </Tooltip>
                                    </span>
                                  </div>
                                  {change.field === 'Description' ? (
                                    <V3DescriptionComparison
                                      from={change.from}
                                      to={change.to}
                                      showEmptyTransition={version === 'V4' || version === 'V5'}
                                    />
                                  ) : (
                                    <p className="change-history__v3-values">
                                      <span>{change.from}</span>
                                      <Icon name="arrow-right" size="xs" />
                                      <span>{change.to}</span>
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        ) : version === 'V3' ? (
                          <>
                            <div className="change-history__project-title">
                              <Icon name="clipboard-document-list" size="xs" />
                              <strong>Project Master</strong>
                            </div>
                            <div className="change-history__table" role="table" aria-label="Project field changes">
                              <div className="change-history__table-row change-history__table-row--header" role="row">
                                <span role="columnheader">Field Name</span>
                                <span role="columnheader">Status</span>
                                <span role="columnheader">From Value</span>
                                <span role="columnheader">To Value</span>
                              </div>
                              {tableChanges.map((change) => (
                                <div key={change.field} className="change-history__table-row" role="row">
                                  <strong role="cell">{change.field}</strong>
                                  <span role="cell">
                                    <HistoryKindBadge kind={change.kind} />
                                  </span>
                                  <span
                                    role="cell"
                                    className={change.field === 'Description' ? 'change-history__table-cell--wrap' : ''}
                                  >
                                    <ClampedHistoryValue value={change.from} />
                                  </span>
                                  <span
                                    role="cell"
                                    className={change.field === 'Description' ? 'change-history__table-cell--wrap' : ''}
                                  >
                                    <ClampedHistoryValue value={change.to} />
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="change-history__object">
                              <Icon name="clipboard-document-list" size="xs" />
                              <strong>Project Master</strong>
                              <span>· {entry.time} CT</span>
                            </div>
                            {changes ? (
                              changes.map((change) => (
                                <div
                                  key={change.field}
                                  className={`change-history__change${
                                    change.field === 'Description'
                                      ? ' change-history__change--description'
                                      : ''
                                  }`}
                                >
                                  <div>
                                    <HistoryKindBadge kind={change.kind} />
                                    <strong>{change.field}</strong>
                                  </div>
                                  <p>
                                    <span>{change.from}</span>
                                    <Icon name="arrow-right" size="xs" />
                                    <span>{change.to}</span>
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="change-history__summary-copy">
                                {entry.fields} updated in this record.
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            )}
          </section>
          )
        })}
      </div>
        </>
      )}
    </div>
  )
}

function ActionMenuButton({ children }: { children: string }) {
  return (
    <button type="button" className="floating-nav__btn floating-nav__btn--secondary floating-nav__btn--dropdown">
      <span className="floating-nav__btn-text">{children}</span>
      <Icon name="chevron-down" size="sm" className="floating-nav__btn-chevron" />
    </button>
  )
}

function ProjectField({
  label,
  value,
  className = '',
  compact = false,
}: {
  label: string
  value: string
  className?: string
  compact?: boolean
}) {
  return (
    <label className={`project-field ${className}`}>
      <span className="project-field__label">{label}</span>
      <input
        className={`project-field__control${compact ? ' project-field__control--compact' : ''}`}
        defaultValue={value}
      />
    </label>
  )
}

function ProjectSelect({
  label,
  value,
  options,
}: {
  label: string
  value: string
  options: string[]
}) {
  return (
    <label className="project-field">
      <span className="project-field__label">{label}</span>
      <select className="project-field__control" defaultValue={value}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function FieldsetHeader({ title }: { title: string }) {
  return (
    <div className="project-fieldset__header">
      <span>{title}</span>
      <label className="project-fieldset__edit">
        <input type="checkbox" />
        Allow Edit
      </label>
    </div>
  )
}

const BUDGET_WIZARD_STEP_LABELS = [
  'Select Project',
  'Select WBS',
  'Create Project Budget/EAC',
] as const

function formatSelectedProjectCaption(projectId: string) {
  const digits = projectId.replace(/^PROJ-?/i, '')
  return `Proj ${digits}`
}

type ProjectBudgetRow = {
  id: string
  name: string
  startDate: string
  endDate: string
  type: string
  contractRev: string
  fundedRev: string
  budget: string
  forecast: string
}

type ProjectWbsRow = {
  id: string
  name: string
  type: string
  version: string
  versionCode: string
  status: string
  closedPeriod: string
  fundedRev: string
  budgetedRevenue: string
  periodOfPerformance: string
}

const PROJECT_BUDGET_ROWS: ProjectBudgetRow[] = [
  {
    id: 'PROJ-000000000000001',
    name: 'A-Lab-Clin1',
    startDate: '01/01/2010',
    endDate: '12/31/2026',
    type: 'A-Lab',
    contractRev: '2160000.00',
    fundedRev: '1160000.00',
    budget: '100,000',
    forecast: '160,000',
  },
  {
    id: 'PROJ-000000000000002',
    name: 'A-Lab-Clin2',
    startDate: '01/01/2012',
    endDate: '12/31/2025',
    type: 'A-Lab',
    contractRev: '980000.00',
    fundedRev: '640000.00',
    budget: '75,000',
    forecast: '92,000',
  },
  {
    id: 'PROJ-000000000000003',
    name: 'Defense 1-Clin1',
    startDate: '03/15/2015',
    endDate: '09/30/2027',
    type: 'Defense 1',
    contractRev: '1060000.00',
    fundedRev: '500000.00',
    budget: '100,000',
    forecast: '150,000',
  },
  {
    id: 'PROJ-000000000000004',
    name: 'Defense 1-Clin2',
    startDate: '06/01/2016',
    endDate: '06/30/2026',
    type: 'Defense 1',
    contractRev: '875000.00',
    fundedRev: '425000.00',
    budget: '82,500',
    forecast: '110,000',
  },
  {
    id: 'PROJ-000000000000005',
    name: 'R&D-Clin1',
    startDate: '01/01/2018',
    endDate: '12/31/2028',
    type: 'R&D',
    contractRev: '540000.00',
    fundedRev: '320000.00',
    budget: '48,000',
    forecast: '61,000',
  },
  {
    id: 'PROJ-000000000000006',
    name: 'R&D-Clin2',
    startDate: '04/01/2019',
    endDate: '03/31/2027',
    type: 'R&D',
    contractRev: '410000.00',
    fundedRev: '275000.00',
    budget: '36,000',
    forecast: '44,500',
  },
  {
    id: 'PROJ-000000000000007',
    name: 'Ops Support-Clin1',
    startDate: '07/01/2014',
    endDate: '12/31/2025',
    type: 'Ops',
    contractRev: '1525000.00',
    fundedRev: '980000.00',
    budget: '125,000',
    forecast: '140,000',
  },
  {
    id: 'PROJ-000000000000008',
    name: 'Ops Support-Clin2',
    startDate: '10/01/2017',
    endDate: '09/30/2026',
    type: 'Ops',
    contractRev: '695000.00',
    fundedRev: '410000.00',
    budget: '58,000',
    forecast: '72,000',
  },
  {
    id: 'PROJ-000000000000009',
    name: 'Training-Clin1',
    startDate: '02/01/2020',
    endDate: '01/31/2026',
    type: 'Training',
    contractRev: '225000.00',
    fundedRev: '180000.00',
    budget: '22,000',
    forecast: '28,500',
  },
  {
    id: 'PROJ-000000000000010',
    name: 'Infrastructure-Clin1',
    startDate: '05/01/2013',
    endDate: '12/31/2030',
    type: 'Infra',
    contractRev: '3250000.00',
    fundedRev: '2100000.00',
    budget: '275,000',
    forecast: '310,000',
  },
  {
    id: 'PROJ-000000000000011',
    name: 'Cyber-Clin1',
    startDate: '08/15/2021',
    endDate: '08/14/2027',
    type: 'Cyber',
    contractRev: '780000.00',
    fundedRev: '560000.00',
    budget: '64,000',
    forecast: '81,000',
  },
  {
    id: 'PROJ-000000000000012',
    name: 'Logistics-Clin1',
    startDate: '11/01/2011',
    endDate: '10/31/2025',
    type: 'Logistics',
    contractRev: '1340000.00',
    fundedRev: '890000.00',
    budget: '112,000',
    forecast: '128,000',
  },
]

const PROJECT_WBS_ROWS: ProjectWbsRow[] = [
  {
    id: 'PROJ-00100.1',
    name: 'R&D-Clin1',
    type: '',
    version: 'V1',
    versionCode: 'CON 101',
    status: '',
    closedPeriod: '06/30/2025',
    fundedRev: '500000.00',
    budgetedRevenue: '0%',
    periodOfPerformance: '01/01/2015 - 12/31/2026',
  },
  {
    id: 'PROJ-00100.1.01',
    name: 'R&D-Clin2',
    type: '',
    version: 'V1',
    versionCode: 'CON 102',
    status: '',
    closedPeriod: '06/30/2025',
    fundedRev: '500000.00',
    budgetedRevenue: '0%',
    periodOfPerformance: '01/01/2015 - 12/31/2026',
  },
  {
    id: 'PROJ-00100.1.02',
    name: 'R&D-Clin3',
    type: '',
    version: 'V1',
    versionCode: 'CON 103',
    status: '',
    closedPeriod: '06/30/2025',
    fundedRev: '500000.00',
    budgetedRevenue: '20%',
    periodOfPerformance: '01/01/2015 - 12/31/2026',
  },
  {
    id: 'PROJ-00100.1.03',
    name: 'R&D-Clin4',
    type: '',
    version: 'V1',
    versionCode: 'CON 104',
    status: '',
    closedPeriod: '06/30/2025',
    fundedRev: '500000.00',
    budgetedRevenue: '0%',
    periodOfPerformance: '01/01/2015 - 12/31/2026',
  },
  {
    id: 'PROJ-00100.1.04',
    name: 'R&D-Clin5',
    type: '',
    version: 'V1',
    versionCode: 'CON 105',
    status: '',
    closedPeriod: '06/30/2025',
    fundedRev: '500000.00',
    budgetedRevenue: '0%',
    periodOfPerformance: '01/01/2015 - 12/31/2026',
  },
  {
    id: 'PROJ-00100.1.05',
    name: 'R&D-Clin6',
    type: '',
    version: 'V1',
    versionCode: 'CON 106',
    status: '',
    closedPeriod: '06/30/2025',
    fundedRev: '500000.00',
    budgetedRevenue: '0%',
    periodOfPerformance: '01/01/2015 - 12/31/2026',
  },
  {
    id: 'PROJ-00100.2',
    name: 'R&D-Clin7',
    type: '',
    version: 'V1',
    versionCode: 'CON 107',
    status: '',
    closedPeriod: '06/30/2025',
    fundedRev: '500000.00',
    budgetedRevenue: '71%',
    periodOfPerformance: '01/01/2015 - 12/31/2026',
  },
  {
    id: 'PROJ-00100.2.01',
    name: 'R&D-Clin8',
    type: '',
    version: 'V1',
    versionCode: 'CON 108',
    status: '',
    closedPeriod: '06/30/2025',
    fundedRev: '500000.00',
    budgetedRevenue: '0%',
    periodOfPerformance: '01/01/2015 - 12/31/2026',
  },
  {
    id: 'PROJ-00100.2.02',
    name: 'R&D-Clin9',
    type: '',
    version: 'V1',
    versionCode: 'CON 109',
    status: '',
    closedPeriod: '06/30/2025',
    fundedRev: '500000.00',
    budgetedRevenue: '0%',
    periodOfPerformance: '01/01/2015 - 12/31/2026',
  },
  {
    id: 'PROJ-00100.2.03',
    name: 'R&D-Clin10',
    type: '',
    version: 'V1',
    versionCode: 'CON 110',
    status: '',
    closedPeriod: '06/30/2025',
    fundedRev: '500000.00',
    budgetedRevenue: '0%',
    periodOfPerformance: '01/01/2015 - 12/31/2026',
  },
  {
    id: 'PROJ-00100.2.04',
    name: 'R&D-Clin11',
    type: '',
    version: 'V1',
    versionCode: 'CON 111',
    status: '',
    closedPeriod: '06/30/2025',
    fundedRev: '500000.00',
    budgetedRevenue: '0%',
    periodOfPerformance: '01/01/2015 - 12/31/2026',
  },
  {
    id: 'PROJ-00100.2.05',
    name: 'R&D-Clin12',
    type: '',
    version: 'V1',
    versionCode: 'CON 112',
    status: '',
    closedPeriod: '06/30/2025',
    fundedRev: '500000.00',
    budgetedRevenue: '0%',
    periodOfPerformance: '01/01/2015 - 12/31/2026',
  },
]

type BudgetTableColumn = string

const BUDGET_RESOURCE_PERIODS = [
  { id: 'p0', date: '01/31/2024', sublabel: '176/180' },
  { id: 'p1', date: '02/29/2024', sublabel: '176/180' },
  { id: 'p2', date: '03/31/2024', sublabel: '176/180' },
  { id: 'p3', date: '04/30/2024', sublabel: '176/180' },
  { id: 'p4', date: '05/31/2024', sublabel: '176/180' },
  { id: 'p5', date: '06/30/2024', sublabel: '176/180' },
  { id: 'p6', date: '07/31/2024', sublabel: '176/180' },
  { id: 'p7', date: '08/31/2024', sublabel: '176/180' },
  { id: 'p8', date: '09/30/2024', sublabel: '176/180' },
  { id: 'p9', date: '10/31/2024', sublabel: '176/180' },
  { id: 'p10', date: '11/30/2024', sublabel: '176/180' },
  { id: 'p11', date: '12/31/2024', sublabel: '176/180' },
] as const

type BudgetResourceRow = {
  id: string
  type: string
  idType: string
  name: string
  total: string
  periods: string[]
}

const BUDGET_RESOURCE_ROWS: BudgetResourceRow[] = [
  {
    id: 'res-carpenter',
    type: 'Employee Plc',
    idType: 'Employee Plc',
    name: 'Carpenter',
    total: '0.00',
    periods: ['0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '132.00', '0.00', '0.00', '0.00', '0.00'],
  },
  {
    id: 'res-tiya',
    type: 'Staff Hours',
    idType: 'Employee',
    name: 'Tiya',
    total: '100.00',
    periods: Array.from({ length: 12 }, () => '132.00'),
  },
  {
    id: 'res-sara',
    type: 'Staff Hours',
    idType: 'Employee',
    name: 'Sara',
    total: '100.00',
    periods: Array.from({ length: 12 }, () => '132.00'),
  },
  {
    id: 'res-amy',
    type: 'Staff Hours',
    idType: 'Employee',
    name: 'Amy',
    total: '120.00',
    periods: Array.from({ length: 12 }, () => '132.00'),
  },
  {
    id: 'res-jason',
    type: 'Staff Hours',
    idType: 'Employee',
    name: 'Jason',
    total: '120.00',
    periods: Array.from({ length: 12 }, () => '132.00'),
  },
  {
    id: 'res-carlo',
    type: 'Staff Hours',
    idType: 'Employee',
    name: 'Carlo',
    total: '120.00',
    periods: Array.from({ length: 12 }, () => '132.00'),
  },
  {
    id: 'res-bushra',
    type: 'Staff Hours',
    idType: 'Employee',
    name: 'Bushra',
    total: '120.00',
    periods: Array.from({ length: 12 }, () => '132.00'),
  },
  {
    id: 'res-penelope',
    type: 'Staff Hours',
    idType: 'Employee',
    name: 'Penelope',
    total: '120.00',
    periods: Array.from({ length: 12 }, () => '132.00'),
  },
]

export function ProjectUserFlowPage() {
  const [wizardStep, setWizardStep] = useState(0)
  const [includeInactive, setIncludeInactive] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState(PROJECT_BUDGET_ROWS[0]?.id ?? '')
  const [selectedWbsId, setSelectedWbsId] = useState(PROJECT_WBS_ROWS[1]?.id ?? PROJECT_WBS_ROWS[0]?.id ?? '')
  const [selectedResourceId, setSelectedResourceId] = useState(BUDGET_RESOURCE_ROWS[0]?.id ?? '')
  const [activeCellColumn, setActiveCellColumn] = useState<BudgetTableColumn>('id')
  const isWbsStep = wizardStep === 1
  const isCreateStep = wizardStep === 2

  const wizardSteps = BUDGET_WIZARD_STEP_LABELS.map((label, index) => {
    if (index === 0 && wizardStep > 0) {
      return {
        label: 'Selected Project',
        description: formatSelectedProjectCaption(selectedProjectId),
        completed: true,
      }
    }
    if (index === 1 && wizardStep > 1) {
      return {
        label: 'Selected WBS',
        description: selectedWbsId,
        completed: true,
      }
    }
    return { label }
  })

  const selectProjectCell = (projectId: string, column: BudgetTableColumn) => {
    setSelectedProjectId(projectId)
    setActiveCellColumn(column)
  }

  const selectWbsCell = (wbsId: string, column: BudgetTableColumn) => {
    setSelectedWbsId(wbsId)
    setActiveCellColumn(column)
  }

  const selectResourceCell = (resourceId: string, column: BudgetTableColumn) => {
    setSelectedResourceId(resourceId)
    setActiveCellColumn(column)
  }

  const goToStep = (step: number) => {
    setWizardStep(step)
    setActiveCellColumn(step === 2 ? 'type' : 'id')
  }

  const floatingNavActions = (
    <>
      <div className="floating-nav__buttons">
        <ActionMenuButton>Actions</ActionMenuButton>
        <button
          type="button"
          className="floating-nav__btn floating-nav__btn--secondary floating-nav__btn--icon-dropdown"
          aria-label="Refresh options"
        >
          <Icon name="arrow-path" size="md" className="floating-nav__btn-icon" />
          <Icon name="chevron-down" size="sm" className="floating-nav__btn-chevron" />
        </button>
      </div>
      <div className="floating-nav__divider" />
      <button type="button" className="floating-nav__pin" aria-label="Pin navigation">
        <Icon name="pin" size="md" className="floating-nav__pin-icon" />
      </button>
    </>
  )

  const tableHeader = (
    <thead>
      <tr>
        <th className="budget-table__lead-col" scope="col">
          <input
            type="checkbox"
            aria-label={
              isCreateStep ? 'Select all resources' : isWbsStep ? 'Select all WBS' : 'Select all projects'
            }
          />
        </th>
        {isCreateStep ? (
          <>
            <th scope="col">Type</th>
            <th scope="col">ID Type</th>
            <th scope="col">Name</th>
          </>
        ) : isWbsStep ? (
          <>
            <th scope="col">Project ID</th>
            <th scope="col">Project Name</th>
            <th scope="col">Type</th>
            <th scope="col">Version</th>
            <th scope="col">Version Code</th>
            <th scope="col">Status</th>
            <th scope="col">Closed Period</th>
            <th className="budget-table__num" scope="col">
              Funded Rev
            </th>
            <th className="budget-table__num" scope="col">
              Budgeted Revenue
            </th>
            <th scope="col">Period Of Performance</th>
          </>
        ) : (
          <>
            <th scope="col">Project ID</th>
            <th scope="col">Project Name</th>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
            <th scope="col">Project Type</th>
            <th className="budget-table__num" scope="col">
              Contract Rev
            </th>
            <th className="budget-table__num" scope="col">
              Funded Rev
            </th>
            <th className="budget-table__num" scope="col">
              Budget
            </th>
            <th className="budget-table__num" scope="col">
              Forecast
            </th>
          </>
        )}
      </tr>
    </thead>
  )

  const tableBody = (
    <tbody>
      {isCreateStep
        ? BUDGET_RESOURCE_ROWS.map((row) => {
            const isSelected = row.id === selectedResourceId
            const cellClass = (column: BudgetTableColumn, extra?: string) =>
              [extra, isSelected && activeCellColumn === column ? 'is-active-cell' : undefined]
                .filter(Boolean)
                .join(' ') || undefined

            return (
              <tr
                key={row.id}
                data-row-id={row.id}
                className={isSelected ? 'is-selected table-row--selected' : undefined}
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => selectResourceCell(row.id, 'type')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    selectResourceCell(row.id, activeCellColumn)
                  }
                }}
              >
                <td
                  className={cellClass('lead', 'budget-table__lead-col')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectResourceCell(row.id, 'lead')
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    aria-label={`Select ${row.name}`}
                  />
                </td>
                <td
                  className={cellClass('type')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectResourceCell(row.id, 'type')
                  }}
                >
                  {row.type}
                </td>
                <td
                  className={cellClass('idType')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectResourceCell(row.id, 'idType')
                  }}
                >
                  {row.idType}
                </td>
                <td
                  className={cellClass('name')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectResourceCell(row.id, 'name')
                  }}
                >
                  {row.name}
                </td>
              </tr>
            )
          })
        : isWbsStep
        ? PROJECT_WBS_ROWS.map((row) => {
            const isSelected = row.id === selectedWbsId
            const cellClass = (column: BudgetTableColumn, extra?: string) =>
              [extra, isSelected && activeCellColumn === column ? 'is-active-cell' : undefined]
                .filter(Boolean)
                .join(' ') || undefined

            return (
              <tr
                key={row.id}
                data-row-id={row.id}
                className={isSelected ? 'is-selected table-row--selected' : undefined}
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => selectWbsCell(row.id, 'id')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    selectWbsCell(row.id, activeCellColumn)
                  }
                }}
              >
                <td
                  className={cellClass('lead', 'budget-table__lead-col')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectWbsCell(row.id, 'lead')
                  }}
                />
                <td
                  className={cellClass('id')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectWbsCell(row.id, 'id')
                  }}
                >
                  {row.id}
                </td>
                <td
                  className={cellClass('name')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectWbsCell(row.id, 'name')
                  }}
                >
                  {row.name}
                </td>
                <td
                  className={cellClass('type')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectWbsCell(row.id, 'type')
                  }}
                >
                  {row.type}
                </td>
                <td
                  className={cellClass('version')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectWbsCell(row.id, 'version')
                  }}
                >
                  {row.version}
                </td>
                <td
                  className={cellClass('versionCode')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectWbsCell(row.id, 'versionCode')
                  }}
                >
                  {row.versionCode}
                </td>
                <td
                  className={cellClass('status')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectWbsCell(row.id, 'status')
                  }}
                >
                  {row.status}
                </td>
                <td
                  className={cellClass('closedPeriod')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectWbsCell(row.id, 'closedPeriod')
                  }}
                >
                  {row.closedPeriod}
                </td>
                <td
                  className={cellClass('fundedRev', 'budget-table__num')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectWbsCell(row.id, 'fundedRev')
                  }}
                >
                  {row.fundedRev}
                </td>
                <td
                  className={cellClass('budgetedRevenue', 'budget-table__num')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectWbsCell(row.id, 'budgetedRevenue')
                  }}
                >
                  {row.budgetedRevenue}
                </td>
                <td
                  className={cellClass('periodOfPerformance')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectWbsCell(row.id, 'periodOfPerformance')
                  }}
                >
                  {row.periodOfPerformance}
                </td>
              </tr>
            )
          })
        : PROJECT_BUDGET_ROWS.map((row) => {
            const isSelected = row.id === selectedProjectId
            const cellClass = (column: BudgetTableColumn, extra?: string) =>
              [extra, isSelected && activeCellColumn === column ? 'is-active-cell' : undefined]
                .filter(Boolean)
                .join(' ') || undefined

            return (
              <tr
                key={row.id}
                data-row-id={row.id}
                className={isSelected ? 'is-selected table-row--selected' : undefined}
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => selectProjectCell(row.id, 'id')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    selectProjectCell(row.id, activeCellColumn)
                  }
                }}
              >
                <td
                  className={cellClass('lead', 'budget-table__lead-col')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectProjectCell(row.id, 'lead')
                  }}
                />
                <td
                  className={cellClass('id')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectProjectCell(row.id, 'id')
                  }}
                >
                  {row.id}
                </td>
                <td
                  className={cellClass('name')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectProjectCell(row.id, 'name')
                  }}
                >
                  {row.name}
                </td>
                <td
                  className={cellClass('startDate')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectProjectCell(row.id, 'startDate')
                  }}
                >
                  {row.startDate}
                </td>
                <td
                  className={cellClass('endDate')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectProjectCell(row.id, 'endDate')
                  }}
                >
                  {row.endDate}
                </td>
                <td
                  className={cellClass('type')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectProjectCell(row.id, 'type')
                  }}
                >
                  {row.type}
                </td>
                <td
                  className={cellClass('contractRev', 'budget-table__num')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectProjectCell(row.id, 'contractRev')
                  }}
                >
                  {row.contractRev}
                </td>
                <td
                  className={cellClass('fundedRev', 'budget-table__num')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectProjectCell(row.id, 'fundedRev')
                  }}
                >
                  {row.fundedRev}
                </td>
                <td
                  className={cellClass('budget', 'budget-table__num')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectProjectCell(row.id, 'budget')
                  }}
                >
                  {row.budget}
                </td>
                <td
                  className={cellClass('forecast', 'budget-table__num')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectProjectCell(row.id, 'forecast')
                  }}
                >
                  {row.forecast}
                </td>
              </tr>
            )
          })}
    </tbody>
  )

  const resourceScrollHeader = (
    <thead>
      <tr>
        <th className="budget-table__num" scope="col">
          Total
        </th>
        {BUDGET_RESOURCE_PERIODS.map((period) => (
          <th key={period.id} className="budget-table__num budget-table__period" scope="col">
            <span className="budget-table__period-date">{period.date}</span>
            <span className="budget-table__period-sub">{period.sublabel}</span>
          </th>
        ))}
      </tr>
    </thead>
  )

  const resourceScrollBody = (
    <tbody>
      {BUDGET_RESOURCE_ROWS.map((row) => {
        const isSelected = row.id === selectedResourceId
        const cellClass = (column: BudgetTableColumn, extra?: string) =>
          [extra, isSelected && activeCellColumn === column ? 'is-active-cell' : undefined]
            .filter(Boolean)
            .join(' ') || undefined

        return (
          <tr
            key={row.id}
            data-row-id={row.id}
            className={isSelected ? 'is-selected table-row--selected' : undefined}
            aria-selected={isSelected}
            tabIndex={0}
            onClick={() => selectResourceCell(row.id, 'total')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                selectResourceCell(row.id, activeCellColumn)
              }
            }}
          >
            <td
              className={cellClass('total', 'budget-table__num')}
              onClick={(event) => {
                event.stopPropagation()
                selectResourceCell(row.id, 'total')
              }}
            >
              {row.total}
            </td>
            {row.periods.map((value, periodIndex) => {
              const column = `period-${periodIndex}`
              return (
                <td
                  key={`${row.id}-${column}`}
                  className={cellClass(column, 'budget-table__num')}
                  onClick={(event) => {
                    event.stopPropagation()
                    selectResourceCell(row.id, column)
                  }}
                >
                  {value}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  )

  return (
    <ShellLayout
      productName="Costpoint"
      logoSrc="/logos/CPVPLogo.svg"
      companyName="Applied Technologies Inc"
      companyColor="#f66e57"
      companies={[
        { id: 'ati', name: 'Applied Technologies Inc', color: '#f66e57' },
        { id: 'deltek', name: 'Deltek Demo Company', color: '#4c92d9' },
      ]}
      showFooter={false}
      showFloatingNav
      floatingNavActions={floatingNavActions}
      leftSidebarVariant="cp"
      rightSidebarVariant="cp"
      leftSidebarSections={LEFT_SECTIONS}
      rightSidebarSections={RIGHT_SECTIONS}
      showRightShellPanel={false}
      pageHeaderTitle=""
      className="project-user-flow-shell"
    >
      <div className="project-user-flow-bg" aria-hidden="true" />

      <section className="project-window budget-window" aria-labelledby="project-window-title">
        <header className="project-window__titlebar budget-window__titlebar">
          <h1 id="project-window-title">Projects Budget /EAC</h1>
          <div className="budget-window__title-actions">
            <button type="button" className="project-window__icon-btn" aria-label="Card view">
              <Icon name="squares-2x2" size="sm" />
            </button>
            <button type="button" className="project-window__icon-btn is-active" aria-label="Grid view">
              <Icon name="view-columns" size="sm" />
            </button>
            <button type="button" className="project-window__icon-btn" aria-label="Minimize">
              <Icon name="minus" size="sm" />
            </button>
            <button type="button" className="project-window__icon-btn" aria-label="Close">
              <Icon name="x-mark" size="sm" />
            </button>
          </div>
        </header>

        <div className="budget-window__body">
          <div className="budget-wizard">
            <Stepper
              className="budget-wizard__stepper"
              activeStep={wizardStep}
              steps={wizardSteps}
              onStepClick={goToStep}
              nonLinear
            />
          </div>

          <div className="budget-toolbar">
            {isCreateStep ? (
              <div className="budget-toolbar__group">
                <Button size="sm" variant="secondary" className="budget-toolbar__secondary">
                  Fill
                </Button>
                <Button size="sm" variant="secondary" className="budget-toolbar__secondary">
                  Distribute
                </Button>
                <Button size="sm" variant="secondary" className="budget-toolbar__secondary">
                  Delete
                </Button>
              </div>
            ) : isWbsStep ? (
              <Button size="sm" variant="secondary" className="budget-toolbar__secondary">
                Delete
              </Button>
            ) : (
              <Checkbox
                label="Include Inactive Projects"
                checked={includeInactive}
                onChange={(event) => setIncludeInactive(event.target.checked)}
              />
            )}
            <div className="budget-toolbar__actions">
              {isCreateStep ? (
                <>
                  <Button size="sm" variant="secondary" className="budget-toolbar__secondary">
                    New
                  </Button>
                  <Button size="sm" variant="secondary" className="budget-toolbar__secondary">
                    Add Resources in bulk
                  </Button>
                </>
              ) : null}
              {isWbsStep ? (
                <>
                  <Button size="sm" variant="outline" disabled className="budget-toolbar__action">
                    Modify
                  </Button>
                  <Button size="sm" variant="outline" disabled className="budget-toolbar__action">
                    Compare Versions
                  </Button>
                </>
              ) : null}
              <Button
                size="sm"
                variant="outline"
                icon="chevron-down"
                iconPosition="right"
                className="budget-toolbar__query"
              >
                Query
              </Button>
            </div>
          </div>

          {isCreateStep ? (
            <div className="budget-split-table" role="group" aria-label="Resource budget table">
              <div className="budget-split-table__pane budget-split-table__pane--fixed budget-table-shell">
                <Table
                  className="budget-table budget-table--resources budget-table--resources-fixed"
                  headerVariant="gray"
                  header={tableHeader}
                  body={tableBody}
                />
              </div>
              <div className="budget-split-table__gutter" aria-hidden="true" />
              <div className="budget-split-table__pane budget-split-table__pane--scroll budget-table-shell budget-table-shell--scroll">
                <Table
                  className="budget-table budget-table--resources budget-table--resources-scroll"
                  headerVariant="gray"
                  header={resourceScrollHeader}
                  body={resourceScrollBody}
                />
              </div>
            </div>
          ) : (
            <div
              className={`budget-table-shell${isWbsStep ? ' budget-table-shell--scroll' : ''}`}
              style={
                isWbsStep
                  ? {
                      overflowX: 'scroll',
                      overflowY: 'hidden',
                      maxWidth: '100%',
                      width: '100%',
                    }
                  : undefined
              }
            >
              <Table
                className={`budget-table${isWbsStep ? ' budget-table--wbs' : ''}`}
                headerVariant="gray"
                header={tableHeader}
                body={tableBody}
              />
            </div>
          )}

          <footer className="budget-window__footer">
            <Button
              size="sm"
              variant="secondary"
              disabled={wizardStep === 0}
              className="budget-window__back"
              onClick={() => goToStep(Math.max(wizardStep - 1, 0))}
            >
              Back
            </Button>
            <Button
              size="sm"
              className="budget-window__next"
              onClick={() =>
                goToStep(Math.min(wizardStep + 1, BUDGET_WIZARD_STEP_LABELS.length - 1))
              }
            >
              Next
            </Button>
          </footer>
        </div>
      </section>
    </ShellLayout>
  )
}
