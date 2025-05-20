# 🧠 Bitespeed Identity Reconciliation – Backend Task

This project solves the **Identity Reconciliation** problem for Bitespeed by handling multiple user contacts (based on email and/or phone number) and linking them correctly based on given logic.

> Built with **Node.js**, **Express**, **TypeScript**, and **MySQL**.

---

## 📌 Problem Statement

Given a POST request with an email and/or phoneNumber, the system must:
- Identify the primary contact record.
- Associate it with all related secondary contacts (based on matching email/phoneNumber).
- Return a unified view of the identity.

---

## 🧰 Tech Stack

- ⚙️ **Backend**: Node.js + Express.js
- 🧠 **Language**: TypeScript
- 🛢️ **Database**: MySQL
- 🧪 **Testing**: Postman Collection included
- 🚀 **Deployment**: Compatible with Render, Railway, Vercel

---

## 🗃️ Database Schema
```
DROP TABLE IF EXISTS Contact;

CREATE TABLE Contact (
  id INT PRIMARY KEY AUTO_INCREMENT,
  phoneNumber VARCHAR(20),
  email VARCHAR(100),
  linkedId INT DEFAULT NULL,
  linkPrecedence ENUM('primary', 'secondary') NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt DATETIME DEFAULT NULL
);

-- Sample data
INSERT INTO Contact (phoneNumber, email, linkedId, linkPrecedence)
VALUES
('123456', 'foo@bar.com', NULL, 'primary'),
('123456', NULL, 1, 'secondary'),
(NULL, 'foo@bar.com', 1, 'secondary');
```

### `Contact` Table

| Field           | Type                        | Description                                     |
|----------------|-----------------------------|-------------------------------------------------|
| id             | INT (Primary Key)           | Unique ID for the contact                       |
| phoneNumber    | VARCHAR(20)                 | Contact phone number (nullable)                |
| email          | VARCHAR(100)                | Contact email (nullable)                       |
| linkedId       | INT                         | Points to the primary contact's ID if secondary |
| linkPrecedence | ENUM ('primary', 'secondary') | Defines whether it's a primary or secondary    |
| createdAt      | DATETIME                    | Auto-set on creation                            |
| updatedAt      | DATETIME                    | Auto-updated on change                          |
| deletedAt      | DATETIME                    | Soft delete flag                                |

---

## 🔁 API Endpoint

### `POST /identify`

#### 📥 Request Body

```json
{
  "email": "foo@bar.com",
  "phoneNumber": "1234567890"
}
```
#### 📤 Response

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["foo@bar.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [2, 3]
  }
}
```
## Testing with Postman
#### Steps
1. Set BASE_URL to http://localhost:3000
2. Test with different combinations of emails and phone numbers

## 🚀 Running Locally


