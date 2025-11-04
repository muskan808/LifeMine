# Backend — User Dashboard

## Quick start (with Docker Compose for MongoDB)

1. From backend/ directory start MongoDB:
docker-compose up -d

markdown
Copy code

2. Install dependencies:
npm install

markdown
Copy code

3. Copy `.env.example` to `.env` and adjust if needed.

4. Seed example data:
npm run seed

markdown
Copy code

5. Start server:
npm run dev

or
npm start

bash
Copy code

API base: `http://localhost:4000`

Endpoints:
- GET `/users` — list (supports query params: page, limit, search, role, isActive, sort)
- GET `/users/:id` — get single
- POST `/users` — create (JSON body)
- PATCH `/users/:id` — update (partial)
- DELETE `/users/:id` — delete

Notes:
- The controller sanitizes nested objects (address, company) to remove any _id or id fields coming from the client before validation.
- The GET /users returns a plain array (for frontend compatibility).
EOF

echo "Files created in $(pwd). Run 'npm install' to install dependencies."
echo "Next steps (run inside $(pwd)):"
echo "  1) npm install"
echo "  2) cp .env.example .env    # edit MONGO_URI if needed"
echo "  3) docker-compose up -d    # starts MongoDB (requires Docker)"
echo "  4) npm run seed            # optional - seeds example users"
echo "  5) npm run dev             # start server with nodemon"
echo ""
echo "If you cannot use Docker, start a local MongoDB and set MONGO_URI in .env to your local Mongo URL."
Save that script into a file (for example recreate_backend.sh), make it executable and run it:

bash
Copy code
chmod +x recreate_backend.sh
./recreate_backend.sh
— or simply copy/paste the whole block directly into your terminal. It will create backend/ and all the source files.

2) What I included (recap)
These files are recreated:

backend/package.json

backend/.env.example

backend/docker-compose.yml

backend/README.md

Under backend/src/:

index.js

app.js

config/db.js

models/User.js

routes/users.js

controllers/usersController.js (includes sanitation for nested _id/id)

validators/userValidator.js (Joi schemas)

seed/seedUsers.js

This matches the backend we had earlier and includes the sanitation fix we discussed (removing _id/id from nested address/company before validation). The GET /users returns a plain array for frontend compatibility.

3) After files are created — run the backend
From backend/:

Install dependencies:

bash
Copy code
npm install
Start MongoDB:

Preferred (Docker):

bash
Copy code
docker-compose up -d
If Docker is not available, install MongoDB locally (Homebrew on macOS) and set MONGO_URI in .env to mongodb://localhost:27017/user_dashboard_db.

Seed sample data (optional but recommended):

bash
Copy code
npm run seed
Start API server:

bash
Copy code
npm run dev
# or
npm start
Server will log:

arduino
Copy code
MongoDB connected
Server listening on http://localhost:4000
4) Connect your frontend
Ensure frontend axios base URL still points to http://localhost:4000 (file src/api/axios.ts in frontend).

Restart frontend: npm start in your frontend folder.

Test create/edit/delete flows.

