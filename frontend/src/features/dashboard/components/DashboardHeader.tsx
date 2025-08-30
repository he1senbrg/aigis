import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INDIAN_LANGUAGES } from '@/shared/constants'
import { Menu, Moon, Sun, Trash } from 'lucide-react'

interface DashboardHeaderProps {
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
  reportLanguage: string
  setReportLanguage: (language: string) => void
  reportReason: string
  setReportReason: (reason: string) => void
  onGenerateServerReport?: () => void
  hasPredictionData?: boolean
  setMobileMenuOpen?: (open: boolean) => void
  isMobile?: boolean
  hasData: boolean // New prop to indicate if data is present
  onClear?: () => void // New prop for clear action
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  darkMode,
  setDarkMode,
  reportLanguage,
  setReportLanguage,
  reportReason,
  setReportReason,
  onGenerateServerReport,
  hasPredictionData = false,
  setMobileMenuOpen,
  isMobile = false,
  hasData,
  onClear
}) => {
  if (isMobile) {
    return (
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div>
          <h1 className="text-xl font-bold text-foreground">AIGIS</h1>
          <p className="text-sm text-muted-foreground">Water Monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          {hasData && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              aria-label="Clear Data"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileMenuOpen?.(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AIGIS Water Monitoring</h1>
        </div>
        <div className="flex items-center gap-2">
          {hasData && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              aria-label="Clear Data"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Controls: Only show when data is present */}
      {hasData && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-end relative z-10">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
              <label htmlFor="report-language" className="text-sm font-medium text-foreground whitespace-nowrap">
                Report Language:
              </label>
              <Select value={reportLanguage} onValueChange={setReportLanguage}>
                <SelectTrigger className="w-full sm:w-48" id="report-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {INDIAN_LANGUAGES.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
              <label htmlFor="report-reason" className="text-sm font-medium text-foreground whitespace-nowrap">
                Reason:
              </label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger className="w-full sm:w-40" id="report-reason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="industry">Industry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              {onGenerateServerReport && hasPredictionData && (
                <Button onClick={onGenerateServerReport} variant="default" className="text-sm">
                  Generate Report
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
