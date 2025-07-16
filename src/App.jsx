import { useState } from 'react'
import { FaBars, FaTimes, FaCalendarAlt, FaUpload, FaHome, FaCheck } from 'react-icons/fa'
import ICAL from 'ical.js'
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentView, setCurrentView] = useState('welcome')
  const [events, setEvents] = useState([])
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [eventCount, setEventCount] = useState(0)

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
        
        const parsedEvents = vevents.map(vevent => {
          const event = new ICAL.Event(vevent)
          return {
            summary: event.summary,
            startDate: event.startDate.toJSDate(),
            endDate: event.endDate.toJSDate(),
            description: event.description || '',
            location: event.location || ''
          }
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
        return <WelcomePage />
      case 'upload':
        return <UploadPage onFileUpload={handleFileUpload} />
      case 'calendar':
        return <CalendarPage events={events} />
      default:
        return <WelcomePage />
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

function WelcomePage() {
  return (
    <div className="welcome-page">
      <h2>Welcome to Birthday Tracker!</h2>
      <p>Keep track of all your friends' and family's birthdays in one place.</p>
      <div className="features">
        <div className="feature">
          <FaUpload size={40} />
          <h3>Upload Calendar</h3>
          <p>Import your birthday events from .ics files</p>
        </div>
        <div className="feature">
          <FaCalendarAlt size={40} />
          <h3>View Calendar</h3>
          <p>See all birthdays in a monthly calendar view</p>
        </div>
      </div>
    </div>
  )
}

function UploadPage({ onFileUpload }) {
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

function CalendarPage() {
  return (
    <div className="calendar-page">
      <h2>Birthday Calendar</h2>
      <p>Monthly view of all birthdays</p>
      <div className="calendar-placeholder">
        <p>Calendar view will be implemented here</p>
      </div>
    </div>
  )
}

export default App
