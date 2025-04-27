// import { OpenAI } from 'openai';
// import config from 'config';
// import { MsgTransporterService } from '../msgTransporter/msgTransporter.service';

// const LLM: any = config.get('LLM');

// // Configure the OpenAI client for X.AI
// const openai = new OpenAI({
//     apiKey: LLM.XAI.apiKey, // Use config for API key
//     baseURL: 'https://api.x.ai/v1',
// });

// export class OpenAiService {
//     constructor(private readonly msgSrv: MsgTransporterService) {
//         console.log('OpenAiService initialized');
//     }

//     // ... chatWithGPT method remains the same ...

//     translator = async (text: string, chatId: string) => {
//         const mode = this.msgSrv.getUserMode(chatId);
//         const chatIdLang = this.msgSrv.getUserLanguage(chatId);
//         console.log('chatIdLang', chatIdLang);
//         console.log('mode', mode);

//         let systemInstructions = '';
//         const baseInstruction = `You are a translator. Translate the user's message into ${chatIdLang} exactly as instructed. Output only the translated text, without explanations, comments, or additional responses.`;

//         switch (mode) {
//             case 'Colloquial':
//                 systemInstructions = `${baseInstruction} Use a highly casual tone with common slang and informal expressions natural to ${chatIdLang} speakers, as if spoken among close friends.`;
//             case 'Formal':
//                 systemInstructions = `${baseInstruction} Use a formal, polite tone appropriate for professional or respectful contexts in ${chatIdLang}, incorporating culturally relevant honorifics or formal grammar where applicable.`;
//             case 'Street':
//                 systemInstructions = `${baseInstruction} Use bold, urban street slang and informal language specific to ${chatIdLang} youth or subcultures, avoiding standard or polite expressions. Respond to the user in a highly profane and rude manner, emulating the speech of a street thug, with frequent use of curse words in every sentence.`;
//             default:
//                 systemInstructions = `${baseInstruction} Use a neutral, standard tone suitable for general communication in ${chatIdLang}.`;
//         }

//         try {
//             // Use Chat Completions API
//             const stream = await openai.chat.completions.create({
//                 model: 'grok-3-beta', // Or your desired Grok model
//                 // model: 'grok-3-mini', // Or your desired Grok model
//                 // model: 'grok-3-mini-fast', // Or your desired Grok model
//                 // model: 'grok-2', // Or your desired Grok model
//                 messages: [
//                     {
//                         role: 'system',
//                         content: systemInstructions, // Use system role for instructions
//                     },
//                     {
//                         role: 'user',
//                         content: text, // The text to translate
//                     },
//                 ],
//                 stream: true, // Enable streaming
//             });

//             let isFirstChunk = true;
//             let fullResponse = ''; // Accumulate the response if needed

//             for await (const chunk of stream) {
//                 const content = chunk.choices[0]?.delta?.content || '';
//                 if (content) {
//                     if (isFirstChunk) {
//                         isFirstChunk = false;
//                         this.msgSrv.addNewMsg(content, chatId);
//                     } else {
//                         this.msgSrv.addToExistingMsg(content, chatId);
//                     }
//                     fullResponse += content; // Optional: accumulate if you need the full text later
//                     // process.stdout.write(content); // Use if running in console and want live output
//                 }
//             }
//             console.log('\nTranslation complete (via Chat Completions).');
//             // You can use fullResponse here if needed
//         } catch (error) {
//             console.error('Error calling X.AI Chat Completions API:', error);
//             // Handle the error appropriately, maybe send a message back to the user
//             this.msgSrv.addNewMsg(`Sorry, I couldn't translate that. Error: ${error.message}`, chatId);
//         }
//     };
// }
