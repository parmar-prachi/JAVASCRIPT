FORM :- 
<img width="1280" height="800" alt="Screenshot 2025-11-30 at 4 32 15 PM" src="https://github.com/user-attachments/assets/2fbdcf3f-d1cb-41ac-9c1f-ec2344d851d1" />

TASK :- 
<img width="1280" height="800" alt="Screenshot 2025-11-30 at 4 34 15 PM" src="https://github.com/user-attachments/assets/997ca448-91db-42a0-a966-f2179ca6352e" />

DASHBOARD :-
<img width="1174" height="440" alt="Screenshot 2025-11-30 at 4 34 28 PM" src="https://github.com/user-attachments/assets/8767e42e-f9eb-4f02-b210-ba9fe48d54c7" />

* PROJECT SUMMARY * : 

💻 Project: Smart Task & Habit Tracker ::

📌 Project Definition :: 

This is a comprehensive, front-end JavaScript dashboard designed for efficient task and habit management. Its core focus is on real-time interactivity and demonstrating robust client-side data handling. All task data is stored in-memory (using JavaScript arrays and objects) and instantly rendered on the web page using powerful DOM manipulation techniques. No backend or persistent storage is required.

🧩 Project Flow & Features :: 

📝 Task & Habit Input :

Data Structure: Every item is captured via an input form (Title, Category, Due Date, Status) and stored as an Object within a primary array.

Dynamic Rendering: New tasks are immediately displayed on the page using core DOM methods like createElement(), appendChild(), and innerHTML.

✅ Management & Status ::

Instant Updates: Each rendered task card features Complete and Delete buttons.

Process: Clicking a button updates the status/removes the item from the in-memory array, followed by an immediate re-render of the task list to reflect the change.

📊 Real-Time Dashboard Summary ::

Dynamic Calculation: A dedicated dashboard section provides live statistics calculated by iterating through the task array.

Metrics Displayed: Total tasks, Completed tasks, Pending tasks, and Overdue tasks.

Display Method: Utilizes Template Literals for a clean, continuously updated summary display.

🔍 Search & Filter Tools ::

Search Functionality: Allows users to quickly search tasks by title or category using an input field.

Filtering: Users can filter the displayed tasks by status (Completed, Pending, Overdue).

Performance: All search and filter operations result in instantaneous, page-reload-free updates to the displayed task list.

🛠️ OOP Task Management (Optional Focus) ::

Architecture: Demonstrates a clean, modular structure using a Task Class.

Methods: The class includes methods responsible for task creation, editing, deletion, and status changes.

Extension: Optional inclusion of a SpecialHabit Class to showcase inheritance concepts.

✅ Core Technologies
JavaScript (ES6+): In-memory data management (Arrays/Objects), Object-Oriented Programming (Classes), and all DOM Manipulation.

