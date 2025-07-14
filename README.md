# PruebaSPA


### How to start the project?

- Step 1:
```
npm install
```
- Step 2:
```
npm run dev
```
- Step 3:
```
json-server --watch database/db.json --port 8000
```


### Database Structure:
```
{
  "users": [
    {
      "name": "user",
      "email": "user@test.com",
      "role": "visitor",
      "password": "123",
      "created": "2023-10-01T10:00:00Z",
      "id": "1"
    },
    {
      "name": "administrador",
      "email": "admin@test.com",
      "role": "admin",
      "password": "123456",
      "created": "2023-10-01T10:00:00Z",
      "id": "2"
    }
  ],
  "events": [
    {
      "id": "1",
      "title": "Event 1",
      "description": "Description for Event 1",
      "date": "2023-10-01 11:00",
      "location": "Location 1",
      "capacity": 20,
      "availableSeats": 19,
      "created": "2023-10-01T10:00:00Z"
    },
    {
      "id": "2",
      "title": "Event 2",
      "description": "Description for Event 2",
      "date": "2023-10-02 15:00",
      "location": "Location 2",
      "capacity": 20,
      "availableSeats": 20,
      "created": "2023-10-01T10:00:00Z"
    }
  ],
  "appointments": [
    {
        "id": "1",
        "event_id": "1",
        "numberOfTickets": 1,
        "user_id": 1,
        "created": "2023-10-01T10:00:00Z"
    }
  ]
}
```