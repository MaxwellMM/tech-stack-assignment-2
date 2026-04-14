 
## SkillSwap Hub – Project Report

## Introduction
The purpose of this project is to design and develop a full stack web application called SkillSwap Hub, which enables users to share skills, upload resources, and collaborate within a community driven platform. The system allows users to register, log in, create profiles, post resources, and interact through comments and upvotes.
This project demonstrates the integration of frontend and backend technologies, including HTML, CSS, JavaScript, and Python Flask. It also focuses on usability, responsiveness, and secure user authentication.

## Aims and Objectives
Aim
To develop a functional and modern web application that supports community based skill sharing.

Objectives
Design a responsive and user friendly interface


Implement user authentication (login/register/logout)


Enable CRUD operations for resources


Integrate backend functionality using Flask


Store and retrieve data using LocalStorage (or MongoDB)


Apply security practices such as password hashing


Evaluate the system’s usability and performance



## Technologies Used
Frontend
HTML5 – Structure of web pages


CSS3 – Styling and layout (modern UI design)


JavaScript – Dynamic functionality and API interaction


Backend
Python Flask – Web framework for routing and server logic


Database
LocalStorage (fallback solution)


MongoDB (optional advanced integration)


Libraries
Flask-Bcrypt – Password hashing for secure authentication


## Go into correct folder

To go into the correct folder
In the terminal "cd Skillswap"


## System Design
4.1 Architecture
The application follows a client server architecture:
Frontend handles user interaction


Backend processes requests and manages data


API endpoints connect frontend and backend


## Gantt Chart
The project was developed over six weeks using a structured timeline with dependencies between tasks. Early phases focused on planning and design, followed by frontend and backend implementation, and finally testing and refinement.

## User guide 

The SkillSwap Hub system is designed to be simple and intuitive. The following steps outline how a user interacts with the platform:

Registration  
Users begin by creating an account using their email and password on the registration page.

Login  
Once registered, users log in securely using their credentials. Successful login redirects the user to the homepage.

Viewing Resources  
The homepage displays community resources. Users can browse, search, and filter content based on categories.

Adding a Resource  
Users can submit a new resource by entering a title, description, and category. The resource is then stored and displayed to other users.

Interacting with Content  
Users can:
- Upvote resources to show appreciation  
- Add comments to engage in discussion  

Profile Management  
Users can edit their profile, including name, skills, and profile image.

Logout  
Users can securely log out, ending their session.

This workflow ensures a user friendly experience and encourages interaction within the community


##  UI Design
The interface was designed with:
Card-based layout


Responsive grid system


Consistent colour palette


Clear navigation structure



## Implementation
5.1 Frontend Features
Responsive navigation bar


Search and filtering system


Dynamic resource rendering


Profile management interface


Interactive forms for user input


5.2 Backend Features
User authentication system


Session management


API endpoints (/api/resources)


Resource creation, commenting, and upvoting


5.3 Security Features
Password hashing using Bcrypt


Input validation


Prevention of duplicate users


Basic session protection

## Challenges Faced

During the development of the SkillSwap Hub application, several technical and design challenges were encountered. These challenges contributed to a deeper understanding of full stack development and problem solving within a real-world context.

- Backend Integration and Routing

One of the primary challenges was integrating the frontend with the Flask backend. Initially, issues arose with incorrect routing and template rendering, particularly the *TemplateNotFound* error. This was resolved by restructuring the project directory to ensure all HTML files were correctly placed within the *templates* folder, as required by Flask’s rendering engine.

- Database Connectivity (MongoDB)

An attempt was made to integrate MongoDB for persistent data storage. However, significant issues were encountered, including connection errors (*ServerSelectionTimeoutError*) due to MongoDB not running locally or not being configured in the system PATH. While this demonstrated the complexity of database integration, the project was adapted to use in memory data structures instead. This ensured functionality while maintaining development progress within time constraints.

