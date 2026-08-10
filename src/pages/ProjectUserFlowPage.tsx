import { useEffect, useState } from 'react'
import { Alert } from '../components/harmony/Alert'
import { Button } from '../components/harmony/Button'
import { ButtonGroup } from '../components/harmony/ButtonGroup'
import { Checkbox } from '../components/harmony/Checkbox'
import { Dialog } from '../components/harmony/Dialog'
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
  const [createBudgetTab, setCreateBudgetTab] = useState<(typeof CREATE_BUDGET_TABS)[number]['id']>(
    'create-budget',
  )
  const [createBudgetSegment, setCreateBudgetSegment] = useState<
    (typeof CREATE_BUDGET_SEGMENTS)[number]['id']
  >('hours')
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
    if (presetComplete) {
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
    if (applyPresetCompleteSelection(selectedProjectId, wbsId)) {
      setActiveCellColumn(column)
      return
    }
    setSelectedWbsId(wbsId)
    setActiveCellColumn(column)
  }

  const selectResourceCell = (resourceId: string, column: BudgetTableColumn) => {
    setSelectedResourceId(resourceId)
    setActiveCellColumn(column)
  }

  const resetWizardToSelectProject = () => {
    setWizardStep(0)
    setSelectedProjectId(PROJECT_BUDGET_ROWS[0]?.id ?? '')
    setSelectedWbsId(PROJECT_WBS_ROWS[0]?.id ?? '')
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
            const isPresetCompleteWbs = isPresetCompleteSelection(selectedProjectId, row.id)
            const showFinalStatus =
              isPresetCompleteWbs || isWbsFinalized(selectedProjectId, row.id)
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
                  {showFinalStatus ? 'V2' : row.version}
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
                  {showFinalStatus ? 'Final' : row.status}
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
      beforeCompanyPicker={
        <Button
          size="sm"
          variant="secondary"
          className="budget-header-reset"
          onClick={handleResetStatuses}
        >
          Reset
        </Button>
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
            <div className="budget-table-shell budget-table-shell--scroll">
              <Table
                className={`budget-table ${
                  isWbsStep ? 'budget-table--wbs' : 'budget-table--projects'
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
