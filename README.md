# F1 Predictor

A comprehensive Formula 1 data platform that serves F1 data from the OpenF1 API with plans for intelligent race outcome predictions.

## 🏎️ Project Overview

This project combines a Django REST API backend with a Next.js frontend to deliver F1 racing data and analytics. Currently focused on data visualization and historical analysis, with future machine learning capabilities planned for race prediction.

## 🛠️ Tech Stack

### Backend
- **Django** 
- **Django REST Framework** 
- **SQLite** (development)
- **OpenF1 API** 

### Frontend
- **Next.js** 
- **React** 
- **TypeScript** 

## 📋 Features

### Current Features
- Podium from the latest GP
- Data about any current driver
- Data about any F1 event form 2023

### Planned Features
-  AI-powered race outcome prediction
-  Advanced analytics and insights
-  Driver and team performance analysis
-  Mobile-optimized experience

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup (Django)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd f1_predictor
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

The Django API will be available at `http://localhost:8000`

## 📁 Project Structure

```
f1_predictor/
├── drivers/               # Django app for driver data
├── f1_predictor/          # Main Django project
│   └── templates/         # Django templates
├── manage.py              # Django management script
├── main.py                # Main application entry point
├── db.sqlite3             # SQLite database
├── requirements.txt       # Python dependencies
├── pyproject.toml         # Project configuration
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
DEBUG=1/0
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=hosts-you-want-to-use
```

## 📊 API Endpoints

### Current Endpoints
- `GET /top3/` - Latest podium info
- `GET /drivers/<int:driver_number>` - Driver information

- *Note: API documentation will be available at `/api/docs/` when fully implemented*

## 🤝 Contributing
Feel free to contribute by opening a pull request!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenF1 API](https://openf1.org/) for providing comprehensive F1 data
- Django and Next.js communities for excellent documentation

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

---

