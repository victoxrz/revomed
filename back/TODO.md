# TODO

## Frontlog (current, in order)

* [ ] Add more roles and permissions
* [ ] Appointment scheduler � calendar, slot management, status.
* [ ] Clinical notes + templates � structured fields (problems, meds, allergies) + free-text note.
* [ ] Automated notifications � email/SMS reminders (stub with Twilio/mock).
    - https://www.emailtooltester.com/en/blog/free-smtp-servers/
* [ ] Document upload & inline viewer � PDFs, images (download/export). 
    - using aws s3 for storage
    - Support PDF/JPG/PNG uploads with inline preview and download.
    - Capture the core metadata (patient, encounter, uploader, type, date).
    - Implement TLS, encryption-at-rest, RBAC, audit logging and (virus scanning ?).
* [ ] Accessibility basics � keyboard nav, semantic HTML, screen-reader labels.
* [ ] Electronic signature / sign-off for reports. (might not be available to my app)
* [ ] Provide export/bundle for patient release-of-information.
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

* [x] Basic patient portal � view reports, appointments, secure messaging (read-only is fine for MVP). (Partial, no appointments ATM)
* [x] Authentication & Authorization � SSO/OAuth2 + RBAC (roles: clinician, nurse, admin, clerk). (Partial)
* [x] Add OAuth (Google) support
* [x] Add tests for sessions
* [x] Patient Master Index � create/search/merge patient records with unique IDs.
* [x] Encounter/Visit management � create visits, record provider, time, reason.
* [x] Export to PDF / printable reports with templates.