# SIA Rider System

A modern web application for managing and tracking rider deliveries for N-Tech Hardware, built with React and Vite. This project provides an efficient dashboard for riders to monitor, update, and complete delivery orders.

## Features

- 🚚 **Rider Dashboard**: Real-time dashboard showing total, pending, and completed deliveries.
- 📆 **Date-based Filtering**: View orders for a selected date.
- 🔍 **Customer Search**: Quickly find orders by customer name.
- ✅ **Mark as Delivered**: Riders can update the status of each order directly from the dashboard.
- 🗺️ **Google Maps Integration**: View customer delivery locations on an embedded Google Map.
- 📊 **Order Statistics**: Visual summary of daily orders, pending, and completed deliveries.
- 🔐 **User Authentication**: Basic authentication using local storage (user info stored and removed on logout).
- 🎨 **Modern UI**: Responsive and attractive user interface built with Tailwind CSS and React Icons.

## Tools & Technologies Used

[![My Skills](https://skillicons.dev/icons?i=react,js,tailwind,java,spring,mysql)](https://skillicons.dev)


### Backend API

> **Note:** This frontend expects a backend API server running at `http://localhost:8080/api/orders`. Be sure to start the backend before using the dashboard.

## Project Structure

- `src/Components/Homepage.jsx`: Main dashboard component for riders
- `src/App.jsx`: App entrypoint
- `src/main.jsx`: Renders the React app
- `src/index.css`: Tailwind CSS import and custom styles
- `vite.config.js`: Vite and plugin configuration
- `eslint.config.js`: ESLint config for code linting
