import { Project } from '../types';
import { generateFileId } from './fileUtils';

export const createJavaScriptProject = (): Project => ({
  id: generateFileId(),
  name: 'New JavaScript Project',
  openTabs: ['main-js'],
  activeFile: 'main-js',
  files: [
    {
      id: 'main-js',
      name: 'main.js',
      type: 'file',
      language: 'javascript',
      content: `// Write your JavaScript code here
console.log('Hello, World!');`
    }
  ]
});

export const createPythonProject = (): Project => ({
  id: generateFileId(),
  name: 'Python Basic Project',
  openTabs: ['main-py', 'readme-md'],
  activeFile: 'main-py',
  files: [
    {
      id: 'main-py',
      name: 'main.py',
      type: 'file',
      language: 'python',
      content: `#!/usr/bin/env python3
"""
Python Basic Project
A simple Python project to get you started.
"""

def greet(name="World"):
    """
    Greet someone with a friendly message.
    
    Args:
        name (str): The name to greet. Defaults to "World".
        
    Returns:
        str: A greeting message.
    """
    return f"Hello, {name}! Welcome to Python programming! 🐍"

def main():
    """Main function to run the program."""
    print(greet())
    print(greet("Developer"))
    
    # Example of basic Python features
    numbers = [1, 2, 3, 4, 5]
    squares = [x**2 for x in numbers]
    print(f"Numbers: {numbers}")
    print(f"Squares: {squares}")
    
    # Dictionary example
    person = {
        "name": "Alice",
        "age": 30,
        "city": "New York"
    }
    print(f"Person info: {person}")

if __name__ == "__main__":
    main()`
    },
    {
      id: 'readme-md',
      name: 'README.md',
      type: 'file',
      language: 'markdown',
      content: `# Python Basic Project

A simple Python project template to get you started with Python development.

## Features

- Basic Python structure with functions
- Example of lists, dictionaries, and list comprehensions
- Proper docstrings and comments
- Main function pattern

## Usage

Run the main script:
\`\`\`bash
python main.py
\`\`\`

## Getting Started

1. Edit \`main.py\` to add your own code
2. Run the script to see the output
3. Add more Python files as needed

Happy coding! 🐍`
    }
  ]
});