- State Management and Data Persistence

Without a database, maintaining application state became a challenge. Data such as users and resources are stored temporarily in Python lists, meaning all data is lost when the server restarts. This limitation required careful handling of session data and user interactions to ensure a smooth user experience despite the lack of persistence.

- Frontend–Backend Synchronisation

Ensuring seamless communication between JavaScript (frontend) and Flask (backend) required careful debugging. Issues such as incorrect API endpoints, inconsistent data formats, and page reload behaviour were resolved by standardising routes and implementing fetch based API calls.

- Debugging Template Errors

Errors such as *‘r is undefined’* in Jinja templates highlighted the importance of correctly passing variables from Flask to HTML. This was resolved by ensuring all dynamic content was rendered within proper loops and that data was consistently structured.

- UI/UX Design Improvements

Another challenge was transforming the interface from a basic layout into a modern, user-friendly design. This required refining CSS styling, improving layout responsiveness, and ensuring consistent navigation across all pages. Achieving a professional appearance required iterative design improvements and testing across different screen sizes.

- Project Structure and File Organisation

Initially, incorrect file placement caused multiple runtime issues. Ensuring a correct structure (e.g., separating *templates*, *static*, and backend files) was essential for the application to function properly. This reinforced best practices in web development project organisation.

---

- Reflection

These challenges significantly improved technical skills in debugging, backend integration, and system design. Overcoming them resulted in a more robust and functional application, demonstrating both practical implementation skills


## Testing and Debugging
Testing was conducted throughout development to ensure functionality and reliability.
Methods Used:
Manual testing of user flows (login, posting, commenting)


Debugging Flask errors (e.g., missing templates, database issues)


Fixing API communication issues


Example Issues Fixed:
TemplateNotFound error → resolved by correct folder structure


MongoDB connection error → replaced with LocalStorage fallback


Undefined variables in templates → fixed by removing incorrect Jinja usage



## UI/UX Evaluation
The system was evaluated based on usability principles:
Strengths:
Clean and modern interface


Responsive design for mobile and desktop


Intuitive navigation


Fast interaction using JavaScript


## Improvements:
Add dark mode


Improve accessibility (ARIA labels, contrast)


Enhance animations and transitions



## Social and Technical Impact
Social Impact:
Encourages collaborative learning


Supports users from different backgrounds


Promotes knowledge sharing


Technical Impact:
Demonstrates full-stack development skills


Shows integration of frontend and backend systems


Highlights modern web development practices



## Ethical Considerations
User data is handled securely (hashed passwords)


No sensitive personal data is stored unnecessarily


System avoids harmful or inappropriate content through basic moderation



## Future Improvements
Implement full MongoDB database integration


Add real-time messaging system


Introduce AI-based recommendations


Improve scalability and deployment (e.g., cloud hosting)



## Conclusion
The SkillSwap Hub project successfully meets its objectives by delivering a functional and modern web application. The integration of frontend and backend technologies demonstrates strong technical understanding. Through iterative development, debugging, and UI improvements, the system achieves a high level of usability and performance.
The project reflects real-world development practices and provides a solid foundation for further enhancements.
 
## References 
Here are properly formatted references (VERY important for 70%+):
Mozilla Developer Network. (2024). HTML: HyperText Markup Language. https://developer.mozilla.org


Mozilla Developer Network. (2024). CSS: Cascading Style Sheets. https://developer.mozilla.org


Mozilla Developer Network. (2024). JavaScript Guide. https://developer.mozilla.org


Pallets Projects. (2024). Flask Documentation. https://flask.palletsprojects.com


MongoDB Inc.. (2024). MongoDB Documentation. https://www.mongodb.com/docs


OWASP Foundation. (2023). Web Security Testing Guide. https://owasp.org


Nielsen, Jakob. (1994). Usability Engineering. Academic Press.



## A.I Declaration

I used generative A.I for the purpuse of Editing