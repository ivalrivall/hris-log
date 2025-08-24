---
description: Repository Information Overview
alwaysApply: true
---

# HRIS-Log Information

## Summary
HRIS-Log is a Node.js application that consumes messages from a RabbitMQ queue and logs them to a MongoDB database. It serves as a logging service for Human Resource Information System (HRIS) events.

## Structure
- **src/**: Contains the application source code
  - **consumer.js**: Implements the RabbitMQ consumer and MongoDB logging functionality
  - **index.js**: Main entry point that initializes the application

## Language & Runtime
**Language**: JavaScript (Node.js)
**Version**: Node.js >=22.17.0 (as specified in package.json)
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- **amqplib** (^0.10.8): RabbitMQ client for Node.js
- **dotenv** (^17.2.1): Environment variable management
- **mongodb** (^6.18.0): MongoDB driver for Node.js

## Configuration
**Environment Variables**:
- **AMQP_URL**: RabbitMQ connection URL
- **AMQP_QUEUE**: RabbitMQ queue name to consume messages from
- **MONGO_URI**: MongoDB connection URI
- **MONGO_DB**: MongoDB database name
- **MONGO_COLLECTION**: MongoDB collection name for storing logs
- **TZ**: Timezone for formatting timestamps (defaults to UTC)

## Build & Installation
```bash
# Install dependencies
npm install

# Start the application
npm start
```

## Usage & Operation
The application connects to both RabbitMQ and MongoDB, then listens for messages on the specified queue. When a message is received, it:
1. Logs the message to the console
2. Parses the message as JSON if possible
3. Stores the message in MongoDB with both UTC and local timestamps
4. Acknowledges the message to RabbitMQ

## Integration Points
- **RabbitMQ**: Consumes messages from a specified queue
- **MongoDB**: Stores received messages with timestamps in both UTC and local time