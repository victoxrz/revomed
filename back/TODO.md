# TODO

## Frontlog (current, in order)

* [ ] Provide export/bundle for patient release-of-information. - just add a buton for medical file export
* [ ] RBAC tests
    - https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/01-Test_Role_Definitions
    - https://www.zaproxy.org/
    - https://github.com/ffuf/ffuf
* [ ] implement search features
* [ ] Appointment scheduler � calendar, slot management, status.
    - FullCalendar (React) — very popular, feature-rich (day/week/month, resource views, drag & drop, plugins). Good for complex calendars.
    - react-big-calendar — open-source, lightweight, good for common views and easy customization. (Often chosen when you want a fully React-based solution.)
    - TOAST UI Calendar (tui-calendar) — full-featured JS calendar with a React wrapper; nice if you want a ready set of schedule views.

DayPilot — commercial + free editions for advanced scheduling (resource timeline, undo/redo, lots of examples). Good for shift/room/resource scheduling.
* [ ] Automated notifications � email/SMS reminders (stub with Twilio/mock).
    - https://www.emailtooltester.com/en/blog/free-smtp-servers/
* [ ] Document upload & inline viewer � PDFs, images (download/export). 
    - using aws s3 for storage
    - Support PDF/JPG/PNG uploads with inline preview and download.
    - Capture the core metadata (patient, encounter, uploader, type, date).
    - Implement TLS, encryption-at-rest, RBAC, audit logging and (virus scanning ?).
* [ ] Accessibility basics � keyboard nav, semantic HTML, screen-reader labels.
* [ ] Electronic signature / sign-off for reports. (might not be available to my app)
* [ ] Audit logs � immutable read/write audit trail for every sensitive action, app logs, error tracking (Sentry), basic metrics, backups.
* [ ] Consent & privacy flags � track patient consent for sharing/data use.
* [ ] CI/CD pipeline � automated tests, linting, deployment (Heroku/GH Actions/K8s).

## Backlog (nice-to-have)

* extend auth methods: https://webauthn.io/
* Multi-tenant / multi-site support � role & data partitioning for hospital groups.
    - i guess this will be the main mode of operation for real deployment 
* try this: FHIR-compliant API � Patient/Encounter/Observation resources (huge credibility boost).
    - or something about making the api interoperable with other existing systems 
* Imaging viewer � DICOM viewer integration or image annotation tool.
* Voice-to-text clinical notes � demonstrate transcription + structured extraction.
* Patient engagement tools � automated care plans, questionnaires, secure chat, reminders.

## Done

* [x] Add more roles and permissions
* [x] Basic patient portal � view reports, appointments, secure messaging (read-only is fine for MVP). (Partial, no appointments ATM)
* [x] Authentication & Authorization � SSO/OAuth2 + RBAC (roles: clinician, nurse, admin, clerk). (Partial)
* [x] Add OAuth (Google) support
* [x] Add tests for sessions
* [x] Patient Master Index � create/search/merge patient records with unique IDs.
* [x] Encounter/Visit management � create visits, record provider, time, reason.
* [x] Export to PDF / printable reports with templates.

## Endpoints by User Role
### Admin
- **GET** `/patients/list`
- **GET** `/templates/list`
- **GET** `/templates/get/{id}`
- **POST** `/templates/create`
- **PUT** `/templates/update/{id}`
- **PUT** `/users/update/{id}`
- **GET** `/users/profile`

### Medic
- **GET** `/patients/list`
- **GET** `/patients/get/{id}`
- **POST** `/patients/create`
- **GET** `/visits/get`
- **POST** `/visits/create`
- **GET** `/templates/list`
- **GET** `/templates/get/{id}`
- **POST** `/triages/create`
- **GET** `/reports/medical/{id}`
- **GET** `/reports/visits/{id}`
- **GET** `/users/profile`

### Assistant
- **GET** `/patients/get/{id}`
- **POST** `/patients/create`
- **PUT** `/patients/update/{id}`
- **POST** `/triages/create`
- **GET** `/users/profile`

### Patient
- **GET** `/visits/get` (own visits only)
- **GET** `/reports/medical/{id}` (own reports only)
- **GET** `/reports/visits/{id}` (own reports only)
- **GET** `/users/profile`

### User (Basic Role)
- **GET** `/users/profile`

### Anonymous (Public Endpoints)
- **POST** `/users/signup`
- **POST** `/users/login`
- **POST** `/users/google-auth`