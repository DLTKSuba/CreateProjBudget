import { useEffect, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { Alert } from '../components/harmony/Alert'
import { Badge } from '../components/harmony/Badge'
import type { BadgeVariant } from '../components/harmony/Badge'
import { Button } from '../components/harmony/Button'
import { ButtonGroup } from '../components/harmony/ButtonGroup'
import { Checkbox } from '../components/harmony/Checkbox'
import { Dialog } from '../components/harmony/Dialog'
import { Dropdown } from '../components/harmony/Dropdown'
import { Icon } from '../components/harmony/Icon'
import { RadioButton } from '../components/harmony/RadioButton'
import { ShellLayout } from '../components/harmony/ShellLayout'
import { Stepper } from '../components/harmony/Stepper'
import { Table } from '../components/harmony/Table'
import { TabStrip } from '../components/harmony/TabStrip'
import type { LeftSidebarSection } from '../components/harmony/LeftSidebar'
import type { RightSidebarSection } from '../components/harmony/RightSidebar'
import './ProjectUserFlowPage.css'

const CREATE_BUDGET_TABS = [
  { id: 'create-budget', label: 'Create Budget' },
  { id: 'create-eac', label: 'Create EAC' },
] as const

const CREATE_BUDGET_SEGMENTS = [
  { id: 'hours', label: 'Hours' },
  { id: 'amount', label: 'Amount' },
  { id: 'staff-escalation', label: 'Staff Escalation' },
  { id: 'analysis-by-period', label: 'Analysis By Period' },
] as const

const PROJECT_CREATED_MESSAGE = 'Project Budget/EAC created'

const WBS_DESIGN_VERSIONS = [
  { value: 'v1', label: 'V1 — Grouped columns' },
  { value: 'v2', label: 'V2 — Hierarchical tree' },
] as const

type WbsDesignVersion = (typeof WBS_DESIGN_VERSIONS)[number]['value']

type ResizableColumn = { key: string; label: string; width: number }

const MIN_COLUMN_WIDTH = 56

type WbsColumnGroup = 'lead' | 'wbs' | 'budget' | 'eac' | 'shared' | 'detail'

type WbsColumnDef = ResizableColumn & {
  group: WbsColumnGroup
  num?: boolean
  sortable?: boolean
}

const WBS_COLUMN_GROUPS = [
  { key: 'wbs', label: 'WBS Attributes' },
  { key: 'budget', label: 'Budget Attributes' },
  { key: 'eac', label: 'EAC Attributes' },
] as const

const WBS_GRID_COLUMNS: WbsColumnDef[] = [
  { key: 'lead', label: 'Select', group: 'lead', width: 36 },
  { key: 'id', label: 'Project ID', group: 'wbs', width: 150 },
  { key: 'name', label: 'Project Name', group: 'wbs', width: 150 },
  { key: 'wbsLevel', label: 'WBS Level', group: 'wbs', width: 92, num: true, sortable: true },
  { key: 'fundingIndicator', label: 'Funding WBS Indicator', group: 'wbs', width: 168 },
  { key: 'fundedRevenue', label: 'Funded Revenue', group: 'wbs', width: 130, num: true, sortable: true },
  { key: 'budgetedRevenue', label: 'Budgeted Revenue', group: 'wbs', width: 134, num: true },
  { key: 'contractValue', label: 'Contract Value', group: 'wbs', width: 134, num: true, sortable: true },
  { key: 'closedPeriod', label: 'Closed Period', group: 'wbs', width: 120 },
  { key: 'startDate', label: 'Start Date', group: 'wbs', width: 112 },
  { key: 'endDate', label: 'End Date', group: 'wbs', width: 112 },
  { key: 'budgetExists', label: 'Budget Exists', group: 'budget', width: 112 },
  { key: 'budgetVersion', label: 'Budget Version', group: 'budget', width: 118 },
  { key: 'budgetStatus', label: 'Budget Status', group: 'budget', width: 112 },
  { key: 'budgetAmount', label: 'Budget Amount', group: 'budget', width: 130, num: true, sortable: true },
  { key: 'budgetRevenue', label: 'Budget Revenue', group: 'budget', width: 130, num: true, sortable: true },
  { key: 'budgetCost', label: 'Budget Cost', group: 'budget', width: 130, num: true, sortable: true },
  { key: 'budgetVariance', label: 'Budget Variance', group: 'budget', width: 134, num: true, sortable: true },
  { key: 'eacExists', label: 'EAC Exists', group: 'eac', width: 104 },
  { key: 'eacVersion', label: 'EAC Version', group: 'eac', width: 110 },
  { key: 'eacStatus', label: 'EAC Status', group: 'eac', width: 104 },
  { key: 'currentEacAmount', label: 'Current EAC Amount', group: 'eac', width: 152, num: true, sortable: true },
  { key: 'etc', label: 'Estimate To Complete (ETC)', group: 'eac', width: 186, num: true, sortable: true },
  { key: 'costVariance', label: 'Cost Variance', group: 'eac', width: 132, num: true, sortable: true },
  { key: 'variancePct', label: 'Variance %', group: 'eac', width: 116, num: true, sortable: true },
  { key: 'actualCostItd', label: 'Actual Cost ITD', group: 'eac', width: 134, num: true, sortable: true },
]

const WBS_GROUP_START_KEYS = new Set(
  WBS_COLUMN_GROUPS.map(
    (group) => WBS_GRID_COLUMNS.find((column) => column.group === group.key)?.key,
  ).filter((key): key is string => Boolean(key)),
)

const WBS_VARIANCE_TONE_KEYS = new Set(['costVariance', 'variancePct'])
const WBS_TREE_VARIANCE_TONE_KEYS = new Set(['variance', 'variancePct'])

const WBS_TREE_COLUMN_GROUPS = [
  { key: 'wbs', label: 'WBS Attributes' },
  { key: 'shared', label: 'Budget / EAC Attributes' },
  { key: 'detail', label: 'Additional Attributes' },
] as const

const WBS_TREE_COLUMNS: WbsColumnDef[] = [
  { key: 'tree', label: 'WBS', group: 'lead', width: 320 },
  { key: 'version', label: 'Version', group: 'shared', width: 92 },
  { key: 'status', label: 'Status', group: 'shared', width: 104 },
  { key: 'amount', label: 'Amount', group: 'shared', width: 132, num: true },
  { key: 'fundedRevenue', label: 'Funded Revenue', group: 'wbs', width: 130, num: true, sortable: true },
  { key: 'budgetedRevenue', label: 'Budgeted Revenue', group: 'wbs', width: 134, num: true },
  { key: 'contractValue', label: 'Contract Value', group: 'wbs', width: 134, num: true, sortable: true },
  { key: 'closedPeriod', label: 'Closed Period', group: 'wbs', width: 120 },
  { key: 'startDate', label: 'Start Date', group: 'wbs', width: 112 },
  { key: 'endDate', label: 'End Date', group: 'wbs', width: 112 },
  { key: 'variance', label: 'Variance', group: 'shared', width: 134, num: true },
  { key: 'revenue', label: 'Budget Revenue', group: 'detail', width: 136, num: true },
  { key: 'cost', label: 'Budget Cost', group: 'detail', width: 126, num: true },
  { key: 'etc', label: 'ETC', group: 'detail', width: 126, num: true },
  { key: 'variancePct', label: 'Variance %', group: 'detail', width: 116, num: true },
  { key: 'actualCostItd', label: 'Actual Cost ITD', group: 'detail', width: 134, num: true },
]

const WBS_TREE_GROUP_START_KEYS = new Set(
  WBS_TREE_COLUMN_GROUPS.map(
    (group) => WBS_TREE_COLUMNS.find((column) => column.group === group.key)?.key,
  ).filter((key): key is string => Boolean(key)),
)

/* Totals are rendered under their own column, so only currency columns roll up.
   Percentages and level counters are intentionally excluded. */
const WBS_TOTAL_SIGNED_KEYS = new Set(['budgetVariance', 'costVariance', 'variance'])

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

function ActionMenuButton({ children }: { children: string }) {
  return (
    <button type="button" className="floating-nav__btn floating-nav__btn--secondary floating-nav__btn--dropdown">
      <span className="floating-nav__btn-text">{children}</span>
      <Icon name="chevron-down" size="sm" className="floating-nav__btn-chevron" />
    </button>
  )
}

const BUDGET_WIZARD_STEP_LABELS = [
  'Select Project',
  'Select WBS',
  'Create Project Budget/EAC',
] as const

function formatSelectedProjectCaption(projectId: string) {
  const digits = projectId.replace(/^PROJ-?/i, '')
  const projectName = PROJECT_BUDGET_ROWS.find((row) => row.id === projectId)?.name ?? ''
  return projectName ? `Proj ${digits} ${projectName}` : `Proj ${digits}`
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

function formatSelectedWbsCaption(wbsId: string) {
  const digits = wbsId.replace(/^PROJ-?/i, '')
  const wbsName = PROJECT_WBS_ROWS.find((row) => row.id === wbsId)?.name ?? ''
  if (!wbsName) return digits
  return `${digits} ${wbsName}`
}

const PRESET_COMPLETE_PROJECT_ID = 'PROJ-000000000000010'

function isWbsEndingInDot2(wbsId: string) {
  return /\.2$/.test(wbsId)
}

function isPresetCompleteSelection(projectId: string, wbsId: string) {
  return projectId === PRESET_COMPLETE_PROJECT_ID && isWbsEndingInDot2(wbsId)
}

type WbsHealthLevel = 'On Track' | 'At Risk' | 'Over Budget'

type WbsHealth = {
  budCost: number
  eacCost: number
  variance: number
  variancePct: number
  pctComplete: number
  level: WbsHealthLevel
}

type WbsAmountSet = {
  hours: number
  cost: number
  fee: number
  revenue: number
}

function computeWbsHealth(row: ProjectWbsRow): WbsHealth {
  const seed = parseInt(row.versionCode.replace(/\D/g, ''), 10) || 100
  const budCost = 400000 + (seed % 12) * 8500
  const overrunPct = ((seed * 37) % 21) - 6
  const eacCost = Math.round(budCost * (1 + overrunPct / 100))
  const variance = eacCost - budCost
  const variancePct = Math.round((variance / budCost) * 1000) / 10
  const pctComplete = 25 + (seed % 8) * 9
  const level: WbsHealthLevel =
    variancePct <= 2 ? 'On Track' : variancePct <= 8 ? 'At Risk' : 'Over Budget'
  return { budCost, eacCost, variance, variancePct, pctComplete, level }
}

function computeWbsAmounts(row: ProjectWbsRow) {
  const health = computeWbsHealth(row)
  const seed = parseInt(row.versionCode.replace(/\D/g, ''), 10) || 100
  const ratio = health.eacCost / health.budCost
  const budHours = 3800 + (seed % 14) * 95
  const bud: WbsAmountSet = {
    hours: budHours,
    cost: health.budCost,
    fee: Math.round(health.budCost * 0.1),
    revenue: Math.round(health.budCost * 1.18),
  }
  const eac: WbsAmountSet = {
    hours: Math.round(budHours * ratio),
    cost: health.eacCost,
    fee: Math.round(health.eacCost * 0.1),
    revenue: Math.round(health.eacCost * 1.18),
  }
  return { bud, eac, health }
}

function formatCurrency(value: number) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatSignedCurrency(value: number) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}${formatCurrency(Math.abs(value))}`
}

type WbsSortColumn = string

type WbsCellData = { display: string; sort: number }

type WbsRowContext = {
  version: string
  budgetStatus: string
  eacVersion: string
  eacStatus: string
}

function parsePeriod(period: string): [string, string] {
  const [start, end] = period.split(' - ')
  return [start ?? '—', end ?? '—']
}

function computeWbsRowData(
  row: ProjectWbsRow,
  ctx: WbsRowContext,
): Record<string, WbsCellData> {
  const { bud, eac, health } = computeWbsAmounts(row)
  const seed = parseInt(row.versionCode.replace(/\D/g, ''), 10) || 100
  const [startDate, endDate] = parsePeriod(row.periodOfPerformance)
  const wbsLevel = row.id.split('.').length - 1
  const fundedRevenue = parseFloat(row.fundedRev) || 0
  const contractValue = Math.round(fundedRevenue * 1.25)
  const budgetAmount = bud.cost + bud.fee
  const budgetVariance = bud.revenue - budgetAmount
  const currentEacAmount = eac.cost + eac.fee
  const actualCostItd = Math.round((eac.cost * health.pctComplete) / 100)
  const etc = eac.cost - actualCostItd
  const costVariance = bud.cost - eac.cost
  const eacExists = seed % 5 === 0 ? 'No' : 'Yes'

  const text = (display: string): WbsCellData => ({ display, sort: 0 })
  const money = (value: number): WbsCellData => ({ display: formatCurrency(value), sort: value })
  const signedMoney = (value: number): WbsCellData => ({
    display: formatSignedCurrency(value),
    sort: value,
  })

  return {
    id: text(row.id),
    name: text(row.name),
    wbsLevel: { display: String(wbsLevel), sort: wbsLevel },
    fundingIndicator: text(wbsLevel <= 1 ? 'Yes' : 'No'),
    fundedRevenue: money(fundedRevenue),
    budgetedRevenue: text(row.budgetedRevenue || '0%'),
    contractValue: money(contractValue),
    closedPeriod: text(row.closedPeriod || '—'),
    startDate: text(startDate),
    endDate: text(endDate),
    budgetExists: text('Yes'),
    budgetVersion: text(ctx.version),
    budgetStatus: text(ctx.budgetStatus || '—'),
    budgetAmount: money(budgetAmount),
    budgetRevenue: money(bud.revenue),
    budgetCost: money(bud.cost),
    budgetVariance: signedMoney(budgetVariance),
    eacExists: text(eacExists),
    eacVersion: text(eacExists === 'No' ? '—' : ctx.eacVersion),
    eacStatus: text(eacExists === 'No' ? '—' : ctx.eacStatus || '—'),
    currentEacAmount: money(currentEacAmount),
    etc: money(etc),
    costVariance: signedMoney(costVariance),
    variancePct: {
      display: `${health.variancePct > 0 ? '+' : ''}${health.variancePct}%`,
      sort: health.variancePct,
    },
    actualCostItd: money(actualCostItd),
  }
}

const WBS_NEUTRAL_CONTEXT: WbsRowContext = {
  version: 'V1',
  budgetStatus: '',
  eacVersion: 'V1',
  eacStatus: '',
}

function wbsSortValue(row: ProjectWbsRow, column: WbsSortColumn) {
  return computeWbsRowData(row, WBS_NEUTRAL_CONTEXT)[column]?.sort ?? 0
}

type WbsTreeNode = {
  row: ProjectWbsRow
  depth: number
  children: WbsTreeNode[]
}

function buildWbsTree(rows: ProjectWbsRow[]): WbsTreeNode[] {
  const nodes = new Map<string, WbsTreeNode>(
    rows.map((row) => [row.id, { row, depth: 0, children: [] }]),
  )
  const roots: WbsTreeNode[] = []

  rows.forEach((row) => {
    const node = nodes.get(row.id)!
    const parentId = row.id.slice(0, row.id.lastIndexOf('.'))
    const parent = parentId && parentId !== row.id ? nodes.get(parentId) : undefined
    if (parent) {
      node.depth = parent.depth + 1
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

const WBS_EMPTY_STATUS_IDS = new Set([
  'PROJ-00100.2.01',
  'PROJ-00100.2.04',
  'PROJ-00100.2.05',
])

/** Demo status for Bud/EAC leaf rows. Final from the wizard context still wins. */
function resolveWbsLeafStatus(
  wbsId: string,
  type: 'budget' | 'eac',
  rowData: Record<string, WbsCellData>,
): string {
  const raw =
    type === 'budget' ? rowData.budgetStatus.display : rowData.eacStatus.display
  if (raw === 'Final') return 'Final'
  if (wbsId === 'PROJ-00100.1.01') return 'Working'
  if (WBS_EMPTY_STATUS_IDS.has(wbsId)) return ''
  if (type === 'budget') return raw && raw !== '—' ? raw : 'Working'
  const eacExists = rowData.eacExists.display === 'Yes'
  return eacExists && raw && raw !== '—' ? raw : ''
}

function buildWbsTreeLeafData(
  wbsId: string,
  rowData: Record<string, WbsCellData>,
  type: 'budget' | 'eac',
): Record<string, WbsCellData> {
  const status = resolveWbsLeafStatus(wbsId, type, rowData)

  if (type === 'budget') {
    return {
      version: rowData.budgetVersion,
      status: { display: status, sort: 0 },
      amount: rowData.budgetAmount,
      variance: rowData.budgetVariance,
      revenue: rowData.budgetRevenue,
      cost: rowData.budgetCost,
    }
  }

  const eacExists = rowData.eacExists.display === 'Yes'
  const empty = { display: '', sort: 0 }
  return {
    version: eacExists ? rowData.eacVersion : empty,
    status: { display: status, sort: 0 },
    amount: eacExists ? rowData.currentEacAmount : empty,
    variance: eacExists ? rowData.costVariance : empty,
    etc: eacExists ? rowData.etc : empty,
    variancePct: eacExists ? rowData.variancePct : empty,
    actualCostItd: eacExists ? rowData.actualCostItd : empty,
  }
}

function buildWbsTreeSummaryData(
  rowData: Record<string, WbsCellData>,
): Record<string, WbsCellData> {
  const budgetAmount = rowData.budgetAmount.sort
  const eacAmount = rowData.eacExists.display === 'Yes' ? rowData.currentEacAmount.sort : 0
  const totalAmount = budgetAmount + eacAmount

  return {
    ...rowData,
    amount: { display: formatCurrency(totalAmount), sort: totalAmount },
  }
}

function healthModifierFor(level: WbsHealthLevel) {
  if (level === 'On Track') return 'wbs-health--ok'
  return level === 'At Risk' ? 'wbs-health--warn' : 'wbs-health--over'
}

const WBS_STATUS_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  Working: 'warning',
  Incomplete: 'error',
  Complete: 'success',
  Approved: 'success',
  Final: 'success',
  'Not Created': 'disabled',
}

const WBS_STATUS_KEYS = new Set(['status', 'budgetStatus', 'eacStatus'])

function renderStatusCellContent(display: string) {
  if (!display || display === '—') return null
  const variant = WBS_STATUS_BADGE_VARIANTS[display]
  if (!variant) return display
  const className =
    display === 'Final' ? 'budget-status-pill budget-status-pill--final' : 'budget-status-pill'
  return (
    <Badge variant={variant} size="medium" className={className}>
      {display}
    </Badge>
  )
}

function renderWbsCellDisplay(display: string | undefined, isStatus: boolean) {
  if (!display || display === '—') return null
  return isStatus ? renderStatusCellContent(display) : display
}

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
  const [selectedWbsId, setSelectedWbsId] = useState(PROJECT_WBS_ROWS[0]?.id ?? '')
  // Tracks the exact WBS tree row that was last clicked. Parent rows use the plain
  // WBS id; BUD/EAC child rows use `${wbsId}::bud` / `${wbsId}::eac`.
  const [activeWbsRowKey, setActiveWbsRowKey] = useState<string | null>(null)
  const [selectedResourceId, setSelectedResourceId] = useState(BUDGET_RESOURCE_ROWS[0]?.id ?? '')
  const [activeCellColumn, setActiveCellColumn] = useState<BudgetTableColumn>('id')
  const [createBudgetTab, setCreateBudgetTab] = useState<(typeof CREATE_BUDGET_TABS)[number]['id']>(
    'create-budget',
  )
  const [createBudgetSegment, setCreateBudgetSegment] = useState<
    (typeof CREATE_BUDGET_SEGMENTS)[number]['id']
  >('hours')
  const [wbsSort, setWbsSort] = useState<{
    column: WbsSortColumn
    direction: 'asc' | 'desc'
  } | null>(null)
  const [wbsDesignVersion, setWbsDesignVersion] = useState<WbsDesignVersion>('v1')
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  // Default: only the first tree root shows Bud/EAC. A later expand replaces it,
  // so the open pair is always either the first root or the last one expanded.
  const [expandedWbsNodes, setExpandedWbsNodes] = useState<string[]>(() => {
    const firstRootId = buildWbsTree(PROJECT_WBS_ROWS)[0]?.row.id
    return firstRootId ? [firstRootId] : []
  })
  const [commitDialogOpen, setCommitDialogOpen] = useState(false)
  const [commitDialogMode, setCommitDialogMode] = useState<'budget' | 'eac'>('budget')
  const [commitWorkflow, setCommitWorkflow] = useState<
    'commit' | 'complete' | 'approve'
  >('commit')
  const [markAsFinal, setMarkAsFinal] = useState(false)
  const [createEacEnabled, setCreateEacEnabled] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [projectCreated, setProjectCreated] = useState(false)
  const [budgetCommitted, setBudgetCommitted] = useState(false)
  const [eacCommitted, setEacCommitted] = useState(false)
  const [budgetMarkedFinal, setBudgetMarkedFinal] = useState(false)
  const [eacMarkedFinal, setEacMarkedFinal] = useState(false)
  const [finalizedWbsKeys, setFinalizedWbsKeys] = useState<string[]>([])
  const isWbsStep = wizardStep === 1
  const isCreateStep = wizardStep === 2
  const isEacTab = createBudgetTab === 'create-eac'

  const selectedWbs = PROJECT_WBS_ROWS.find((row) => row.id === selectedWbsId)
  const presetComplete = isPresetCompleteSelection(selectedProjectId, selectedWbsId)
  const isWbsFinalized = (projectId: string, wbsId: string) =>
    finalizedWbsKeys.includes(`${projectId}::${wbsId}`)
  const selectionFinalized = isWbsFinalized(selectedProjectId, selectedWbsId)
  // A Bud/EAC marked Final for the current selection keeps every wizard step green,
  // even after navigating back into an earlier step.
  const selectionHasFinalBudget = presetComplete || selectionFinalized
  const createStepVersion =
    presetComplete || selectionFinalized ? 'V2' : selectedWbs?.version || 'V1'
  const budgetStatus =
    presetComplete || selectionFinalized || budgetMarkedFinal ? 'Final' : 'Committed'
  const eacStatus =
    presetComplete || selectionFinalized || eacMarkedFinal ? 'Final' : 'Committed'

  const formatCreateStepCaption = (includeEac: boolean) => {
    const budCaption = `Bud / ${createStepVersion} / ${budgetStatus}`
    if (!includeEac) return budCaption
    return `${budCaption} - EAC / ${createStepVersion} / ${eacStatus}`
  }

  const applyPresetCompleteSelection = (projectId: string, wbsId: string) => {
    if (!isPresetCompleteSelection(projectId, wbsId)) return false

    setSelectedProjectId(projectId)
    setSelectedWbsId(wbsId)
    setCreateEacEnabled(true)
    setBudgetCommitted(true)
    setEacCommitted(true)
    setProjectCreated(true)
    setToastMessage(null)
    return true
  }

  useEffect(() => {
    if (!toastMessage) return

    const dismissTimer = window.setTimeout(() => {
      setToastMessage(null)
    }, 5000)

    return () => window.clearTimeout(dismissTimer)
  }, [toastMessage])

  const openCommitDialog = (mode: 'budget' | 'eac') => {
    setCommitDialogMode(mode)
    setCommitDialogOpen(true)
  }

  const closeCommitDialog = () => {
    setCommitDialogOpen(false)
    setMarkAsFinal(false)
    setCommitWorkflow('commit')
  }

  const handleCommitSave = (switchToEac: boolean) => {
    if (commitDialogMode === 'eac') {
      if (markAsFinal) {
        setCreateBudgetTab('create-eac')
        setProjectCreated(false)
        setEacCommitted(true)
        setEacMarkedFinal(true)
        setToastMessage('Eacs successfully marked as final')
      }
      closeCommitDialog()
      return
    }

    if (markAsFinal) {
      setCreateEacEnabled(true)
      setBudgetCommitted(true)
      setBudgetMarkedFinal(true)
      setToastMessage('Budget successfully marked as final')
    }
    if (switchToEac) {
      setCreateEacEnabled(true)
      setBudgetCommitted(true)
      setCreateBudgetTab('create-eac')
    }
    closeCommitDialog()
  }

  const wizardSteps = BUDGET_WIZARD_STEP_LABELS.map((label, index) => {
    if (selectionHasFinalBudget) {
      if (index === 0) {
        return {
          label: 'Selected Project',
          description: formatSelectedProjectCaption(selectedProjectId),
          completed: true,
        }
      }
      if (index === 1) {
        return {
          label: 'Selected WBS',
          description: formatSelectedWbsCaption(selectedWbsId),
          completed: true,
        }
      }
      return {
        label,
        description: formatCreateStepCaption(true),
        completed: true,
      }
    }
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
        description: formatSelectedWbsCaption(selectedWbsId),
        completed: true,
      }
    }
    if (index === 2 && projectCreated && budgetCommitted) {
      const bothCreated = eacCommitted
      return {
        label,
        description: formatCreateStepCaption(bothCreated),
        completed: bothCreated,
      }
    }
    return { label }
  })

  const selectProjectCell = (projectId: string, column: BudgetTableColumn) => {
    if (applyPresetCompleteSelection(projectId, selectedWbsId)) {
      setActiveCellColumn(column)
      return
    }
    setSelectedProjectId(projectId)
    setActiveCellColumn(column)
  }

  const selectWbsCell = (wbsId: string, column: BudgetTableColumn) => {
    setActiveWbsRowKey(wbsId)
    if (applyPresetCompleteSelection(selectedProjectId, wbsId)) {
      setActiveCellColumn(column)
      return
    }
    setSelectedWbsId(wbsId)
    setActiveCellColumn(column)
  }

  const selectWbsLeafRow = (wbsId: string, leafKey: string) => {
    selectWbsCell(wbsId, 'id')
    setActiveWbsRowKey(`${wbsId}::${leafKey}`)
  }

  const selectResourceCell = (resourceId: string, column: BudgetTableColumn) => {
    setSelectedResourceId(resourceId)
    setActiveCellColumn(column)
  }

  const resetWizardToSelectProject = () => {
    setWizardStep(0)
    setSelectedProjectId(PROJECT_BUDGET_ROWS[0]?.id ?? '')
    setSelectedWbsId(PROJECT_WBS_ROWS[0]?.id ?? '')
    setActiveWbsRowKey(null)
    {
      const firstRootId = buildWbsTree(PROJECT_WBS_ROWS)[0]?.row.id
      setExpandedWbsNodes(firstRootId ? [firstRootId] : [])
    }
    setSelectedResourceId(BUDGET_RESOURCE_ROWS[0]?.id ?? '')
    setActiveCellColumn('id')
    setCreateBudgetTab('create-budget')
    setCreateBudgetSegment('hours')
    setCommitDialogOpen(false)
    setCommitDialogMode('budget')
    setCommitWorkflow('commit')
    setMarkAsFinal(false)
    setCreateEacEnabled(false)
    setToastMessage(null)
    setProjectCreated(false)
    setBudgetCommitted(false)
    setEacCommitted(false)
    setBudgetMarkedFinal(false)
    setEacMarkedFinal(false)
  }

  const handleResetStatuses = () => {
    setFinalizedWbsKeys([])
  }

  const goToStep = (step: number) => {
    if (step === 0) {
      resetWizardToSelectProject()
      return
    }
    setWizardStep(step)
    setActiveCellColumn(step === 2 ? 'type' : 'id')
  }

  const handleFooterPrimaryAction = () => {
    if (!isCreateStep) {
      goToStep(Math.min(wizardStep + 1, BUDGET_WIZARD_STEP_LABELS.length - 1))
      return
    }
    setToastMessage(PROJECT_CREATED_MESSAGE)
    setProjectCreated(true)

    const finalizedKey = `${selectedProjectId}::${selectedWbsId}`
    setFinalizedWbsKeys((keys) => (keys.includes(finalizedKey) ? keys : [...keys, finalizedKey]))
  }

  const wbsColumnTotals = (() => {
    const totals: Record<string, number> = {}
    const add = (key: string, value: number) => {
      totals[key] = (totals[key] ?? 0) + value
    }

    PROJECT_WBS_ROWS.forEach((row) => {
      const data = computeWbsRowData(row, WBS_NEUTRAL_CONTEXT)
      const eacAmount =
        data.eacExists.display === 'Yes' ? data.currentEacAmount.sort : 0

      add('fundedRevenue', data.fundedRevenue.sort)
      add('contractValue', data.contractValue.sort)
      add('budgetAmount', data.budgetAmount.sort)
      add('budgetRevenue', data.budgetRevenue.sort)
      add('budgetCost', data.budgetCost.sort)
      add('budgetVariance', data.budgetVariance.sort)
      add('currentEacAmount', data.currentEacAmount.sort)
      add('etc', data.etc.sort)
      add('costVariance', data.costVariance.sort)
      add('actualCostItd', data.actualCostItd.sort)
      add('amount', data.budgetAmount.sort + eacAmount)
      add('revenue', data.budgetRevenue.sort)
      add('cost', data.budgetCost.sort)
      add('variance', data.costVariance.sort)
    })

    return totals
  })()

  const renderWbsTotalCells = (
    columns: WbsColumnDef[],
    groupStartKeys: Set<string>,
    labelKey?: string,
  ) =>
    columns
      .filter((column) => column.group !== 'lead')
      .map((column) => {
        const total = wbsColumnTotals[column.key]
        const className =
          [
            column.num ? 'budget-table__num' : '',
            groupStartKeys.has(column.key) ? 'budget-table__group-start' : '',
            column.key === labelKey ? 'budget-table__totals-label' : '',
          ]
            .filter(Boolean)
            .join(' ') || undefined

        return (
          <td key={column.key} className={className}>
            {column.key === labelKey
              ? 'Total'
              : total === undefined
              ? ''
              : WBS_TOTAL_SIGNED_KEYS.has(column.key)
              ? formatSignedCurrency(total)
              : formatCurrency(total)}
          </td>
        )
      })

  const visibleWbsRows = (() => {
    if (!wbsSort) return PROJECT_WBS_ROWS
    const factor = wbsSort.direction === 'asc' ? 1 : -1
    return [...PROJECT_WBS_ROWS].sort(
      (a, b) => (wbsSortValue(a, wbsSort.column) - wbsSortValue(b, wbsSort.column)) * factor,
    )
  })()

  const toggleWbsSort = (column: WbsSortColumn) => {
    setWbsSort((current) => {
      if (current?.column !== column) return { column, direction: 'desc' }
      if (current.direction === 'desc') return { column, direction: 'asc' }
      return null
    })
  }

  const sortableHeaderProps = (column: WbsSortColumn) => ({
    'aria-sort': (wbsSort?.column === column
      ? wbsSort.direction === 'asc'
        ? 'ascending'
        : 'descending'
      : 'none') as 'ascending' | 'descending' | 'none',
    className: `budget-table__sortable${wbsSort?.column === column ? ' is-sorted' : ''}`,
    onClick: () => toggleWbsSort(column),
  })

  const sortIndicator = (column: WbsSortColumn) => (
    <span className="budget-table__sort-icon" aria-hidden="true">
      {wbsSort?.column === column ? (wbsSort.direction === 'asc' ? '▲' : '▼') : '↕'}
    </span>
  )

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

  const activeWbsColumns = wbsDesignVersion === 'v2' ? WBS_TREE_COLUMNS : WBS_GRID_COLUMNS

  const columnWidthFor = (column: ResizableColumn) =>
    columnWidths[`${wbsDesignVersion}:${column.key}`] ?? column.width

  const wbsTableWidth = activeWbsColumns.reduce(
    (total, column) => total + columnWidthFor(column),
    0,
  )

  const startColumnResize = (
    column: ResizableColumn,
    event: ReactPointerEvent<HTMLSpanElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    const storageKey = `${wbsDesignVersion}:${column.key}`
    const startX = event.clientX
    const startWidth = columnWidthFor(column)

    const handleMove = (moveEvent: PointerEvent) => {
      const nextWidth = Math.max(MIN_COLUMN_WIDTH, startWidth + moveEvent.clientX - startX)
      setColumnWidths((prev) => ({ ...prev, [storageKey]: nextWidth }))
    }

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      document.body.classList.remove('is-column-resizing')
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    document.body.classList.add('is-column-resizing')
  }

  const resetColumnWidth = (column: ResizableColumn) =>
    setColumnWidths((prev) => {
      const next = { ...prev }
      delete next[`${wbsDesignVersion}:${column.key}`]
      return next
    })

  const columnResizeHandle = (column: ResizableColumn) => (
    <span
      className="column-resizer"
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize ${column.label} column`}
      title="Drag to resize, double-click to reset"
      onPointerDown={(event) => startColumnResize(column, event)}
      onDoubleClick={(event) => {
        event.stopPropagation()
        resetColumnWidth(column)
      }}
      onClick={(event) => event.stopPropagation()}
    />
  )

  const wbsColgroup = (
    <colgroup>
      {activeWbsColumns.map((column) => (
        <col key={column.key} style={{ width: `${columnWidthFor(column)}px` }} />
      ))}
    </colgroup>
  )

  const columnByKey = (key: string) =>
    activeWbsColumns.find((column) => column.key === key) ?? activeWbsColumns[0]

  const sortableTh = (
    column: WbsSortColumn,
    label: string,
    options?: { num?: boolean; extraClass?: string; widthKey?: string },
  ) => {
    const props = sortableHeaderProps(column)
    return (
      <th
        key={column}
        scope="col"
        aria-sort={props['aria-sort']}
        className={[props.className, options?.num ? 'budget-table__num' : '', options?.extraClass]
          .filter(Boolean)
          .join(' ')}
        onClick={props.onClick}
      >
        <button type="button" className="budget-table__sort-btn">
          {label}
          {sortIndicator(column)}
        </button>
        {columnResizeHandle(columnByKey(options?.widthKey ?? column))}
      </th>
    )
  }

  const wbsGroupedHeader = (
    <>
      {wbsColgroup}
      <thead className="budget-table__head--grouped">
        <tr className="budget-table__group-row">
          <th className="budget-table__lead-col" scope="col" rowSpan={2}>
            <input type="checkbox" aria-label="Select all WBS" />
            {columnResizeHandle(columnByKey('lead'))}
          </th>
          {WBS_COLUMN_GROUPS.map((group) => {
            const groupColumns = WBS_GRID_COLUMNS.filter((column) => column.group === group.key)
            return (
              <th
                key={group.key}
                scope="colgroup"
                colSpan={groupColumns.length}
                className={`budget-table__group budget-table__group--${group.key} budget-table__group-start`}
              >
                {group.label}
              </th>
            )
          })}
        </tr>
        <tr>
          {WBS_GRID_COLUMNS.filter((column) => column.group !== 'lead').map((column) => {
            const groupStart = WBS_GROUP_START_KEYS.has(column.key)
            if (column.sortable) {
              return sortableTh(column.key, column.label, {
                num: column.num,
                extraClass: groupStart ? 'budget-table__group-start' : undefined,
              })
            }
            return (
              <th
                key={column.key}
                scope="col"
                className={
                  [column.num ? 'budget-table__num' : '', groupStart ? 'budget-table__group-start' : '']
                    .filter(Boolean)
                    .join(' ') || undefined
                }
              >
                {column.label}
                {columnResizeHandle(column)}
              </th>
            )
          })}
        </tr>
      </thead>
    </>
  )

  const wbsTree = buildWbsTree(PROJECT_WBS_ROWS)

  // Rows expand independently, so any number of Bud/EAC pairs can stay open.
  const toggleWbsNode = (id: string) =>
    setExpandedWbsNodes((prev) =>
      prev.includes(id) ? prev.filter((nodeId) => nodeId !== id) : [...prev, id],
    )

  const setAllWbsNodesExpanded = (expanded: boolean) =>
    setExpandedWbsNodes(expanded ? PROJECT_WBS_ROWS.map((row) => row.id) : [])

  const wbsTreeHeader = (
    <>
      {wbsColgroup}
      <thead>
        <tr>
          <th scope="col" className="wbs-tree__head-cell">
            WBS
            {columnResizeHandle(columnByKey('tree'))}
          </th>
          {WBS_TREE_COLUMNS.filter((column) => column.group !== 'lead').map((column) => {
            const groupStart = WBS_TREE_GROUP_START_KEYS.has(column.key)
            if (column.sortable) {
              return sortableTh(column.key, column.label, {
                num: column.num,
                extraClass: groupStart ? 'budget-table__group-start' : undefined,
              })
            }
            return (
              <th
                key={column.key}
                scope="col"
                className={
                  [column.num ? 'budget-table__num' : '', groupStart ? 'budget-table__group-start' : '']
                    .filter(Boolean)
                    .join(' ') || undefined
                }
              >
                {column.label}
                {columnResizeHandle(column)}
              </th>
            )
          })}
        </tr>
      </thead>
    </>
  )

  const renderWbsTreeCells = (
    rowData: Record<string, WbsCellData>,
    toneModifier: string,
    visibleGroups: WbsColumnGroup[],
  ) =>
    WBS_TREE_COLUMNS.filter((column) => column.group !== 'lead').map((column) => {
      const inVisibleGroup = visibleGroups.includes(column.group)
      const data = inVisibleGroup ? rowData[column.key] : undefined
      const tone =
        inVisibleGroup && WBS_TREE_VARIANCE_TONE_KEYS.has(column.key) ? toneModifier : ''
      const className =
        [
          column.num ? 'budget-table__num' : '',
          WBS_TREE_GROUP_START_KEYS.has(column.key) ? 'budget-table__group-start' : '',
          tone,
        ]
          .filter(Boolean)
          .join(' ') || undefined
      return (
        <td key={column.key} className={className}>
          {renderWbsCellDisplay(data?.display, WBS_STATUS_KEYS.has(column.key))}
        </td>
      )
    })

  const highlightedWbsRowKey = activeWbsRowKey ?? selectedWbsId

  const renderWbsTreeRows = (node: WbsTreeNode): ReactNode[] => {
    const rows: ReactNode[] = []
    const isExpanded = expandedWbsNodes.includes(node.row.id)
    const isSelected = node.row.id === highlightedWbsRowKey
    const showFinalStatus =
      isPresetCompleteSelection(selectedProjectId, node.row.id) ||
      isWbsFinalized(selectedProjectId, node.row.id)
    const version = showFinalStatus ? 'V2' : node.row.version
    const budgetStatus = showFinalStatus ? 'Final' : node.row.status
    const eacStatus = showFinalStatus ? 'Final' : ''
    const ctx: WbsRowContext = {
      version,
      budgetStatus,
      eacVersion: version,
      eacStatus,
    }
    const rowData = computeWbsRowData(node.row, ctx)
    const summaryData = buildWbsTreeSummaryData(rowData)
    const modifier = healthModifierFor(computeWbsHealth(node.row).level)

    rows.push(
      <tr
        key={node.row.id}
        data-row-id={node.row.id}
        className={`wbs-tree__row wbs-tree__row--wbs${
          isSelected ? ' is-selected table-row--selected' : ''
        }`}
        aria-selected={isSelected}
        tabIndex={0}
        onClick={() => {
          selectWbsCell(node.row.id, 'id')
          toggleWbsNode(node.row.id)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            selectWbsCell(node.row.id, activeCellColumn)
            toggleWbsNode(node.row.id)
          }
        }}
      >
        <td className="wbs-tree__cell" style={{ paddingLeft: `${8 + node.depth * 22}px` }}>
          <span className="wbs-tree__cell-inner">
            <button
              type="button"
              className="wbs-tree__toggle"
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? 'Hide' : 'Show'} Bud and EAC for ${node.row.id}`}
              onClick={(event) => {
                event.stopPropagation()
                toggleWbsNode(node.row.id)
              }}
            >
              <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} size="sm" />
            </button>
            <span className="wbs-tree__id">{node.row.id}</span>
            <span className="wbs-tree__name">{node.row.name}</span>
          </span>
        </td>
        {renderWbsTreeCells(summaryData, modifier, ['wbs', 'shared'])}
      </tr>,
    )

    if (isExpanded) {
      ;(
        [
          { key: 'bud', label: 'Bud', type: 'budget' as const },
          { key: 'eac', label: 'EAC', type: 'eac' as const },
        ] as const
      ).forEach((leaf) => {
        const isLeafSelected = highlightedWbsRowKey === `${node.row.id}::${leaf.key}`
        rows.push(
          <tr
            key={`${node.row.id}-${leaf.key}`}
            data-row-id={`${node.row.id}-${leaf.key}`}
            className={`wbs-tree__row wbs-tree__row--leaf wbs-tree__row--${leaf.key}${
              isLeafSelected ? ' is-selected table-row--selected' : ''
            }`}
            aria-selected={isLeafSelected}
            tabIndex={0}
            onClick={() => selectWbsLeafRow(node.row.id, leaf.key)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                selectWbsLeafRow(node.row.id, leaf.key)
              }
            }}
          >
            <td
              className="wbs-tree__cell wbs-tree__cell--leaf"
              style={{ paddingLeft: `${8 + node.depth * 22}px` }}
            >
              <span className="wbs-tree__cell-inner">
                <span className="wbs-tree__toggle-spacer" aria-hidden="true" />
                <span className="wbs-tree__leaf-label">{leaf.label}</span>
              </span>
            </td>
            {renderWbsTreeCells(buildWbsTreeLeafData(node.row.id, rowData, leaf.type), modifier, [
              'shared',
              'detail',
            ])}
          </tr>,
        )
      })
    }

    // Child WBS rows stay visible regardless of expansion — the toggle only shows or
    // hides this row's own Bud/EAC pair.
    node.children.forEach((child) => {
      rows.push(...renderWbsTreeRows(child))
    })

    return rows
  }

  const wbsTreeBody = (
    <tbody>
      {wbsTree.flatMap((node) => renderWbsTreeRows(node))}
      <tr className="table-row--total budget-table__totals-row">
        <td className="wbs-tree__cell budget-table__totals-label">Total</td>
        {renderWbsTotalCells(WBS_TREE_COLUMNS, WBS_TREE_GROUP_START_KEYS)}
      </tr>
    </tbody>
  )

  const tableHeader = isWbsStep ? (
    wbsGroupedHeader
  ) : (
    <thead>
      <tr>
        <th className="budget-table__lead-col" scope="col">
          <input
            type="checkbox"
            aria-label={isCreateStep ? 'Select all resources' : 'Select all projects'}
          />
        </th>
        {isCreateStep ? (
          <>
            <th scope="col">Type</th>
            <th scope="col">ID Type</th>
            <th scope="col">Name</th>
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
        ? [
            ...visibleWbsRows.map((row) => {
            const isSelected = row.id === selectedWbsId
            const isPresetCompleteWbs = isPresetCompleteSelection(selectedProjectId, row.id)
            const showFinalStatus =
              isPresetCompleteWbs || isWbsFinalized(selectedProjectId, row.id)
            const version = showFinalStatus ? 'V2' : row.version
            const budgetStatus = showFinalStatus ? 'Final' : row.status
            const eacStatus = showFinalStatus ? 'Final' : ''
            const rowData = computeWbsRowData(row, {
              version,
              budgetStatus,
              eacVersion: version,
              eacStatus,
            })
            const health = computeWbsHealth(row)
            const healthModifier = healthModifierFor(health.level)
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
                {WBS_GRID_COLUMNS.filter((column) => column.group !== 'lead').map((column) => {
                  const data = rowData[column.key]
                  const groupStart = WBS_GROUP_START_KEYS.has(column.key)
                  const toneClass = WBS_VARIANCE_TONE_KEYS.has(column.key) ? healthModifier : ''
                  const extra =
                    [
                      column.num ? 'budget-table__num' : '',
                      groupStart ? 'budget-table__group-start' : '',
                      toneClass,
                    ]
                      .filter(Boolean)
                      .join(' ') || undefined
                  return (
                    <td
                      key={column.key}
                      className={cellClass(column.key, extra)}
                      onClick={(event) => {
                        event.stopPropagation()
                        selectWbsCell(row.id, column.key)
                      }}
                    >
                      {renderWbsCellDisplay(data?.display, WBS_STATUS_KEYS.has(column.key))}
                    </td>
                  )
                })}
              </tr>
            )
          }),
            <tr key="wbs-totals" className="table-row--total budget-table__totals-row">
              <td className="budget-table__lead-col" />
              {renderWbsTotalCells(WBS_GRID_COLUMNS, WBS_GROUP_START_KEYS, 'id')}
            </tr>,
          ]
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
      beforeCompanyPicker={
        <div className="budget-header-tools">
          <Button
            size="sm"
            variant="secondary"
            className="budget-header-reset"
            onClick={handleResetStatuses}
          >
            Reset
          </Button>
          <Dropdown
            className="budget-header-version"
            options={WBS_DESIGN_VERSIONS.map((option) => ({ ...option }))}
            value={wbsDesignVersion}
            triggerFixedWidth="13rem"
            onChange={(value) => setWbsDesignVersion(value as WbsDesignVersion)}
          />
        </div>
      }
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
        {toastMessage ? (
          <div key={toastMessage} className="budget-window__toast" role="status">
            <Alert
              variant="success"
              style="enhanced"
              title="Message(s)"
              dismissible
              onDismiss={() => setToastMessage(null)}
              className="budget-window__toast-alert"
            >
              {toastMessage}
            </Alert>
          </div>
        ) : null}

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

          {isCreateStep ? (
            <div className="budget-create-chrome">
              <div className="budget-create-chrome__tabs-row">
                <TabStrip
                  className={`budget-create-tabs${
                    createEacEnabled ? ' budget-create-tabs--eac-enabled' : ''
                  }`}
                  overflowMode="none"
                  tabs={CREATE_BUDGET_TABS.map((tab) => ({
                    ...tab,
                    active: tab.id === createBudgetTab,
                    disabled: tab.id === 'create-eac' && !createEacEnabled,
                  }))}
                  onTabSelected={(tabId) => {
                    setCreateBudgetTab(tabId as (typeof CREATE_BUDGET_TABS)[number]['id'])
                  }}
                />
                <div className="budget-create-chrome__actions">
                  {isEacTab ? (
                    projectCreated ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="budget-create-chrome__secondary"
                      >
                        Create New Version
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="budget-create-chrome__muted"
                        >
                          Modify
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="budget-create-chrome__secondary"
                        >
                          Create New Version
                        </Button>
                        <Button
                          size="sm"
                          className="budget-create-chrome__commit"
                          onClick={() => openCommitDialog('eac')}
                        >
                          Commit EAC
                        </Button>
                      </>
                    )
                  ) : (
                    <>
                      <Button size="sm" variant="outline" disabled className="budget-create-chrome__muted">
                        Create New Version
                      </Button>
                      <Button size="sm" variant="outline" disabled className="budget-create-chrome__muted">
                        Inspect
                      </Button>
                      <Button size="sm" variant="outline" disabled className="budget-create-chrome__muted">
                        Recalc
                      </Button>
                      <Button
                        size="sm"
                        className="budget-create-chrome__commit"
                        onClick={() => openCommitDialog('budget')}
                      >
                        Commit Budget
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="budget-create-chrome__segments">
                <ButtonGroup variant="default" size="sm" className="budget-create-segments">
                  {CREATE_BUDGET_SEGMENTS.map((segment) => (
                    <Button
                      key={segment.id}
                      size="sm"
                      buttonType="theme"
                      variant={createBudgetSegment === segment.id ? 'primary' : 'outline'}
                      aria-pressed={createBudgetSegment === segment.id}
                      onClick={() => setCreateBudgetSegment(segment.id)}
                    >
                      {segment.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>
            </div>
          ) : null}

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
              <div className="budget-toolbar__group">
                {wbsDesignVersion === 'v2' ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="budget-toolbar__action"
                      onClick={() => setAllWbsNodesExpanded(true)}
                    >
                      Expand all
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="budget-toolbar__action"
                      onClick={() => setAllWbsNodesExpanded(false)}
                    >
                      Collapse all
                    </Button>
                  </>
                ) : null}
                <Button size="sm" variant="secondary" className="budget-toolbar__secondary">
                  Delete
                </Button>
              </div>
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
          ) : isWbsStep && wbsDesignVersion === 'v2' ? (
            <div
              className="budget-table-shell budget-table-shell--scroll"
              style={{ '--wbs-table-width': `${wbsTableWidth}px` } as CSSProperties}
            >
              <Table
                className="budget-table budget-table--wbs budget-table--wbs-tree budget-table--resizable"
                headerVariant="gray"
                header={wbsTreeHeader}
                body={wbsTreeBody}
              />
            </div>
          ) : (
            <div
              className="budget-table-shell budget-table-shell--scroll"
              style={
                isWbsStep
                  ? ({ '--wbs-table-width': `${wbsTableWidth}px` } as CSSProperties)
                  : undefined
              }
            >
              <Table
                className={`budget-table ${
                  isWbsStep ? 'budget-table--wbs budget-table--resizable' : 'budget-table--projects'
                }`}
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
              disabled={isCreateStep && projectCreated}
              onClick={handleFooterPrimaryAction}
            >
              {isCreateStep ? 'Save' : 'Next'}
            </Button>
          </footer>
        </div>
      </section>

      <Dialog
        id="commit-budget-dialog"
        title={commitDialogMode === 'eac' ? 'Commit EAC' : 'Commit Budget'}
        open={commitDialogOpen}
        onClose={closeCommitDialog}
        resizable={false}
        className="commit-budget-dialog"
        footer={
          <div className="commit-budget-dialog__footer-actions">
            <Button size="sm" onClick={() => handleCommitSave(false)}>
              Save
            </Button>
            {commitDialogMode === 'budget' ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleCommitSave(true)}
              >
                Save and create EAC
              </Button>
            ) : null}
            <Button size="sm" variant="secondary" onClick={closeCommitDialog}>
              Cancel
            </Button>
          </div>
        }
      >
        <fieldset className="commit-budget-dialog__workflow">
          <legend>Workflow</legend>
          <p>
            {commitDialogMode === 'eac'
              ? 'You are about to commit the EAC. Would you like to apply any other workflow actions?'
              : 'You are about to commit the budget. Would you like to apply any other workflow actions?'}
          </p>
          <div className="commit-budget-dialog__options">
            <div>
              <RadioButton
                name="commit-budget-workflow"
                value="commit"
                label="Commit"
                size="small"
                checked={commitWorkflow === 'commit'}
                onChange={() => setCommitWorkflow('commit')}
              />
              <Checkbox
                label="Mark as Final"
                checked={markAsFinal}
                disabled={commitWorkflow !== 'commit'}
                onChange={(event) => setMarkAsFinal(event.target.checked)}
                className="commit-budget-dialog__mark-final"
              />
            </div>
            <RadioButton
              name="commit-budget-workflow"
              value="complete"
              label="Commit and Complete"
              size="small"
              checked={commitWorkflow === 'complete'}
              onChange={() => {
                setCommitWorkflow('complete')
                setMarkAsFinal(false)
              }}
            />
            <RadioButton
              name="commit-budget-workflow"
              value="approve"
              label="Commit, Complete and Approve"
              size="small"
              checked={commitWorkflow === 'approve'}
              onChange={() => {
                setCommitWorkflow('approve')
                setMarkAsFinal(false)
              }}
            />
          </div>
        </fieldset>
      </Dialog>
    </ShellLayout>
  )
}
