import { useState, useEffect } from 'react'
import { FaBars, FaTimes, FaCalendarAlt, FaUpload, FaHome, FaCheck, FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'
import ICAL from 'ical.js'
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentView, setCurrentView] = useState('welcome')
  const [events, setEvents] = useState([])
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [eventCount, setEventCount] = useState(0)
  const [, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
      
      // Close menu on resize if it's open and screen becomes larger
      if (isMenuOpen && window.innerWidth > 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [isMenuOpen])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navigateTo = (view) => {
    setCurrentView(view)
    setIsMenuOpen(false)
  }

  const handleFileUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jcalData = ICAL.parse(e.target.result)
        const comp = new ICAL.Component(jcalData)
        const vevents = comp.getAllSubcomponents('vevent')
        
        const currentYear = new Date().getFullYear()
        
        const parsedEvents = vevents.map(vevent => {
          const event = new ICAL.Event(vevent)
          const originalStartDate = event.startDate.toJSDate()
          const originalEndDate = event.endDate.toJSDate()
          
          // Normalize dates to current year for birthday display
          const normalizedStartDate = new Date(currentYear, originalStartDate.getMonth(), originalStartDate.getDate())
          const normalizedEndDate = new Date(currentYear, originalEndDate.getMonth(), originalEndDate.getDate())
          
          // Extract numerical value from description field for yearBorn
          const description = event.description || ''
          const yearMatch = description.match(/\b(19|20)\d{2}\b/)
          const yearFromDescription = yearMatch ? parseInt(yearMatch[0]) : null
          
          const parsedEvent = {
            summary: event.summary,
            startDate: normalizedStartDate,
            endDate: normalizedEndDate,
            yearBorn: yearFromDescription || originalStartDate.getFullYear(),
            description: description,
            location: event.location || '',
            month: originalStartDate.getMonth(),
            day: originalStartDate.getDate()
          }
          
          return parsedEvent
        })
        
        setEvents(parsedEvents)
        setEventCount(parsedEvents.length)
        setShowSuccessPopup(true)
        setTimeout(() => setShowSuccessPopup(false), 3000)
      } catch (error) {
        console.error('Error parsing calendar file:', error)
        alert('Error parsing calendar file. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomePage onNavigate={navigateTo} events={events} />
      case 'upload':
        return <UploadPage onFileUpload={handleFileUpload} onNavigate={navigateTo} />
      case 'calendar':
        return <CalendarPage events={events} onNavigate={navigateTo} />
      default:
        return <WelcomePage onNavigate={navigateTo} events={events} />
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Birthday Tracker</h1>
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>
      
      <nav className={`menu ${isMenuOpen ? 'menu-open' : ''}`}>
        <button onClick={() => navigateTo('welcome')}>
          <FaHome /> Welcome
        </button>
        <button onClick={() => navigateTo('upload')}>
          <FaUpload /> Upload Calendar
        </button>
        <button onClick={() => navigateTo('calendar')}>
          <FaCalendarAlt /> View Calendar
        </button>
      </nav>
      
      <main className="main-content">
        {renderCurrentView()}
      </main>
      
      {showSuccessPopup && (
        <div className="success-popup">
          <FaCheck />
          <span>
            Calendar uploaded successfully! {eventCount} event{eventCount !== 1 ? 's' : ''} parsed.
          </span>
        </div>
      )}
    </div>
  )
}

function WelcomePage({ onNavigate, events }) {
  const getUpcomingEventsThisMonth = () => {
    if (!events || events.length === 0) return 0
    
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentDay = currentDate.getDate()
    
    return events.filter(event => {
      return event.month === currentMonth && event.day >= currentDay
    }).length
  }

  const upcomingCount = getUpcomingEventsThisMonth()
  const currentMonthName = format(new Date(), 'MMMM')

  return (
    <div className="welcome-page">
      <h2>Welcome to Birthday Tracker!</h2>
      <p>Keep track of all your friends' and family's birthdays in one place.</p>
      
      {events && events.length > 0 && (
        <div className="upcoming-events">
          <h3>This Month</h3>
          <p>{upcomingCount === 0 ? 'No more events this month!' : `${upcomingCount} event${upcomingCount !== 1 ? 's' : ''} in ${currentMonthName}`}</p>
        </div>
      )}
      
      <div className="features">
        <div className="feature" onClick={() => onNavigate('upload')}>
          <FaUpload size={40} />
          <h3>Upload Calendar</h3>
          <p>Import your birthday events from .ics files</p>
        </div>
        <div className="feature" onClick={() => onNavigate('calendar')}>
          <FaCalendarAlt size={40} />
          <h3>View Calendar</h3>
          <p>See all birthdays in a monthly calendar view</p>
        </div>
      </div>
    </div>
  )
}

