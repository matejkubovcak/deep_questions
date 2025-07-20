# Deep Questions App

A Vue 3 application that displays deep, introspective questions with state persistence and flexible navigation modes.

## 🎯 Overview

This app presents users with thought-provoking questions from `questions.txt`, allowing them to navigate through questions sequentially or randomly while maintaining their progress across browser sessions.

## ✨ Features

### Core Functionality
- **Question Display**: Clean, minimalist interface with large, readable text
- **Navigation Modes**: 
  - Sequential Mode: Show questions in order (1, 2, 3...)
  - Random Mode: Show questions randomly, ensuring no repeats until all shown
- **State Persistence**: Progress saved to localStorage, survives browser reloads
- **Progress Tracking**: Visual indicators showing completion status

### User Controls
- Next/Previous navigation buttons
- Random question button
- Mode toggle (Sequential/Random)
- Reset progress option
- Progress indicator with completion percentage

### Technical Features
- **Responsive Design**: Mobile-first approach with touch-friendly controls
- **Smooth Animations**: Fade transitions between questions
- **Accessibility**: Keyboard navigation and screen reader support
- **Offline Capability**: Works without internet connection

## 🛠 Technical Stack

- **Frontend**: Vue 3 with Composition API
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Storage**: LocalStorage for state persistence

## 📁 Project Structure

```
deep-questions-app/
├── src/
│   ├── components/
│   │   ├── QuestionDisplay.vue      # Main question display component
│   │   ├── NavigationControls.vue   # Next/Previous/Random buttons
│   │   ├── ProgressIndicator.vue    # Progress bar and stats
│   │   └── ModeToggle.vue          # Sequential/Random mode toggle
│   ├── stores/
│   │   └── questionStore.js        # Pinia store with persistence
│   ├── utils/
│   │   └── questionLoader.js       # Question parsing utilities
│   ├── App.vue                     # Root component
│   └── main.js                     # App entry point
├── public/
│   └── questions.txt               # Question data source
├── package.json
└── index.html
```

## 🔄 State Management

### Pinia Store Structure
```javascript
{
  currentQuestionIndex: number,    // Current question position
  viewedQuestions: Set<number>,    // Questions that have been shown
  navigationMode: 'sequential' | 'random',
  questions: Array<Question>,      // Parsed questions from questions.txt
  totalQuestions: number
}
```

### LocalStorage Persistence
The app automatically saves state to localStorage with the key `deep-questions-state`:
```javascript
{
  "viewedQuestions": [1, 5, 12, 23, ...],
  "currentQuestionIndex": 15,
  "navigationMode": "random",
  "lastViewedDate": "2024-01-15T10:30:00Z"
}
```

## 🎨 UI/UX Design

### Design Principles
- **Minimalist**: Clean, distraction-free interface
- **Readable**: Large, clear typography for questions
- **Accessible**: High contrast, keyboard navigation
- **Responsive**: Works seamlessly on all device sizes

### Visual Theme
- **Dark Mode**: Primary theme with subtle gradients
- **Typography**: Large, readable font for questions
- **Animations**: Smooth fade transitions between questions
- **Layout**: Centered question with controls below

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd deep-questions-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development
```bash
# Start development server with hot reload
npm run dev

# Run linting
npm run lint

# Run tests (if implemented)
npm run test
```

## 📊 Data Source

Questions are loaded from `public/questions.txt`, which contains 73 deep, introspective questions. The app parses this file on startup and stores questions in reactive state.

### Question Format
```
1. If your life were a landscape, what geographical features would represent your inner emotional terrain?
2. What part of yourself do you hide from others that you wish they could safely see?
...
```

## 🔧 Configuration

### Environment Variables
- `VITE_APP_TITLE`: App title (default: "Deep Questions")
- `VITE_STORAGE_KEY`: LocalStorage key (default: "deep-questions-state")

### Customization
- Modify `tailwind.config.js` for theme customization
- Update `src/stores/questionStore.js` for state management changes
- Edit `public/questions.txt` to add/modify questions

## 🧪 Testing Strategy

### Unit Tests
- Component rendering and interactions
- Store state management
- Question parsing utilities
- LocalStorage persistence

### Integration Tests
- End-to-end navigation flows
- State persistence across sessions
- Responsive design breakpoints

## 📱 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔮 Future Enhancements

### Planned Features
- Question categories/tags
- Favorite questions bookmarking
- Export progress/answers
- Share specific questions
- Daily question reminders
- Answer journaling feature
- Question difficulty ratings
- Social sharing capabilities

### Advanced Features
- Multiple question sets
- User accounts and cloud sync
- Question recommendations
- Progress analytics
- Custom question creation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Questions inspired by deep psychological and philosophical inquiry
- Built with Vue 3 and modern web technologies
- Designed for mindful self-reflection and personal growth 