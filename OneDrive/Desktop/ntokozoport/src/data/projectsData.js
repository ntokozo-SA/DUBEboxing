export const projectsData = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with React frontend and Node.js backend",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    youtubeEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    blogContent: `
      <h2 class="text-2xl font-bold mb-4">Building a Modern E-Commerce Platform</h2>
      
      <p class="mb-4">This project represents a comprehensive e-commerce solution that I developed from concept to deployment. The platform features a modern, responsive design built with React and styled with TailwindCSS, ensuring an optimal user experience across all devices.</p>
      
      <h3 class="text-xl font-semibold mb-3">Key Features</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>User authentication and authorization system</li>
        <li>Product catalog with advanced filtering and search</li>
        <li>Shopping cart with real-time updates</li>
        <li>Secure payment processing integration</li>
        <li>Admin dashboard for inventory management</li>
        <li>Order tracking and management system</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Technical Stack</h3>
      <p class="mb-4">The frontend is built with React 18, utilizing modern hooks and functional components. For styling, I chose TailwindCSS for its utility-first approach and rapid development capabilities. The backend is powered by Node.js with Express, providing a robust API for the frontend to consume.</p>
      
      <p class="mb-4">Database management is handled by MongoDB, offering flexibility for the product catalog and user data. Authentication is implemented using JWT tokens, ensuring secure user sessions. The entire application is containerized with Docker for easy deployment and scaling.</p>
      
      <h3 class="text-xl font-semibold mb-3">Challenges and Solutions</h3>
      <p class="mb-4">One of the biggest challenges was implementing real-time inventory updates across multiple users. I solved this using WebSocket connections to ensure that product availability is always current. Another significant challenge was optimizing the product search functionality for large catalogs, which I addressed by implementing Elasticsearch for fast and accurate search results.</p>
      
      <p class="mb-4">The project taught me valuable lessons about state management in large applications, the importance of proper error handling, and the benefits of comprehensive testing. I implemented unit tests using Jest and integration tests to ensure the reliability of critical user flows.</p>
    `
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    youtubeEmbedUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    blogContent: `
      <h2 class="text-2xl font-bold mb-4">Collaborative Task Management Solution</h2>
      
      <p class="mb-4">This task management application was designed to facilitate team collaboration and project organization. The app provides an intuitive interface for creating, assigning, and tracking tasks across multiple projects and teams.</p>
      
      <h3 class="text-xl font-semibold mb-3">Core Functionality</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Project creation and team management</li>
        <li>Task creation with priority levels and due dates</li>
        <li>Real-time collaboration and updates</li>
        <li>Progress tracking and analytics</li>
        <li>File attachment and comment system</li>
        <li>Mobile-responsive design</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Technology Implementation</h3>
      <p class="mb-4">The application is built using React for the frontend, with Redux for state management to handle the complex data flow between components. Real-time updates are implemented using Socket.io, ensuring that all team members see changes instantly.</p>
      
      <p class="mb-4">The backend is developed with Node.js and Express, providing RESTful APIs for data management. PostgreSQL is used as the primary database, with Redis for caching frequently accessed data and session management. The application also integrates with cloud storage services for file uploads and attachments.</p>
      
      <h3 class="text-xl font-semibold mb-3">User Experience Design</h3>
      <p class="mb-4">Special attention was paid to creating an intuitive user interface that reduces the learning curve for new users. The drag-and-drop functionality for task management makes it easy to reorganize priorities and project structures. The dashboard provides at-a-glance insights into project progress and team productivity.</p>
      
      <p class="mb-4">The application includes comprehensive notification systems, alerting users to task assignments, approaching deadlines, and project updates. The mobile-responsive design ensures that team members can stay connected and productive even when away from their desks.</p>
    `
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "A beautiful weather application with location-based forecasts",
    imageUrl: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=300&fit=crop",
    youtubeEmbedUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
    blogContent: `
      <h2 class="text-2xl font-bold mb-4">Interactive Weather Dashboard</h2>
      
      <p class="mb-4">This weather dashboard application provides users with comprehensive weather information in a visually appealing and easy-to-understand format. The app integrates with multiple weather APIs to provide accurate, up-to-date forecasts and historical weather data.</p>
      
      <h3 class="text-xl font-semibold mb-3">Features and Capabilities</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Current weather conditions with detailed metrics</li>
        <li>7-day and hourly forecasts</li>
        <li>Interactive weather maps and radar</li>
        <li>Location-based weather alerts</li>
        <li>Weather history and trends</li>
        <li>Customizable dashboard layouts</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Technical Architecture</h3>
      <p class="mb-4">The frontend is built with React and TypeScript, providing type safety and better development experience. The application uses Chart.js for data visualization, creating beautiful and interactive weather charts and graphs. The UI is designed with TailwindCSS for consistent styling and responsive design.</p>
      
      <p class="mb-4">The backend integrates with multiple weather APIs including OpenWeatherMap and WeatherAPI to ensure data accuracy and redundancy. The application implements geolocation services to automatically detect user location and provide relevant weather information. Data caching is implemented to reduce API calls and improve performance.</p>
      
      <h3 class="text-xl font-semibold mb-3">Data Visualization</h3>
      <p class="mb-4">One of the key features is the interactive weather maps that display current conditions, precipitation, temperature, and wind patterns. The dashboard includes various chart types including line charts for temperature trends, bar charts for precipitation data, and radar charts for wind direction and speed.</p>
      
      <p class="mb-4">The application also provides weather alerts and notifications for severe weather conditions, helping users stay informed about potential weather hazards. The customizable dashboard allows users to arrange widgets according to their preferences and focus on the weather information most relevant to them.</p>
    `
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "A modern portfolio website showcasing projects and skills",
    imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop",
    youtubeEmbedUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
    blogContent: `
      <h2 class="text-2xl font-bold mb-4">Modern Portfolio Website</h2>
      
      <p class="mb-4">This portfolio website serves as a comprehensive showcase of my skills, projects, and professional journey. The design emphasizes clean aesthetics, fast loading times, and excellent user experience across all devices and platforms.</p>
      
      <h3 class="text-xl font-semibold mb-3">Design Philosophy</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Minimalist design with focus on content</li>
        <li>Responsive layout for all screen sizes</li>
        <li>Fast loading and optimized performance</li>
        <li>Accessible design following WCAG guidelines</li>
        <li>SEO optimized for better visibility</li>
        <li>Interactive elements for engagement</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Technical Implementation</h3>
      <p class="mb-4">The website is built using React with modern hooks and functional components. Styling is handled with TailwindCSS, providing utility-first CSS classes for rapid development and consistent design. The site uses React Router for smooth navigation between different sections.</p>
      
      <p class="mb-4">Performance optimization includes lazy loading of images and components, code splitting for faster initial page loads, and efficient state management. The website is deployed using modern hosting solutions with CDN integration for global accessibility and fast loading times.</p>
      
      <h3 class="text-xl font-semibold mb-3">Content Management</h3>
      <p class="mb-4">The portfolio includes detailed project showcases with embedded videos, comprehensive skill demonstrations, and a professional blog section. Each project page provides in-depth information about the development process, challenges faced, and solutions implemented.</p>
      
      <p class="mb-4">The contact section includes multiple ways for potential clients and employers to reach out, including a contact form, social media links, and professional networking profiles. The website also includes a downloadable resume and links to live project demos and GitHub repositories.</p>
    `
  }
]; 