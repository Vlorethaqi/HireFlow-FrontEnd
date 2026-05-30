HireFlow FrontEnd
HireFlow FrontEnd eshte aplikacioni web per platformen HireFlow. Aplikacioni eshte ndertuar me React dhe Vite, dhe komunikon me HireFlow BackEnd per autentikim, menaxhim te shpalljeve te punes, aplikimeve, kompanive, departamenteve, profileve te kandidateve dhe njoftimeve.

Teknologjite
React
Vite
React Router DOM
Axios
ESLint
Kerkesat paraprake
Para se te startohet frontend-i, sigurohuni qe keni te instaluar:

Node.js
npm
HireFlow BackEnd duke punuar ne http://localhost:3000
Instalimi
npm install
Startimi i projektit
npm run dev
Pas startimit, aplikacioni zakonisht hapet ne:

http://localhost:5173
Komandat kryesore
npm run dev
Starton aplikacionin ne menyren e zhvillimit.

npm run build
Krijon versionin final per publikim ne dosjen dist.

npm run preview
Shfaq versionin final lokalisht.

npm run lint
Kontrollon kodin me ESLint.

Konfigurimi i API-se
Frontend-i perdor Axios instance ne:

src/services/api.js
Aktualisht API base URL eshte:

http://localhost:3000
Nese backend-i startohet ne port tjeter, ndryshoni baseURL ne src/services/api.js.

Autentikimi
Pas login-it, aplikacioni ruan te dhenat ne sessionStorage:

token
refreshToken
user
Axios interceptor shton automatikisht token-in ne header-in Authorization. Nese token-i skadon, frontend-i provon te marre token te ri permes endpoint-it /auth/refresh.

Rolet dhe qasja
Aplikacioni mbeshtet disa role:

CANDIDATE
HR
ADMIN
Qasja ne faqe ndryshon sipas rolit te perdoruesit:

Kandidati mund te menaxhoje profilin, aplikimet dhe punet e ruajtura.
HR mund te shqyrtoje aplikimet.
Admin mund te menaxhoje pune, aftesi, perdorues, kompani dhe departamente.
Faqet kryesore
/jobs - lista e puneve
/login - kycja
/register - regjistrimi
/profile - profili i kandidatit
/applications - statusi i aplikimeve
/saved-jobs - punet e ruajtura
/notifications - njoftimet
/departments - departamentet
/jobs/create - krijimi i nje pune
/hr-review - shqyrtimi i aplikimeve nga HR/Admin
/users - menaxhimi i perdoruesve
/companies - menaxhimi i kompanive
/companies/create - krijimi i kompanise
/skills - menaxhimi i aftesive
Struktura e projektit
HireFlow-FrontEnd/
  public/
    favicon.svg
    icons.svg
  src/
    assets/
    pages/
    services/
    App.jsx
    main.jsx
    index.css
    App.css
  index.html
  package.json
  vite.config.js
Sherbimet
Dosja src/services permban funksionet qe komunikojne me backend-in:

api.js - konfigurimi global i Axios
authService.js - login, register dhe refresh token
jobService.js - shpalljet e punes
applicationservice.js - aplikimet
candidateProfileservice.js - profili i kandidatit
companyService.js - kompanite
notificationService.js - njoftimet
savedJobservice.js - punet e ruajtura
userService.js - perdoruesit
Ndertimi per publikim
Per te krijuar versionin final:

npm run build
Pastaj mund ta testoni lokalisht me:

npm run preview
Shenime
Backend-i duhet te jete aktiv para testimit te shumices se funksioneve.
Perdoruesi ruhet vetem gjate sesionit te browser-it.
Nese merrni gabime 401, provoni te beni logout/login ose kontrolloni nese backend-i po punon.