export const createFlaskProject = (): Project => ({
  id: generateFileId(),
  name: 'Flask Web App',
  openTabs: ['app-py', 'index-html'],
  activeFile: 'app-py',
  files: [
    {
      id: 'app-py',
      name: 'app.py',
      type: 'file',
      language: 'python',
      content: `#!/usr/bin/env python3
"""
Flask Web Application
A simple Flask web app with basic routes and templates.
"""

from flask import Flask, render_template, request, jsonify
import json
from datetime import datetime

app = Flask(__name__)

# Sample data
tasks = [
    {"id": 1, "title": "Learn Flask", "completed": False},
    {"id": 2, "title": "Build a web app", "completed": True},
    {"id": 3, "title": "Deploy to production", "completed": False}
]

@app.route('/')
def home():
    """Home page route."""
    return render_template('index.html', tasks=tasks)

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """API endpoint to get all tasks."""
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    """API endpoint to add a new task."""
    data = request.get_json()
    new_task = {
        "id": len(tasks) + 1,
        "title": data.get('title', ''),
        "completed": False
    }
    tasks.append(new_task)
    return jsonify(new_task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """API endpoint to update a task."""
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    data = request.get_json()
    task['completed'] = data.get('completed', task['completed'])
    task['title'] = data.get('title', task['title'])
    return jsonify(task)

@app.route('/about')
def about():
    """About page route."""
    return {
        "message": "Flask Web App",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == '__main__':
    print("Starting Flask development server...")
    print("Visit: http://localhost:5000")
    app.run(debug=True, port=5000)`
    },
    {
      id: 'index-html',
      name: 'templates/index.html',
      type: 'file',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flask Task Manager</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #4a5568;
            text-align: center;
            margin-bottom: 30px;
        }
        .task-form {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }
        .task-form input {
            flex: 1;
            padding: 12px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 16px;
        }
        .task-form button {
            padding: 12px 24px;
            background: #4299e1;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
        }
        .task-form button:hover {
            background: #3182ce;
        }
        .task-list {
            list-style: none;
            padding: 0;
        }
        .task-item {
            display: flex;
            align-items: center;
            padding: 15px;
            margin: 10px 0;
            background: #f7fafc;
            border-radius: 8px;
            border-left: 4px solid #4299e1;
        }
        .task-item.completed {
            background: #f0fff4;
            border-left-color: #48bb78;
            text-decoration: line-through;
            opacity: 0.7;
        }
        .task-checkbox {
            margin-right: 15px;
            transform: scale(1.2);
        }
        .task-title {
            flex: 1;
            font-size: 16px;
        }
        .status {
            margin-top: 20px;
            padding: 10px;
            background: #edf2f7;
            border-radius: 8px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🐍 Flask Task Manager</h1>
        
        <div class="task-form">
            <input type="text" id="taskInput" placeholder="Enter a new task..." />
            <button onclick="addTask()">Add Task</button>
        </div>
        
        <ul class="task-list" id="taskList">
            {% for task in tasks %}
            <li class="task-item {{ 'completed' if task.completed else '' }}">
                <input type="checkbox" class="task-checkbox" 
                       {{ 'checked' if task.completed else '' }}
                       onchange="toggleTask({{ task.id }})">
                <span class="task-title">{{ task.title }}</span>
            </li>
            {% endfor %}
        </ul>
        
        <div class="status">
            <p>Flask web application running successfully! 🎉</p>
            <p>This template demonstrates routes, templates, and API endpoints.</p>
        </div>
    </div>

    <script>
        async function addTask() {
            const input = document.getElementById('taskInput');
            const title = input.value.trim();
            
            if (!title) return;
            
            try {
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title })
                });
                
                if (response.ok) {
                    input.value = '';
                    location.reload(); // Simple reload for demo
                }
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
        
        async function toggleTask(taskId) {
            try {
                const taskItem = event.target.closest('.task-item');
                const completed = event.target.checked;
                
                const response = await fetch(\`/api/tasks/\${taskId}\`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed })
                });
                
                if (response.ok) {
                    taskItem.classList.toggle('completed', completed);
                }
            } catch (error) {
                console.error('Error updating task:', error);
            }
        }
        
        // Allow Enter key to add task
        document.getElementById('taskInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    </script>
</body>
</html>`
    },
    {
      id: 'requirements-txt',
      name: 'requirements.txt',
      type: 'file',
      language: 'plaintext',
      content: `Flask==2.3.3
Werkzeug==2.3.7
Jinja2==3.1.2
click==8.1.7
itsdangerous==2.1.2
MarkupSafe==2.1.3`
    },
    {
      id: 'readme-flask',
      name: 'README.md',
      type: 'file',
      language: 'markdown',
      content: `# Flask Web Application

A simple Flask web application with task management functionality.

## Features

- 🏠 Home page with task list
- 📝 Add new tasks
- ✅ Mark tasks as complete/incomplete
- 🔗 RESTful API endpoints
- 📱 Responsive design

## Installation

1. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. Run the application:
\`\`\`bash
python app.py
\`\`\`

3. Open your browser and visit: http://localhost:5000

## API Endpoints

- \`GET /\` - Home page
- \`GET /api/tasks\` - Get all tasks
- \`POST /api/tasks\` - Add new task
- \`PUT /api/tasks/<id>\` - Update task
- \`GET /about\` - About information

## Project Structure

- \`app.py\` - Main Flask application
- \`templates/index.html\` - HTML template
- \`requirements.txt\` - Python dependencies

Happy coding with Flask! 🐍🚀`
    }
  ]
});

export const createDataScienceProject = (): Project => ({
  id: generateFileId(),
  name: 'Data Science Project',
  openTabs: ['analysis-py', 'data-csv'],
  activeFile: 'analysis-py',
  files: [
    {
      id: 'analysis-py',
      name: 'data_analysis.py',
      type: 'file',
      language: 'python',
      content: '#!/usr/bin/env python3\n' +
'"""\n' +
'Data Science Project\n' +
'A comprehensive data analysis template with pandas, numpy, and visualization.\n' +
'"""\n' +
'\n' +
'import pandas as pd\n' +
'import numpy as np\n' +
'import matplotlib.pyplot as plt\n' +
'import seaborn as sns\n' +
'from datetime import datetime, timedelta\n' +
'import json\n' +
'\n' +
'def generate_sample_data():\n' +
'    """Generate sample sales data for analysis."""\n' +
'    np.random.seed(42)\n' +
'    dates = pd.date_range(start="2023-01-01", end="2023-12-31", freq="D")\n' +
'    \n' +
'    data = {\n' +
'        "date": dates,\n' +
'        "sales": np.random.normal(1000, 200, len(dates)),\n' +
'        "customers": np.random.poisson(50, len(dates)),\n' +
'        "product_category": np.random.choice(["Electronics", "Clothing", "Books", "Home"], len(dates)),\n' +
'        "region": np.random.choice(["North", "South", "East", "West"], len(dates))\n' +
'    }\n' +
'    \n' +
'    df = pd.DataFrame(data)\n' +
'    df["sales"] = np.maximum(df["sales"], 0)  # Ensure positive sales\n' +
'    df["revenue_per_customer"] = df["sales"] / df["customers"]\n' +
'    \n' +
'    return df\n' +
'\n' +
'def analyze_data(df):\n' +
'    """Perform comprehensive data analysis."""\n' +
'    print("📊 DATA ANALYSIS REPORT")\n' +
'    print("=" * 50)\n' +
'    \n' +
'    # Basic statistics\n' +
'    print("\\n📈 BASIC STATISTICS:")\n' +
'    print(f"Total rows: {len(df):,}")\n' +
'    print(f"Date range: {df[\'date\'].min()} to {df[\'date\'].max()}")\n' +
'    print(f"Average daily sales: ${df[\'sales\'].mean():.2f}")\n' +
'    print(f"Total revenue: ${df[\'sales\'].sum():,.2f}")\n' +
'    print(f"Average customers per day: {df[\'customers\'].mean():.1f}")\n' +
'    \n' +
'    # Category analysis\n' +
'    print("\\n🏷️ CATEGORY PERFORMANCE:")\n' +
'    category_stats = df.groupby("product_category").agg({\n' +
'        "sales": ["mean", "sum", "count"],\n' +
'        "customers": "mean"\n' +
'    }).round(2)\n' +
'    print(category_stats)\n' +
'    \n' +
'    return {\n' +
'        "total_revenue": df["sales"].sum(),\n' +
'        "avg_daily_sales": df["sales"].mean(),\n' +
'        "best_category": df.groupby("product_category")["sales"].sum().idxmax()\n' +
'    }\n' +
'\n' +
'def main():\n' +
'    """Main analysis pipeline."""\n' +
'    print("🚀 Starting Data Science Analysis...")\n' +
'    print("=" * 50)\n' +
'    \n' +
'    # Generate sample data\n' +
'    print("📊 Generating sample sales data...")\n' +
'    df = generate_sample_data()\n' +
'    \n' +
'    # Save sample data to CSV\n' +
'    df.to_csv("sample_sales_data.csv", index=False)\n' +
'    print("✅ Sample data saved to \'sample_sales_data.csv\'")\n' +
'    \n' +
'    # Perform analysis\n' +
'    insights = analyze_data(df)\n' +
'    \n' +
'    print("\\n🎉 Data analysis completed successfully!")\n' +
'    print("Check the generated files for detailed results.")\n' +
'\n' +
'if __name__ == "__main__":\n' +
'    main()'
    },
    {
      id: 'data-csv',
      name: 'sample_data.csv',
      type: 'file',
      language: 'plaintext',
      content: `date,product,sales,customers,region
2023-01-01,Electronics,1250.50,45,North
2023-01-02,Clothing,890.25,38,South
2023-01-03,Books,1150.75,52,East
2023-01-04,Home,975.00,41,West
2023-01-05,Electronics,1320.80,48,North
2023-01-06,Clothing,1100.25,55,South
2023-01-07,Books,825.50,35,East
2023-01-08,Home,1275.00,47,West
2023-01-09,Electronics,1180.75,43,North
2023-01-10,Clothing,950.25,39,South`
    },
    {
      id: 'requirements-ds',
      name: 'requirements.txt',
      type: 'file',
      language: 'plaintext',
      content: `pandas==2.1.1
numpy==1.24.3
matplotlib==3.7.2
seaborn==0.12.2
jupyter==1.0.0
scipy==1.11.2
scikit-learn==1.3.0`
    },
    {
      id: 'readme-ds',
      name: 'README.md',
      type: 'file',
      language: 'markdown',
      content: `# Data Science Project

A comprehensive data science project template with analysis, visualization, and insights.

## Features

- 📊 Sample data generation
- 📈 Statistical analysis
- 📉 Data visualization with matplotlib/seaborn
- 🔍 Category and regional performance analysis
- 📅 Time series insights
- 💾 Export results to JSON/CSV

## Installation

Install required packages:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage

Run the analysis:
\`\`\`bash
python data_analysis.py
\`\`\`

## What it does

1. **Data Generation**: Creates sample sales data with multiple dimensions
2. **Statistical Analysis**: Computes key metrics and summaries
3. **Visualization**: Creates charts for trends, categories, and correlations
4. **Insights Export**: Saves results to JSON for further use

## Files Generated

- \`sample_sales_data.csv\` - Generated dataset
- \`analysis_results.json\` - Key insights and metrics

## Next Steps

- Replace sample data with your own dataset
- Customize analysis based on your requirements
- Add more sophisticated ML models
- Create interactive dashboards

Happy data analyzing! 📊🐍`
    }
  ]
});

export const createSQLProject = (): Project => ({
  id: generateFileId(),
  name: 'New SQL Project',
  openTabs: ['main-sql'],
  activeFile: 'main-sql',
  files: [
    {
      id: 'main-sql',
      name: 'main.sql',
      type: 'file',
      language: 'sql',
      content: `-- Write your SQL queries here
SELECT 'Hello, World!' AS message;`
    }
  ]
});

export const createEmptyProject = (): Project => ({
  id: generateFileId(),
  name: 'New Project',
  openTabs: [],
  activeFile: undefined,
  files: []
});

export const createHtmlProject = (): Project => ({
  id: generateFileId(),
  name: 'HTML Website Project',
  openTabs: ['index-html'],
  activeFile: 'index-html',
  files: [
    {
      id: 'index-html',
      name: 'index.html',
      type: 'file',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
    </header>
    
    <main>
        <section class="hero">
            <h2>Hello, World!</h2>
            <p>This is a simple HTML website.</p>
            <button id="click-btn">Click Me!</button>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 My Website. All rights reserved.</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`
    },
    {
      id: 'styles-css',
      name: 'styles.css',
      type: 'file',
      language: 'css',
      content: `/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 1rem 0;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

header h1 {
    color: white;
    font-size: 2rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

main {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 2rem;
}

.hero {
    background: rgba(255, 255, 255, 0.9);
    padding: 3rem;
    border-radius: 15px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 500px;
    transform: translateY(0);
    transition: transform 0.3s ease;
}

.hero:hover {
    transform: translateY(-5px);
}

.hero h2 {
    color: #667eea;
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

.hero p {
    margin-bottom: 2rem;
    font-size: 1.1rem;
    color: #666;
}

#click-btn {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 30px;
    font-size: 1rem;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

#click-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

#click-btn:active {
    transform: translateY(0);
}

footer {
    text-align: center;
    padding: 1rem;
    color: rgba(255, 255, 255, 0.8);
    position: fixed;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.1);
}

/* Responsive design */
@media (max-width: 768px) {
    .hero {
        padding: 2rem;
        margin: 1rem;
    }
    
    .hero h2 {
        font-size: 2rem;
    }
    
    header h1 {
        font-size: 1.5rem;
    }
}`
    },
    {
      id: 'script-js',
      name: 'script.js',
      type: 'file',
      language: 'javascript',
      content: `// Interactive JavaScript for the website
document.addEventListener('DOMContentLoaded', function() {
    // Get the button element
    const clickButton = document.getElementById('click-btn');
    const heroSection = document.querySelector('.hero');
    
    // Counter for button clicks
    let clickCount = 0;
    
    // Array of fun messages
    const messages = [
        "Hello, World! 🌟",
        "You clicked me! 🎉",
        "JavaScript is awesome! 💻",
        "Keep clicking! 🚀",
        "You're doing great! ⭐",
        "Frontend development rocks! 🎨",
        "One more click? 😄",
        "Infinite possibilities! ∞"
    ];
    
    // Array of colors for the hero section
    const colors = [
        'rgba(255, 255, 255, 0.9)',
        'rgba(255, 248, 220, 0.9)',
        'rgba(240, 248, 255, 0.9)',
        'rgba(245, 255, 250, 0.9)',
        'rgba(255, 240, 245, 0.9)',
        'rgba(248, 248, 255, 0.9)'
    ];
    
    // Add click event listener
    clickButton.addEventListener('click', function() {
        clickCount++;
        
        // Change the message
        const messageIndex = (clickCount - 1) % messages.length;
        const heroTitle = heroSection.querySelector('h2');
        heroTitle.textContent = messages[messageIndex];
        
        // Change background color
        const colorIndex = clickCount % colors.length;
        heroSection.style.background = colors[colorIndex];
        
        // Add a fun animation
        heroSection.style.transform = 'scale(1.05)';
        setTimeout(() => {
            heroSection.style.transform = 'scale(1)';
        }, 200);
        
        // Update button text
        clickButton.textContent = \`Clicked \${clickCount} time\${clickCount === 1 ? '' : 's'}!\`;
        
        // Console log for debugging
        console.log(\`Button clicked \${clickCount} times!\`);
        
        // Special effects for milestone clicks
        if (clickCount === 10) {
            alert('🎉 Congratulations! You clicked 10 times!');
        } else if (clickCount === 25) {
            alert('🏆 Amazing! You are a clicking champion!');
        }
    });
    
    // Add some hover effects with JavaScript
    clickButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    clickButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Console welcome message
    console.log('🚀 Website loaded successfully!');
    console.log('💡 Open the browser developer tools to see this message!');
});

// Function to demonstrate JavaScript capabilities
function showCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    console.log(\`Current time: \${timeString}\`);
    return timeString;
}

// Call the function every second
setInterval(showCurrentTime, 1000);`
    }
  ]
});

export const createReactProject = (): Project => ({
  id: generateFileId(),
  name: 'React App Project',
  openTabs: ['index-html', 'app-jsx'],
  activeFile: 'app-jsx',
  files: [
    {
      id: 'index-html',
      name: 'index.html',
      type: 'file',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <!-- React component will be injected here by the preview system -->
</body>
</html>`
    },
    {
      id: 'app-jsx',
      name: 'app.jsx',
      type: 'file',
      language: 'javascript',
      content: `// React Component Example
function App() {
    const [count, setCount] = React.useState(0);
    const [name, setName] = React.useState('World');
    
    const incrementCount = () => {
        setCount(count + 1);
    };
    
    const resetCount = () => {
        setCount(0);
    };
    
    return (
        <div style={{ 
            padding: '20px', 
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
        }}>
            <h1>Hello, {name}! 👋</h1>
            <p>Welcome to your React app!</p>
            
            <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '20px',
                borderRadius: '10px',
                margin: '20px auto',
                maxWidth: '400px'
            }}>
                <h2>Counter: {count}</h2>
                <button 
                    onClick={incrementCount}
                    style={{
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        margin: '5px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Increment
                </button>
                <button 
                    onClick={resetCount}
                    style={{
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        margin: '5px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Reset
                </button>
            </div>
            
            <div style={{ marginTop: '20px' }}>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: 'none',
                        margin: '10px'
                    }}
                />
            </div>
        </div>
    );
}

// Render the App component
ReactDOM.render(<App />, document.getElementById('root'));`
    }
  ]
});

export const createBootstrapProject = (): Project => ({
  id: generateFileId(),
  name: 'Bootstrap Website',
  openTabs: ['bootstrap-html'],
  activeFile: 'bootstrap-html',
  files: [
    {
      id: 'bootstrap-html',
      name: 'index.html',
      type: 'file',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap Website</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="#"><i class="fas fa-code"></i> My Website</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="#home">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="#services">Services</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="bg-light py-5">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold text-primary">Welcome to Bootstrap!</h1>
                    <p class="lead">Build responsive, mobile-first websites with the world's most popular front-end framework.</p>
                    <button class="btn btn-primary btn-lg me-3">Get Started</button>
                    <button class="btn btn-outline-primary btn-lg">Learn More</button>
                </div>
                <div class="col-lg-6">
                    <img src="https://via.placeholder.com/500x300/007bff/ffffff?text=Bootstrap" class="img-fluid rounded" alt="Bootstrap">
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="about" class="py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center mb-5">
                    <h2 class="display-5 fw-bold">Why Choose Bootstrap?</h2>
                    <p class="lead">Powerful features for modern web development</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="card h-100 text-center">
                        <div class="card-body">
                            <i class="fas fa-mobile-alt fa-3x text-primary mb-3"></i>
                            <h5 class="card-title">Responsive Design</h5>
                            <p class="card-text">Mobile-first approach ensures your site looks great on all devices.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card h-100 text-center">
                        <div class="card-body">
                            <i class="fas fa-bolt fa-3x text-primary mb-3"></i>
                            <h5 class="card-title">Fast Development</h5>
                            <p class="card-text">Pre-built components and utilities speed up your development process.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card h-100 text-center">
                        <div class="card-body">
                            <i class="fas fa-palette fa-3x text-primary mb-3"></i>
                            <h5 class="card-title">Customizable</h5>
                            <p class="card-text">Easily customize colors, spacing, and components to match your brand.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="bg-primary text-white py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center">
                    <h2 class="display-5 fw-bold mb-4">Get In Touch</h2>
                    <p class="lead mb-4">Ready to start your next project?</p>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="d-flex align-items-center justify-content-center">
                                <i class="fas fa-envelope fa-2x me-3"></i>
                                <div>
                                    <h5>Email</h5>
                                    <p class="mb-0">contact@mywebsite.com</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="d-flex align-items-center justify-content-center">
                                <i class="fas fa-phone fa-2x me-3"></i>
                                <div>
                                    <h5>Phone</h5>
                                    <p class="mb-0">+1 (555) 123-4567</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white text-center py-3">
        <div class="container">
            <p class="mb-0">&copy; 2025 My Website. Built with Bootstrap 5.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`
    }
  ]
});

export const getDefaultProjects = (): Project[] => [
  createHtmlProject()
];

// All functions are already exported individually above