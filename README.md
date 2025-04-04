# Weather App

This is a **Weather App** built using **JavaScript**, **OpenWeather API**, and **Tailwind CSS**.

## 🌟 Features

- **Search Weather by City** 🔍
- **Get Weather for Current Location** 📍
- **7-Day Forecast** 📅
- **Search History with Dropdown** 📜
- **Auto-hide Search History** when the cursor moves away 🖱️
- **Responsive & Styled with Tailwind CSS** 🎨

---
[img ss](https://github.com/user-attachments/assets/ce9a4409-a769-46c1-a512-9b44bcca47ff)

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Tailwind CSS

#### ➤ Install Tailwind via npm
```bash
npm install -D tailwindcss 
```

#### ➤ Initialize Tailwind Config
```bash
npx tailwindcss init
```

#### ➤ if got error then thast probabay buz you version of tailwindcss. run this command and initialize tailwind again 
```bash
npm i -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init
```

#### ➤ Configure `tailwind.config.js`
```js
module.exports = {
  content: ["*"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### ➤ Add Tailwind to `src/styles.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4️⃣ Run this and open whith live server
```bash
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
```

---

## 📂 Folder Structure
```
weather-app/
│   ├── index.html      # Main HTML file
│── src/
│   ├── script.js       # Main JavaScript file
│   ├── styles.css      # Tailwind styles
│   ├── output.css      # Processed Tailwind file
│
│── tailwind.config.js  # Tailwind Config
│── package.json       # Dependencies
│── README.md          # Documentation
```

---

## 🌐 API Integration
- **Uses OpenWeather API** for weather data
- **Displays current weather & forecast**
- **Handles errors gracefully**

🔗 **Get your API Key:** [https://openweathermap.org/api](https://openweathermap.org/api)

---

## 🎨 UI & Styling
- **Fully responsive** ✅
- **Styled using Tailwind CSS** 🎨
- **Dark mode friendly** 🌑

---

## 🚀 Deployment
You can deploy using **Netlify**, **Vercel**, or **GitHub Pages**.

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

🎉 **Your Weather App is ready!**
