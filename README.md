# Quora-like Q&A API (Backend Skill Checkpoint)

## Description
REST API สำหรับตั้งคำถามและตอบคำถาม (คล้าย Quora)
สร้างด้วย Express.js และ PostgreSQL ตาม Backend Skill Checkpoint ของ TechUp

**Tech stack:** Node.js, Express, PostgreSQL, Postman

**สิ่งที่ทำได้:** CRUD คำถาม, ค้นหาคำถาม, สร้าง/ดู/ลบคำตอบ

## Table of Contents
- [Description](#description)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Credits](#credits)
  
## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- Postman (สำหรับทดสอบ)

### Installation
1. Clone repo
2. `npm install`
3. สร้าง database เช่น `quora_mock`
4. รัน SQL จาก Gist
5. แก้ `utils/db.mjs` ให้เป็น connection จริง
6. `npm start` → เปิดที่ `http://localhost:4000`

## API Endpoints

### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /questions | สร้างคำถาม |
| GET | /questions | ดูทั้งหมด |
| GET | /questions/:questionId | ดูตาม id |
| PUT | /questions/:questionId | แก้ไข |
| DELETE | /questions/:questionId | ลบ |
| GET | /questions/search?title=&category= | ค้นหา |

### Answers
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /questions/:questionId/answers | สร้างคำตอบ |
| GET | /questions/:questionId/answers | ดูคำตอบ |
| DELETE | /questions/:questionId/answers | ลบคำตอบทั้งหมดของคำถามนั้น |

### Example
POST /questions
```json
{
  "title": "What is the capital of France?",
  "description": "Basic geography question",
  "category": "Geography"
}


Credits

```md
## Credits
- TechUp Backend Skill Checkpoint
- SQL Script: [quora-mock.sql](https://gist.github.com/napatwongchr/811ef7071003602b94482b3d8c0f32e0)
- API Design จากเอกสารของ TechUp
- README guide: [freeCodeCamp](https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/)