function UploadPage({ onFileUpload, onNavigate }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file first')
      return
    }

    setIsUploading(true)
    
    setTimeout(() => {
      onFileUpload(selectedFile)
      setIsUploading(false)
      setSelectedFile(null)
      document.querySelector('input[type="file"]').value = ''
    }, 1000)
  }

  return (
    <div className="upload-page">
      <button className="back-button" onClick={() => onNavigate('welcome')}>
        <FaArrowLeft /> Back to Home
      </button>
      <h2>Upload Birthday Calendar</h2>
      <p>Select an .ics or .ical file containing birthday events</p>
      <div className="upload-area">
        <input 
          type="file" 
          accept=".ics,.ical" 
          onChange={handleFileSelect}
        />
        <p>Choose your .ics or .ical file</p>
        <button 
          className="upload-button" 
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Calendar'}
        </button>
      </div>
    </div>
  )
}

function CalendarPage({ events, onNavigate }) {
  const [showEmptyState, setShowEmptyState] = useState(false)
  const [gridColumns, setGridColumns] = useState(1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventDate, setEventDate] = useState(null)
  const [viewMode, setViewMode] = useState('12months')
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const start = new Date(today)
    start.setDate(today.getDate() - today.getDay())
    return start
  })
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  
  useEffect(() => {
    if (!events || events.length === 0) {
      setShowEmptyState(true)
      const timer = setTimeout(() => setShowEmptyState(false), 3000)
      return () => clearTimeout(timer)
    } else {
      setShowEmptyState(false)
    }
  }, [events])

  const navigateYear = (direction) => {
    setSelectedYear(prev => direction === 'next' ? prev + 1 : prev - 1)
  }

  const navigateWeek = (direction) => {
    setCurrentWeekStart(prev => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7))
      return newDate
    })
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'next') {
        newDate.setMonth(prev.getMonth() + 1)
      } else {
        newDate.setMonth(prev.getMonth() - 1)
      }
      return newDate
    })
  }

  const handleEventClick = (event, date) => {
    setSelectedEvent(event)
    setEventDate(date)
  }

  const closeEventPopup = () => {
    setSelectedEvent(null)
    setEventDate(null)
  }

  const calculateAge = (event, viewDate) => {
    if (!event.yearBorn) return null
    
    const birthYear = event.yearBorn
    const viewYear = viewDate.getFullYear()
    const birthMonth = event.month
    const birthDay = event.day
    const viewMonth = viewDate.getMonth()
    const viewDay = viewDate.getDate()
    
    let age = viewYear - birthYear
    
    // Adjust if birthday hasn't occurred yet this year
    if (viewMonth < birthMonth || (viewMonth === birthMonth && viewDay < birthDay)) {
      age--
    }
    
    return age
  }

  useEffect(() => {
    const updateGridColumns = () => {
      const width = window.innerWidth
      if (width < 600) {
        setGridColumns(1)
      } else if (width < 900) {
        setGridColumns(2)
      } else if (width < 1200) {
        setGridColumns(3)
      } else if (width < 1600) {
        setGridColumns(4)
      } else if (width < 2000) {
        setGridColumns(5)
      } else {
        setGridColumns(6)
      }
    }

    updateGridColumns()
    window.addEventListener('resize', updateGridColumns)
    
    return () => window.removeEventListener('resize', updateGridColumns)
  }, [])

  const getCurrentMonth = () => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    return {
      name: format(date, 'MMMM yyyy'),
      date,
      days: eachDayOfInterval({
        start: startOfMonth(date),
        end: endOfMonth(date)
      })
    }
  }

  const getCurrentWeek = () => {
    const endOfWeek = new Date(currentWeekStart)
    endOfWeek.setDate(currentWeekStart.getDate() + 6)
    
    return {
      name: `${format(currentWeekStart, 'MMM d')} - ${format(endOfWeek, 'MMM d, yyyy')}`,
      days: eachDayOfInterval({
        start: currentWeekStart,
        end: endOfWeek
      })
    }
  }

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(selectedYear, i, 1)
    return {
      name: format(date, 'MMMM yyyy'),
      date,
      days: eachDayOfInterval({
        start: startOfMonth(date),
        end: endOfMonth(date)
      })
    }
  })

  const getEventsForDate = (date) => {
    if (!events) return []
    
    return events.filter(event => {
      // Create normalized event date for the selected year
      const normalizedEventDate = new Date(selectedYear, event.month, event.day)
      const isSameDayMatch = isSameDay(normalizedEventDate, date)
      
      // Alternative method: Direct month/day comparison for extra safety
      const isMonthDayMatch = event.month === date.getMonth() && event.day === date.getDate()
      
      return isSameDayMatch || isMonthDayMatch
    })
  }

  return (
    <div className="calendar-page">
      <button className="back-button" onClick={() => onNavigate('welcome')}>
        <FaArrowLeft /> Back to Home
      </button>
      <h2>Birthday Calendar</h2>
      
      <div className="view-controls">
        <div className="view-toggle">
          <button 
            className={`view-toggle-button ${viewMode === 'week' ? 'active' : ''}`}
            onClick={() => setViewMode('week')}
          >
            Week
          </button>
          <button 
            className={`view-toggle-button ${viewMode === 'month' ? 'active' : ''}`}
            onClick={() => setViewMode('month')}
          >
            Month
          </button>
          <button 
            className={`view-toggle-button ${viewMode === '12months' ? 'active' : ''}`}
            onClick={() => setViewMode('12months')}
          >
            12 Months
          </button>
        </div>
        
        <div className="year-navigation">
          {viewMode === 'week' && (
            <>
              <button className="year-nav-button" onClick={() => navigateWeek('prev')}>
                <FaChevronLeft />
              </button>
              <h3 className="year-display">Week</h3>
              <button className="year-nav-button" onClick={() => navigateWeek('next')}>
                <FaChevronRight />
              </button>
            </>
          )}
          {viewMode === 'month' && (
            <>
              <button className="year-nav-button" onClick={() => navigateMonth('prev')}>
                <FaChevronLeft />
              </button>
              <h3 className="year-display">Month</h3>
              <button className="year-nav-button" onClick={() => navigateMonth('next')}>
                <FaChevronRight />
              </button>
            </>
          )}
          {viewMode === '12months' && (
            <>
              <button className="year-nav-button" onClick={() => navigateYear('prev')}>
                <FaChevronLeft />
              </button>
              <h3 className="year-display">{selectedYear}</h3>
              <button className="year-nav-button" onClick={() => navigateYear('next')}>
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
      </div>
      
      <p>
        {viewMode === 'week' ? `Week of ${getCurrentWeek().name}` : 
         viewMode === 'month' ? `${getCurrentMonth().name}` : 
         `All birthdays for ${selectedYear}`}
      </p>
      
      {viewMode === 'week' && (
        <div className="week-view">
          <div className="week-container">
            <h3 className="week-title">{getCurrentWeek().name}</h3>
            <div className="week-grid">
              <div className="weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="weekday">{day}</div>
                ))}
              </div>
              <div className="week-days-grid">
                {getCurrentWeek().days.map((day, dayIndex) => {
                  const dayEvents = getEventsForDate(day)
                  return (
                    <div key={dayIndex} className={`day ${dayEvents.length > 0 ? 'has-events' : ''}`}>
                      <div className="day-header">
                        <span className="day-number">{format(day, 'd')}</span>
                        {dayEvents.length > 0 && (
                          <span className="event-badge">{dayEvents.length}</span>
                        )}
                      </div>
                      {dayEvents.length > 0 && (
                        <div className="events">
                          {dayEvents.map((event, eventIndex) => (
                            <div 
                              key={eventIndex} 
                              className="event clickable" 
                              title={`${event.summary}${event.description ? ` - ${event.description}` : ''}`}
                              onClick={() => handleEventClick(event, day)}
                            >
                              {event.summary.length > 20 ? event.summary.substring(0, 17) + '...' : event.summary}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'month' && (
        <div className="month-view">
          <div className="month-container">
            <h3 className="month-title">{getCurrentMonth().name}</h3>
            <div className="month-grid">
              <div className="weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="weekday">{day}</div>
                ))}
              </div>
              <div className="days-grid">
                {Array.from({ length: getCurrentMonth().days[0].getDay() }, (_, i) => (
                  <div key={`empty-${i}`} className="day empty"></div>
                ))}
                {getCurrentMonth().days.map((day, dayIndex) => {
                  const dayEvents = getEventsForDate(day)
                  return (
                    <div key={dayIndex} className={`day ${dayEvents.length > 0 ? 'has-events' : ''}`}>
                      <div className="day-header">
                        <span className="day-number">{format(day, 'd')}</span>
                        {dayEvents.length > 0 && (
                          <span className="event-badge">{dayEvents.length}</span>
                        )}
                      </div>
                      {dayEvents.length > 0 && (
                        <div className="events">
                          {dayEvents.slice(0, 2).map((event, eventIndex) => (
                            <div 
                              key={eventIndex} 
                              className="event clickable" 
                              title={`${event.summary}${event.description ? ` - ${event.description}` : ''}`}
                              onClick={() => handleEventClick(event, day)}
                            >
                              {event.summary.length > 15 ? event.summary.substring(0, 12) + '...' : event.summary}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div 
                              className="event more-events clickable" 
                              title={`Click to see all ${dayEvents.length} events`}
                              onClick={() => handleEventClick(dayEvents[2], day)}
                            >
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === '12months' && (
        <div className="calendar-grid">
          {months.map((month, monthIndex) => (
            <div key={monthIndex} className="month-container">
              <h3 className="month-title">{month.name}</h3>
              <div className="month-grid">
                <div className="weekdays">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="weekday">{day}</div>
                  ))}
                </div>
                <div className="days-grid">
                  {Array.from({ length: month.days[0].getDay() }, (_, i) => (
                    <div key={`empty-${i}`} className="day empty"></div>
                  ))}
                  {month.days.map((day, dayIndex) => {
                    const dayEvents = getEventsForDate(day)
                    return (
                      <div key={dayIndex} className={`day ${dayEvents.length > 0 ? 'has-events' : ''}`}>
                        <div className="day-header">
                          <span className="day-number">{format(day, 'd')}</span>
                          {dayEvents.length > 0 && (
                            <span className="event-badge">{dayEvents.length}</span>
                          )}
                        </div>
                        {dayEvents.length > 0 && (
                          <div className="events">
                            {dayEvents.slice(0, 2).map((event, eventIndex) => (
                              <div 
                                key={eventIndex} 
                                className="event clickable" 
                                title={`${event.summary}${event.description ? ` - ${event.description}` : ''}`}
                                onClick={() => handleEventClick(event, day)}
                              >
                                {event.summary.length > 15 ? event.summary.substring(0, 12) + '...' : event.summary}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div 
                                className="event more-events clickable" 
                                title={`Click to see all ${dayEvents.length} events`}
                                onClick={() => handleEventClick(dayEvents[2], day)}
                              >
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showEmptyState && (
        <div className="empty-state-popup">
          <span>No events loaded yet</span>
        </div>
      )}
      
      {selectedEvent && eventDate && (
        <div className="event-popup-overlay" onClick={closeEventPopup}>
          <div className="event-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-button" onClick={closeEventPopup}>
              Close
            </button>
            
            <div className="popup-content">
              <h3 className="popup-title">{selectedEvent.summary}</h3>
              
              <div className="popup-details">
                <div className="popup-field">
                  <strong>Date:</strong> {format(eventDate, 'MMMM d, yyyy')}
                </div>
                
                {selectedEvent.yearBorn && (
                  <div className="popup-field">
                    <strong>{selectedEvent.summary.includes('[Anniversary]') ? 'Year:' : 'Born:'}</strong> {selectedEvent.yearBorn}
                  </div>
                )}
                
                {calculateAge(selectedEvent, eventDate) !== null && (
                  <div className="popup-field age-field">
                    <strong>{selectedEvent.summary.includes('[Anniversary]') ? 'Years Ago:' : 'Age:'}</strong> {calculateAge(selectedEvent, eventDate)} {selectedEvent.summary.includes('[Anniversary]') ? 'years ago' : 'years old'}
                  </div>
                )}
                
                {selectedEvent.location && (
                  <div className="popup-field">
                    <strong>Location:</strong> {selectedEvent.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
