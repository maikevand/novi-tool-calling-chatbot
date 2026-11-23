import {openai} from '@ai-sdk/openai';
import {
    isStepCount,
    convertToModelMessages,
    createUIMessageStreamResponse,
    generateId,
    streamText,
    toUIMessageStream,
} from 'ai';
import {saveChat} from "@/lib/chat/cruds";
import {tools} from "@/lib/tools";
import type {ChatMessage} from "@/lib/chat/types";

export async function POST(request: Request) {
    const CONTEXT = 'Je bent een jobcoach. Antwoord in het Nederlands in maximaal 5 zinnen. ' +
        'Gebruik zoekVacatures als de gebruiker naar openstaande vacatures vraagt. Verzin nooit vacatures die er niet zijn. Als er geen vacatures gevonden worden die voldoen aan de zoekopdracht, stel dan voor om een ander zoekwoord of een andere plaats te proberen. ' +
        'Wanneer zoekVacatures resultaten teruggeeft, worden deze al als lijst in de chat getoond. Herhaal de vacatures en hun links daarom niet in je tekstuele antwoord. Geef alleen een korte toelichting. ' +
        'Als de gebruiker een vacaturetekst aanlevert, gebruik dan altijd analyseerVacature, ook als de tekst kort is. Gebruik zoekVacatures alleen wanneer de gebruiker vraagt om nieuwe of actuele vacatures te zoeken. ' +
        'Gebruik analyseerVacature als de gebruiker een vacaturetekst aanlevert om te analyseren. ' +
        'Geef de gebruiker antwoorden over webdevelopment zonder tool.'
    const TEMPERATURE = 0.7
    const MAX_OUTPUT_TOKENS = 500

    if (!process.env.OPENAI_API_KEY) {
        return Response.json(
            {error: 'OPENAI_API_KEY ontbreekt. Zet deze in .env.local.'},
            {status: 500},
        );
    }

    try {
        const {id, messages}: { id: string, messages: ChatMessage[] } = await request.json();

        const recentMessages = messages.slice(-10);

        const result = streamText({
            model: openai('gpt-4o-mini'),
            messages: await convertToModelMessages(recentMessages),
            instructions: CONTEXT,
            temperature: TEMPERATURE,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            tools,
            stopWhen: isStepCount(5),
            onEnd: ({usage}) => {
                console.log("Input: ", usage.inputTokens)
                console.log("Output: ", usage.outputTokens)
            }
        });

        return createUIMessageStreamResponse({
            stream: toUIMessageStream({
                stream: result.stream,
                originalMessages: messages,
                generateMessageId: generateId,
                onError: (error) => {
                    console.error('Fout bij OpenAI:', error);
                    return 'Er ging iets mis bij het ophalen van een antwoord.';
                },
                onEnd: async ({messages}) => {
                    try {
                        await saveChat(id, messages)
                    } catch (error) {
                        console.error('Fout bij opslaan van chat:', error);
                    }
                }
            }),
        });
    } catch (error) {
        console.error('Fout in /api/chat:', error);
        return Response.json({error: 'Er ging iets mis.'}, {status: 500});
    }
}
