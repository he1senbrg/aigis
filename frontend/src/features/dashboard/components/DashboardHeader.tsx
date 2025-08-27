import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INDIAN_LANGUAGES } from '@/shared/constants'
import { Menu, Moon, Sun } from 'lucide-react'

interface DashboardHeaderProps {
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
  reportLanguage: string
  setReportLanguage: (language: string) => void
  onGenerateReport: () => void
  setMobileMenuOpen?: (open: boolean) => void
  isMobile?: boolean
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  darkMode,
  setDarkMode,
  reportLanguage,
  setReportLanguage,
  onGenerateReport,
  setMobileMenuOpen,
  isMobile = false
}) => {
  if (isMobile) {
    return (
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div>
          <h1 className="text-xl font-bold text-foreground">AIGIS</h1>
          <p className="text-sm text-muted-foreground">Water Monitoring</p>
        </div>
        <div className="flex items-center gap-2">
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
        {/* Dark Mode Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      {/* Controls */}
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
          <Button onClick={onGenerateReport} variant="outline" className="text-sm">
            Generate Report
          </Button>
        </div>
      </div>
    </>
  )
}
