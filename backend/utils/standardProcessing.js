const fs = require("fs");

class StandardProcessor {
  async processFile(file) {
    try {
      let extractedText = "";

      if (file.mimetype === "application/pdf") {
        extractedText = await this.extractFromPDF(file.path);
      } else {
        extractedText = await this.extractFromImage(file.path);
      }

      const structuredData = this.structureExtractedData(extractedText);

      return {
        rawText: extractedText,
        structuredData,
        extractionMethod:
          file.mimetype === "application/pdf" ? "pdf-parse" : "tesseract.js",
      };
    } catch (error) {
      throw new Error(`Standard extraction failed: ${error.message}`);
    }
  }

  async extractFromPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      throw new Error(`PDF extraction error: ${error.message}`);
    }
  }

  async extractFromImage(filePath) {
    try {
      const {
        data: { text },
      } = await tesseract.recognize(filePath, "eng", {
        logger: (m) => console.log(m),
      });
      return text;
    } catch (error) {
      throw new Error(`Image extraction error: ${error.message}`);
    }
  }

  structureExtractedData(text) {
    const patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/g,
      date: /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g,
      ssn: /\d{3}-\d{2}-\d{4}/g,
    };

    const structured = {};

    for (const [key, pattern] of Object.entries(patterns)) {
      const matches = text.match(pattern);
      if (matches) {
        structured[key] = matches;
      }
    }

    // Extract lines with potential meaningful data
    const lines = text.split("\n").filter((line) => line.trim().length > 5);
    structured.meaningfulLines = lines.slice(0, 10);

    return structured;
  }
}

module.exports = new StandardProcessor();
