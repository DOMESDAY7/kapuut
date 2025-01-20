# Quiz Creation Microservice using AI via Ollama

This repository contains a lightweight microservice written in Go for generating quizzes using AI powered by Ollama. The microservice is designed to simplify the creation of quizzes by automating question generation.

## Features
- **AI-Generated Questions:** Uses Ollama's AI capabilities to create questions tailored to your needs.
- **Customizable:** Specify topics, difficulty levels, and question formats.
- **REST API:** Easy-to-use endpoints for seamless integration.
- **Lightweight and Scalable:** Built with Go for high performance and scalability.

## Prerequisites
Before running the microservice, ensure you have the following installed:

1. [Go](https://go.dev/dl/) (version 1.20 or higher)
2. Access to Ollama's AI API (API key required)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quiz-ai-microservice.git
   cd quiz-ai-microservice
   ```

2. Install dependencies:
   ```bash
   go mod tidy
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   OLLAMA_API_KEY=your_ollama_api_key
   PORT=8080
   ```

## Usage

### Starting the Microservice

Run the following command to start the server:
```bash
go run main.go
```

By default, the server runs on `http://localhost:8080`.

### API Endpoints

#### 1. Generate Quiz Questions
**Endpoint:**
```
POST /generate-quiz
```

**Request Body:**
```json
{
  "topic": "Science",
  "difficulty": "medium",
  "number_of_questions": 5
}
```

**Response:**
```json
{
  "questions": [
    {
      "question": "What is the chemical symbol for water?",
      "options": ["O2", "H2O", "CO2", "H2"],
      "answer": "H2O"
    },
    ...
  ]
}
```

### Example cURL Command
```bash
curl -X POST http://localhost:8080/generate-quiz \
-H "Content-Type: application/json" \
-d '{"topic": "Math", "difficulty": "easy", "number_of_questions": 3}'
```

## Testing
Run the tests to ensure the service works as expected:
```bash
go test ./...
```

## Deployment

### Docker
1. Build the Docker image:
   ```bash
   docker build -t quiz-ai-microservice .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:8080 --env-file .env quiz-ai-microservice
   ```

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve the microservice.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments
- [Ollama](https://ollama.com) for providing the AI capabilities.
- The Go community for their excellent tools and libraries.

