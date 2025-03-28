// core-utils.js - Core utility functions used throughout the application

// Format number with commas
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculate monthly payment
export function calculateMonthlyPayment(amount, interestRate, months) {
  amount = parseFloat(amount);
  interestRate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
  months = parseInt(months);
  
  // Calculate monthly payment using loan formula
  return (
      (amount * interestRate * Math.pow(1 + interestRate, months)) /
      (Math.pow(1 + interestRate, months) - 1)
  );
}

// Function to get current date in the format: "12th March, 2025"
export function getCurrentDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  // Add suffix to day
  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) suffix = 'st';
  else if (day === 2 || day === 22) suffix = 'nd';
  else if (day === 3 || day === 23) suffix = 'rd';
  
  return `${day}${suffix} ${month}, ${year}`;
}

// Function to get current time in the format: "14:32"
export function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Update status bar time
export function updateTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const timeElement = document.querySelector(".status-bar div:first-child");
  if (timeElement) {
      timeElement.textContent = `${hours}:${minutes}`;
  }
}

// Check if device is mobile
export function isMobile() {
  return window.innerWidth <= 480;
}