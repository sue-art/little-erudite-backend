import express from "express";
import OpenAI from "openai";

const router = express.Router();

//OpenAI API
const openai = new OpenAI(process.env.OPENAI_API_KEY);

router.post("/chat", async (request, response) => {
  const { chats } = request.body;
  console.log(chats);

  const params = {
    messages: [{ role: "user", content: "Say this is a test" }, ...chats],
    model: "gpt-3.5-turbo",
  };

  try {
    const chatCompletion = await openai.chat.completions.create(params);

    if (chatCompletion.choices && chatCompletion.choices.length > 0) {
      response.json({
        output: chatCompletion.choices[0].message,
      });

      console.log(response.json.output);
    } else {
      response.status(500).json({ error: "No chat completion choices found" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "An error occurred" });
  }
});

router.post("/booktalks", async (request, response) => {
  const { question, answer, chats } = request.body;

  //console.log(question, answer);

  const prompt = `
    Create a valid JSON array of objects with feedback from booktalk question and answer. following this format:
    [{
      "feedback": "Feedback for the book talk question",
    }]
    The JSON object:
  `.trim();

  const params = {
    messages: [
      {
        role: "system",
        content:
          "You are a children's book expert who explains books with children's humor and makes children engaged with books.",
      },
      {
        role: "user",
        content: `You recieved the ${question} and the children gives me this answer ${answer}.`,
      },
      {
        role: "assistant",
        content: `Provide feedback for the book talk question. and Provide the next question about new topic about this book.`,
      },
      ...chats,
    ],

    model: "gpt-3.5-turbo-1106",
  };

  try {
    const bookTalksCompletion = await openai.chat.completions.create(params);

    if (bookTalksCompletion.choices && bookTalksCompletion.choices.length > 0) {
      response.json({
        output: bookTalksCompletion.choices[0].message,
      });

      console.log(response.json.output);
    } else {
      response
        .status(500)
        .json({ error: "No questions completion choices found" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "An error occurred" });
  }
});

router.post("/book", async (request, response) => {
  const { title, author, description } = request.body;

  const prompt = `Book information below: 
    title : ${title}
    author: ${author}
    description: ${description}
    Can you create a valid JSON array of objects for 5 book talk questions, characters and keyword list  of ${title} following this format:
    [{
      {
        "title": "Book Title",
        "author": "Book Author",
        "description": "Explanation of the book",
        "ages": "Age group",
        "pages": "Number of pages",
        "booktalks": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
        "characterlist": ["Character 1", "Character 2", "Character 3", "Character 4", "Character 5"],
        "keywordlist": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4", "Keyword 5"],
      }]  
    The JSON object:`.trim();

  const params = {
    messages: [
      {
        role: "system",
        content:
          "You are a children book expert that explain about the books with childrens humour and make children fun to enganged books.",
      },
      {
        role: "assistant",
        content:
          "You are a JSON data with a title, author attributes children book expert book talks about a book to children and parents. create a valid JSON array of objects in English following this format",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "gpt-3.5-turbo-1106",
    response_format: {
      type: "json_object",
    },
  };

  try {
    const quizCompletion = await openai.chat.completions.create(params);

    if (quizCompletion.choices && quizCompletion.choices.length > 0) {
      response.json({
        output: quizCompletion.choices[0].message,
      });

      console.log(response.json.output);
    } else {
      response
        .status(500)
        .json({ error: "No questions completion choices found" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "An error occurred" });
  }
});

router.post("/author-info", async (request, response) => {
  const { name, title } = request.body;

  const prompt =
    `Can you give me a book author information about: ${name} of ${title} in JSON informat attribute with name, description, image, published_books? 
    [{
      {
        "name": "Book Author",
        "description": "Explanation of the Authro",
        "image": "Author Image",
        "published_books": [{title, image, description, price, link}],
      }]  
    The JSON object:`.trim();

  const params = {
    messages: [
      {
        role: "system",
        content:
          "You are a children's book expert who explains books with children's humor and makes them fun to engage with.",
      },
      {
        role: "user",
        content: prompt,
      },
      {
        role: "assistant",
        content: `Provide a book author information about: ${name} of ${title}. The response should be in JSON format with the following attributes: name, description, image, and published_books (including title, image, description, price, and link).`,
      },
    ],
    model: "gpt-3.5-turbo-1106",
  };

  try {
    const authorCompletion = await openai.chat.completions.create(params);

    if (authorCompletion.choices && authorCompletion.choices.length > 0) {
      response.json({
        output: authorCompletion.choices[0].message,
      });

      console.log(response.json.output);
      return;
    } else {
      response
        .status(500)
        .json({ error: "No questions completion choices found" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "An error occurred" });
  }
});

router.post("/quizzes", async (request, response) => {
  const { name, title } = request.body;

  const prompt = `You are a children book storyteller. The question need to be engaged with children.
  Can you generate 10 questions of a book quiz about: ${title} authors by${name} JSON format attribute with title, description, image, quesitons [{question, options, answer}] ? `;
  const params = {
    messages: [
      {
        role: "system",
        content:
          "You are a children book expert that explain about the books with childrens humour and make children fun to enganged books.",
      },
      {
        role: "user",
        content: prompt,
      },
      {
        role: "assistant",
        content: `Provide a book quiz 10 questions about: ${title} authors by${name} JSON format attribute with title, description, image, quesitons [{question, options, answer}] ?`,
      },
    ],
    model: "gpt-3.5-turbo-1106",
    response_format: {
      type: "json_object",
    },
  };

  try {
    const quizCompletion = await openai.chat.completions.create(params);

    if (quizCompletion.choices && quizCompletion.choices.length > 0) {
      response.json({
        output: quizCompletion.choices[0].message,
      });

      console.log(response.json.output);
      return;
    } else {
      response
        .status(500)
        .json({ error: "No questions completion choices found" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "An error occurred" });
  }
});
export default router;
