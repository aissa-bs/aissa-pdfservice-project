from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF for PDF processing
from transformers import pipeline
import os
import logging

import openai
app = Flask(__name__)


CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
openai.api_key = "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"

# Load the summarization model
summarizer = pipeline("summarization")


def extract_text_from_pdf(pdf_path):
    """Extracts all text from a PDF file using PyMuPDF."""
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text


@app.route('/test', methods=['GET'])
def test():
    return "Server is up and running!"


def summarize_text(text):
    """Summarizes the extracted text using a
    Hugging Face summarizer pipeline."""
    # Split the text into chunks if it's too long
    max_chunk_length = 1000  # Set a max chunk length based
    text_chunks = [text[i:i + max_chunk_length]
                   for i in range(0, len(text), max_chunk_length)]

    summary = ""
    for chunk in text_chunks:
        # Skip empty chunks
        if chunk.strip():
            try:
                chunk_summary = summarizer(chunk, max_length=150,
                                           min_length=30, do_sample=False)
                summary += chunk_summary[0]['summary_text'] + " "
            except Exception as e:
                logging.error(f"Error summarizing chunk: {e}")

    return summary.strip()  # Return the combined summary


@app.route("/api/summarize", methods=["POST"])
def summarize_pdf():
    """Handles PDF summarization requests."""
    if "file" not in request.files:
        logging.error("No file provided in the request.")
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        logging.error("No selected file.")
        return jsonify({"error": "No selected file"}), 400

    # Save the file to a temporary path
    file_path = os.path.join("temp", file.filename)
    file.save(file_path)
    logging.info(f"File saved to {file_path}")

    try:
        # Extract and summarize the text
        text = extract_text_from_pdf(file_path)
        logging.info("Text extracted from PDF.")
        summary = summarize_text(text)
        logging.info("Text summarization successful.")
        return jsonify({"summary": summary})
    except Exception:
        logging.exception("An error occurred during summarization.")
        return jsonify({"error": "An internal error occurred"}), 500
    finally:
        # Clean up the temporary file
        if os.path.exists(file_path):
            os.remove(file_path)
            logging.info(f"Temporary file {file_path} removed.")


def summarize_with_openai(text):
    """Summarizes text using OpenAI."""
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",  # Use "gpt-3.5-turbo" if preferred
            prompt=f"Summarize the following text:\n{text}",
            max_tokens=150,  # Adjust as needed
            temperature=0.5
        )
        return response.choices[0].text.strip()
    except Exception as e:
        logging.error(f"Error with OpenAI summarization: {e}")
        return "Error summarizing with OpenAI."


@app.route('/api/summarize_openai', methods=['POST'])
def summarize_pdf_openai():
    """Handles PDF summarization requests using OpenAI."""
    if "file" not in request.files:
        logging.error("No file provided in the request.")
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        logging.error("No selected file.")
        return jsonify({"error": "No selected file"}), 400

    # Save the file to a temporary path
    file_path = os.path.join("temp", file.filename)
    file.save(file_path)
    logging.info(f"File saved to {file_path}")

    try:
        # Extract and summarize the text
        text = extract_text_from_pdf(file_path)
        logging.info("Text extracted from PDF.")

        # Use ChatCompletion to summarize the text with OpenAI
        openai_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use the preferred model
            messages=[
                {"role": "system", "content":
                    "You are a helpful assistant that summarizes documents."},
                {"role": "user", "content":
                    f"Summarize the following text:\n{text}"}
            ],
            max_tokens=150
        )

        summary = openai_response['choices'][0]['message']['content'].strip()
        logging.info("OpenAI summarization successful.")
        return jsonify({"summary": summary})
    except Exception:
        logging.exception("An error occurred during OpenAI summarization.")
        return jsonify({"error": "An internal error occurred"}), 500
    finally:
        # Clean up the temporary file
        if os.path.exists(file_path):
            os.remove(file_path)
            logging.info(f"Temporary file {file_path} removed.")


@app.route("/api/search", methods=["POST"])
def search_in_pdf():
    """Handles text search within the uploaded PDF."""
    if "file" not in request.files or "query" not in request.form:
        logging.error("File and query are required for searching.")
        return jsonify({"error": "File and query are required"}), 400

    file = request.files["file"]
    query = request.form["query"].lower()

    # Save the file to a temporary path
    file_path = os.path.join("temp", file.filename)
    file.save(file_path)
    logging.info(f"File saved to {file_path}")

    try:
        # Extract text and search for the query
        text = extract_text_from_pdf(file_path)
        occurrences = []
        for i, page in enumerate(text.split("\n")):
            if query in page.lower():
                occurrences.append({"page": i + 1, "context": page.strip()})
        logging.info("Search completed.")
        return jsonify({"results": occurrences})
    except Exception:
        logging.exception("An error occurred during searching.")
        return jsonify({"error": "An internal error occurred"}), 500
    finally:
        # Clean up the temporary file
        if os.path.exists(file_path):
            os.remove(file_path)
            logging.info(f"Temporary file {file_path} removed.")


if __name__ == "__main__":
    os.makedirs("temp", exist_ok=True)  # Ensure the temp directory exists
    app.run(host="0.0.0.0", port=5000)
