import json
import requests

def generate_quiz(theme: str):
    prompt = f"""
    Génère un quiz basé sur le thème '{theme}' sous forme de JSON structuré selon ce modèle Prisma:
    - Quizzes (contient le titre du quiz et une liste de questions)
    - Questions (chaque question a plusieurs réponses, dont une correcte)
    - Answers (indique si la réponse est correcte ou non)

    Exemple de sortie JSON :
    {{
        "quizId": "generated_id",
        "quiz": "{theme} Quiz",
        "question": [
            {{
                "questionId": "generated_id",
                "question": "Une question sur {theme} ?",
                "answer": [
                    {{ "answerId": "generated_id", "answer": "Réponse 1", "isCorrect": false }},
                    {{ "answerId": "generated_id", "answer": "Réponse 2", "isCorrect": true }},
                    {{ "answerId": "generated_id", "answer": "Réponse 3", "isCorrect": false }}
                ]
            }}
        ]
    }}
    """

    # Send the POST request with streaming enabled
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "mistral", "prompt": prompt, "temperature": 0.7},
        stream=True  # Enable streaming to receive partial responses
    )

    # Initialize an empty string to accumulate response parts
    accumulated_response = ""
    # Iterate over each line in the streaming response
    for line in response.iter_lines(decode_unicode=True):
        if line:  # If the line is not empty
            try:
                # Parse each JSON line
                data = json.loads(line)
                # Accumulate the content of the "response" field
                accumulated_response += data.get("response", "")
            except json.JSONDecodeError as e:
                print("Error decoding JSON line:", e)

    try:
        # Try to parse the accumulated response as a complete JSON
        quiz_json = json.loads(accumulated_response)
        return quiz_json
    except json.JSONDecodeError as e:
        print("Error decoding concatenated JSON:", e)
        return {"error": "Impossible de générer un JSON valide"}

if __name__ == "__main__":
    theme_input = input("Entrez un thème pour le quiz : ")
    quiz_data = generate_quiz(theme_input)
    print(json.dumps(quiz_data, indent=4, ensure_ascii=False))
