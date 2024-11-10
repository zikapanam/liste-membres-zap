## Liste adhérents 2 e React et Express

# Réinstaller les libs client

cd client
rm -rf node_modules package-lock.json
npm install

# Réinstaller les libs server

cd server
rm -rf node_modules package-lock.json
npm install

# Compiler transcript
Dans root projet:

npx tsc 

# Démarrer le serveur
cd server && npx nodemon

http://localhost:5000/api/zap-records

# Démarrer le client
cd client && npm start

http://localhost:3000
