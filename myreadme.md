# SkillSwap Hub – Full Stack Web Application

## Overview

SkillSwap Hub is a full-stack web application developed for the COM4113 Tech Stack Development module. The platform enables users to share, discover, and interact with educational resources within a collaborative community environment.

The system integrates frontend and backend technologies, allowing users to register, log in, create resources, search content, and engage through comments and upvotes. The project demonstrates the application of modern web development principles, including client-server architecture, database integration, and secure authentication.

---

## Aims and Objectives

The primary aim of this project was to design and develop a functional, responsive, and interactive web application.

### Objectives:

* Develop a structured frontend using HTML, CSS, and JavaScript
* Implement backend functionality using Flask (Python)
* Integrate a database system for persistent storage
* Develop secure user authentication
* Enable dynamic interaction using API endpoints
* Evaluate the system’s performance and limitations

---

## Technologies Used

### Frontend Technologies

* **HTML5** – Provides semantic structure
* **CSS3** – Used for styling and responsive design
* **JavaScript (ES6)** – Handles dynamic content and API calls

### Backend Technologies

* **Flask (Python)** – Lightweight web framework for routing and logic
* **Flask-Bcrypt** – Password hashing for security
* **Flask Sessions** – Maintains user login state

### Database

* **MongoDB** – NoSQL database for flexible data storage
* **PyMongo** – Python interface for MongoDB operations

---

## System Architecture

The application follows a **three-tier architecture**:

1. **Presentation Layer (Frontend)**

   * Handles user interaction
   * Built using HTML, CSS, JavaScript

2. **Application Layer (Backend)**

   * Processes logic and requests
   * Implemented using Flask

3. **Data Layer (Database)**

   * Stores user and resource data
   * Managed using MongoDB

This separation improves scalability, maintainability, and performance.

---

## Authentication and Security

The application includes a secure authentication system:

* User registration and login
* Password hashing using Flask-Bcrypt
* Session-based authentication
* Route protection for logged-in users only

### Security Considerations:

* Plain-text passwords are not stored
* Basic input validation is implemented
* Session management prevents unauthorized access

---

## Features and Functionality

### 1. User Authentication

Users can create accounts and log in securely. Sessions maintain authentication across pages.

### 2. Resource Management

Users can:

* Add new resources
* View shared content
* Categorise resources

### 3. Search Functionality

A search system allows users to find resources using keywords. MongoDB regex queries are used to enable flexible searching.

### 4. Upvoting System

Users can upvote resources, increasing their visibility and ranking.

### 5. Comment System

Users can engage with resources by adding comments, supporting collaborative discussion.

### 6. Profile Management

Users can edit their profile details, including name, bio, and skills.

---

## User Interface Design

The interface follows modern UI/UX principles:

* Clean and minimal design
* Card-based layout for readability
* Responsive grid system
* Consistent colour palette and typography
* Interactive elements such as buttons and forms

The design ensures usability across different devices, including desktops, tablets, and mobile phones.

---

## Implementation Details

### Backend Implementation

Flask routes were used to handle:

* Authentication (`/login`, `/register`)
* Resource operations (`/add`, `/api/resources`)
* User interactions (`/upvote`, `/comment`)

### API Integration

JavaScript Fetch API enables asynchronous communication between frontend and backend, allowing dynamic updates without reloading pages.

### Database Design

**Users Collection**

* Email
* Password (hashed)
* Profile details

**Resources Collection**

* Title
* Description
* Category
* Upvotes
* Comments
* Creator

---

## Challenges and Solutions

### MongoDB Connection Issues

The application initially failed to connect to MongoDB due to the service not running. This was resolved by starting the MongoDB server and verifying the connection string.

### Template Rendering Errors

Flask could not locate HTML files due to incorrect directory structure. This was fixed by placing all HTML files inside the `/templates` folder.

### Frontend–Backend Integration

Managing asynchronous data required careful handling of API calls using JavaScript.

---

## Critical Evaluation

### Strengths

* Fully functional full-stack system
* Secure authentication implementation
* Dynamic content rendering using JavaScript
* Scalable NoSQL database design
* Responsive and modern UI

### Limitations

* Limited advanced validation and error handling
* No role-based access control (e.g., admin users)
* Basic UI compared to industry-level applications
* Limited persistence when MongoDB is not configured

---

## Future Improvements

* Implement image uploads for resources
* Add user roles and permissions
* Improve UI with animations and transitions
* Integrate MongoDB Atlas for cloud deployment
* Develop RESTful API structure
* Deploy application using platforms such as Render or Heroku

---

## Conclusion

SkillSwap Hub successfully demonstrates the development of a full-stack web application using modern web technologies. The project integrates frontend design, backend processing, and database management to create an interactive and functional platform.

The system meets the objectives of the assignment and showcases key development skills, including authentication, API design, and data handling. With further enhancements, the platform could be extended into a production-level application.

---

## How to Run the Project

1. Navigate to the project folder:

```
cd Skillswap
```

2. Install dependencies:

```
pip install flask pymongo flask-bcrypt
```

3. Start MongoDB (if using database)

4. Run the application:

```
python app.py
```

5. Open in browser:

```
http://127.0.0.1:5000
```

---

## References (APA 7)

Fielding, R. T. (2000). *Architectural styles and the design of network-based software architectures* (Doctoral dissertation, University of California, Irvine).

Flask Documentation. (2024). *Flask Web Development Documentation*. https://flask.palletsprojects.com/

MongoDB Inc. (2024). *MongoDB Documentation*. https://www.mongodb.com/docs/

Mozilla Developer Network. (2024). *HTML, CSS, and JavaScript Guide*. https://developer.mozilla.org/

Pallets Projects. (2024). *Flask-Bcrypt Documentation*. https://flask-bcrypt.readthedocs.io/

W3C. (2014). *HTML5 Specification*. https://www.w3.org/TR/html5/

---

## A.I Declaration
I used generative A.I for the purpose of editing
---
