# T3 Chat App
## ⏰Something To Note:

Link to run: https://t3-chat-app-web.onrender.com/

- I'm using the free instance of render for my backend so when it first starts up, it will be a cold start resulting the website to take some time to process your request, please try again if your response times out

- I also have my database hosted on Supabase and since I'm also using the free version of Supabase, after a period of inactivity the db might be in paused state, so please get back to me if this occurs

- Can use my details iif you don't want to register a account:

  
Username: sandeep.singh


Password: 12345678

## 💡Inspiration
  - This project is from a hackathon me and my friend came across, by a famous Youtuber called Theo (https://cloneathon.t3.chat/)
  - I wanted to make a chatbot ik( who really cares about chatbots) but thats the point, chatbots can actually much more things than what you're currently thinking about, there's chat branching, chat sessions renaming, global and local memory retention across chat sessions, image uploads, web searching, integrating multiple LLM and much more.

## 👀What it does?
- I wanted to test the functionality of how far chatbots can be. Currently I'm using Vue.js, Express.js, Supabase and PostgreSQL. The LLM itself is from OpenAI where I didn't modify the prompt template much. However, this chatbot does have global and local memory retention as for every message I ask to the chatbot which gets stored in the db, I do tell the LLM to figure if its important to store the message in the global db and whenever the LLM responds to my query it first references the global db as well as previous chat histories (providing local memory retention as well) before providing a response.

## 💡What I learnt
- Not only about using OpenAI for the Api keys for this chatbot. I also learnt that these simple chatbots which only processes couple of tokens for local memory as well as specifying response to limit to a couple of tokens, I realised how cheap chatbots can be for a single user lol. I have not even spent 1 cent of API keys usage lol, even though I spent the minimum price of $10
- How to implement more features in just regular chatbots and providing a good UI/UX

## 🚧Challenges I ran into
- Being able to upload, store and retrieve images was a pain, I used Supabase object storage for this as they do allow image storing in Supabase even though I thought of AWS S3

## 🟩Further Improvements
- Build chat branching to chat sessions, as well as being able to search the internet for information and not just rely on OpenAI for this

