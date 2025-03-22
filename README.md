# JobNest

JobNest is an AI-powered platform designed to help users land their dream jobs by bridging skill gaps and providing personalized career insights. The platform offers a range of features including AI job matching, skill gap analysis, industry insights, resume building, and more.

## Features

- **AI Job Matching**: Get personalized job recommendations based on your skills and preferences.
- **Skill Gap Analysis**: Identify missing skills and receive course recommendations to improve your profile.
- **Industry Insights**: Access real-time data on industry trends, salary ranges, and in-demand skills.
- **Resume Builder**: Create an ATS-optimized resume with AI assistance and get feedback.
- **Competency Testing**: Take assessments to showcase your skills and stand out to employers.
- **Salary Negotiation**: Get personalized salary ranges and negotiation tips for your target roles.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **AI Services**: Google Generative AI

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/jobnest.git
   cd jobnest
   ```

2. **Install dependencies**:
   - For the frontend:
     ```bash
     cd frontend
     npm install
     ```
   - For the backend:
     ```bash
     cd backend
     npm install
     ```

3. **Environment Variables**:
   - Create a `.env` file in the `backend` directory and add your environment variables:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     JWT_SECRET=your_jwt_secret
     MONGO_URI=your_mongo_uri
     ```

4. **Run the application**:
   - Start the backend server:
     ```bash
     cd backend
     npm run dev
     ```
   - Start the frontend development server:
     ```bash
     cd frontend
     npm run dev
     ```

5. **Access the application**:
   - Open your browser and navigate to `http://localhost:5174` to access the frontend.

## Usage

- **Sign Up**: Create an account and set up your profile.
- **Explore Industry Insights**: Get insights into industry trends and salary ranges.
- **Build Your Resume**: Use the resume builder to create a professional resume.
- **Find Jobs**: Use AI-powered recommendations to find jobs.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


