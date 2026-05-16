# Team Task Manager

## Project Description

Team Task Manager is a modern, full-stack enterprise web application designed to help organizations streamline project oversight, manage employee tasks, and track team attendance in real-time.

Built with a premium SaaS-style interface, the platform provides a unified dashboard for both administrators and regular members.

### Tech Stack
- **Frontend:** React JS, Vanilla CSS (Custom Design System), React Router DOM
- **Backend:** Spring Boot, Spring Security, RESTful APIs
- **Database:** MySQL
- **Security:** Stateless JWT Authentication & Role-Based Access Control (RBAC)

---

## Key Features

### 🏢 Unified Team Management (Admin Only)
- Comprehensive **Team Dashboard** for live visibility into company workforce.
- Real-time **Attendance Tracking** (Present/Absent statuses).
- **Employee Activity History** logs (account creation, attendance marking, etc.).
- Add, Edit, and Remove employee accounts.

### 📁 Project & Task Management
- Create and organize complex projects.
- Assign specific employees to projects.
- Create granular tasks within projects.
- Drag-and-drop or interactive status updates for tasks.
- Advanced metrics tracking (Total Tasks, Overdue, Completed).

### 👥 Role-Based Portals
- **Admin Portal:** Full access to all modules, analytics, and employee data.
- **Member Portal:** Clean, focused view of assigned projects and personal task lists.

---

## Application Setup

### 1. Database Configuration
Ensure MySQL is running locally on port `3306`.
Update the database credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/team_task_manager
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### 2. Running the Backend (Spring Boot)
Open your terminal in the root directory and run:
```bash
mvnw spring-boot:run
```

### 3. Running the Frontend (React)
Open a separate terminal in the root directory and run:
```bash
npm install
npm run dev
```

---

## Authentication & First Run

1. Navigate to the frontend URL (usually `http://localhost:5173`).
2. Click **Sign Up** to create your first account. 
3. Because the system requires an initial Admin, simply select **Admin** from the Role toggle during signup.
4. Log in with your new credentials to access the full Team Dashboard!

---

*This project is designed for clean architecture, highly responsive UI, and secure enterprise data flow.*
