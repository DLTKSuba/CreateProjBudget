import { useEffect, useId, useRef, useState } from 'react'
import { Badge } from '../components/harmony/Badge'
import type { BadgeVariant } from '../components/harmony/Badge'
import { Button } from '../components/harmony/Button'
import { Checkbox } from '../components/harmony/Checkbox'
import { Icon } from '../components/harmony/Icon'
import { Input } from '../components/harmony/Input'
import { ShellLayout } from '../components/harmony/ShellLayout'
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

const VERSION_OPTIONS: { value: ProjectVersion; label: string }[] = [
  { value: 'V4', label: 'Design Proposal' },
  { value: 'V1', label: 'Original/Current Version' },
  { value: 'V2', label: 'Propose -V2' },
  { value: 'V5', label: 'Proposal Version V4 - Update' },
  { value: 'V3', label: 'Other Design Exploration - V3' },
]

const OTHER_IDEA_VALUES = new Set<ProjectVersion>(['V1', 'V2', 'V3', 'V5'])

function VersionPicker({
  value,
  onChange,
}: {
  value: ProjectVersion
  onChange: (version: ProjectVersion) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selectedLabel =
    VERSION_OPTIONS.find((option) => option.value === value)?.label ?? 'Design Proposal'

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="project-version-picker" ref={rootRef}>
      <span className="project-version-picker__label">Application version</span>
      <button
        type="button"
        className="project-version-picker__trigger"
        aria-label="Application version"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{selectedLabel}</span>
        <Icon name="chevron-down" size="sm" />
      </button>
      {isOpen && (
        <ul className="project-version-picker__menu" role="listbox" aria-label="Application version">
          <li role="option" aria-selected={value === 'V4'}>
            <button
              type="button"
              className={`project-version-picker__option project-version-picker__option--primary${
                value === 'V4' ? ' is-selected' : ''
              }`}
              onClick={() => {
                onChange('V4')
                setIsOpen(false)
              }}
            >
              Design Proposal
            </button>
          </li>
          <li className="project-version-picker__divider" role="separator" aria-hidden="true" />
          <li className="project-version-picker__group-label" role="presentation">
            Other Ideas (Ignore)
          </li>
          {VERSION_OPTIONS.filter((option) => OTHER_IDEA_VALUES.has(option.value)).map((option) => (
            <li key={option.value} role="option" aria-selected={value === option.value}>
              <button
                type="button"
                className={`project-version-picker__option project-version-picker__option--ignored${
                  value === option.value ? ' is-selected' : ''
                }`}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function ProjectUserFlowPage() {
  const [activeDefinitionTab, setActiveDefinitionTab] = useState<'basic' | 'details'>('basic')
  const [activeProjectTab, setActiveProjectTab] = useState<string | null>(null)
  const [version, setVersion] = useState<ProjectVersion>('V4')

  const floatingNavActions = (
    <>
      <div className="floating-nav__buttons">
        <button type="button" className="floating-nav__btn floating-nav__btn--secondary">
          Clone
        </button>
        <ActionMenuButton>Actions</ActionMenuButton>
        <button
          type="button"
          className="floating-nav__btn floating-nav__btn--secondary floating-nav__btn--icon-dropdown"
          aria-label="Refresh options"
        >
          <Icon name="arrow-path" size="md" className="floating-nav__btn-icon" />
          <Icon name="chevron-down" size="sm" className="floating-nav__btn-chevron" />
        </button>
        <button type="button" className="floating-nav__btn floating-nav__btn--primary floating-nav__btn--dropdown">
          <span className="floating-nav__btn-text">Save</span>
          <Icon name="chevron-down" size="sm" className="floating-nav__btn-chevron" />
        </button>
      </div>
      <div className="floating-nav__divider" />
      <button type="button" className="floating-nav__pin" aria-label="Enter full screen">
        <Icon name="arrows-pointing-out" size="md" className="floating-nav__pin-icon" />
      </button>
      <button type="button" className="floating-nav__pin" aria-label="Pin navigation">
        <Icon name="pin" size="md" className="floating-nav__pin-icon" />
      </button>
    </>
  )

  return (
    <ShellLayout
      productName="Costpoint"
      logoSrc="/logos/CPVPLogo.svg"
      companyName="Applied Technologies Inc"
      companies={[
        { id: 'ati', name: 'Applied Technologies Inc', color: '#4c92d9' },
        { id: 'deltek', name: 'Deltek Demo Company', color: '#7367f0' },
      ]}
      beforeCompanyPicker={<VersionPicker value={version} onChange={setVersion} />}
      showFooter={false}
      showFloatingNav
      floatingNavActions={floatingNavActions}
      leftSidebarVariant="cp"
      rightSidebarVariant="cp"
      leftSidebarSections={LEFT_SECTIONS}
      rightSidebarSections={RIGHT_SECTIONS}
      showRightShellPanel
      rightShellPanelInitialTitle="Change History"
      rightShellPanelInitialTitleIcon="history"
      rightShellPanelSlot={<ChangeHistoryPanel key={version} version={version} />}
      pageHeaderTitle=""
      className="project-user-flow-shell"
    >
      <div className="project-user-flow-bg" aria-hidden="true">
        <span className="project-user-flow-bg__grid" />
        <span className="project-user-flow-bg__dial project-user-flow-bg__dial--large" />
        <span className="project-user-flow-bg__dial project-user-flow-bg__dial--small" />
      </div>

      <section className="project-window" aria-labelledby="project-window-title">
        <header className="project-window__titlebar">
          <h1 id="project-window-title">Manage Project User Flow</h1>
          <div className="project-window__record-actions">
            <Button size="xs">New</Button>
            <Button size="xs" variant="outline" icon="document" iconPosition="right">
              Copy
            </Button>
            <Button size="xs" variant="outline">Delete</Button>
            <Button size="xs" variant="outline" icon="chevron-down" iconPosition="right">
              Attach
            </Button>
            <Button size="xs" variant="outline">Approval</Button>
            <span className="project-window__record-count" aria-label="Record navigation">
              <input type="checkbox" aria-label="Select record" />
              <Icon name="chevron-left" size="xs" />
              <strong>1 of 1 Existing</strong>
              <Icon name="chevron-right" size="xs" />
            </span>
            <Input className="project-window__find" placeholder="Find" aria-label="Find project" />
            <Button size="xs" className="project-window__query">Query</Button>
            <Button size="xs" icon="squares-2x2" ariaLabel="Card view" />
            <Button size="xs" variant="outline" icon="view-columns" ariaLabel="Grid view" />
            <button className="project-window__icon-btn" type="button" aria-label="More actions">
              <Icon name="ellipsis-horizontal" size="sm" />
            </button>
            <button className="project-window__icon-btn" type="button" aria-label="Minimize">
              <Icon name="minus" size="sm" />
            </button>
            <button className="project-window__icon-btn" type="button" aria-label="Close">
              <Icon name="x-mark" size="sm" />
            </button>
          </div>
        </header>

        <div className="project-window__identity">
          <ProjectField label="Project*" value="9000.004.10" compact />
          <ProjectField label="Name*" value="V3 PRODUCTION REFLECTORS..." className="project-field--grow" />
          <ProjectField label="Abbreviation" value="980AMA" compact />
          <ProjectField label="Level" value="3" compact />
          <Button size="xs">Load Defaults</Button>
        </div>

        <nav className="project-window__definition-tabs" aria-label="Project definition sections">
          <button type="button" className="project-window__definition-label">
            Primary Definitions
          </button>
          <button
            type="button"
            className={activeDefinitionTab === 'basic' ? 'is-active' : ''}
            onClick={() => setActiveDefinitionTab('basic')}
          >
            Basic Info
          </button>
          <button
            type="button"
            className={activeDefinitionTab === 'details' ? 'is-active' : ''}
            onClick={() => setActiveDefinitionTab('details')}
          >
            Details
          </button>
        </nav>

        <div className="project-window__form">
          <fieldset className="project-fieldset">
            <FieldsetHeader title="Classification" />
            <ProjectField label="Project Classification" value="DIRECT PROJECT" />
            <ProjectSelect label="Project Type" value="FIXED PRICE" options={['FIXED PRICE', 'COST PLUS', 'TIME & MATERIALS']} />
            <ProjectSelect label="Export Project" value="Time & Expense Project" options={['Time & Expense Project', 'Billing Project', 'No Export']} />
            <div className="project-fieldset__checks">
              <Checkbox label="Billable Project" defaultChecked />
              <Checkbox label="Apply Cost of Money Rates" />
              <Checkbox label="Cobra Project" />
            </div>
            <ProjectField label="Cobra Mapping V..." value="" />
            <a className="project-fieldset__link" href="#project-roles">Project Roles</a>
          </fieldset>

          <fieldset className="project-fieldset">
            <FieldsetHeader title="Charging" />
            <div className="project-fieldset__checks project-fieldset__checks--two-column">
              <Checkbox label="Active" defaultChecked />
              <Checkbox label="Allow Charging" defaultChecked />
            </div>
            <ProjectSelect label="Account Group" value="GOV" options={['GOV', 'COMMERCIAL', 'INTERNAL']} />
            <div className="project-fieldset__checks">
              <Checkbox label="Organizations" defaultChecked />
              <Checkbox label="Which Orgs Can Charge Specific Accts" />
              <Checkbox label="Allow Edit" />
              <Checkbox label="Export to Shop Floor Time" />
              <Checkbox label="Export to Manufacturing Execution" />
              <Checkbox label="Export Project Workforce to Talent" />
            </div>
          </fieldset>

          <fieldset className="project-fieldset">
            <FieldsetHeader title="Controls" />
            <ProjectField label="Owning Org" value="" />
            <div className="project-fieldset__checks">
              <Checkbox label="Default to Owning Organization" defaultChecked />
              <Checkbox label="Project Workforce Required" defaultChecked />
              <Checkbox label="Use Top Level Workforce" />
              <Checkbox label="Apply Salary Cap" />
            </div>
            <ProjectField label="Salary Cap Code" value="" />
            <a className="project-fieldset__link project-fieldset__link--inline" href="#acrn-options">
              ACRN Options
            </a>
            <div className="project-fieldset__checks project-fieldset__checks--bottom">
              <Checkbox label="Allow Edit" />
              <Checkbox label="ACRN Warnings With Modifications Changes" />
            </div>
          </fieldset>
        </div>

        <nav className="project-window__bottom-tabs" aria-label="Project detail tabs">
          {PROJECT_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeProjectTab === tab ? 'is-active' : ''}
              onClick={() => setActiveProjectTab(tab)}
            >
              {tab}
              {tab === 'ACRN' && <span className="project-window__tab-count">1</span>}
            </button>
          ))}
        </nav>
      </section>
    </ShellLayout>
  )
}
